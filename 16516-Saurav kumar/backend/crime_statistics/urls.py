from django.urls import path
from . import views

urlpatterns = [
    path('', views.public_dashboard, name='statistics_dashboard'),
    path('transparency/', views.transparency_reports, name='transparency_reports'),
    path('transparency/<int:report_id>/', views.transparency_report_detail, name='transparency_report_detail'),
    path('api/stats/', views.api_statistics, name='api_statistics'),
    path('api/categories/', views.api_category_stats, name='api_category_stats'),
    path('api/locations/', views.api_location_stats, name='api_location_stats'),
    path('api/performance/', views.api_performance_metrics, name='api_performance_metrics'),
    path('admin/generate/', views.admin_generate_statistics, name='admin_generate_statistics'),
    path('admin/transparency/', views.admin_create_transparency_report, name='admin_create_transparency_report'),
] 