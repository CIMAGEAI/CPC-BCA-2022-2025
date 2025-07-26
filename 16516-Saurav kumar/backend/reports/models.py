"""
Models for Crime Report Portal - Complaint Management with Security Features.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from cryptography.fernet import Fernet
from django.conf import settings
import uuid
import json

User = get_user_model()


class CrimeCategory(models.Model):
    """
    Categories of crimes for classification.
    """
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    priority_level = models.IntegerField(
        choices=[
            (1, 'Low'),
            (2, 'Medium'),
            (3, 'High'),
            (4, 'Critical'),
        ],
        default=2
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Crime Category'
        verbose_name_plural = 'Crime Categories'
        db_table = 'crime_categories'
        ordering = ['priority_level', 'name']
    
    def __str__(self):
        return self.name


class Station(models.Model):
    name = models.CharField(max_length=100, unique=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class CrimeReport(models.Model):
    """
    Main crime report model with encryption and security features.
    """
    
    # Status choices
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('assigned', 'Assigned to Officer'),
        ('investigating', 'Under Investigation'),
        ('pending_evidence', 'Pending Evidence'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
        ('rejected', 'Rejected'),
    ]
    
    # Priority choices
    PRIORITY_CHOICES = [
        ('normal', 'Normal (सामान्य)'),
        ('medium', 'Medium (मध्यम)'),
        ('critical', 'Critical (गंभीर)'),
        ('sensitive', 'Sensitive (संवेदनशील)'),
    ]
    
    # Basic identification
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case_number = models.CharField(max_length=20, unique=True, editable=False)
    
    # Reporter information (encrypted)
    reporter = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='reports_filed',
        null=True,
        blank=True
    )
    is_anonymous = models.BooleanField(default=False)
    reporter_name = models.CharField(max_length=200, blank=True, null=True)
    reporter_email = models.EmailField(blank=True, null=True)
    reporter_phone = models.CharField(max_length=17, blank=True, null=True)
    
    # Incident details (encrypted)
    category = models.ForeignKey(CrimeCategory, on_delete=models.PROTECT, null=True, blank=True)
    incident_date = models.DateTimeField(null=True, blank=True)
    incident_location = models.TextField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Description (encrypted)
    description = models.TextField(blank=True, null=True)
    additional_details = models.TextField(blank=True, null=True)
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted', blank=True, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium', blank=True, null=True)
    
    # Assignment
    assigned_officer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_reports',
        limit_choices_to={'role__in': ['officer', 'supervisor']}
    )
    assigned_date = models.DateTimeField(null=True, blank=True)
    station = models.ForeignKey('Station', on_delete=models.SET_NULL, null=True, blank=True, related_name='reports')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # Security and privacy
    is_sensitive = models.BooleanField(default=False)
    access_level = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('restricted', 'Restricted'),
            ('confidential', 'Confidential'),
        ],
        default='restricted',
        blank=True,
        null=True
    )
    
    # Audit fields
    created_by_ip = models.GenericIPAddressField(null=True, blank=True)
    last_modified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='modified_reports'
    )
    
    class Meta:
        db_table = 'crime_reports'
        indexes = [
            models.Index(fields=['case_number']),
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
            models.Index(fields=['incident_date']),
            models.Index(fields=['assigned_officer']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Case #{self.case_number} - {self.category.name}"
    
    def save(self, *args, **kwargs):
        """Generate case number and handle status changes."""
        if not self.case_number:
            self.case_number = self.generate_case_number()
        
        # Update resolved_at when status changes to resolved
        if self.status == 'resolved' and not self.resolved_at:
            self.resolved_at = timezone.now()
        
        super().save(*args, **kwargs)
    
    def generate_case_number(self):
        """Generate unique case number."""
        year = timezone.now().year
        count = CrimeReport.objects.filter(
            created_at__year=year
        ).count() + 1
        return f"CR{year}{count:06d}"
    
    def can_be_accessed_by(self, user):
        """Check if user can access this report."""
        if user.role == 'admin':
            return True
        if user.role in ['officer', 'supervisor']:
            return True
        if self.reporter == user:
            return True
        return False
    
    def can_be_edited_by(self, user):
        """Check if user can edit this report."""
        if user.role == 'admin':
            return True
        if user.role in ['officer', 'supervisor']:
            return True
        if self.reporter == user and self.status == 'submitted':
            return True
        return False
    
    def get_encrypted_description(self):
        """Get encrypted description."""
        if hasattr(settings, 'ENCRYPTION_KEY'):
            f = Fernet(settings.ENCRYPTION_KEY.encode())
            return f.encrypt(self.description.encode()).decode()
        return self.description


class ReportEvidence(models.Model):
    """
    Evidence files attached to crime reports.
    """
    
    EVIDENCE_TYPES = [
        ('photo', 'Photograph'),
        ('video', 'Video'),
        ('document', 'Document'),
        ('audio', 'Audio Recording'),
        ('other', 'Other'),
    ]
    
    report = models.ForeignKey(CrimeReport, on_delete=models.CASCADE, related_name='evidence')
    file = models.FileField(upload_to='evidence/%Y/%m/%d/')
    file_type = models.CharField(max_length=20, choices=EVIDENCE_TYPES)
    description = models.CharField(max_length=255, blank=True)
    
    # Security
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='report_verified_evidence'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    
    # File metadata
    file_size = models.PositiveIntegerField()
    file_hash = models.CharField(max_length=64)  # SHA-256 hash
    mime_type = models.CharField(max_length=100)
    
    # Timestamps
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_evidence')
    
    class Meta:
        db_table = 'report_evidence'
        verbose_name = 'Report Evidence'
        verbose_name_plural = 'Report Evidence'
    
    def __str__(self):
        return f"Evidence for {self.report.case_number} - {self.get_file_type_display()}"
    
    def clean(self):
        """Validate file size and type."""
        if self.file:
            # Check file size (10MB limit)
            if self.file.size > 10 * 1024 * 1024:
                raise ValidationError(_("File size must be less than 10MB."))
            # Check file type
            allowed_types = ['image/', 'video/', 'audio/', 'application/pdf', 'text/']
            if hasattr(self.file, 'content_type'):
                if not any(self.file.content_type.startswith(t) for t in allowed_types):
                    raise ValidationError(_("File type not allowed."))


class ReportStatus(models.Model):
    """
    Status history for crime reports.
    """
    
    report = models.ForeignKey(CrimeReport, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=CrimeReport.STATUS_CHOICES)
    notes = models.TextField(blank=True)
    
    # Who made the change
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='status_changes')
    changed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'report_status_history'
        ordering = ['-changed_at']
    
    def __str__(self):
        return f"{self.report.case_number} - {self.status} by {self.changed_by}"


class ReportComment(models.Model):
    """
    Comments and notes on crime reports.
    """
    
    report = models.ForeignKey(CrimeReport, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='report_comments')
    content = models.TextField()
    is_internal = models.BooleanField(default=False)  # Internal notes not visible to reporter
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'report_comments'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author} on {self.report.case_number}"


class ReportNotification(models.Model):
    """
    Notifications for report updates.
    """
    
    NOTIFICATION_TYPES = [
        ('status_change', 'Status Change'),
        ('assignment', 'Assignment'),
        ('comment', 'New Comment'),
        ('evidence', 'Evidence Added'),
        ('reminder', 'Reminder'),
    ]
    
    report = models.ForeignKey(CrimeReport, on_delete=models.CASCADE, related_name='notifications')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='report_notification_user')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'report_notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]
    
    def __str__(self):
        return f"Notification for {self.user} - {self.notification_type}"
    
    def mark_as_read(self):
        """Mark notification as read."""
        self.is_read = True
        self.read_at = timezone.now()
        self.save(update_fields=['is_read', 'read_at'])


class ReportStatistics(models.Model):
    """
    Aggregated statistics for reporting and transparency.
    """
    
    date = models.DateField(unique=True)
    total_reports = models.PositiveIntegerField(default=0)
    resolved_reports = models.PositiveIntegerField(default=0)
    pending_reports = models.PositiveIntegerField(default=0)
    
    # Category breakdown (JSON field)
    category_breakdown = models.JSONField(default=dict)
    
    # Average resolution time
    avg_resolution_time_hours = models.FloatField(default=0.0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'report_statistics'
        verbose_name = 'Report Statistics'
        verbose_name_plural = 'Report Statistics'
        ordering = ['-date']
    
    def __str__(self):
        return f"Statistics for {self.date}"
    
    @classmethod
    def update_daily_statistics(cls, date):
        """Update statistics for a specific date."""
        from django.db.models import Count, Avg
        from django.utils import timezone
        
        # Get reports for the date
        reports = CrimeReport.objects.filter(
            created_at__date=date
        )
        
        # Calculate statistics
        total_reports = reports.count()
        resolved_reports = reports.filter(status='resolved').count()
        pending_reports = reports.exclude(status__in=['resolved', 'closed']).count()
        
        # Category breakdown
        category_breakdown = reports.values('category__name').annotate(
            count=Count('id')
        )
        
        # Average resolution time
        resolved_reports_with_time = reports.filter(
            status='resolved',
            resolved_at__isnull=False
        )
        
        avg_resolution_time = 0
        if resolved_reports_with_time.exists():
            avg_resolution_time = resolved_reports_with_time.aggregate(
                avg_time=Avg(models.F('resolved_at') - models.F('created_at'))
            )['avg_time'].total_seconds() / 3600  # Convert to hours
        
        # Create or update statistics
        stats, created = cls.objects.get_or_create(
            date=date,
            defaults={
                'total_reports': total_reports,
                'resolved_reports': resolved_reports,
                'pending_reports': pending_reports,
                'category_breakdown': {item['category__name']: item['count'] for item in category_breakdown},
                'avg_resolution_time_hours': avg_resolution_time,
            }
        )
        
        if not created:
            stats.total_reports = total_reports
            stats.resolved_reports = resolved_reports
            stats.pending_reports = pending_reports
            stats.category_breakdown = {item['category__name']: item['count'] for item in category_breakdown}
            stats.avg_resolution_time_hours = avg_resolution_time
            stats.save()
        
        return stats 