"""
Admin interface for notifications app.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import NotificationTemplate, Notification, NotificationPreference
from backend.authentication.models import UserProfile


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'notification_type', 'is_active', 'created_at']
    list_filter = ['notification_type', 'is_active', 'created_at']
    search_fields = ['name', 'subject']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'notification_type', 'is_active')
        }),
        ('Templates', {
            'fields': ('subject', 'email_template', 'sms_template', 'in_app_template'),
            'classes': ('collapse',)
        }),
        ('Variables', {
            'fields': ('variables',),
            'classes': ('collapse',),
            'description': 'Available template variables in JSON format'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'notification_type', 'email_status', 
        'sms_status', 'in_app_status', 'created_at'
    ]
    list_filter = [
        'notification_type', 'email_status', 'sms_status', 
        'in_app_status', 'created_at', 'send_email', 'send_sms', 'send_in_app'
    ]
    search_fields = ['user__email', 'user__username', 'subject', 'message']
    readonly_fields = [
        'id', 'created_at', 'scheduled_at', 'sent_at', 
        'email_sent_at', 'sms_sent_at', 'in_app_sent_at'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'template', 'notification_type')
        }),
        ('Content', {
            'fields': ('subject', 'message')
        }),
        ('Delivery Settings', {
            'fields': ('send_email', 'send_sms', 'send_in_app')
        }),
        ('Status', {
            'fields': (
                'email_status', 'sms_status', 'in_app_status',
                'email_error', 'sms_error'
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at', 'scheduled_at', 'sent_at',
                'email_sent_at', 'sms_sent_at', 'in_app_sent_at'
            ),
            'classes': ('collapse',)
        }),
        ('Related Objects', {
            'fields': ('related_report',),
            'classes': ('collapse',)
        })
    )
    
    actions = ['resend_failed_notifications', 'send_test_sms']
    
    def resend_failed_notifications(self, request, queryset):
        """Resend failed notifications."""
        count = 0
        for notification in queryset:
            if notification.email_status == 'failed':
                if notification.send_email_notification():
                    count += 1
            if notification.sms_status == 'failed':
                if notification.send_sms_notification():
                    count += 1
        
        self.message_user(
            request, 
            f'Successfully resent {count} failed notifications.'
        )
    
    resend_failed_notifications.short_description = "Resend failed notifications"
    
    def send_test_sms(self, request, queryset):
        """Send test SMS to selected notifications."""
        from .services import get_sms_service
        
        sms_service = get_sms_service()
        count = 0
        
        for notification in queryset:
            if notification.user.phone_number:
                result = sms_service.send_sms(
                    to_number=notification.user.phone_number,
                    message=f"Test SMS: {notification.message[:50]}..."
                )
                if result['success']:
                    count += 1
        
        self.message_user(
            request, 
            f'Successfully sent {count} test SMS messages.'
        )
    
    send_test_sms.short_description = "Send test SMS"


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'email_status_updates', 'sms_status_updates', 
        'in_app_status_updates', 'digest_frequency'
    ]
    list_filter = [
        'email_status_updates', 'sms_status_updates', 'sms_urgent',
        'in_app_status_updates', 'digest_frequency', 'quiet_hours_enabled'
    ]
    search_fields = ['user__email', 'user__username']
    readonly_fields = ['updated_at']
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Email Preferences', {
            'fields': (
                'email_status_updates', 'email_assignments', 
                'email_comments', 'email_reminders', 'email_marketing'
            )
        }),
        ('SMS Preferences', {
            'fields': (
                'sms_status_updates', 'sms_assignments', 'sms_urgent'
            )
        }),
        ('In-App Preferences', {
            'fields': (
                'in_app_status_updates', 'in_app_assignments', 
                'in_app_comments', 'in_app_reminders'
            )
        }),
        ('Frequency & Timing', {
            'fields': (
                'digest_frequency', 'quiet_hours_enabled',
                'quiet_hours_start', 'quiet_hours_end'
            )
        }),
        ('Timestamps', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        })
    ) 


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'station', 'address', 'date_of_birth', 'id_document_verified')
    search_fields = ('user__email', 'user__username')
    list_filter = ('station', 'id_document_verified') 