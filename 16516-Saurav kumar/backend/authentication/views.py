from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, login as auth_login
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponse
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.conf import settings
from .forms import SecureUserCreationForm, SecureAuthenticationForm
from .models import User, PasswordResetToken, UserOTP
from twilio.rest import Client
from backend.notifications.services import get_sms_service

def admin_login_view(request):
    """Admin login view"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.role == 'admin':
            auth_login(request, user)
            messages.success(request, f'Welcome, Admin {user.get_full_name() or user.username}!')
            return redirect('admin_dashboard')
        else:
            messages.error(request, 'Invalid credentials or insufficient permissions.')
    return render(request, 'authentication/admin_login.html')

def police_login_view(request):
    """Police login view"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.role == 'police':
            auth_login(request, user)
            messages.success(request, f'Welcome, Officer {user.get_full_name() or user.username}!')
            return redirect('officer_dashboard')
        else:
            messages.error(request, 'Invalid credentials or insufficient permissions.')
    return render(request, 'authentication/police_login.html')

def public_login_view(request):
    """Public login view"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.role == 'public':
            auth_login(request, user)
            messages.success(request, f'Welcome, {user.get_full_name() or user.username}!')
            return redirect('home')
        else:
            messages.error(request, 'Invalid credentials or insufficient permissions.')
    return render(request, 'authentication/public_login.html')

def login_view(request):
    """General login view that redirects based on role"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            if user.role == 'admin':
                messages.success(request, f'Welcome, Admin {user.get_full_name() or user.username}!')
                return redirect('admin_dashboard')
            elif user.role == 'police':
                messages.success(request, f'Welcome, Officer {user.get_full_name() or user.username}!')
                return redirect('police_dashboard')
            else:
                messages.success(request, f'Welcome, {user.get_full_name() or user.username}!')
                return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'authentication/login.html')

def logout_view(request):
    """Logout view"""
    logout(request)
    messages.success(request, 'You have been successfully logged out.')
    return redirect('home')

def register_view(request):
    """Register view that renders the register template"""
    if request.method == 'POST':
        # Handle registration form submission
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        phone = request.POST.get('phone')
        role = request.POST.get('role', 'public')
        
        # Validation
        if password1 != password2:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'authentication/register.html')
        
        if not all([username, email, password1, first_name, last_name]):
            messages.error(request, 'Please fill in all required fields.')
            return render(request, 'authentication/register.html')
        
        if len(password1) < 8:
            messages.error(request, 'Password must be at least 8 characters long.')
            return render(request, 'authentication/register.html')
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, 'A user with this email already exists.')
            return render(request, 'authentication/register.html')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'A user with this username already exists.')
            return render(request, 'authentication/register.html')
        
        try:
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1,
                first_name=first_name,
                last_name=last_name,
                phone_number=phone,
                role=role,
                is_active=True
            )
            # Generate badge number for police
            badge_number = None
            if role == 'police':
                import random
                import string
                # Example: POL-2024-XXXXX
                badge_number = f"POL-{timezone.now().year}-{''.join(random.choices(string.digits, k=5))}"
                # Ensure uniqueness
                while User.objects.filter(badge_number=badge_number).exists():
                    badge_number = f"POL-{timezone.now().year}-{''.join(random.choices(string.digits, k=5))}"
                user.badge_number = badge_number
                user.save(update_fields=['badge_number'])
            # Create user profile
            from .models import UserProfile
            UserProfile.objects.create(user=user)
            # Send badge number email if police
            if role == 'police' and badge_number:
                subject = 'Your Police Badge Number - Crime Report Portal'
                message = f"Dear {user.get_full_name()},\n\nYour registration as a police officer is successful.\nYour Badge Number: {badge_number}\n\nPlease use this badge number for login and future reference.\n\nThank you,\nCrime Report Portal Team"
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,
                )
                # Show confirmation page with badge number
                return render(request, 'authentication/police_registration_success.html', {'badge_number': badge_number, 'user': user})
            messages.success(request, f'Account created successfully! Welcome {user.get_full_name()}. Please login.')
            return redirect('authentication:login')
            
        except Exception as e:
            messages.error(request, f'Error creating account: {str(e)}')
            return render(request, 'authentication/register.html')
    
    return render(request, 'authentication/register.html')

@login_required
def profile_view(request):
    """Profile view"""
    return render(request, 'authentication/profile.html')

@login_required
def change_password_view(request):
    """Handle password change requests for logged-in users"""
    if request.method == 'POST':
        current_password = request.POST.get('current_password')
        new_password1 = request.POST.get('new_password1')
        new_password2 = request.POST.get('new_password2')
        
        # Validate current password
        if not request.user.check_password(current_password):
            messages.error(request, 'Current password is incorrect.')
            return render(request, 'authentication/change_password.html')
        
        # Validate new passwords match
        if new_password1 != new_password2:
            messages.error(request, 'New passwords do not match.')
            return render(request, 'authentication/change_password.html')
        
        # Validate password strength (you can add more validation)
        if len(new_password1) < 8:
            messages.error(request, 'New password must be at least 8 characters long.')
            return render(request, 'authentication/change_password.html')
        
        # Change password
        request.user.set_password(new_password1)
        request.user.save()
        
        messages.success(request, 'Password changed successfully! Please login again.')
        return redirect('authentication:login')
    
    return render(request, 'authentication/change_password.html')

def reset_password_view(request):
    """Handle password reset requests (always show generic message)"""
    if request.method == 'POST':
        email = request.POST.get('email')
        if email:
            try:
                user = User.objects.get(email=email)
                # Generate a unique token
                token = get_random_string(64)
                expires_at = timezone.now() + timezone.timedelta(hours=24)
                reset_token, created = PasswordResetToken.objects.get_or_create(
                    user=user,
                    defaults={
                        'token': token,
                        'expires_at': expires_at,
                        'is_used': False
                    }
                )
                if not created:
                    reset_token.token = token
                    reset_token.expires_at = expires_at
                    reset_token.is_used = False
                    reset_token.save()
                reset_url = request.build_absolute_uri(f'/auth/reset-password-confirm/{token}/')
                subject = 'Password Reset Request - Crime Report Portal'
                html_message = render_to_string('emails/password_reset.html', {
                    'user': user,
                    'reset_url': reset_url,
                })
                message = f"""
Hello {user.get_full_name() or user.username},

You have requested to reset your password for the Crime Report Portal.

Click the following link to reset your password:
{reset_url}

This link will expire in 24 hours.

If you did not request this password reset, please ignore this email.

Best regards,
Crime Report Portal Team
                """
                try:
                    send_mail(
                        subject=subject,
                        message=message,
                        html_message=html_message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=False,
                    )
                except Exception as e:
                    print(f"Email sending error: {e}")
                # Always show generic message
            except User.DoesNotExist:
                pass  # Don't reveal if email exists or not
            messages.success(request, 'If an account with this email exists, you will receive a password reset link shortly.')
            return redirect('authentication:login')
        else:
            messages.error(request, 'Please provide a valid email address.')
    return render(request, 'authentication/reset_password.html')

def verify_email_view(request, token):
    """Handle email verification with token"""
    try:
        # Here you would typically:
        # 1. Validate the token
        # 2. Find the user associated with the token
        # 3. Mark the user's email as verified
        # 4. Delete or expire the token
        
        # For now, we'll just show a success message
        messages.success(request, 'Email verified successfully! You can now login.')
        return render(request, 'authentication/verify_email.html', {'token': token, 'verified': True})
        
    except Exception as e:
        messages.error(request, 'Invalid or expired verification link.')
        return render(request, 'authentication/verify_email.html', {'token': token, 'verified': False})

def reset_password_confirm_view(request, token):
    """Handle password reset confirmation with token"""
    try:
        # Find the reset token
        reset_token = PasswordResetToken.objects.get(token=token)
        
        if not reset_token.is_valid():
            messages.error(request, 'This password reset link is invalid or has expired.')
            return redirect('authentication:login')
        
        if request.method == 'POST':
            new_password1 = request.POST.get('new_password1')
            new_password2 = request.POST.get('new_password2')
            
            # Validate passwords
            if new_password1 != new_password2:
                messages.error(request, 'Passwords do not match.')
                return render(request, 'authentication/reset_password_confirm.html', {'token': token})
            
            if len(new_password1) < 8:
                messages.error(request, 'Password must be at least 8 characters long.')
                return render(request, 'authentication/reset_password_confirm.html', {'token': token})
            
            # Set new password
            user = reset_token.user
            user.set_password(new_password1)
            user.save()
            
            # Mark token as used
            reset_token.is_used = True
            reset_token.save()
            
            messages.success(request, 'Password has been reset successfully! You can now login with your new password.')
            return redirect('authentication:login')
        
        return render(request, 'authentication/reset_password_confirm.html', {'token': token})
        
    except PasswordResetToken.DoesNotExist:
        messages.error(request, 'Invalid password reset link.')
        return redirect('authentication:login')

def forgot_password_view(request):
    """Display the forgot password page."""
    return render(request, 'authentication/forgot_password.html')

@login_required
def admin_dashboard_view(request):
    """Admin dashboard for user and system management"""
    # Check if user is admin
    if not request.user.is_superuser and request.user.role not in ['admin', 'supervisor']:
        messages.error(request, 'Access denied. Admin privileges required.')
        return redirect('home')
    
    # Get statistics
    total_users = User.objects.count()
    total_citizens = User.objects.filter(role='citizen').count()
    total_officers = User.objects.filter(role='officer').count()
    total_admins = User.objects.filter(role='admin').count()
    
    # Get recent users
    recent_users = User.objects.order_by('-date_joined')[:10]
    
    # Get reports statistics
    from backend.reports.models import CrimeReport
    total_reports = CrimeReport.objects.count()
    pending_reports = CrimeReport.objects.filter(status='submitted').count()
    assigned_reports = CrimeReport.objects.filter(status='assigned').count()
    resolved_reports = CrimeReport.objects.filter(status='resolved').count()
    
    # Get recent reports
    recent_reports = CrimeReport.objects.select_related('reporter', 'category').order_by('-created_at')[:10]
    
    context = {
        'total_users': total_users,
        'total_citizens': total_citizens,
        'total_officers': total_officers,
        'total_admins': total_admins,
        'recent_users': recent_users,
        'total_reports': total_reports,
        'pending_reports': pending_reports,
        'assigned_reports': assigned_reports,
        'resolved_reports': resolved_reports,
        'recent_reports': recent_reports,
    }
    
    return render(request, 'authentication/admin_dashboard.html', context)

def verify_otp_view(request):
    """OTP verification view for 2FA login"""
    from .models import UserOTP, User
    user_id = request.session.get('pre_2fa_user_id')
    if not user_id:
        messages.error(request, 'Session expired. Please login again.')
        return redirect('authentication:login')
    user = User.objects.filter(id=user_id).first()
    if not user:
        messages.error(request, 'User not found. Please login again.')
        return redirect('authentication:login')
    error = None
    if request.method == 'POST':
        otp_input = request.POST.get('otp')
        otp_obj = UserOTP.objects.filter(user=user, is_used=False).order_by('-created_at').first()
        if not otp_obj:
            error = 'OTP not found. Please request a new OTP.'
        elif otp_obj.is_expired():
            error = 'OTP expire ho chuka hai. Naya OTP mangiye.'
        elif otp_obj.code != otp_input:
            error = 'Incorrect OTP entered.'
        else:
            # OTP sahi hai
            otp_obj.is_used = True
            otp_obj.save()
            auth_login(request, user)
            del request.session['pre_2fa_user_id']
            messages.success(request, f'Welcome, {user.get_full_name() or user.username}!')
            return redirect('home')
        messages.error(request, error)
    return render(request, 'authentication/verify_otp.html', {'user': user})

def resend_otp_view(request):
    """Resend OTP for 2FA login (Hindi messages)"""
    from .models import UserOTP, User
    user_id = request.session.get('pre_2fa_user_id')
    if not user_id:
        messages.error(request, 'Session expire ho gayi hai. Dobara login karein.')
        return redirect('authentication:login')
    user = User.objects.filter(id=user_id).first()
    if not user:
        messages.error(request, 'User nahi mila. Dobara login karein.')
        return redirect('authentication:login')
    # Purane OTP expire kar do
    UserOTP.objects.filter(user=user, is_used=False).update(is_used=True)
    # Naya OTP banao
    import random
    otp_code = str(random.randint(100000, 999999))
    from django.utils import timezone
    expires_at = timezone.now() + timezone.timedelta(minutes=10)
    UserOTP.objects.create(user=user, code=otp_code, expires_at=expires_at)
    # Email bhejo
    from django.conf import settings
    from django.core.mail import send_mail
    subject = 'Aapka naya OTP - Crime Report Portal'
    message = f"Namaste {user.get_full_name() or user.username},\n\nAapka naya OTP hai: {otp_code}\n\nYeh code 10 minute ke liye valid hai. Agar aapne login nahi kiya toh is email ko ignore karein.\n\nCrime Report Portal Team"
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
    messages.success(request, 'Naya OTP aapke email par bhej diya gaya hai.')
    return redirect('authentication:verify_otp')

def send_otp_sms(phone_number, otp_code):
    """Send OTP via SMS using the SMS service"""
    try:
        sms_service = get_sms_service()
        result = sms_service.send_sms(
            to_number=phone_number,
            message=f'Your OTP for Crime Report Portal login is: {otp_code}. Valid for 10 minutes.'
        )
        return result.get('sid', None)
    except Exception as e:
        print(f'SMS sending error: {e}')
        return None 