"""
Security views for Crime Report Portal - Evidence Management.
"""

from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import JsonResponse, HttpResponse
from django.core.paginator import Paginator
from django.db.models import Q, Count
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.contrib.auth import get_user_model
from .models import FileScan, EvidenceVerification, SecurityAuditLog
from backend.reports.models import ReportEvidence
import mimetypes
import os

User = get_user_model()


def is_officer_or_admin(user):
    """Check if user is officer, admin, or supervisor."""
    return user.role in ['officer', 'admin', 'supervisor']


@login_required
@user_passes_test(is_officer_or_admin)
def security_home(request):
    """Security home page."""
    return render(request, 'security/evidence_management.html')


@login_required
@user_passes_test(is_officer_or_admin)
def evidence_management(request):
    """Evidence management dashboard."""
    evidence_list = ReportEvidence.objects.select_related('report', 'uploaded_by').order_by('-uploaded_at')
    
    # Filtering
    scan_status = request.GET.get('scan_status')
    if scan_status:
        evidence_list = evidence_list.filter(scan_status=scan_status)
    
    verification_status = request.GET.get('verification_status')
    if verification_status:
        evidence_list = evidence_list.filter(verification_status=verification_status)
    
    file_type = request.GET.get('file_type')
    if file_type:
        if file_type == 'image':
            evidence_list = evidence_list.filter(mime_type__startswith='image/')
        elif file_type == 'video':
            evidence_list = evidence_list.filter(mime_type__startswith='video/')
        elif file_type == 'document':
            evidence_list = evidence_list.filter(mime_type__in=['application/pdf', 'application/msword', 
                                                               'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
        elif file_type == 'audio':
            evidence_list = evidence_list.filter(mime_type__startswith='audio/')
    
    search_query = request.GET.get('search')
    if search_query:
        evidence_list = evidence_list.filter(
            Q(file__name__icontains=search_query) |
            Q(report__case_number__icontains=search_query) |
            Q(uploaded_by__first_name__icontains=search_query) |
            Q(uploaded_by__last_name__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(evidence_list, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Statistics
    stats = {
        'total_evidence': ReportEvidence.objects.count(),
        'verified_evidence': ReportEvidence.objects.filter(verification_status='verified').count(),
        'pending_review': ReportEvidence.objects.filter(verification_status='pending').count(),
        'quarantined_files': ReportEvidence.objects.filter(scan_status='quarantined').count(),
    }
    
    context = {
        'evidence_list': page_obj,
        'stats': stats,
    }
    
    return render(request, 'security/evidence_management.html', context)


@login_required
@user_passes_test(is_officer_or_admin)
def evidence_detail(request, evidence_id):
    """Get detailed evidence information via AJAX."""
    evidence = get_object_or_404(ReportEvidence, id=evidence_id)
    
    # Log access
    SecurityAuditLog.log_event(
        event_type='evidence_access',
        user=request.user,
        description=f'Accessed evidence file: {evidence.file.name}',
        related_evidence=evidence,
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT'),
        session_id=request.session.session_key
    )
    
    # Get verification info
    verification = None
    if hasattr(evidence, 'verification'):
        verification = evidence.verification
    
    # Get file scan info
    file_scan = None
    try:
        file_scan = FileScan.objects.get(file_hash=evidence.file_hash)
    except FileScan.DoesNotExist:
        pass
    
    # Generate HTML for modal
    html = f"""
    <div class="row">
        <div class="col-md-6">
            <h6>File Information</h6>
            <table class="table table-sm">
                <tr><td><strong>File Name:</strong></td><td>{evidence.file.name}</td></tr>
                <tr><td><strong>File Size:</strong></td><td>{evidence.file_size|filesizeformat}</td></tr>
                <tr><td><strong>MIME Type:</strong></td><td>{evidence.mime_type}</td></tr>
                <tr><td><strong>File Hash:</strong></td><td><code>{evidence.file_hash}</code></td></tr>
                <tr><td><strong>Uploaded:</strong></td><td>{evidence.uploaded_at.strftime('%M %d, %Y %g:%i %A')}</td></tr>
                <tr><td><strong>Uploaded By:</strong></td><td>{evidence.uploaded_by.first_name} {evidence.uploaded_by.last_name}</td></tr>
            </table>
        </div>
        <div class="col-md-6">
            <h6>Case Information</h6>
            <table class="table table-sm">
                <tr><td><strong>Case Number:</strong></td><td><a href="/reports/report/{evidence.report.id}/">{evidence.report.case_number}</a></td></tr>
                <tr><td><strong>Category:</strong></td><td>{evidence.report.category.name}</td></tr>
                <tr><td><strong>Status:</strong></td><td>{evidence.report.get_status_display()}</td></tr>
                <tr><td><strong>Reporter:</strong></td><td>{evidence.report.reporter.first_name} {evidence.report.reporter.last_name}</td></tr>
            </table>
        </div>
    </div>
    
    <div class="row mt-3">
        <div class="col-md-6">
            <h6>Security Scan</h6>
            <table class="table table-sm">
                <tr><td><strong>Scan Status:</strong></td><td><span class="badge bg-{'success' if evidence.scan_status == 'clean' else 'danger' if evidence.scan_status == 'infected' else 'warning'}">{evidence.get_scan_status_display()}</span></td></tr>
    """
    
    if file_scan:
        html += f"""
                <tr><td><strong>Scanned At:</strong></td><td>{file_scan.scanned_at.strftime('%M %d, %Y %g:%i %A') if file_scan.scanned_at else 'Not scanned'}</td></tr>
                <tr><td><strong>Scan Engine:</strong></td><td>{file_scan.scanned_by}</td></tr>
                <tr><td><strong>Threats Found:</strong></td><td>{file_scan.threat_count}</td></tr>
        """
    
    html += """
            </table>
        </div>
        <div class="col-md-6">
            <h6>Verification Status</h6>
            <table class="table table-sm">
    """
    
    if verification:
        html += f"""
                <tr><td><strong>Status:</strong></td><td><span class="badge bg-{'success' if verification.verification_status == 'verified' else 'danger' if verification.verification_status == 'rejected' else 'warning'}">{verification.get_verification_status_display()}</span></td></tr>
                <tr><td><strong>Verified By:</strong></td><td>{verification.verified_by.first_name} {verification.verified_by.last_name if verification.verified_by else 'N/A'}</td></tr>
                <tr><td><strong>Verified At:</strong></td><td>{verification.verified_at.strftime('%M %d, %Y %g:%i %A') if verification.verified_at else 'N/A'}</td></tr>
                <tr><td><strong>Notes:</strong></td><td>{verification.verification_notes or 'No notes'}</td></tr>
        """
    else:
        html += """
                <tr><td><strong>Status:</strong></td><td><span class="badge bg-warning">Pending Verification</span></td></tr>
                <tr><td><strong>Verified By:</strong></td><td>N/A</td></tr>
                <tr><td><strong>Verified At:</strong></td><td>N/A</td></tr>
                <tr><td><strong>Notes:</strong></td><td>No verification record</td></tr>
        """
    
    html += """
            </table>
        </div>
    </div>
    """
    
    if verification and verification.custody_chain:
        html += """
        <div class="row mt-3">
            <div class="col-12">
                <h6>Chain of Custody</h6>
                <div class="custody-chain">
        """
        
        for entry in verification.custody_chain:
            html += f"""
                    <div class="custody-entry">
                        <div class="d-flex justify-content-between">
                            <strong>{entry['user_name']}</strong>
                            <small class="text-muted">{entry['timestamp']}</small>
                        </div>
                        <div class="text-muted">{entry['action']}</div>
                        {f'<div class="mt-1"><em>{entry["notes"]}</em></div>' if entry.get('notes') else ''}
                    </div>
            """
        
        html += """
                </div>
            </div>
        </div>
        """
    
    return JsonResponse({'html': html})


@login_required
@user_passes_test(is_officer_or_admin)
def evidence_download(request, evidence_id):
    """Download evidence file."""
    evidence = get_object_or_404(ReportEvidence, id=evidence_id)
    
    # Log download
    SecurityAuditLog.log_event(
        event_type='file_download',
        user=request.user,
        description=f'Downloaded evidence file: {evidence.file.name}',
        related_evidence=evidence,
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT'),
        session_id=request.session.session_key
    )
    
    # Check if file exists
    if not evidence.file.storage.exists(evidence.file.name):
        return JsonResponse({'error': 'File not found'}, status=404)
    
    # Get file content
    file_content = evidence.file.read()
    
    # Determine content type
    content_type, encoding = mimetypes.guess_type(evidence.file.name)
    if content_type is None:
        content_type = 'application/octet-stream'
    
    # Create response
    response = HttpResponse(file_content, content_type=content_type)
    response['Content-Disposition'] = f'attachment; filename="{os.path.basename(evidence.file.name)}"'
    
    return response


@login_required
@user_passes_test(is_officer_or_admin)
@require_http_methods(["POST"])
def verify_evidence(request, evidence_id):
    """Verify evidence file."""
    evidence = get_object_or_404(ReportEvidence, id=evidence_id)
    notes = request.POST.get('notes', '')
    
    # Create or get verification record
    verification, created = EvidenceVerification.objects.get_or_create(evidence=evidence)
    
    # Verify the evidence
    verification.verify_evidence(request.user, notes)
    
    # Add custody entry
    verification.add_custody_entry(
        user=request.user,
        action='Evidence verified',
        notes=notes
    )
    
    # Log verification
    SecurityAuditLog.log_event(
        event_type='admin_action',
        user=request.user,
        description=f'Verified evidence file: {evidence.file.name}',
        related_evidence=evidence,
        severity='medium',
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT'),
        session_id=request.session.session_key
    )
    
    return JsonResponse({
        'success': True,
        'message': 'Evidence verified successfully'
    })


@login_required
@user_passes_test(is_officer_or_admin)
@require_http_methods(["POST"])
def reject_evidence(request, evidence_id):
    """Reject evidence file."""
    evidence = get_object_or_404(ReportEvidence, id=evidence_id)
    reason = request.POST.get('reason', '')
    
    if not reason:
        return JsonResponse({
            'success': False,
            'error': 'Rejection reason is required'
        }, status=400)
    
    # Create or get verification record
    verification, created = EvidenceVerification.objects.get_or_create(evidence=evidence)
    
    # Reject the evidence
    verification.reject_evidence(request.user, reason)
    
    # Add custody entry
    verification.add_custody_entry(
        user=request.user,
        action='Evidence rejected',
        notes=reason
    )
    
    # Log rejection
    SecurityAuditLog.log_event(
        event_type='admin_action',
        user=request.user,
        description=f'Rejected evidence file: {evidence.file.name}',
        related_evidence=evidence,
        severity='high',
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT'),
        session_id=request.session.session_key
    )
    
    return JsonResponse({
        'success': True,
        'message': 'Evidence rejected successfully'
    })


@login_required
@user_passes_test(is_officer_or_admin)
def security_audit_log(request):
    """View security audit log."""
    logs = SecurityAuditLog.objects.select_related('user', 'related_report', 'related_evidence').order_by('-timestamp')
    
    # Filtering
    event_type = request.GET.get('event_type')
    if event_type:
        logs = logs.filter(event_type=event_type)
    
    severity = request.GET.get('severity')
    if severity:
        logs = logs.filter(severity=severity)
    
    user_id = request.GET.get('user')
    if user_id:
        logs = logs.filter(user_id=user_id)
    
    # Pagination
    paginator = Paginator(logs, 50)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'logs': page_obj,
        'event_types': SecurityAuditLog.EVENT_TYPES,
        'severity_levels': SecurityAuditLog.SEVERITY_LEVELS,
    }
    
    return render(request, 'security/audit_log.html', context)


@login_required
@user_passes_test(is_officer_or_admin)
def file_scan_status(request, file_hash):
    """Get file scan status."""
    try:
        file_scan = FileScan.objects.get(file_hash=file_hash)
        return JsonResponse({
            'scan_status': file_scan.scan_status,
            'threats_found': file_scan.threats_found,
            'scan_result': file_scan.scan_result,
            'scanned_at': file_scan.scanned_at.isoformat() if file_scan.scanned_at else None,
        })
    except FileScan.DoesNotExist:
        return JsonResponse({
            'scan_status': 'not_found',
            'error': 'File scan record not found'
        }, status=404)


def public_security_info_view(request):
    """Public security info page with cyber safety tips and reporting guidelines."""
    return render(request, 'security/public_security_info.html')


def laws_view(request):
    """Laws and Acts page."""
    return render(request, 'laws.html') 