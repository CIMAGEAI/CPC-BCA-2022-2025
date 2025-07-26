from django.urls import path
from . import views

urlpatterns = [
    # User notification views
    path('', views.notification_list, name='notification_list'),
    path('count/', views.get_notification_count, name='notification_count'),
    path('unread-count/', views.get_notification_count, name='notification_unread_count'),
    
    # Notification actions
    path('<uuid:notification_id>/mark-read/', views.mark_notification_read_view, name='mark_notification_read'),
    path('mark-all-read/', views.mark_all_notifications_read, name='mark_all_notifications_read'),
    path('<int:notification_id>/delete/', views.delete_notification, name='delete_notification'),
    path('clear-all/', views.clear_all_notifications, name='clear_all_notifications'),
    
    # User preferences
    path('preferences/', views.update_preferences, name='update_notification_preferences'),
    path('settings/', views.notification_settings, name='notification_settings'),
    
    # SMS testing
    path('test-sms/', views.test_sms_view, name='test_sms'),
    path('api/test-sms/', views.SMSTestAPIView.as_view(), name='sms_test_api'),
    
    # API endpoints
    path('api/create/', views.create_notification, name='create_notification'),
    
    # Admin endpoints
    path('admin/', views.admin_notifications, name='admin_notifications'),
    path('admin/<uuid:notification_id>/resend/', views.resend_notification, name='resend_notification'),
    path('check/', views.check_notifications, name='check_notifications'),
] 