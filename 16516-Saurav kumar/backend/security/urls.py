from django.urls import path
from . import views
from .views import public_security_info_view

urlpatterns = [
    # Security Home
    path('', views.security_home, name='security_home'),
    # Evidence Management
    path('evidence/', views.evidence_management, name='evidence_management'),
    path('evidence/<uuid:evidence_id>/detail/', views.evidence_detail, name='evidence_detail'),
    path('evidence/<uuid:evidence_id>/download/', views.evidence_download, name='evidence_download'),
    path('evidence/<uuid:evidence_id>/verify/', views.verify_evidence, name='verify_evidence'),
    path('evidence/<uuid:evidence_id>/reject/', views.reject_evidence, name='reject_evidence'),
    
    # Security Audit
    path('audit-log/', views.security_audit_log, name='security_audit_log'),
    
    # File Scanning
    path('scan/<str:file_hash>/', views.file_scan_status, name='file_scan_status'),
    path('info/', public_security_info_view, name='public_security_info'),
] 