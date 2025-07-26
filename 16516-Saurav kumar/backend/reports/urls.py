from django.urls import path
from . import views

urlpatterns = [
    path('', views.public_reports_page, name='reports_home'),  # Reports home page
    path('submit/', views.submit_complaint, name='report_create'),
    path('my-reports/', views.my_reports, name='my_reports'),
    path('search/', views.advanced_search_reports, name='advanced_search'),
    path('report/<uuid:report_id>/', views.report_detail, name='report_detail'),
    path('track/<str:case_number>/', views.report_tracking, name='report_tracking'),
    
    # Export functionality
    path('export/csv/', views.export_reports_csv, name='export_reports_csv'),
    path('export/excel/', views.export_reports_excel, name='export_reports_excel'),
    path('report/<uuid:report_id>/export/pdf/', views.export_report_pdf, name='export_report_pdf'),
    
    # Officer/Admin endpoints
    path('dashboard/', views.officer_dashboard, name='dashboard'),
    path('report/<uuid:report_id>/update-status/', views.update_report_status, name='update_report_status'),
    path('report/<uuid:report_id>/assign/', views.assign_report, name='assign_report'),
    path('report/<uuid:report_id>/comment/', views.add_comment, name='add_comment'),
    path('reverse-geocode/', views.reverse_geocode_api, name='reverse_geocode_api'),
    path('report/<uuid:report_id>/upload-evidence/', views.upload_evidence, name='upload_evidence'),
    path('assignable/', views.assignable_cases_page, name='assignable_cases'),
    path('police-dashboard/cases/', views.police_dashboard_cases_api, name='police_dashboard_cases_api'),
] 