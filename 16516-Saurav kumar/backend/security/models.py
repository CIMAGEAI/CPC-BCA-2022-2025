"""
Security models for Crime Report Portal - Evidence Management & Security.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.files.uploadedfile import UploadedFile
import hashlib
import os
import mimetypes

User = get_user_model()


class FileScan(models.Model):
    """
    File scanning results for uploaded evidence.
    """
    
    SCAN_STATUS = [
        ('pending', 'Pending'),
        ('scanning', 'Scanning'),
        ('clean', 'Clean'),
        ('infected', 'Infected'),
        ('error', 'Error'),
        ('quarantined', 'Quarantined'),
    ]
    
    file_hash = models.CharField(max_length=64, unique=True)  # SHA-256 hash
    file_path = models.CharField(max_length=500)
    file_size = models.PositiveIntegerField()
    mime_type = models.CharField(max_length=100)
    
    # Scan results
    scan_status = models.CharField(max_length=20, choices=SCAN_STATUS, default='pending')
    scan_result = models.JSONField(default=dict)
    scan_error = models.TextField(blank=True)
    
    # Threat information
    threats_found = models.JSONField(default=list)
    threat_count = models.PositiveIntegerField(default=0)
    
    # Scan metadata
    scanned_by = models.CharField(max_length=50, default='clamav')  # clamav, custom, etc.
    scan_duration = models.FloatField(null=True, blank=True)  # seconds
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    scanned_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'file_scans'
        indexes = [
            models.Index(fields=['file_hash']),
            models.Index(fields=['scan_status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Scan {self.file_hash[:8]} - {self.get_scan_status_display()}"
    
    @classmethod
    def create_from_file(cls, file_obj, file_path):
        """Create a file scan record from an uploaded file."""
        # Calculate file hash
        hasher = hashlib.sha256()
        for chunk in file_obj.chunks():
            hasher.update(chunk)
        file_hash = hasher.hexdigest()
        
        # Get file info
        file_size = file_obj.size
        mime_type = file_obj.content_type or mimetypes.guess_type(file_obj.name)[0] or 'application/octet-stream'
        
        # Check if scan already exists
        scan, created = cls.objects.get_or_create(
            file_hash=file_hash,
            defaults={
                'file_path': file_path,
                'file_size': file_size,
                'mime_type': mime_type,
            }
        )
        
        return scan
    
    def scan_file(self):
        """Scan the file for threats."""
        try:
            self.scan_status = 'scanning'
            self.save(update_fields=['scan_status'])
            
            # TODO: Integrate with ClamAV or other antivirus
            # For now, simulate scanning
            import time
            time.sleep(0.1)  # Simulate scan time
            
            # Check file type restrictions
            allowed_types = [
                'image/', 'video/', 'audio/', 
                'application/pdf', 'text/',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]
            
            if not any(self.mime_type.startswith(t) for t in allowed_types):
                self.scan_status = 'quarantined'
                self.threats_found = ['Unsupported file type']
                self.threat_count = 1
                self.scan_result = {
                    'reason': 'File type not allowed',
                    'allowed_types': allowed_types
                }
            else:
                self.scan_status = 'clean'
                self.threats_found = []
                self.threat_count = 0
                self.scan_result = {
                    'reason': 'File passed security scan',
                    'scan_engine': 'clamav'
                }
            
            self.scanned_at = timezone.now()
            self.save()
            
            return True
            
        except Exception as e:
            self.scan_status = 'error'
            self.scan_error = str(e)
            self.save()
            return False


class EvidenceVerification(models.Model):
    """
    Evidence verification and chain of custody tracking.
    """
    
    VERIFICATION_STATUS = [
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
        ('requires_review', 'Requires Review'),
    ]
    
    evidence = models.OneToOneField('reports.ReportEvidence', on_delete=models.CASCADE, related_name='verification')
    
    # Verification details
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='pending')
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='security_verified_evidence')
    verified_at = models.DateTimeField(null=True, blank=True)
    
    # Verification notes
    verification_notes = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Chain of custody
    custody_chain = models.JSONField(default=list)  # Track who accessed the evidence
    
    # Digital signatures
    digital_signature = models.CharField(max_length=128, blank=True)  # Hash of verification data
    signature_timestamp = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'evidence_verification'
    
    def __str__(self):
        return f"Verification for {self.evidence} - {self.get_verification_status_display()}"
    
    def verify_evidence(self, verified_by, notes=''):
        """Verify the evidence."""
        self.verification_status = 'verified'
        self.verified_by = verified_by
        self.verified_at = timezone.now()
        self.verification_notes = notes
        
        # Update the evidence model
        self.evidence.is_verified = True
        self.evidence.verified_by = verified_by
        self.evidence.verified_at = timezone.now()
        self.evidence.save()
        
        # Generate digital signature
        self.generate_digital_signature()
        
        self.save()
    
    def reject_evidence(self, rejected_by, reason):
        """Reject the evidence."""
        self.verification_status = 'rejected'
        self.verified_by = rejected_by
        self.verified_at = timezone.now()
        self.rejection_reason = reason
        self.save()
    
    def add_custody_entry(self, user, action, notes=''):
        """Add an entry to the chain of custody."""
        entry = {
            'timestamp': timezone.now().isoformat(),
            'user_id': str(user.id),
            'user_name': f"{user.first_name} {user.last_name}",
            'action': action,
            'notes': notes,
        }
        
        self.custody_chain.append(entry)
        self.save(update_fields=['custody_chain'])
    
    def generate_digital_signature(self):
        """Generate a digital signature for the verification."""
        import hashlib
        
        # Create signature data
        signature_data = f"{self.evidence.id}{self.verified_by.id}{self.verified_at.isoformat()}{self.verification_notes}"
        
        # Generate hash
        self.digital_signature = hashlib.sha256(signature_data.encode()).hexdigest()
        self.signature_timestamp = timezone.now()
        self.save(update_fields=['digital_signature', 'signature_timestamp'])


class SecurityAuditLog(models.Model):
    """
    Security audit log for tracking sensitive operations.
    """
    
    EVENT_TYPES = [
        ('login', 'User Login'),
        ('logout', 'User Logout'),
        ('failed_login', 'Failed Login'),
        ('password_change', 'Password Change'),
        ('file_upload', 'File Upload'),
        ('file_download', 'File Download'),
        ('evidence_access', 'Evidence Access'),
        ('report_access', 'Report Access'),
        ('status_change', 'Status Change'),
        ('assignment', 'Report Assignment'),
        ('admin_action', 'Admin Action'),
        ('data_export', 'Data Export'),
        ('data_deletion', 'Data Deletion'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    # Event details
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS, default='low')
    
    # User and session info
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='audit_logs')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    session_id = models.CharField(max_length=100, blank=True)
    
    # Event details
    description = models.TextField()
    details = models.JSONField(default=dict)
    
    # Related objects
    related_report = models.ForeignKey('reports.CrimeReport', on_delete=models.CASCADE, null=True, blank=True)
    related_evidence = models.ForeignKey('reports.ReportEvidence', on_delete=models.CASCADE, null=True, blank=True)
    
    # Timestamps
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'security_audit_log'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['event_type', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['severity', 'timestamp']),
            models.Index(fields=['ip_address', 'timestamp']),
        ]
    
    def __str__(self):
        return f"{self.get_event_type_display()} - {self.user} - {self.timestamp}"
    
    @classmethod
    def log_event(cls, event_type, user=None, description='', details=None, severity='low', 
                  ip_address=None, user_agent=None, session_id=None, 
                  related_report=None, related_evidence=None):
        """Log a security event."""
        return cls.objects.create(
            event_type=event_type,
            severity=severity,
            user=user,
            ip_address=ip_address,
            user_agent=user_agent or '',
            session_id=session_id or '',
            description=description,
            details=details or {},
            related_report=related_report,
            related_evidence=related_evidence,
        )


class DataRetentionPolicy(models.Model):
    """
    Data retention policies for different types of data.
    """
    
    DATA_TYPES = [
        ('reports', 'Crime Reports'),
        ('evidence', 'Evidence Files'),
        ('audit_logs', 'Audit Logs'),
        ('notifications', 'Notifications'),
        ('user_data', 'User Data'),
        ('statistics', 'Statistics'),
    ]
    
    RETENTION_PERIODS = [
        ('1_year', '1 Year'),
        ('3_years', '3 Years'),
        ('5_years', '5 Years'),
        ('7_years', '7 Years'),
        ('10_years', '10 Years'),
        ('permanent', 'Permanent'),
    ]
    
    data_type = models.CharField(max_length=20, choices=DATA_TYPES, unique=True)
    retention_period = models.CharField(max_length=20, choices=RETENTION_PERIODS)
    is_active = models.BooleanField(default=True)
    
    # Policy details
    description = models.TextField()
    legal_basis = models.TextField(blank=True)
    
    # Cleanup settings
    auto_cleanup = models.BooleanField(default=True)
    archive_before_deletion = models.BooleanField(default=True)
    archive_location = models.CharField(max_length=500, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'data_retention_policies'
        verbose_name = 'Data Retention Policy'
        verbose_name_plural = 'Data Retention Policies'
    
    def __str__(self):
        return f"{self.get_data_type_display()} - {self.get_retention_period_display()}"
    
    def get_retention_date(self):
        """Get the date when data should be retained until."""
        from datetime import timedelta
        
        retention_map = {
            '1_year': timedelta(days=365),
            '3_years': timedelta(days=365*3),
            '5_years': timedelta(days=365*5),
            '7_years': timedelta(days=365*7),
            '10_years': timedelta(days=365*10),
            'permanent': None,
        }
        
        if self.retention_period == 'permanent':
            return None
        
        return timezone.now() - retention_map[self.retention_period] 