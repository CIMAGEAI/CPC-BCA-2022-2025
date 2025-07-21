"""
Complaint submission view for Crime Report Portal.
"""

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q, Count
from django.http import JsonResponse, HttpResponse
from django.utils import timezone
from datetime import datetime, timedelta
from .forms import CrimeReportForm, ReportEvidenceForm
from .models import CrimeReport, ReportEvidence, ReportStatus, ReportComment, CrimeCategory
from django.db import transaction
from django.conf import settings
from django.core.files.uploadedfile import UploadedFile
import hashlib
from backend.authentication.models import User
import csv
import io
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import xlsxwriter
import requests
from django.views.decorators.csrf import csrf_exempt
from .models import Station
from django.utils.dateformat import DateFormat
from django.utils.formats import get_format

def is_officer_or_admin(user):
    """Check if user is officer, admin, or supervisor."""
    return user.role in ['officer', 'admin', 'supervisor']


def export_reports_csv(request):
    """Export crime reports to CSV format."""
    if not request.user.is_authenticated or request.user.role not in ['admin', 'officer', 'supervisor']:
        messages.error(request, 'Access denied.')
        return redirect('home')
    
    # Get filtered reports
    reports = CrimeReport.objects.all()
    
    # Apply filters
    status_filter = request.GET.get('status')
    if status_filter:
        reports = reports.filter(status=status_filter)
    
    category_filter = request.GET.get('category')
    if category_filter:
        reports = reports.filter(category_id=category_filter)
    
    date_from = request.GET.get('date_from')
    if date_from:
        try:
            date_from = datetime.strptime(date_from, '%Y-%m-%d')
            reports = reports.filter(incident_date__date__gte=date_from.date())
        except ValueError:
            pass
    
    date_to = request.GET.get('date_to')
    if date_to:
        try:
            date_to = datetime.strptime(date_to, '%Y-%m-%d')
            reports = reports.filter(incident_date__date__lte=date_to.date())
        except ValueError:
            pass
    
    # Create CSV response
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="crime_reports_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
    
    writer = csv.writer(response)
    writer.writerow([
        'Case Number', 'Category', 'Status', 'Priority', 'Incident Date', 
        'Location', 'Description', 'Reporter', 'Assigned Officer', 'Created Date'
    ])
    
    for report in reports:
        writer.writerow([
            report.case_number,
            report.category.name,
            report.get_status_display(),
            report.get_priority_display(),
            report.incident_date.strftime('%Y-%m-%d %H:%M'),
            report.incident_location,
            report.description[:100] + '...' if len(report.description) > 100 else report.description,
            report.reporter.get_full_name() if report.reporter else 'Anonymous',
            report.assigned_officer.get_full_name() if report.assigned_officer else 'Unassigned',
            report.created_at.strftime('%Y-%m-%d %H:%M')
        ])
    
    return response


def export_reports_excel(request):
    """Export crime reports to Excel format."""
    if not request.user.is_authenticated or request.user.role not in ['admin', 'officer', 'supervisor']:
        messages.error(request, 'Access denied.')
        return redirect('home')
    
    # Get filtered reports
    reports = CrimeReport.objects.all()
    
    # Apply filters
    status_filter = request.GET.get('status')
    if status_filter:
        reports = reports.filter(status=status_filter)
    
    category_filter = request.GET.get('category')
    if category_filter:
        reports = reports.filter(category_id=category_filter)
    
    date_from = request.GET.get('date_from')
    if date_from:
        try:
            date_from = datetime.strptime(date_from, '%Y-%m-%d')
            reports = reports.filter(incident_date__date__gte=date_from.date())
        except ValueError:
            pass
    
    date_to = request.GET.get('date_to')
    if date_to:
        try:
            date_to = datetime.strptime(date_to, '%Y-%m-%d')
            reports = reports.filter(incident_date__date__lte=date_to.date())
        except ValueError:
            pass
    
    # Create Excel response
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = f'attachment; filename="crime_reports_{timezone.now().strftime("%Y%m%d_%H%M%S")}.xlsx"'
    
    # Create workbook and worksheet
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet('Crime Reports')
    
    # Define formats
    header_format = workbook.add_format({
        'bold': True,
        'bg_color': '#1e3a8a',
        'font_color': 'white',
        'border': 1
    })
    
    cell_format = workbook.add_format({
        'border': 1,
        'text_wrap': True
    })
    
    # Write headers
    headers = [
        'Case Number', 'Category', 'Status', 'Priority', 'Incident Date', 
        'Location', 'Description', 'Reporter', 'Assigned Officer', 'Created Date'
    ]
    
    for col, header in enumerate(headers):
        worksheet.write(0, col, header, header_format)
    
    # Write data
    for row, report in enumerate(reports, start=1):
        worksheet.write(row, 0, report.case_number, cell_format)
        worksheet.write(row, 1, report.category.name, cell_format)
        worksheet.write(row, 2, report.get_status_display(), cell_format)
        worksheet.write(row, 3, report.get_priority_display(), cell_format)
        worksheet.write(row, 4, report.incident_date.strftime('%Y-%m-%d %H:%M'), cell_format)
        worksheet.write(row, 5, report.incident_location, cell_format)
        worksheet.write(row, 6, report.description[:100] + '...' if len(report.description) > 100 else report.description, cell_format)
        worksheet.write(row, 7, report.reporter.get_full_name() if report.reporter else 'Anonymous', cell_format)
        worksheet.write(row, 8, report.assigned_officer.get_full_name() if report.assigned_officer else 'Unassigned', cell_format)
        worksheet.write(row, 9, report.created_at.strftime('%Y-%m-%d %H:%M'), cell_format)
    
    # Auto-adjust column widths
    for col in range(len(headers)):
        worksheet.set_column(col, col, 15)
    
    workbook.close()
    output.seek(0)
    response.write(output.getvalue())
    
    return response


def export_report_pdf(request, report_id):
    """Export a single crime report to PDF."""
    if not request.user.is_authenticated:
        messages.error(request, 'Access denied.')
        return redirect('home')
    
    report = get_object_or_404(CrimeReport, id=report_id)
    
    # Check permissions
    if not report.can_be_accessed_by(request.user):
        messages.error(request, 'Access denied.')
        return redirect('home')
    
    # Create PDF response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="crime_report_{report.case_number}.pdf"'
    
    # Create PDF document
    doc = SimpleDocTemplate(response, pagesize=A4)
    elements = []
    
    # Get styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    # Add title
    elements.append(Paragraph(f"Crime Report - {report.case_number}", title_style))
    elements.append(Spacer(1, 20))
    
    # Report details
    data = [
        ['Field', 'Value'],
        ['Case Number', report.case_number],
        ['Category', report.category.name],
        ['Status', report.get_status_display()],
        ['Priority', report.get_priority_display()],
        ['Incident Date', report.incident_date.strftime('%Y-%m-%d %H:%M')],
        ['Location', report.incident_location],
        ['Reporter', report.reporter.get_full_name() if report.reporter else 'Anonymous'],
        ['Assigned Officer', report.assigned_officer.get_full_name() if report.assigned_officer else 'Unassigned'],
        ['Created Date', report.created_at.strftime('%Y-%m-%d %H:%M')],
    ]
    
    # Create table
    table = Table(data, colWidths=[2*inch, 4*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(table)
    elements.append(Spacer(1, 20))
    
    # Description
    elements.append(Paragraph("Description:", styles['Heading2']))
    elements.append(Paragraph(report.description, styles['Normal']))
    
    if report.additional_details:
        elements.append(Spacer(1, 12))
        elements.append(Paragraph("Additional Details:", styles['Heading2']))
        elements.append(Paragraph(report.additional_details, styles['Normal']))
    
    # Build PDF
    doc.build(elements)
    return response


def advanced_search_reports(request):
    """Advanced search functionality for crime reports."""
    reports = CrimeReport.objects.all()
    
    # Apply filters based on user role
    if request.user.is_authenticated:
        if request.user.role == 'public':
            reports = reports.filter(reporter=request.user)
        elif request.user.role == 'officer':
            reports = reports.filter(assigned_officer=request.user)
        elif request.user.role == 'supervisor':
            reports = reports.filter(
                Q(assigned_officer__isnull=True) | 
                Q(assigned_officer__role='police')
            )
        # Admin can see all reports
    else:
        # For anonymous users, show only public reports or redirect to login
        messages.warning(request, 'Please log in to access advanced search features.')
        return redirect('authentication:login')
    
    # Search query
    search_query = request.GET.get('search', '')
    if search_query:
        reports = reports.filter(
            Q(case_number__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(incident_location__icontains=search_query) |
            Q(reporter__first_name__icontains=search_query) |
            Q(reporter__last_name__icontains=search_query) |
            Q(reporter_name__icontains=search_query)
        )
    
    # Date range filter
    date_from = request.GET.get('date_from')
    date_to = request.GET.get('date_to')
    if date_from:
        try:
            date_from = datetime.strptime(date_from, '%Y-%m-%d')
            reports = reports.filter(incident_date__date__gte=date_from.date())
        except ValueError:
            pass
    if date_to:
        try:
            date_to = datetime.strptime(date_to, '%Y-%m-%d')
            reports = reports.filter(incident_date__date__lte=date_to.date())
        except ValueError:
            pass
    
    # Category filter
    category_filter = request.GET.get('category')
    if category_filter:
        reports = reports.filter(category_id=category_filter)
    
    # Status filter
    status_filter = request.GET.get('status')
    if status_filter:
        reports = reports.filter(status=status_filter)
    
    # Priority filter
    priority_filter = request.GET.get('priority')
    if priority_filter:
        reports = reports.filter(priority=priority_filter)
    
    # Location filter (radius search)
    lat = request.GET.get('latitude')
    lng = request.GET.get('longitude')
    radius = request.GET.get('radius', 10)  # Default 10km radius
    if lat and lng:
        try:
            lat, lng = float(lat), float(lng)
            radius = float(radius)
            # Simple distance calculation (can be improved with PostGIS)
            reports = reports.filter(
                latitude__range=(lat - radius/111, lat + radius/111),
                longitude__range=(lng - radius/111, lng + radius/111)
            )
        except ValueError:
            pass
    
    # Sorting
    sort_by = request.GET.get('sort', '-created_at')
    valid_sort_fields = [
        'created_at', '-created_at', 'incident_date', '-incident_date',
        'status', '-status', 'priority', '-priority', 'case_number', '-case_number'
    ]
    if sort_by in valid_sort_fields:
        reports = reports.order_by(sort_by)
    
    # Pagination
    paginator = Paginator(reports, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get filter options
    categories = CrimeCategory.objects.filter(is_active=True)
    
    context = {
        'page_obj': page_obj,
        'categories': categories,
        'status_choices': CrimeReport.STATUS_CHOICES,
        'priority_choices': CrimeReport.PRIORITY_CHOICES,
        'current_filters': {
            'search': search_query,
            'date_from': date_from,
            'date_to': date_to,
            'category': category_filter,
            'status': status_filter,
            'priority': priority_filter,
            'latitude': lat,
            'longitude': lng,
            'radius': radius,
            'sort': sort_by,
        }
    }
    
    return render(request, 'reports/advanced_search.html', context)


@transaction.atomic
def submit_complaint(request):
    if request.method == 'POST':
        report_form = CrimeReportForm(request.POST)
        evidence_form = ReportEvidenceForm(request.POST, request.FILES)
        if report_form.is_valid() and (not request.FILES or evidence_form.is_valid()):
            report = report_form.save(commit=False)
            # Assign reporter only if user is logged in
            if request.user.is_authenticated:
                report.reporter = request.user
            report.created_by_ip = request.META.get('REMOTE_ADDR')
            # Ensure station is set
            if not report.station:
                messages.error(request, 'कृपया स्टेशन चुनें (Please select a station).')
                categories = CrimeCategory.objects.filter(is_active=True)
                stations = Station.objects.all()
                return render(request, 'reports/submit_complaint.html', {
                    'report_form': report_form,
                    'evidence_form': evidence_form,
                    'categories': categories,
                    'stations': stations
                })
            report.save()
            # Handle evidence
            if request.FILES:
                evidence = evidence_form.save(commit=False)
                evidence.report = report
                if request.user.is_authenticated:
                    evidence.uploaded_by = request.user
                evidence.file_size = evidence.file.size
                if hasattr(evidence.file, 'content_type'):
                    evidence.mime_type = evidence.file.content_type
                else:
                    evidence.mime_type = ''
                # Calculate file hash
                hasher = hashlib.sha256()
                for chunk in evidence.file.chunks():
                    hasher.update(chunk)
                evidence.file_hash = hasher.hexdigest()
                evidence.save()
            messages.success(request, 'Your complaint has been submitted successfully.')
            if request.user.is_authenticated:
                return redirect('my_reports')
            else:
                return redirect('home')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        report_form = CrimeReportForm()
        evidence_form = ReportEvidenceForm()
    categories = CrimeCategory.objects.filter(is_active=True)
    stations = Station.objects.all()
    return render(request, 'reports/submit_complaint.html', {
        'report_form': report_form,
        'evidence_form': evidence_form,
        'categories': categories,
        'stations': stations
    })

@login_required
def my_reports(request):
    """View user's submitted complaints with filtering and pagination."""
    reports = CrimeReport.objects.filter(reporter=request.user).order_by('-created_at')
    
    # Filtering
    status_filter = request.GET.get('status')
    if status_filter:
        reports = reports.filter(status=status_filter)
    
    category_filter = request.GET.get('category')
    if category_filter:
        reports = reports.filter(category_id=category_filter)
    
    # Search
    search_query = request.GET.get('search')
    if search_query:
        reports = reports.filter(
            Q(case_number__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(incident_location__icontains=search_query)
        )
    
    # Date range filter
    date_from = request.GET.get('date_from')
    date_to = request.GET.get('date_to')
    if date_from:
        try:
            date_from = datetime.strptime(date_from, '%Y-%m-%d')
            reports = reports.filter(incident_date__date__gte=date_from.date())
        except ValueError:
            pass
    if date_to:
        try:
            date_to = datetime.strptime(date_to, '%Y-%m-%d')
            reports = reports.filter(incident_date__date__lte=date_to.date())
        except ValueError:
            pass
    
    # Sorting
    sort_by = request.GET.get('sort', '-created_at')
    valid_sort_fields = ['created_at', '-created_at', 'incident_date', '-incident_date', 'status', '-status']
    if sort_by in valid_sort_fields:
        reports = reports.order_by(sort_by)
    
    # Pagination
    paginator = Paginator(reports, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get categories for filter dropdown
    categories = CrimeCategory.objects.filter(is_active=True)
    
    context = {
        'page_obj': page_obj,
        'categories': categories,
        'status_choices': CrimeReport.STATUS_CHOICES,
        'current_filters': {
            'status': status_filter,
            'category': category_filter,
            'search': search_query,
            'date_from': date_from,
            'date_to': date_to,
            'sort': sort_by,
        }
    }
    
    return render(request, 'reports/my_reports.html', context)

@login_required
def report_detail(request, report_id):
    """View detailed information about a specific complaint."""
    user = request.user
    try:
        if user.role in ['officer', 'police', 'admin', 'supervisor']:
            # Police/admin/supervisor: can view ALL reports
            report = CrimeReport.objects.get(id=report_id)
            # All police officers can view all reports for now
        else:
            # Public: can only view their own reports
            report = CrimeReport.objects.get(id=report_id, reporter=user)
    except CrimeReport.DoesNotExist:
        return render(request, '404.html', status=404)

    # Get status history
    status_history = ReportStatus.objects.filter(report=report).order_by('-changed_at')

    # Get comments (filter based on user role)
    if user.is_authenticated and user.role in ['officer', 'admin', 'supervisor']:
        comments = ReportComment.objects.filter(report=report)
    else:
        comments = ReportComment.objects.filter(report=report, is_internal=False)

    # Get evidence
    evidence = ReportEvidence.objects.filter(report=report)

    context = {
        'report': report,
        'status_history': status_history,
        'comments': comments,
        'evidence': evidence,
    }

    return render(request, 'reports/report_detail.html', context)

@login_required
def report_tracking(request, case_number):
    """Public tracking page for complaints using case number."""
    report = get_object_or_404(CrimeReport, case_number=case_number)
    
    # For public tracking, only show limited information
    if not report.can_be_accessed_by(request.user):
        # Show only basic status information for public tracking
        context = {
            'report': report,
            'status_history': ReportStatus.objects.filter(report=report).order_by('-changed_at'),
            'is_public_tracking': True,
        }
        return render(request, 'reports/report_tracking.html', context)
    
    # If user has access, redirect to full detail view
    return redirect('report_detail', report_id=report.id)

@login_required
@user_passes_test(is_officer_or_admin)
def officer_dashboard(request):
    """Officer/Admin dashboard for managing complaints."""
    # Get reports based on user role
    if request.user.is_authenticated:
        if request.user.role == 'admin':
            reports = CrimeReport.objects.all()
        elif request.user.role == 'supervisor':
            reports = CrimeReport.objects.filter(
                Q(assigned_officer__isnull=True) | 
                Q(assigned_officer__role='police')
            )
        else:  # police
            user_station = getattr(request.user.userprofile, 'station', None)
            if user_station:
                reports = CrimeReport.objects.filter(
                    Q(station=user_station) & (
                        Q(assigned_officer=request.user) |
                        (Q(status='pending') & Q(assigned_officer__isnull=True))
                    )
                ).distinct().order_by('-created_at')
            else:
                reports = CrimeReport.objects.none()

        # --- Search/Filter ---
        case_id = request.GET.get('case_id', '').strip()
        case_type = request.GET.get('case_type', '').strip()
        priority_filter = request.GET.get('priority')
        category_filter = request.GET.get('category')
        status_filter = request.GET.get('status')
        date_from = request.GET.get('date_from')
        date_to = request.GET.get('date_to')
        search_query = request.GET.get('search')

        if case_id:
            reports = reports.filter(case_number__iexact=case_id)
        if case_type:
            reports = reports.filter(category__name__icontains=case_type)
        if priority_filter:
            reports = reports.filter(priority=priority_filter)
        if category_filter:
            reports = reports.filter(category_id=category_filter)
        if status_filter:
            reports = reports.filter(status=status_filter)
        if date_from:
            reports = reports.filter(created_at__date__gte=date_from)
        if date_to:
            reports = reports.filter(created_at__date__lte=date_to)
        if search_query:
            reports = reports.filter(
                Q(case_number__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(incident_location__icontains=search_query) |
                Q(reporter__first_name__icontains=search_query) |
                Q(reporter__last_name__icontains=search_query)
            )

        reports = reports.order_by('-created_at')

    else:
        # This should not happen due to @login_required decorator, but just in case
        return redirect('authentication:login')
    
    # Pagination
    paginator = Paginator(reports, 15)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Dashboard statistics
    total_reports = CrimeReport.objects.count()
    pending_reports = CrimeReport.objects.filter(status__in=['submitted', 'under_review']).count()
    assigned_reports = CrimeReport.objects.filter(status='assigned').count()
    resolved_reports = CrimeReport.objects.filter(status='resolved').count()
    
    # Category breakdown
    category_stats = CrimeCategory.objects.annotate(
        report_count=Count('crimereport')
    ).order_by('-report_count')[:5]
    
    # Recent activity
    recent_status_changes = ReportStatus.objects.select_related('report', 'changed_by').order_by('-changed_at')[:10]
    
    # Recent notifications for this officer
    notifications = []
    if request.user.role == 'police':
        from backend.notifications.models import Notification
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')[:10]

    context = {
        'page_obj': page_obj,
        'cases': page_obj.object_list,
        'categories': CrimeCategory.objects.filter(is_active=True),
        'status_choices': CrimeReport.STATUS_CHOICES,
        'priority_choices': CrimeReport.PRIORITY_CHOICES,
        'current_filters': {
            'status': status_filter,
            'priority': priority_filter,
            'category': category_filter,
            'search': search_query,
            'sort': sort_by,
        },
        'stats': {
            'total': total_reports,
            'pending': pending_reports,
            'assigned': assigned_reports,
            'resolved': resolved_reports,
        },
        'category_stats': category_stats,
        'recent_activity': recent_status_changes,
        'officer': {
            'name': request.user.get_full_name() or request.user.username,
            'id': request.user.id,
            'role': request.user.role,
            'last_login': request.user.last_login,
            'station': getattr(getattr(request.user, 'userprofile', None), 'station', None).name if getattr(getattr(request.user, 'userprofile', None), 'station', None) else 'N/A',
        },
        'notifications': notifications,
    }
    
    return render(request, 'reports/officer_dashboard.html', context)

@login_required
@user_passes_test(is_officer_or_admin)
def update_report_status(request, report_id):
    """Update report status via AJAX."""
    if request.method == 'POST':
        report = get_object_or_404(CrimeReport, id=report_id)
        
        # Check permissions
        if not report.can_be_edited_by(request.user):
            return JsonResponse({'error': 'Permission denied'}, status=403)
        
        new_status = request.POST.get('status')
        notes = request.POST.get('notes', '')
        
        if new_status and new_status in dict(CrimeReport.STATUS_CHOICES):
            old_status = report.status
            report.status = new_status
            
            # Update resolved_at if status is resolved
            if new_status == 'resolved' and not report.resolved_at:
                report.resolved_at = timezone.now()
            
            report.save()
            
            # Create status history entry
            ReportStatus.objects.create(
                report=report,
                status=new_status,
                notes=notes,
                changed_by=request.user
            )
            
            # Create notification for reporter
            if report.reporter and report.reporter != request.user:
                from .models import ReportNotification
                ReportNotification.objects.create(
                    report=report,
                    user=report.reporter,
                    notification_type='status_change',
                    message=f'Your case #{report.case_number} status has been updated to {report.get_status_display()}.'
                )
            
            return JsonResponse({
                'success': True,
                'new_status': new_status,
                'status_display': report.get_status_display(),
                'message': f'Status updated to {report.get_status_display()}'
            })
        
        return JsonResponse({'error': 'Invalid status'}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required
@user_passes_test(is_officer_or_admin)
def assign_report(request, report_id):
    """Assign report to an officer via AJAX."""
    if request.method == 'POST':
        report = get_object_or_404(CrimeReport, id=report_id)
        
        # Check permissions
        if not report.can_be_edited_by(request.user):
            return JsonResponse({'error': 'Permission denied'}, status=403)
        
        officer_id = request.POST.get('officer_id')
        notes = request.POST.get('notes', '')
        
        if officer_id:
            try:
                officer = User.objects.get(id=officer_id, role__in=['officer', 'supervisor'])
                report.assigned_officer = officer
                report.assigned_date = timezone.now()
                report.status = 'assigned'
                report.save()
                
                # Create status history entry
                ReportStatus.objects.create(
                    report=report,
                    status='assigned',
                    notes=f'Assigned to {officer.first_name} {officer.last_name}. {notes}',
                    changed_by=request.user
                )
                
                # Create notification for assigned officer
                from .models import ReportNotification
                ReportNotification.objects.create(
                    report=report,
                    user=officer,
                    notification_type='assignment',
                    message=f'You have been assigned case #{report.case_number}.'
                )
                
                # Create notification for reporter
                if report.reporter and report.reporter != request.user:
                    ReportNotification.objects.create(
                        report=report,
                        user=report.reporter,
                        notification_type='assignment',
                        message=f'Your case #{report.case_number} has been assigned to an officer.'
                    )
                
                return JsonResponse({
                    'success': True,
                    'officer_name': f'{officer.first_name} {officer.last_name}',
                    'message': f'Report assigned to {officer.first_name} {officer.last_name}'
                })
                
            except User.DoesNotExist:
                return JsonResponse({'error': 'Officer not found'}, status=404)
        
        return JsonResponse({'error': 'Invalid officer ID'}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required
@user_passes_test(is_officer_or_admin)
def add_comment(request, report_id):
    """Add comment to report via AJAX."""
    if request.method == 'POST':
        report = get_object_or_404(CrimeReport, id=report_id)
        
        # Check permissions
        if not report.can_be_accessed_by(request.user):
            return JsonResponse({'error': 'Permission denied'}, status=403)
        
        content = request.POST.get('content', '').strip()
        is_internal = request.POST.get('is_internal', 'false').lower() == 'true'
        
        if content:
            comment = ReportComment.objects.create(
                report=report,
                author=request.user,
                content=content,
                is_internal=is_internal
            )
            
            # Create notification for reporter (if not internal)
            if not is_internal and report.reporter and report.reporter != request.user:
                from .models import ReportNotification
                ReportNotification.objects.create(
                    report=report,
                    user=report.reporter,
                    notification_type='comment',
                    message=f'A new comment has been added to your case #{report.case_number}.'
                )
            
            return JsonResponse({
                'success': True,
                'comment': {
                    'id': comment.id,
                    'content': comment.content,
                    'author_name': f'{comment.author.first_name} {comment.author.last_name}',
                    'is_internal': comment.is_internal,
                    'created_at': comment.created_at.strftime('%M %d, %Y %g:%i %A'),
                }
            })
        
        return JsonResponse({'error': 'Comment content is required'}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
@login_required
@user_passes_test(is_officer_or_admin)
def upload_evidence(request, report_id):
    """Upload progress report/evidence for a case via AJAX."""
    if request.method == 'POST':
        report = get_object_or_404(CrimeReport, id=report_id)
        # Check permissions
        if not report.can_be_accessed_by(request.user):
            return JsonResponse({'error': 'Permission denied'}, status=403)
        form = ReportEvidenceForm(request.POST, request.FILES)
        if form.is_valid():
            evidence = form.save(commit=False)
            evidence.report = report
            evidence.uploaded_by = request.user
            evidence.file_size = evidence.file.size
            evidence.mime_type = evidence.file.content_type if hasattr(evidence.file, 'content_type') else ''
            # Calculate file hash
            hasher = hashlib.sha256()
            for chunk in evidence.file.chunks():
                hasher.update(chunk)
            evidence.file_hash = hasher.hexdigest()
            evidence.save()
            return JsonResponse({'success': True, 'message': 'Evidence uploaded.'})
        else:
            return JsonResponse({'error': 'Invalid form data', 'details': form.errors}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def public_reports_page(request):
    """Public reports page for anonymous users."""
    # Get some basic statistics for public display
    stats = {
        'total_reports': CrimeReport.objects.count(),
        'resolved_reports': CrimeReport.objects.filter(status='resolved').count(),
        'categories': CrimeCategory.objects.filter(is_active=True)[:5],
    }
    
    # Calculate resolution rate
    if stats['total_reports'] > 0:
        stats['resolution_rate'] = round((stats['resolved_reports'] / stats['total_reports']) * 100, 1)
    else:
        stats['resolution_rate'] = 0
    
    context = {
        'stats': stats,
        'is_public': True,
    }
    
    return render(request, 'reports/public_reports.html', context) 

def reverse_geocode_api(request):
    """API endpoint: Given lat/lng, return address using OpenStreetMap Nominatim from backend."""
    lat = request.GET.get('lat')
    lng = request.GET.get('lng')
    if not lat or not lng:
        return JsonResponse({'error': 'Missing lat/lng'}, status=400)
    try:
        url = f'https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}&zoom=18&addressdetails=1'
        headers = {'User-Agent': 'CrimePortal/1.0'}
        resp = requests.get(url, headers=headers, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            return JsonResponse({'address': data.get('display_name', '')})
        else:
            return JsonResponse({'error': 'Failed to fetch address'}, status=502)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500) 


def assignable_cases_page(request):
    """Page showing all assignable cases (real data)."""
    from django.utils import timezone
    # Only officers/admins can view
    if not request.user.is_authenticated or request.user.role not in ['officer', 'admin', 'supervisor']:
        from django.contrib import messages
        messages.error(request, 'Access denied.')
        from django.shortcuts import redirect
        return redirect('home')

    # Get all unassigned, submitted/pending cases
    assignable_cases = CrimeReport.objects.filter(
        assigned_officer__isnull=True,
        status__in=['submitted', 'pending', 'under_review']
    ).order_by('-created_at')[:50]

    context = {
        'assignable_cases': assignable_cases,
    }
    return render(request, 'main/assignable_cases.html', context) 

@login_required
@user_passes_test(is_officer_or_admin)
def police_dashboard_cases_api(request):
    """API endpoint for police dashboard real-time case updates."""
    try:
        from backend.reports.models import CrimeReport
        from django.template.defaultfilters import date as DateFormat
        from django.conf import settings
        
        # Show ALL cases for police dashboard
        cases = CrimeReport.objects.all().order_by('-created_at')
        
        # --- Search/Filter (optional: can add GET params support) ---
        case_list = []
        for case in cases:
            case_list.append({
                'id': str(case.id),
                'case_number': case.case_number,
                'reporter_name': case.reporter_name or (case.reporter.get_full_name() if case.reporter else 'Anonymous'),
                'category_name': case.category.name if case.category else '',
                'status': case.status,
                'status_display': dict(case.STATUS_CHOICES).get(case.status, case.status),
                'priority': case.priority,
                'priority_display': dict(case.PRIORITY_CHOICES).get(case.priority, case.priority),
                'created_at': DateFormat(case.created_at).format(get_format('DATE_FORMAT')),
            })
        return JsonResponse({'success': True, 'cases': case_list})
    except Exception as e:
        print(f"Error in police_dashboard_cases_api: {e}")
        return JsonResponse({'success': False, 'error': str(e)}, status=500) 