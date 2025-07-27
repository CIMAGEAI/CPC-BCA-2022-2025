"""
Notification models for Crime Report Portal.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import json
import uuid

User = get_user_model()


class NotificationTemplate(models.Model):
    """
    Templates for different types of notifications.
    """
    
    NOTIFICATION_TYPES = [
        ('status_change', 'Status Change'),
        ('assignment', 'Assignment'),
        ('comment', 'New Comment'),
        ('evidence', 'Evidence Added'),
        ('reminder', 'Reminder'),
        ('welcome', 'Welcome'),
        ('password_reset', 'Password Reset'),
        ('verification', 'Account Verification'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    subject = models.CharField(max_length=200)
    email_template = models.TextField()
    sms_template = models.TextField(blank=True)
    in_app_template = models.TextField()
    is_active = models.BooleanField(default=True)
    
    # Variables that can be used in templates
    variables = models.JSONField(default=dict, help_text="Available template variables")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_templates'
    
    def __str__(self):
        return f"{self.name} ({self.get_notification_type_display()})"


class Notification(models.Model):
    """
    Individual notification instance.
    """
    
    DELIVERY_STATUS = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification_user')
    template = models.ForeignKey(NotificationTemplate, on_delete=models.CASCADE, null=True, blank=True)
    
    # Notification content
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NotificationTemplate.NOTIFICATION_TYPES)
    
    # Delivery settings
    send_email = models.BooleanField(default=True)
    send_sms = models.BooleanField(default=False)
    send_in_app = models.BooleanField(default=True)
    
    # Delivery status
    email_status = models.CharField(max_length=20, choices=DELIVERY_STATUS, default='pending')
    sms_status = models.CharField(max_length=20, choices=DELIVERY_STATUS, default='pending')
    in_app_status = models.CharField(max_length=20, choices=DELIVERY_STATUS, default='pending')
    
    # Delivery tracking
    email_sent_at = models.DateTimeField(null=True, blank=True)
    sms_sent_at = models.DateTimeField(null=True, blank=True)
    in_app_sent_at = models.DateTimeField(null=True, blank=True)
    
    # Error tracking
    email_error = models.TextField(blank=True)
    sms_error = models.TextField(blank=True)
    
    # Related objects
    related_report = models.ForeignKey('reports.CrimeReport', on_delete=models.CASCADE, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'notification_type']),
            models.Index(fields=['email_status', 'sms_status']),
            models.Index(fields=['scheduled_at']),
        ]
    
    def __str__(self):
        return f"Notification for {self.user.email} - {self.notification_type}"
    
    def send_email_notification(self):
        """Send email notification."""
        if not self.send_email or self.email_status != 'pending':
            return False
        
        try:
            # Get user's email preferences
            if not self.user.marketing_consent:
                self.email_status = 'cancelled'
                self.save(update_fields=['email_status'])
                return False
            
            # Send email
            success = send_mail(
                subject=self.subject,
                message=self.message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.user.email],
                fail_silently=False,
            )
            
            if success:
                self.email_status = 'sent'
                self.email_sent_at = timezone.now()
                self.save(update_fields=['email_status', 'email_sent_at'])
                return True
            else:
                self.email_status = 'failed'
                self.email_error = 'Email sending failed'
                self.save(update_fields=['email_status', 'email_error'])
                return False
                
        except Exception as e:
            self.email_status = 'failed'
            self.email_error = str(e)
            self.save(update_fields=['email_status', 'email_error'])
            return False
    
    def send_sms_notification(self):
        """Send SMS notification."""
        if not self.send_sms or self.sms_status != 'pending':
            return False
        
        try:
            # Check if user has phone number
            if not self.user.phone_number:
                self.sms_status = 'cancelled'
                self.save(update_fields=['sms_status'])
                return False
            
            # Import SMS service
            from .services import get_sms_service
            
            # Get SMS service
            sms_service = get_sms_service()
            
            # Send SMS
            result = sms_service.send_sms(
                to_number=self.user.phone_number,
                message=self.message
            )
            
            if result['success']:
                self.sms_status = 'sent'
                self.sms_sent_at = timezone.now()
                self.save(update_fields=['sms_status', 'sms_sent_at'])
                return True
            else:
                self.sms_status = 'failed'
                self.sms_error = result.get('message', 'SMS sending failed')
                self.save(update_fields=['sms_status', 'sms_error'])
                return False
            
        except Exception as e:
            self.sms_status = 'failed'
            self.sms_error = str(e)
            self.save(update_fields=['sms_status', 'sms_error'])
            return False
    
    def send_in_app_notification(self):
        """Send in-app notification."""
        if not self.send_in_app or self.in_app_status != 'pending':
            return False
        
        try:
            # Create in-app notification
            from backend.reports.models import ReportNotification
            ReportNotification.objects.create(
                report=self.related_report,
                user=self.user,
                notification_type=self.notification_type,
                message=self.message
            )
            
            self.in_app_status = 'sent'
            self.in_app_sent_at = timezone.now()
            self.save(update_fields=['in_app_status', 'in_app_sent_at'])
            return True
            
        except Exception as e:
            self.in_app_status = 'failed'
            self.save(update_fields=['in_app_status'])
            return False
    
    def send_all(self):
        """Send notification through all enabled channels."""
        email_sent = self.send_email_notification()
        sms_sent = self.send_sms_notification()
        in_app_sent = self.send_in_app_notification()
        
        # Update overall sent status
        if any([email_sent, sms_sent, in_app_sent]):
            self.sent_at = timezone.now()
            self.save(update_fields=['sent_at'])
        
        return {
            'email': email_sent,
            'sms': sms_sent,
            'in_app': in_app_sent
        }


class NotificationPreference(models.Model):
    """
    User notification preferences.
    """
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Email preferences
    email_status_updates = models.BooleanField(default=True)
    email_assignments = models.BooleanField(default=True)
    email_comments = models.BooleanField(default=True)
    email_reminders = models.BooleanField(default=False)
    email_marketing = models.BooleanField(default=False)
    
    # SMS preferences
    sms_status_updates = models.BooleanField(default=False)
    sms_assignments = models.BooleanField(default=False)
    sms_urgent = models.BooleanField(default=True)
    
    # In-app preferences
    in_app_status_updates = models.BooleanField(default=True)
    in_app_assignments = models.BooleanField(default=True)
    in_app_comments = models.BooleanField(default=True)
    in_app_reminders = models.BooleanField(default=True)
    
    # Frequency preferences
    digest_frequency = models.CharField(
        max_length=20,
        choices=[
            ('immediate', 'Immediate'),
            ('hourly', 'Hourly'),
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
        ],
        default='immediate'
    )
    
    # Quiet hours
    quiet_hours_start = models.TimeField(null=True, blank=True)
    quiet_hours_end = models.TimeField(null=True, blank=True)
    quiet_hours_enabled = models.BooleanField(default=False)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_preferences'
    
    def __str__(self):
        return f"Preferences for {self.user.email}"
    
    def is_quiet_hours(self):
        """Check if current time is within quiet hours."""
        if not self.quiet_hours_enabled:
            return False
        
        if not self.quiet_hours_start or not self.quiet_hours_end:
            return False
        
        current_time = timezone.now().time()
        return self.quiet_hours_start <= current_time <= self.quiet_hours_end 