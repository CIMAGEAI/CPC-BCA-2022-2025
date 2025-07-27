"""
Statistics models for Crime Report Portal transparency dashboard.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Count, Avg, Sum, Min
from datetime import datetime, timedelta
import json

User = get_user_model()


class CrimeStatistics(models.Model):
    """
    Aggregated crime statistics for transparency reporting.
    """
    
    # Time period
    date = models.DateField(unique=True)
    period_type = models.CharField(
        max_length=20,
        choices=[
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('yearly', 'Yearly'),
        ],
        default='daily'
    )
    
    # Basic counts
    total_reports = models.PositiveIntegerField(default=0)
    resolved_reports = models.PositiveIntegerField(default=0)
    pending_reports = models.PositiveIntegerField(default=0)
    rejected_reports = models.PositiveIntegerField(default=0)
    
    # Category breakdown (JSON)
    category_breakdown = models.JSONField(default=dict)
    
    # Priority breakdown
    priority_breakdown = models.JSONField(default=dict)
    
    # Performance metrics
    avg_resolution_time_hours = models.FloatField(default=0.0)
    avg_response_time_hours = models.FloatField(default=0.0)
    
    # Geographic data (anonymized)
    location_breakdown = models.JSONField(default=dict)
    
    # Officer performance
    officer_assignments = models.JSONField(default=dict)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'crime_statistics'
        ordering = ['-date']
        indexes = [
            models.Index(fields=['date', 'period_type']),
        ]
    
    def __str__(self):
        return f"Statistics for {self.date} ({self.period_type})"
    
    @classmethod
    def generate_daily_statistics(cls, date=None):
        """Generate daily statistics for a specific date."""
        if date is None:
            date = timezone.now().date()
        
        from backend.reports.models import CrimeReport, ReportStatus
        
        # Get reports for the date
        reports = CrimeReport.objects.filter(created_at__date=date)
        
        # Basic counts
        total_reports = reports.count()
        resolved_reports = reports.filter(status='resolved').count()
        pending_reports = reports.exclude(status__in=['resolved', 'closed', 'rejected']).count()
        rejected_reports = reports.filter(status='rejected').count()
        
        # Category breakdown
        category_breakdown = reports.values('category__name').annotate(
            count=Count('id')
        )
        category_data = {item['category__name']: item['count'] for item in category_breakdown}
        
        # Priority breakdown
        priority_breakdown = reports.values('priority').annotate(
            count=Count('id')
        )
        priority_data = {item['priority']: item['count'] for item in priority_breakdown}
        
        # Performance metrics
        resolved_reports_with_time = reports.filter(
            status='resolved',
            resolved_at__isnull=False
        )
        
        avg_resolution_time = 0
        if resolved_reports_with_time.exists():
            avg_resolution_time = resolved_reports_with_time.aggregate(
                avg_time=Avg(models.F('resolved_at') - models.F('created_at'))
            )['avg_time'].total_seconds() / 3600  # Convert to hours
        
        # Response time (time to first status change)
        avg_response_time = 0
        reports_with_response = reports.filter(
            status_history__isnull=False
        ).annotate(
            first_response=Min('status_history__changed_at')
        )
        
        if reports_with_response.exists():
            avg_response_time = reports_with_response.aggregate(
                avg_response=Avg(models.F('first_response') - models.F('created_at'))
            )['avg_response'].total_seconds() / 3600
        
        # Location breakdown (anonymized - only general areas)
        location_breakdown = {}
        for report in reports:
            # Anonymize location by taking first part of address
            if report.incident_location:
                area = report.incident_location.split(',')[0].strip()
                location_breakdown[area] = location_breakdown.get(area, 0) + 1
        
        # Officer assignments
        officer_assignments = reports.values('assigned_officer__first_name', 'assigned_officer__last_name').annotate(
            count=Count('id')
        )
        officer_data = {}
        for item in officer_assignments:
            if item['assigned_officer__first_name']:
                name = f"{item['assigned_officer__first_name']} {item['assigned_officer__last_name']}"
                officer_data[name] = item['count']
        
        # Create or update statistics
        stats, created = cls.objects.get_or_create(
            date=date,
            period_type='daily',
            defaults={
                'total_reports': total_reports,
                'resolved_reports': resolved_reports,
                'pending_reports': pending_reports,
                'rejected_reports': rejected_reports,
                'category_breakdown': category_data,
                'priority_breakdown': priority_data,
                'avg_resolution_time_hours': avg_resolution_time,
                'avg_response_time_hours': avg_response_time,
                'location_breakdown': location_breakdown,
                'officer_assignments': officer_data,
            }
        )
        
        if not created:
            stats.total_reports = total_reports
            stats.resolved_reports = resolved_reports
            stats.pending_reports = pending_reports
            stats.rejected_reports = rejected_reports
            stats.category_breakdown = category_data
            stats.priority_breakdown = priority_data
            stats.avg_resolution_time_hours = avg_resolution_time
            stats.avg_response_time_hours = avg_response_time
            stats.location_breakdown = location_breakdown
            stats.officer_assignments = officer_data
            stats.save()
        
        return stats


class TransparencyReport(models.Model):
    """
    Public transparency reports for citizens.
    """
    
    REPORT_TYPES = [
        ('monthly', 'Monthly Report'),
        ('quarterly', 'Quarterly Report'),
        ('annual', 'Annual Report'),
        ('special', 'Special Report'),
    ]
    
    title = models.CharField(max_length=200)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Report content
    summary = models.TextField()
    key_findings = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    
    # Statistics snapshot
    statistics_snapshot = models.JSONField(default=dict)
    
    # File attachments
    pdf_report = models.FileField(upload_to='transparency_reports/', null=True, blank=True)
    
    # Publication settings
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    published_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='published_reports'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transparency_reports'
        ordering = ['-period_end']
    
    def __str__(self):
        return f"{self.title} ({self.period_start} - {self.period_end})"
    
    def publish(self, published_by):
        """Publish the transparency report."""
        self.is_published = True
        self.published_at = timezone.now()
        self.published_by = published_by
        self.save()
    
    def generate_statistics_snapshot(self):
        """Generate statistics snapshot for the report period."""
        from backend.reports.models import CrimeReport
        
        reports = CrimeReport.objects.filter(
            created_at__date__gte=self.period_start,
            created_at__date__lte=self.period_end
        )
        
        snapshot = {
            'total_reports': reports.count(),
            'resolved_reports': reports.filter(status='resolved').count(),
            'pending_reports': reports.exclude(status__in=['resolved', 'closed']).count(),
            'category_breakdown': {},
            'priority_breakdown': {},
            'avg_resolution_time': 0,
            'top_locations': [],
        }
        
        # Category breakdown
        category_data = reports.values('category__name').annotate(count=Count('id'))
        snapshot['category_breakdown'] = {item['category__name']: item['count'] for item in category_data}
        
        # Priority breakdown
        priority_data = reports.values('priority').annotate(count=Count('id'))
        snapshot['priority_breakdown'] = {item['priority']: item['count'] for item in priority_data}
        
        # Average resolution time
        resolved_reports = reports.filter(status='resolved', resolved_at__isnull=False)
        if resolved_reports.exists():
            avg_time = resolved_reports.aggregate(
                avg_time=Avg(models.F('resolved_at') - models.F('created_at'))
            )['avg_time'].total_seconds() / 3600
            snapshot['avg_resolution_time'] = round(avg_time, 2)
        
        # Top locations (anonymized)
        location_counts = {}
        for report in reports:
            if report.incident_location:
                area = report.incident_location.split(',')[0].strip()
                location_counts[area] = location_counts.get(area, 0) + 1
        
        snapshot['top_locations'] = sorted(
            location_counts.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:10]
        
        self.statistics_snapshot = snapshot
        self.save(update_fields=['statistics_snapshot'])
        
        return snapshot


class PublicDashboard(models.Model):
    """
    Configuration for public dashboard widgets and displays.
    """
    
    WIDGET_TYPES = [
        ('chart', 'Chart'),
        ('metric', 'Metric'),
        ('table', 'Table'),
        ('map', 'Map'),
    ]
    
    name = models.CharField(max_length=100)
    widget_type = models.CharField(max_length=20, choices=WIDGET_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Configuration
    config = models.JSONField(default=dict)
    data_source = models.CharField(max_length=100, blank=True)
    
    # Display settings
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    refresh_interval = models.PositiveIntegerField(default=3600)  # seconds
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'public_dashboard'
        ordering = ['order', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_widget_type_display()})"
    
    def get_data(self):
        """Get data for the widget."""
        if self.data_source == 'recent_reports':
            from backend.reports.models import CrimeReport
            return CrimeReport.objects.filter(
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count()
        
        elif self.data_source == 'resolution_rate':
            from backend.reports.models import CrimeReport
            total = CrimeReport.objects.filter(
                created_at__gte=timezone.now() - timedelta(days=90)
            ).count()
            resolved = CrimeReport.objects.filter(
                created_at__gte=timezone.now() - timedelta(days=90),
                status='resolved'
            ).count()
            return round((resolved / total * 100) if total > 0 else 0, 1)
        
        elif self.data_source == 'category_breakdown':
            from backend.reports.models import CrimeReport
            return CrimeReport.objects.values('category__name').annotate(
                count=Count('id')
            ).order_by('-count')[:5]
        
        return None 