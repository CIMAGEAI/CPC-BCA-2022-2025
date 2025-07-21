from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('police/dashboard/', views.police_dashboard, name='police_dashboard'),
    path('public/dashboard/', views.public_dashboard, name='public_dashboard'),
] 