from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from .decorators import admin_required, police_required, public_required
from django.urls import reverse
from backend.reports.models import CrimeReport, ReportNotification
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

# Login view with role-based redirect
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if user.role == 'admin':
                return redirect('admin_dashboard')
            elif user.role == 'police':
                return redirect('police_dashboard')
            else:
                return redirect('public_dashboard')
        else:
            messages.error(request, 'Invalid username or password')
    return render(request, 'main/login.html')

@login_required
def admin_dashboard(request):
    if not request.user.is_superuser and getattr(request.user, 'role', None) != 'admin':
        return redirect('home')
    total_users = User.objects.count()
    total_reports = CrimeReport.objects.count()
    open_cases = CrimeReport.objects.exclude(status__in=['closed', 'resolved']).count()
    closed_cases = CrimeReport.objects.filter(status__in=['closed', 'resolved']).count()
    recent_reports = CrimeReport.objects.order_by('-created_at')[:8]
    # Complaints by status
    status_counts = CrimeReport.objects.values('status').annotate(count=Count('id'))
    status_data = {item['status']: item['count'] for item in status_counts}
    # Complaints by month (last 6 months)
    today = timezone.now().date()
    months = []
    month_data = []
    for i in range(5, -1, -1):
        month = (today.replace(day=1) - timedelta(days=30*i)).replace(day=1)
        months.append(month.strftime('%b %Y'))
        count = CrimeReport.objects.filter(created_at__year=month.year, created_at__month=month.month).count()
        month_data.append(count)
    # Recent users
    recent_users = User.objects.order_by('-date_joined')[:5]
    # Today stats
    today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    new_users_today = User.objects.filter(date_joined__gte=today_start).count()
    new_complaints_today = CrimeReport.objects.filter(created_at__gte=today_start).count()
    # Recent notifications (real)
    recent_notifications = ReportNotification.objects.order_by('-created_at')[:8]
    context = {
        'total_users': total_users,
        'total_reports': total_reports,
        'open_cases': open_cases,
        'closed_cases': closed_cases,
        'recent_reports': recent_reports,
    }
    context.update({
        'status_data': status_data,
        'months': months,
        'month_data': month_data,
        'recent_users': recent_users,
        'new_users_today': new_users_today,
        'new_complaints_today': new_complaints_today,
        'recent_notifications': recent_notifications,
    })
    return render(request, 'main/admin_dashboard.html', context)

@login_required
@police_required
def police_dashboard(request):
    try:
        officer = request.user
        
        # Enhanced officer info with proper name display
        officer_info = {
            'name': officer.get_full_name() or officer.username,
            'id': officer.id,
            'role': officer.get_role_display() if hasattr(officer, 'get_role_display') else 'Police',
            'last_login': officer.last_login,
            'station': getattr(officer, 'station', 'N/A'),
            'email': officer.email,
            'username': officer.username,
        }
        
        from backend.reports.models import CrimeReport, CrimeCategory, ReportNotification
        from django.db.models import Count, Q
        from datetime import timedelta
        
        # --- Show ALL cases for now (not filtering by station) ---
        cases = CrimeReport.objects.all().order_by('-created_at')
        
        # --- Search/Filter ---
        case_id = request.GET.get('case_id', '').strip()
        case_type = request.GET.get('case_type', '').strip()
        priority = request.GET.get('priority', '').strip()
        status = request.GET.get('status', '').strip()
        date_from = request.GET.get('date_from', '').strip()
        date_to = request.GET.get('date_to', '').strip()
        
        if case_id:
            cases = cases.filter(case_number__icontains=case_id)
        if case_type:
            cases = cases.filter(category__name__icontains=case_type)
        if priority:
            cases = cases.filter(priority=priority)
        if status:
            cases = cases.filter(status=status)
        if date_from:
            cases = cases.filter(created_at__date__gte=date_from)
        if date_to:
            cases = cases.filter(created_at__date__lte=date_to)
        
        # --- Enhanced Stats ---
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        stats = {
            'total': cases.count(),
            'open': cases.filter(status='submitted').count(),
            'in_progress': cases.filter(status='investigating').count(),
            'closed': cases.filter(status='closed').count(),
            'pending': cases.filter(status__in=['submitted', 'under_review']).count(),
            'critical': cases.filter(priority='critical').count(),
            'high_priority': cases.filter(priority='high').count(),
            'medium_priority': cases.filter(priority='medium').count(),
            'low_priority': cases.filter(priority='low').count(),
            'this_week': cases.filter(created_at__date__gte=week_ago).count(),
            'this_month': cases.filter(created_at__date__gte=month_ago).count(),
            'resolved_this_month': cases.filter(status='closed', created_at__date__gte=month_ago).count(),
        }
        
        # --- Category Statistics ---
        category_stats = cases.values('category__name').annotate(count=Count('id')).order_by('-count')[:5]
        
        # --- Priority Statistics ---
        priority_stats = cases.values('priority').annotate(count=Count('id'))
        
        # --- Recent Activity ---
        recent_cases = cases[:10]
        
        # --- Notifications ---
        notifications = ReportNotification.objects.all().order_by('-created_at')[:10]
        
        # --- Monthly Trends (Last 6 months) ---
        monthly_data = []
        for i in range(5, -1, -1):
            month_date = today.replace(day=1) - timedelta(days=30*i)
            month_count = cases.filter(
                created_at__year=month_date.year,
                created_at__month=month_date.month
            ).count()
            monthly_data.append({
                'month': month_date.strftime('%b %Y'),
                'count': month_count
            })
        
        # --- For dropdowns ---
        categories = CrimeCategory.objects.filter(is_active=True)
        priorities = CrimeReport.PRIORITY_CHOICES
        status_choices = CrimeReport.STATUS_CHOICES
        
        context = {
            'officer': officer_info,
            'cases': cases,
            'stats': stats,
            'categories': categories,
            'priorities': priorities,
            'status_choices': status_choices,
            'category_stats': category_stats,
            'priority_stats': priority_stats,
            'recent_cases': recent_cases,
            'notifications': notifications,
            'monthly_data': monthly_data,
            'current_filters': {
                'case_id': case_id,
                'case_type': case_type,
                'priority': priority,
                'status': status,
                'date_from': date_from,
                'date_to': date_to,
            },
        }
        
        return render(request, 'main/police_dashboard.html', context)
        
    except Exception as e:
        print(f"Error in police_dashboard: {e}")
        # Return a basic context if there's an error
        return render(request, 'main/police_dashboard.html', {
            'officer': {'name': 'Officer', 'id': 1, 'role': 'Police', 'last_login': None, 'station': 'N/A', 'email': '', 'username': ''},
            'cases': [],
            'stats': {'total': 0, 'open': 0, 'in_progress': 0, 'closed': 0, 'pending': 0, 'critical': 0, 'high_priority': 0, 'medium_priority': 0, 'low_priority': 0, 'this_week': 0, 'this_month': 0, 'resolved_this_month': 0},
            'categories': [],
            'priorities': [],
            'status_choices': [],
            'category_stats': [],
            'priority_stats': [],
            'recent_cases': [],
            'notifications': [],
            'monthly_data': [],
            'current_filters': {},
        })

@login_required
@public_required
def public_dashboard(request):
    user = request.user
    from backend.reports.models import CrimeReport, CrimeCategory
    cases = CrimeReport.objects.filter(reporter=user).order_by('-created_at')
    # --- Search/Filter ---
    case_id = request.GET.get('case_id', '').strip()
    case_type = request.GET.get('case_type', '').strip()
    priority = request.GET.get('priority', '').strip()
    status = request.GET.get('status', '').strip()
    date_from = request.GET.get('date_from', '').strip()
    date_to = request.GET.get('date_to', '').strip()
    if case_id:
        cases = cases.filter(case_number__icontains=case_id)
    if case_type:
        cases = cases.filter(category__name__icontains=case_type)
    if priority:
        cases = cases.filter(priority=priority)
    if status:
        cases = cases.filter(status=status)
    if date_from:
        cases = cases.filter(created_at__date__gte=date_from)
    if date_to:
        cases = cases.filter(created_at__date__lte=date_to)
    # --- Stats ---
    stats = {
        'total': cases.count(),
        'open': cases.filter(status='submitted').count(),
        'in_progress': cases.filter(status='investigating').count(),
        'closed': cases.filter(status='closed').count(),
        'pending': cases.filter(status__in=['submitted', 'under_review']).count(),
        'critical': cases.filter(priority='critical').count(),
    }
    # --- For dropdowns ---
    categories = CrimeCategory.objects.filter(is_active=True)
    priorities = CrimeReport.PRIORITY_CHOICES
    status_choices = CrimeReport.STATUS_CHOICES
    return render(request, 'main/public_dashboard.html', {
        'user_info': {
            'name': user.get_full_name() or user.username,
            'id': user.id,
            'role': user.get_role_display() if hasattr(user, 'get_role_display') else 'Public',
            'last_login': user.last_login,
        },
        'cases': cases,
        'stats': stats,
        'categories': categories,
        'priorities': priorities,
        'status_choices': status_choices,
        'current_filters': {
            'case_id': case_id,
            'case_type': case_type,
            'priority': priority,
            'status': status,
            'date_from': date_from,
            'date_to': date_to,
        },
    })

def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        role = request.POST.get('role', 'public')
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
        else:
            user = User.objects.create_user(username=username, password=password, role=role)
            messages.success(request, 'Account created successfully! Please login.')
            return redirect('login')
    return render(request, 'main/register.html') 