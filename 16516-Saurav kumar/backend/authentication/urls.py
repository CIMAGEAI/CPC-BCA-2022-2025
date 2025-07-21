"""
URL configuration for authentication app.
"""

from django.urls import path, include
from . import views

app_name = 'authentication'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('admin/login/', views.admin_login_view, name='admin_login'),
    path('police/login/', views.police_login_view, name='police_login'),
    path('public/login/', views.public_login_view, name='public_login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('profile/', views.profile_view, name='profile'),
    path('change-password/', views.change_password_view, name='change_password'),
    path('reset-password/', views.reset_password_view, name='reset_password'),
    path('reset-password-confirm/<str:token>/', views.reset_password_confirm_view, name='reset_password_confirm'),
    path('verify-email/<str:token>/', views.verify_email_view, name='verify_email'),
    path('forgot-password/', views.forgot_password_view, name='forgot_password'),
    path('admin-dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
    path('verify-otp/', views.verify_otp_view, name='verify_otp'),
    path('resend-otp/', views.resend_otp_view, name='resend_otp'),
] 