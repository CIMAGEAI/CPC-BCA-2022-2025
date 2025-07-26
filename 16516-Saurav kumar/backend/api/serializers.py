"""
Serializers for Crime Report Portal API with security features.
"""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from backend.authentication.models import UserProfile, LoginAttempt
from backend.reports.models import (
    CrimeReport, CrimeCategory, ReportEvidence, 
    ReportStatus, ReportComment, ReportNotification,
    ReportStatistics
)
from django.utils import timezone
from django.core.exceptions import ValidationError

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    User serializer with security considerations.
    """
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'is_verified', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """
    User profile serializer with encrypted fields.
    """
    
    class Meta:
        model = UserProfile
        fields = ['date_of_birth', 'address', 'emergency_contact', 'emergency_phone', 'language_preference']
    
    def validate_address(self, value):
        """Validate address field."""
        if value and len(value) > 500:
            raise serializers.ValidationError("Address is too long.")
        return value


class SecureUserRegistrationSerializer(serializers.ModelSerializer):
    """
    Secure user registration serializer.
    """
    
    password = serializers.CharField(write_only=True, min_length=12)
    password_confirm = serializers.CharField(write_only=True)
    data_consent = serializers.BooleanField(required=True)
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'phone_number', 'password', 'password_confirm', 'data_consent']
    
    def validate_password(self, value):
        """Enhanced password validation."""
        if len(value) < 12:
            raise serializers.ValidationError("Password must be at least 12 characters long.")
        
        if not any(c.isupper() for c in value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        
        if not any(c.islower() for c in value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        
        if not any(c.isdigit() for c in value):
            raise serializers.ValidationError("Password must contain at least one number.")
        
        if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        
        return value
    
    def validate(self, attrs):
        """Validate password confirmation and email uniqueness."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        return attrs
    
    def create(self, validated_data):
        """Create user with secure password hashing."""
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data.get('phone_number', ''),
            data_consent=validated_data['data_consent']
        )
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer with additional security checks.
    """
    
    def validate(self, attrs):
        """Validate login with security checks."""
        data = super().validate(attrs)
        
        # Check if account is locked
        if self.user.is_locked():
            raise serializers.ValidationError("Account is temporarily locked due to multiple failed login attempts.")
        
        # Check if account is active
        if not self.user.is_active:
            raise serializers.ValidationError("Account has been deactivated.")
        
        # Reset failed attempts on successful login
        self.user.reset_failed_attempts()
        
        # Add user info to response
        data['user'] = UserSerializer(self.user).data
        
        return data


class CrimeCategorySerializer(serializers.ModelSerializer):
    """
    Crime category serializer.
    """
    
    class Meta:
        model = CrimeCategory
        fields = ['id', 'name', 'description', 'priority_level']


class ReportEvidenceSerializer(serializers.ModelSerializer):
    """
    Evidence serializer with file validation.
    """
    
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportEvidence
        fields = ['id', 'file', 'file_url', 'file_type', 'description', 'is_verified', 'uploaded_at']
        read_only_fields = ['id', 'file_url', 'is_verified', 'uploaded_at']
    
    def get_file_url(self, obj):
        """Get secure file URL."""
        if obj.file:
            return self.context['request'].build_absolute_uri(obj.file.url)
        return None
    
    def validate_file(self, value):
        """Validate uploaded file."""
        if value:
            # Check file size (10MB limit)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("File size must be less than 10MB.")
            
            # Check file type
            allowed_types = ['image/', 'video/', 'audio/', 'application/pdf', 'text/']
            if not any(value.content_type.startswith(t) for t in allowed_types):
                raise serializers.ValidationError("File type not allowed.")
        
        return value


class ReportCommentSerializer(serializers.ModelSerializer):
    """
    Report comment serializer.
    """
    
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportComment
        fields = ['id', 'content', 'is_internal', 'author_name', 'created_at']
        read_only_fields = ['id', 'author_name', 'created_at']
    
    def get_author_name(self, obj):
        """Get author name based on user permissions."""
        request = self.context.get('request')
        if request and request.user.role in ['officer', 'admin', 'supervisor']:
            return f"{obj.author.first_name} {obj.author.last_name}"
        return "Officer" if obj.author.role in ['officer', 'admin', 'supervisor'] else "Reporter"


class ReportStatusSerializer(serializers.ModelSerializer):
    """
    Report status history serializer.
    """
    
    changed_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportStatus
        fields = ['status', 'notes', 'changed_by_name', 'changed_at']
        read_only_fields = ['changed_by_name', 'changed_at']
    
    def get_changed_by_name(self, obj):
        """Get name of person who changed status."""
        return f"{obj.changed_by.first_name} {obj.changed_by.last_name}"


class CrimeReportSerializer(serializers.ModelSerializer):
    """
    Crime report serializer with security and permissions.
    """
    
    category = CrimeCategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    evidence = ReportEvidenceSerializer(many=True, read_only=True)
    comments = ReportCommentSerializer(many=True, read_only=True)
    status_history = ReportStatusSerializer(many=True, read_only=True)
    assigned_officer_name = serializers.SerializerMethodField()
    reporter_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CrimeReport
        fields = [
            'id', 'case_number', 'category', 'category_id', 'incident_date', 
            'incident_location', 'latitude', 'longitude', 'description', 
            'additional_details', 'status', 'priority', 'assigned_officer_name',
            'reporter_name', 'evidence', 'comments', 'status_history',
            'created_at', 'updated_at', 'resolved_at'
        ]
        read_only_fields = ['id', 'case_number', 'created_at', 'updated_at', 'resolved_at']
    
    def get_assigned_officer_name(self, obj):
        """Get assigned officer name."""
        if obj.assigned_officer:
            return f"{obj.assigned_officer.first_name} {obj.assigned_officer.last_name}"
        return None
    
    def get_reporter_name(self, obj):
        """Get reporter name based on permissions."""
        request = self.context.get('request')
        if request and request.user.role in ['officer', 'admin', 'supervisor']:
            if obj.is_anonymous:
                return obj.reporter_name
            elif obj.reporter:
                return f"{obj.reporter.first_name} {obj.reporter.last_name}"
        return "Anonymous" if obj.is_anonymous else "Reporter"
    
    def validate_incident_date(self, value):
        """Validate incident date."""
        if value > timezone.now():
            raise serializers.ValidationError("Incident date cannot be in the future.")
        return value
    
    def validate_description(self, value):
        """Validate description length."""
        if len(value) < 10:
            raise serializers.ValidationError("Description must be at least 10 characters long.")
        return value
    
    def create(self, validated_data):
        """Create crime report with security features."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['reporter'] = request.user
            validated_data['created_by_ip'] = self.get_client_ip(request)
        
        # Get category
        category_id = validated_data.pop('category_id')
        try:
            category = CrimeCategory.objects.get(id=category_id)
            validated_data['category'] = category
        except CrimeCategory.DoesNotExist:
            raise serializers.ValidationError("Invalid category.")
        
        return super().create(validated_data)
    
    def get_client_ip(self, request):
        """Get client IP address."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class CrimeReportListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for crime report lists.
    """
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = CrimeReport
        fields = [
            'id', 'case_number', 'category_name', 'incident_date', 
            'incident_location', 'status', 'status_display', 'priority',
            'created_at'
        ]


class ReportNotificationSerializer(serializers.ModelSerializer):
    """
    Notification serializer.
    """
    
    class Meta:
        model = ReportNotification
        fields = ['id', 'notification_type', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'notification_type', 'message', 'created_at']


class ReportStatisticsSerializer(serializers.ModelSerializer):
    """
    Statistics serializer for transparency dashboard.
    """
    
    class Meta:
        model = ReportStatistics
        fields = [
            'date', 'total_reports', 'resolved_reports', 'pending_reports',
            'category_breakdown', 'avg_resolution_time_hours'
        ]


class StatusUpdateSerializer(serializers.Serializer):
    """
    Serializer for updating report status.
    """
    
    status = serializers.ChoiceField(choices=CrimeReport.STATUS_CHOICES)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_status(self, value):
        """Validate status transition."""
        request = self.context.get('request')
        report = self.context.get('report')
        
        if not request or not report:
            return value
        
        # Check if user can change status
        if request.user.role not in ['officer', 'admin', 'supervisor']:
            raise serializers.ValidationError("You don't have permission to change status.")
        
        # Validate status transition
        valid_transitions = {
            'submitted': ['under_review', 'rejected'],
            'under_review': ['assigned', 'rejected'],
            'assigned': ['investigating', 'rejected'],
            'investigating': ['pending_evidence', 'resolved', 'rejected'],
            'pending_evidence': ['investigating', 'resolved'],
            'resolved': ['closed'],
            'closed': [],
            'rejected': []
        }
        
        current_status = report.status
        if value not in valid_transitions.get(current_status, []):
            raise serializers.ValidationError(f"Invalid status transition from {current_status} to {value}.")
        
        return value


class AssignmentSerializer(serializers.Serializer):
    """
    Serializer for assigning reports to officers.
    """
    
    officer_id = serializers.UUIDField()
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_officer_id(self, value):
        """Validate officer exists and has correct role."""
        try:
            officer = User.objects.get(id=value)
            if officer.role not in ['officer', 'supervisor']:
                raise serializers.ValidationError("Selected user is not an officer or supervisor.")
        except User.DoesNotExist:
            raise serializers.ValidationError("Officer not found.")
        
        return value 