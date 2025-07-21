"""
Notification views for Crime Report Portal.
"""

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db.models import Q
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from .models import Notification, NotificationPreference, NotificationTemplate
from backend.reports.models import CrimeCategory, CrimeReport, ReportNotification
from backend.authentication.models import User
import json
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from .services import get_sms_service

User = get_user_model()


@login_required
def notifications_list(request):
    """View user's notifications with filtering and pagination."""
    notifications = ReportNotification.objects.filter(user=request.user).order_by('-created_at')
    
    # Filtering
    notification_type = request.GET.get('type')
    if notification_type:
        notifications = notifications.filter(notification_type=notification_type)
    
    status_filter = request.GET.get('status')
    if status_filter == 'unread':
        notifications = notifications.filter(is_read=False)
    elif status_filter == 'read':
        notifications = notifications.filter(is_read=True)
    
    # Date filtering
    date_filter = request.GET.get('date')
    if date_filter == 'today':
        notifications = notifications.filter(created_at__date=timezone.now().date())
    elif date_filter == 'week':
        notifications = notifications.filter(created_at__gte=timezone.now() - timezone.timedelta(days=7))
    elif date_filter == 'month':
        notifications = notifications.filter(created_at__gte=timezone.now() - timezone.timedelta(days=30))
    
    # Search
    search_query = request.GET.get('search')
    if search_query:
        notifications = notifications.filter(
            Q(message__icontains=search_query) |
            Q(report__case_number__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(notifications, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get user preferences
    preferences, created = NotificationPreference.objects.get_or_create(user=request.user)
    
    # Statistics
    stats = {
        'total': ReportNotification.objects.filter(user=request.user).count(),
        'unread': ReportNotification.objects.filter(user=request.user, is_read=False).count(),
    }
    
    context = {
        'notifications': page_obj,
        'preferences': preferences,
        'stats': stats,
    }
    
    return render(request, 'notifications/notifications.html', context)


@login_required
@require_http_methods(["POST"])
def mark_notification_read(request, notification_id):
    """Mark a notification as read."""
    try:
        notification = get_object_or_404(ReportNotification, id=notification_id, user=request.user)
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Notification marked as read'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)


@login_required
@require_http_methods(["POST"])
def mark_all_notifications_read(request):
    """Mark all user notifications as read."""
    try:
        ReportNotification.objects.filter(
            user=request.user, 
            is_read=False
        ).update(
            is_read=True,
            read_at=timezone.now()
        )
        
        return JsonResponse({
            'success': True,
            'message': 'All notifications marked as read'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)


@login_required
@require_http_methods(["DELETE"])
def delete_notification(request, notification_id):
    """Delete a notification."""
    try:
        notification = get_object_or_404(ReportNotification, id=notification_id, user=request.user)
        notification.delete()
        
        return JsonResponse({
            'success': True,
            'message': 'Notification deleted'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)


@login_required
@require_http_methods(["DELETE"])
def clear_all_notifications(request):
    """Clear all user notifications."""
    try:
        ReportNotification.objects.filter(user=request.user).delete()
        
        return JsonResponse({
            'success': True,
            'message': 'All notifications cleared'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)


@login_required
@require_http_methods(["POST"])
def update_preferences(request):
    """Update user notification preferences."""
    try:
        preferences, created = NotificationPreference.objects.get_or_create(user=request.user)
        
        # Update email preferences
        preferences.email_status_updates = request.POST.get('email_status_updates') == 'on'
        preferences.email_assignments = request.POST.get('email_assignments') == 'on'
        preferences.email_comments = request.POST.get('email_comments') == 'on'
        preferences.email_reminders = request.POST.get('email_reminders') == 'on'
        preferences.email_marketing = request.POST.get('email_marketing') == 'on'
        
        # Update SMS preferences
        preferences.sms_status_updates = request.POST.get('sms_status_updates') == 'on'
        preferences.sms_assignments = request.POST.get('sms_assignments') == 'on'
        preferences.sms_urgent = request.POST.get('sms_urgent') == 'on'
        
        # Update in-app preferences
        preferences.in_app_status_updates = request.POST.get('in_app_status_updates') == 'on'
        preferences.in_app_assignments = request.POST.get('in_app_assignments') == 'on'
        preferences.in_app_comments = request.POST.get('in_app_comments') == 'on'
        preferences.in_app_reminders = request.POST.get('in_app_reminders') == 'on'
        
        # Update frequency
        preferences.digest_frequency = request.POST.get('digest_frequency', 'immediate')
        
        # Update quiet hours
        preferences.quiet_hours_enabled = request.POST.get('quiet_hours_enabled') == 'on'
        if preferences.quiet_hours_enabled:
            preferences.quiet_hours_start = request.POST.get('quiet_hours_start')
            preferences.quiet_hours_end = request.POST.get('quiet_hours_end')
        
        preferences.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Preferences updated successfully'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)


@login_required
def get_notification_count(request):
    """Get unread notification count for header."""
    count = ReportNotification.objects.filter(user=request.user, is_read=False).count()
    return JsonResponse({'count': count})


# API endpoints for creating notifications
@csrf_exempt
@require_http_methods(["POST"])
def create_notification(request):
    """Create a new notification via API."""
    try:
        data = json.loads(request.body)
        
        # Validate required fields
        required_fields = ['user_id', 'notification_type', 'message']
        for field in required_fields:
            if field not in data:
                return JsonResponse({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }, status=400)
        
        # Get user
        try:
            user = User.objects.get(id=data['user_id'])
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'User not found'
            }, status=404)
        
        # Get user preferences
        preferences, created = NotificationPreference.objects.get_or_create(user=user)
        
        # Check if notification should be sent based on preferences
        notification_type = data['notification_type']
        should_send = False
        
        if notification_type == 'status_change' and preferences.in_app_status_updates:
            should_send = True
        elif notification_type == 'assignment' and preferences.in_app_assignments:
            should_send = True
        elif notification_type == 'comment' and preferences.in_app_comments:
            should_send = True
        elif notification_type == 'reminder' and preferences.in_app_reminders:
            should_send = True
        else:
            should_send = True  # Default to sending if no specific preference
        
        if not should_send:
            return JsonResponse({
                'success': True,
                'message': 'Notification skipped due to user preferences'
            })
        
        # Check quiet hours
        if preferences.is_quiet_hours():
            return JsonResponse({
                'success': True,
                'message': 'Notification delayed due to quiet hours'
            })
        
        # Create notification
        notification_data = {
            'user': user,
            'notification_type': notification_type,
            'message': data['message'],
        }
        
        # Add optional fields
        if 'report_id' in data:
            try:
                notification_data['report'] = CrimeReport.objects.get(id=data['report_id'])
            except CrimeReport.DoesNotExist:
                pass
        
        notification = ReportNotification.objects.create(**notification_data)
        
        # Send email/SMS if enabled
        if preferences.email_status_updates and notification_type == 'status_change':
            send_email_notification(notification, user)
        
        if preferences.sms_urgent and notification_type in ['assignment', 'status_change']:
            send_sms_notification(notification, user)
        
        return JsonResponse({
            'success': True,
            'notification_id': notification.id,
            'message': 'Notification created successfully'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


def send_email_notification(notification, user):
    """Send email notification."""
    try:
        from django.core.mail import send_mail
        from django.conf import settings
        
        subject = f"Crime Report Update - {notification.get_notification_type_display()}"
        
        send_mail(
            subject=subject,
            message=notification.message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
        
        # Log email sent
        print(f"Email notification sent to {user.email}: {subject}")
        
    except Exception as e:
        print(f"Error sending email notification: {e}")


def send_sms_notification(notification, user):
    """Send SMS notification."""
    try:
        # TODO: Integrate with SMS service (Twilio, etc.)
        # For now, just log the SMS
        print(f"SMS notification would be sent to {user.phone_number}: {notification.message}")
        
    except Exception as e:
        print(f"Error sending SMS notification: {e}")


# Admin endpoints for notification management
@login_required
def admin_notifications(request):
    """Admin view for managing all notifications."""
    if not request.user.is_staff:
        return JsonResponse({'error': 'Permission denied'}, status=403)
    
    notifications = Notification.objects.all().order_by('-created_at')
    
    # Filtering
    status_filter = request.GET.get('status')
    if status_filter:
        notifications = notifications.filter(email_status=status_filter)
    
    # Pagination
    paginator = Paginator(notifications, 50)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'notifications': page_obj,
    }
    
    return render(request, 'notifications/admin_notifications.html', context)


@login_required
@require_http_methods(["POST"])
def resend_notification(request, notification_id):
    """Resend a failed notification."""
    if not request.user.is_staff:
        return JsonResponse({'error': 'Permission denied'}, status=403)
    
    try:
        notification = get_object_or_404(Notification, id=notification_id)
        result = notification.send_all()
        
        return JsonResponse({
            'success': True,
            'result': result,
            'message': 'Notification resent'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)


@login_required
def notification_list_view(request):
    notifications = Notification.objects.filter(user=request.user, send_in_app=True).order_by('-created_at')[:50]
    return render(request, 'notifications/notification_list.html', {'notifications': notifications})


@login_required
def mark_notification_read_view(request, notification_id):
    notification = get_object_or_404(Notification, id=notification_id, user=request.user)
    notification.in_app_status = 'delivered'
    notification.save(update_fields=['in_app_status'])
    return redirect('notifications:notification_list')


@login_required
def notification_settings(request):
    """User notification preferences page."""
    try:
        preferences = NotificationPreference.objects.get(user=request.user)
    except NotificationPreference.DoesNotExist:
        preferences = NotificationPreference.objects.create(user=request.user)
    
    if request.method == 'POST':
        # Update preferences
        preferences.email_status_updates = request.POST.get('email_status_updates') == 'on'
        preferences.email_assignments = request.POST.get('email_assignments') == 'on'
        preferences.email_comments = request.POST.get('email_comments') == 'on'
        preferences.email_reminders = request.POST.get('email_reminders') == 'on'
        preferences.email_marketing = request.POST.get('email_marketing') == 'on'
        
        preferences.sms_status_updates = request.POST.get('sms_status_updates') == 'on'
        preferences.sms_assignments = request.POST.get('sms_assignments') == 'on'
        preferences.sms_urgent = request.POST.get('sms_urgent') == 'on'
        
        preferences.in_app_status_updates = request.POST.get('in_app_status_updates') == 'on'
        preferences.in_app_assignments = request.POST.get('in_app_assignments') == 'on'
        preferences.in_app_comments = request.POST.get('in_app_comments') == 'on'
        preferences.in_app_reminders = request.POST.get('in_app_reminders') == 'on'
        
        preferences.digest_frequency = request.POST.get('digest_frequency', 'immediate')
        preferences.quiet_hours_enabled = request.POST.get('quiet_hours_enabled') == 'on'
        
        if preferences.quiet_hours_enabled:
            preferences.quiet_hours_start = request.POST.get('quiet_hours_start')
            preferences.quiet_hours_end = request.POST.get('quiet_hours_end')
        
        preferences.save()
        messages.success(request, 'Notification preferences updated successfully!')
        return redirect('notification_settings')
    
    context = {
        'preferences': preferences,
        'user': request.user
    }
    return render(request, 'notifications/settings.html', context)


@login_required
def test_sms_view(request):
    """Test SMS functionality."""
    if request.method == 'POST':
        phone_number = request.POST.get('phone_number')
        message = request.POST.get('message', 'Test SMS from Crime Report Portal')
        
        if not phone_number:
            messages.error(request, 'Phone number is required.')
            return redirect('test_sms')
        
        try:
            sms_service = get_sms_service()
            result = sms_service.send_sms(
                to_number=phone_number,
                message=message
            )
            
            if result['success']:
                messages.success(request, f'SMS sent successfully! SID: {result.get("sid", "N/A")}')
            else:
                messages.error(request, f'SMS sending failed: {result.get("message", "Unknown error")}')
                
        except Exception as e:
            messages.error(request, f'Error sending SMS: {str(e)}')
        
        return redirect('test_sms')
    
    return render(request, 'notifications/test_sms.html')


@method_decorator(csrf_exempt, name='dispatch')
class SMSTestAPIView(View):
    """API endpoint for testing SMS functionality."""
    
    def post(self, request):
        """Send test SMS via API."""
        import json
        
        try:
            data = json.loads(request.body)
            phone_number = data.get('phone_number')
            message = data.get('message', 'Test SMS from Crime Report Portal API')
            
            if not phone_number:
                return JsonResponse({
                    'success': False,
                    'message': 'Phone number is required'
                }, status=400)
            
            sms_service = get_sms_service()
            result = sms_service.send_sms(
                to_number=phone_number,
                message=message
            )
            
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)


@login_required
def notification_list(request):
    """User's notification history."""
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    
    context = {
        'notifications': notifications
    }
    return render(request, 'notifications/list.html', context)


@login_required
def notification_detail(request, notification_id):
    """View notification details."""
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
    except Notification.DoesNotExist:
        messages.error(request, 'Notification not found.')
        return redirect('notification_list')
    
    context = {
        'notification': notification
    }
    return render(request, 'notifications/detail.html', context) 


@login_required
def check_notifications(request):
    notifications = []
    for n in request.user.report_notification_user.filter(is_read=False).order_by('-created_at')[:5]:
        notifications.append({
            'id': n.id,
            'message': n.message,
            'created_at': n.created_at.strftime('%Y-%m-%d %H:%M'),
        })
    return JsonResponse({'notifications': notifications}) 