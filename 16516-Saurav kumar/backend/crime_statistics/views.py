"""
Statistics views for Crime Report Portal transparency dashboard.
"""

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db.models import Count, Avg, Q, F
from django.utils import timezone
from datetime import datetime, timedelta
from .models import CrimeStatistics, TransparencyReport, PublicDashboard
from backend.reports.models import CrimeReport, CrimeCategory, ReportEvidence
from collections import OrderedDict
from backend.authentication.models import User

def public_dashboard(request):
    """Public statistics dashboard."""
    # Get recent statistics
    try:
        latest_stats = CrimeStatistics.objects.latest('date')
    except CrimeStatistics.DoesNotExist:
        latest_stats = None
    
    # Calculate current statistics
    current_stats = {
        'total_reports': CrimeReport.objects.count(),
        'resolved_reports': CrimeReport.objects.filter(status='resolved').count(),
        'pending_reports': CrimeReport.objects.exclude(status__in=['resolved', 'closed']).count(),
        'active_cases': CrimeReport.objects.filter(status__in=['assigned', 'under_review']).count(),
    }
    
    # Calculate resolution rate
    if current_stats['total_reports'] > 0:
        current_stats['resolution_rate'] = round(
            (current_stats['resolved_reports'] / current_stats['total_reports']) * 100, 1
        )
    else:
        current_stats['resolution_rate'] = 0
    
    # Calculate average response time (last 90 days)
    recent_reports = CrimeReport.objects.filter(
        created_at__gte=timezone.now() - timedelta(days=90)
    )
    if recent_reports.exists():
        avg_response_time = recent_reports.aggregate(
            avg_time=Avg(F('assigned_date') - F('created_at'))
        )['avg_time']
        if avg_response_time:
            current_stats['avg_response_time'] = round(avg_response_time.total_seconds() / 3600, 1)
        else:
            current_stats['avg_response_time'] = 0
    else:
        current_stats['avg_response_time'] = 0
    
    # Community trust (placeholder - would be from surveys)
    current_stats['community_trust'] = 85  # Placeholder
    
    # Category breakdown
    category_data = {}
    categories = CrimeCategory.objects.annotate(
        report_count=Count('crimereport')
    ).order_by('-report_count')[:10]
    
    for category in categories:
        category_data[category.name] = category.report_count
    
    # Monthly trends (last 12 months)
    trend_data = {}
    for i in range(12):
        date = timezone.now() - timedelta(days=30*i)
        month_key = date.strftime('%B %Y')
        count = CrimeReport.objects.filter(
            created_at__year=date.year,
            created_at__month=date.month
        ).count()
        trend_data[month_key] = count
    
    # Location breakdown (anonymized)
    location_data = {}
    reports_with_location = CrimeReport.objects.exclude(incident_location='')
    for report in reports_with_location[:100]:  # Limit to prevent performance issues
        if report.incident_location:
            area = report.incident_location.split(',')[0].strip()
            location_data[area] = location_data.get(area, 0) + 1
    
    # Priority breakdown
    priority_data = {}
    priorities = CrimeReport.objects.values('priority').annotate(count=Count('id'))
    for item in priorities:
        priority_data[item['priority']] = item['count']
    
    # Recent reports (public info only)
    recent_reports = CrimeReport.objects.filter(
        status__in=['resolved', 'closed']
    ).select_related('category').order_by('-created_at')[:10]
    
    # Get dashboard widgets
    widgets = PublicDashboard.objects.filter(is_active=True).order_by('order')
    
    # Monthly reports trend (last 12 months)
    monthly_reports = OrderedDict()
    now = timezone.now()
    for i in range(11, -1, -1):
        month = (now.replace(day=1) - timezone.timedelta(days=30*i))
        key = month.strftime('%b %Y')
        count = CrimeReport.objects.filter(
            created_at__year=month.year,
            created_at__month=month.month
        ).count()
        monthly_reports[key] = count
    # Status breakdown
    status_labels = ['submitted', 'assigned', 'under_review', 'resolved', 'closed']
    status_counts = [
        CrimeReport.objects.filter(status=label).count()
        for label in status_labels
    ]
    # Monthly user growth (last 12 months)
    monthly_users = OrderedDict()
    for i in range(11, -1, -1):
        month = (now.replace(day=1) - timezone.timedelta(days=30*i))
        key = month.strftime('%b %Y')
        count = User.objects.filter(
            created_at__year=month.year,
            created_at__month=month.month
        ).count()
        monthly_users[key] = count
    
    context = {
        'stats': current_stats,
        'category_data': category_data,
        'trend_data': trend_data,
        'location_data': location_data,
        'priority_data': priority_data,
        'recent_reports': recent_reports,
        'widgets': widgets,
        'last_updated': timezone.now(),
        'data_period': 'Last 30 days',
        'next_update': timezone.now() + timedelta(hours=1),
        'monthly_reports': list(monthly_reports.values()),
        'monthly_reports_labels': list(monthly_reports.keys()),
        'status_labels': status_labels,
        'status_counts': status_counts,
        'monthly_users': list(monthly_users.values()),
        'monthly_users_labels': list(monthly_users.keys()),
    }
    
    return render(request, 'statistics/dashboard.html', context)


def transparency_reports(request):
    """List of published transparency reports."""
    reports = TransparencyReport.objects.filter(is_published=True).order_by('-period_end')
    
    # Pagination
    paginator = Paginator(reports, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'reports': page_obj,
    }
    
    return render(request, 'statistics/transparency_reports.html', context)


def transparency_report_detail(request, report_id):
    """Detailed view of a transparency report."""
    report = get_object_or_404(TransparencyReport, id=report_id, is_published=True)
    
    context = {
        'report': report,
    }
    
    return render(request, 'statistics/transparency_report_detail.html', context)


def api_statistics(request):
    """API endpoint for statistics data."""
    # Get date range
    days = int(request.GET.get('days', 30))
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=days)
    
    # Get reports in date range
    reports = CrimeReport.objects.filter(
        created_at__date__gte=start_date,
        created_at__date__lte=end_date
    )
    
    # Calculate statistics
    stats = {
        'total_reports': reports.count(),
        'resolved_reports': reports.filter(status='resolved').count(),
        'pending_reports': reports.exclude(status__in=['resolved', 'closed']).count(),
        'category_breakdown': {},
        'daily_trends': {},
        'location_breakdown': {},
    }
    
    # Category breakdown
    category_data = reports.values('category__name').annotate(count=Count('id'))
    for item in category_data:
        stats['category_breakdown'][item['category__name']] = item['count']
    
    # Daily trends
    for i in range(days):
        date = start_date + timedelta(days=i)
        count = reports.filter(created_at__date=date).count()
        stats['daily_trends'][date.strftime('%Y-%m-%d')] = count
    
    # Location breakdown (anonymized)
    location_counts = {}
    for report in reports.exclude(incident_location=''):
        if report.incident_location:
            area = report.incident_location.split(',')[0].strip()
            location_counts[area] = location_counts.get(area, 0) + 1
    
    stats['location_breakdown'] = dict(
        sorted(location_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    )
    
    return JsonResponse(stats)


def api_category_stats(request):
    """API endpoint for category statistics."""
    categories = CrimeCategory.objects.annotate(
        total_reports=Count('crimereport'),
        resolved_reports=Count('crimereport', filter=Q(crimereport__status='resolved')),
        pending_reports=Count('crimereport', filter=Q(crimereport__status__in=['submitted', 'assigned', 'under_review']))
    ).order_by('-total_reports')
    
    data = []
    for category in categories:
        resolution_rate = 0
        if category.total_reports > 0:
            resolution_rate = round((category.resolved_reports / category.total_reports) * 100, 1)
        
        data.append({
            'name': category.name,
            'total_reports': category.total_reports,
            'resolved_reports': category.resolved_reports,
            'pending_reports': category.pending_reports,
            'resolution_rate': resolution_rate,
        })
    
    return JsonResponse({'categories': data})


def api_location_stats(request):
    """API endpoint for location statistics."""
    # Get reports with locations
    reports = CrimeReport.objects.exclude(incident_location='')
    
    # Anonymize locations
    location_counts = {}
    for report in reports:
        if report.incident_location:
            area = report.incident_location.split(',')[0].strip()
            location_counts[area] = location_counts.get(area, 0) + 1
    
    # Sort by count and limit to top 20
    sorted_locations = sorted(location_counts.items(), key=lambda x: x[1], reverse=True)[:20]
    
    data = [{'location': loc, 'count': count} for loc, count in sorted_locations]
    
    return JsonResponse({'locations': data})


def api_performance_metrics(request):
    """API endpoint for performance metrics."""
    # Get reports from last 90 days
    end_date = timezone.now()
    start_date = end_date - timedelta(days=90)
    
    reports = CrimeReport.objects.filter(
        created_at__gte=start_date,
        created_at__lte=end_date
    )
    
    # Calculate metrics
    total_reports = reports.count()
    resolved_reports = reports.filter(status='resolved').count()
    
    # Average resolution time
    resolved_with_time = reports.filter(
        status='resolved',
        resolved_at__isnull=False
    )
    
    avg_resolution_time = 0
    if resolved_with_time.exists():
        avg_time = resolved_with_time.aggregate(
            avg_time=Avg('resolved_at' - 'created_at')
        )['avg_time']
        if avg_time:
            avg_resolution_time = round(avg_time.total_seconds() / 3600, 1)
    
    # Average response time
    assigned_reports = reports.filter(
        assigned_date__isnull=False
    )
    
    avg_response_time = 0
    if assigned_reports.exists():
        avg_time = assigned_reports.aggregate(
            avg_time=Avg('assigned_date' - 'created_at')
        )['avg_time']
        if avg_time:
            avg_response_time = round(avg_time.total_seconds() / 3600, 1)
    
    # Resolution rate
    resolution_rate = 0
    if total_reports > 0:
        resolution_rate = round((resolved_reports / total_reports) * 100, 1)
    
    metrics = {
        'total_reports': total_reports,
        'resolved_reports': resolved_reports,
        'resolution_rate': resolution_rate,
        'avg_resolution_time_hours': avg_resolution_time,
        'avg_response_time_hours': avg_response_time,
        'period_days': 90,
    }
    
    return JsonResponse(metrics)


# Admin endpoints for managing statistics
def admin_generate_statistics(request):
    """Admin endpoint to generate daily statistics."""
    if not request.user.is_staff:
        return JsonResponse({'error': 'Permission denied'}, status=403)
    
    try:
        # Generate statistics for today
        stats = CrimeStatistics.generate_daily_statistics()
        
        return JsonResponse({
            'success': True,
            'message': f'Statistics generated for {stats.date}',
            'stats': {
                'total_reports': stats.total_reports,
                'resolved_reports': stats.resolved_reports,
                'pending_reports': stats.pending_reports,
            }
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


def admin_create_transparency_report(request):
    """Admin endpoint to create transparency report."""
    if not request.user.is_staff:
        return JsonResponse({'error': 'Permission denied'}, status=403)
    
    try:
        # This would typically be a form submission
        # For now, just return success
        return JsonResponse({
            'success': True,
            'message': 'Transparency report creation endpoint'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500) 