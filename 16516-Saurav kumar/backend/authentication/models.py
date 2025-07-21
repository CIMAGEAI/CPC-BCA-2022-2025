"""
Custom User model with enhanced security features for Crime Report Portal.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone
from django.core.exceptions import ValidationError
import uuid


class User(AbstractUser):
    """
    Custom User model with enhanced security features.
    """
    
    # User roles
    ROLE_CHOICES = [
        ('public', 'Public Citizen'),
        ('police', 'Police Officer'),
        ('admin', 'Administrator'),
    ]
    
    # Basic fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, verbose_name='Email Address')
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    
    # Role and permissions
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='public')
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Security fields
    failed_login_attempts = models.PositiveIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    password_changed_at = models.DateTimeField(auto_now_add=True)
    
    # Two-factor authentication
    two_factor_enabled = models.BooleanField(default=False)
    backup_codes = models.JSONField(default=list, blank=True)
    
    # Privacy and consent
    data_consent = models.BooleanField(default=False)
    marketing_consent = models.BooleanField(default=False)
    last_consent_update = models.DateTimeField(auto_now_add=True)
    
    # Badge number for police officers
    badge_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Override username to use email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    def clean(self):
        """Custom validation."""
        super().clean()
        if self.role == 'officer' and not self.is_verified:
            raise ValidationError("Law enforcement officers must be verified.")
    
    def is_locked(self):
        """Check if account is locked due to failed login attempts."""
        if self.locked_until and self.locked_until > timezone.now():
            return True
        return False
    
    def increment_failed_attempts(self):
        """Increment failed login attempts and lock account if necessary."""
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= 5:
            self.locked_until = timezone.now() + timezone.timedelta(minutes=30)
        self.save(update_fields=['failed_login_attempts', 'locked_until'])
    
    def reset_failed_attempts(self):
        """Reset failed login attempts after successful login."""
        self.failed_login_attempts = 0
        self.locked_until = None
        self.save(update_fields=['failed_login_attempts', 'locked_until'])
    
    def can_access_complaints(self):
        """Check if user can access complaint data."""
        return self.role in ['police', 'admin']
    
    def can_edit_complaints(self):
        """Check if user can edit complaint data."""
        return self.role in ['police', 'admin']
    
    def can_delete_complaints(self):
        """Check if user can delete complaint data."""
        return self.role == 'admin'


class UserProfile(models.Model):
    """
    Extended user profile with additional information.
    """
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Personal information (encrypted)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=17, blank=True)
    
    # Preferences
    notification_preferences = models.JSONField(default=dict)
    
    # Verification
    id_document_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='verifications_made'
    )
    
    # Station
    station = models.ForeignKey('reports.Station', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profile'
    
    def __str__(self):
        return f"Profile for {self.user.email}"


class LoginAttempt(models.Model):
    """
    Track login attempts for security monitoring.
    """
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_attempts')
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    success = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'login_attempts'
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['ip_address', 'timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {'Success' if self.success else 'Failed'} - {self.timestamp}"


class PasswordResetToken(models.Model):
    """Model to store password reset tokens"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'password_reset_tokens'
    
    def __str__(self):
        return f"Reset token for {self.user.email}"
    
    def is_expired(self):
        """Check if token has expired"""
        from django.utils import timezone
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        """Check if token is valid and not used"""
        return not self.is_used and not self.is_expired()


class UserOTP(models.Model):
    """
    Stores OTP codes for two-factor authentication (2FA).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    code = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = 'user_otps'
        indexes = [
            models.Index(fields=['user', 'expires_at']),
        ]

    def __str__(self):
        return f"OTP for {self.user.email} (expires {self.expires_at})"

    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at

    def is_valid(self):
        return not self.is_used and not self.is_expired() 