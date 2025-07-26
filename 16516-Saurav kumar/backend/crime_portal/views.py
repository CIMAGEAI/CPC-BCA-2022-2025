from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Q
from backend.reports.models import CrimeReport

def home(request):
    """Home page view"""
    return render(request, 'home.html')

def privacy_policy(request):
    """Privacy Policy page view"""
    return render(request, 'privacy-policy.html')

def terms_of_service(request):
    """Terms of Service page view"""
    return render(request, 'terms-of-service.html')

def test_view(request):
    """Simple test view"""
    return HttpResponse("Hello! Django is working correctly!")

def custom_404(request, exception):
    return render(request, '404.html', status=404)

def custom_500(request):
    return render(request, '500.html', status=500)

def custom_403(request, exception):
    return render(request, '403.html', status=403)

def global_search(request):
    """Global search across all reports and users."""
    query = request.GET.get('q', '')
    context = {
        'reports': [],
        'users': [],
        'query': query,
        'total_reports': 0,
        'total_users': 0,
    }
    
    if query:
        # Search in reports
        reports = CrimeReport.objects.filter(
            Q(case_number__icontains=query) |
            Q(description__icontains=query) |
            Q(incident_location__icontains=query) |
            Q(reporter_name__icontains=query) |
            Q(reporter_email__icontains=query)
        ).select_related('reporter', 'category')[:20]
        
        # Search in users (only for admins)
        users = []
        if request.user.is_authenticated and request.user.role in ['admin', 'supervisor']:
            from backend.authentication.models import User
            users = User.objects.filter(
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query) |
                Q(email__icontains=query) |
                Q(username__icontains=query)
            )[:10]
        
        context = {
            'reports': reports,
            'users': users,
            'query': query,
            'total_reports': reports.count(),
            'total_users': len(users),
        }
    
    return render(request, 'search_results.html', context)

def acts_view(request):
    return render(request, 'acts.html') 