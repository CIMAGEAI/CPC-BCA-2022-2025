"""
Secure forms for user authentication and profile management.
"""

from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from .models import User, UserProfile
from django.utils import timezone


class SecureUserCreationForm(UserCreationForm):
    """
    Enhanced user registration form with security features.
    """
    
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your email address'
        })
    )
    
    first_name = forms.CharField(
        max_length=30,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'First Name'
        })
    )
    
    last_name = forms.CharField(
        max_length=30,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Last Name'
        })
    )
    
    phone_number = forms.CharField(
        max_length=17,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': '+1234567890'
        }),
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'."
            )
        ]
    )
    
    password1 = forms.CharField(
        label=_("Password"),
        strip=False,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Create a strong password'
        }),
        help_text=_("Password must be at least 12 characters long and contain uppercase, lowercase, numbers, and special characters.")
    )
    
    password2 = forms.CharField(
        label=_("Password confirmation"),
        strip=False,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Confirm your password'
        })
    )
    
    data_consent = forms.BooleanField(
        required=True,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        label=_("I consent to the processing of my personal data for the purpose of crime reporting.")
    )
    
    marketing_consent = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        label=_("I consent to receive updates and notifications about my reports.")
    )
    
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'phone_number', 'password1', 'password2')
    
    def clean_password1(self):
        """Enhanced password validation."""
        password = self.cleaned_data.get('password1')
        if password:
            if len(password) < 12:
                raise forms.ValidationError(
                    _("Password must be at least 12 characters long.")
                )
            if not any(c.isupper() for c in password):
                raise forms.ValidationError(
                    _("Password must contain at least one uppercase letter.")
                )
            if not any(c.islower() for c in password):
                raise forms.ValidationError(
                    _("Password must contain at least one lowercase letter.")
                )
            if not any(c.isdigit() for c in password):
                raise forms.ValidationError(
                    _("Password must contain at least one number.")
                )
            if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
                raise forms.ValidationError(
                    _("Password must contain at least one special character.")
                )
        return password
    
    def clean_email(self):
        """Check if email is already registered."""
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError(
                _("A user with this email address already exists.")
            )
        return email
    
    def save(self, commit=True):
        """Save user with additional security settings."""
        user = super().save(commit=False)
        user.username = self.cleaned_data['email']  # Use email as username
        user.data_consent = self.cleaned_data['data_consent']
        user.marketing_consent = self.cleaned_data['marketing_consent']
        
        if commit:
            user.save()
            # Create user profile
            UserProfile.objects.create(user=user)
        
        return user


class SecureAuthenticationForm(AuthenticationForm):
    """
    Enhanced login form with security features.
    """
    
    username = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your email address',
            'autocomplete': 'email'
        })
    )
    
    password = forms.CharField(
        strip=False,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your password',
            'autocomplete': 'current-password'
        })
    )
    
    remember_me = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        label=_("Remember me for 30 days")
    )
    
    def clean(self):
        """Enhanced validation with account lockout check."""
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        
        if username:
            try:
                user = User.objects.get(email=username)
                if user.is_locked():
                    raise forms.ValidationError(
                        _("Account is temporarily locked due to multiple failed login attempts. Please try again later.")
                    )
                if not user.is_active:
                    raise forms.ValidationError(
                        _("This account has been deactivated. Please contact support.")
                    )
            except User.DoesNotExist:
                pass  # Let the parent form handle this error
        
        return cleaned_data


class UserProfileForm(forms.ModelForm):
    """
    Form for updating user profile information.
    """
    
    class Meta:
        model = UserProfile
        fields = ['date_of_birth', 'address', 'emergency_contact', 'emergency_phone']
        widgets = {
            'date_of_birth': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date'
            }),
            'address': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Enter your address'
            }),
            'emergency_contact': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Emergency contact name'
            }),
            'emergency_phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '+1234567890'
            })
        }
    
    def clean_emergency_phone(self):
        """Validate emergency phone number."""
        phone = self.cleaned_data.get('emergency_phone')
        if phone:
            phone_validator = RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'."
            )
            phone_validator(phone)
        return phone


class PasswordChangeForm(forms.Form):
    """
    Secure password change form.
    """
    
    current_password = forms.CharField(
        strip=False,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Current password'
        })
    )
    
    new_password1 = forms.CharField(
        strip=False,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'New password'
        }),
        help_text=_("Password must be at least 12 characters long and contain uppercase, lowercase, numbers, and special characters.")
    )
    
    new_password2 = forms.CharField(
        strip=False,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Confirm new password'
        })
    )
    
    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)
    
    def clean_current_password(self):
        """Verify current password."""
        current_password = self.cleaned_data.get('current_password')
        if not self.user.check_password(current_password):
            raise forms.ValidationError(_("Current password is incorrect."))
        return current_password
    
    def clean_new_password1(self):
        """Enhanced password validation."""
        password = self.cleaned_data.get('new_password1')
        if password:
            if len(password) < 12:
                raise forms.ValidationError(
                    _("Password must be at least 12 characters long.")
                )
            if not any(c.isupper() for c in password):
                raise forms.ValidationError(
                    _("Password must contain at least one uppercase letter.")
                )
            if not any(c.islower() for c in password):
                raise forms.ValidationError(
                    _("Password must contain at least one lowercase letter.")
                )
            if not any(c.isdigit() for c in password):
                raise forms.ValidationError(
                    _("Password must contain at least one number.")
                )
            if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
                raise forms.ValidationError(
                    _("Password must contain at least one special character.")
                )
        return password
    
    def clean(self):
        """Ensure new passwords match."""
        cleaned_data = super().clean()
        password1 = cleaned_data.get('new_password1')
        password2 = cleaned_data.get('new_password2')
        
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(_("New passwords do not match."))
        
        return cleaned_data
    
    def save(self):
        """Update user password."""
        self.user.set_password(self.cleaned_data['new_password1'])
        self.user.password_changed_at = timezone.now()
        self.user.save()
        return self.user


class UserProfileEditForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone_number', 'email']
        widgets = {
            'email': forms.EmailInput(attrs={'readonly': 'readonly'}),
        } 