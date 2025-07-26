"""
URL configuration for Crime Report Portal.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import set_language
from .views import home, test_view, privacy_policy, terms_of_service, global_search
from backend.security.views import laws_view
from django.contrib.sitemaps.views import sitemap
from .sitemap import StaticViewSitemap
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from backend.authentication.models import User
from backend.reports.models import CrimeReport, ReportComment

sitemaps = {
    'static': StaticViewSitemap,
}

def police_dashboard_redirect(request):
    return redirect('/main/police/dashboard/')

def public_dashboard_redirect(request):
    return redirect('/main/public/dashboard/')

@login_required
def officer_dashboard(request):
    ...

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('test/', test_view, name='test'),
    path('search/', global_search, name='global_search'),
    path('privacy-policy/', privacy_policy, name='privacy_policy'),
    path('terms-of-service/', terms_of_service, name='terms_of_service'),
    path('auth/', include('backend.authentication.urls')),
    path('reports/', include('backend.reports.urls')),
    path('api/', include('backend.api.urls')),
    path('notifications/', include('backend.notifications.urls')),
    path('statistics/', include('backend.crime_statistics.urls')),
    path('security/', include('backend.security.urls')),
    path('laws/', laws_view, name='laws'),
    path('main/', include('main.urls')),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('police/dashboard/', police_dashboard_redirect),
    path('public/dashboard/', public_dashboard_redirect),
    # path('2fa/', include('two_factor.urls')),  # Commented out temporarily
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Custom error handlers
handler404 = 'backend.crime_portal.views.custom_404'
handler500 = 'backend.crime_portal.views.custom_500'
handler403 = 'backend.crime_portal.views.custom_403' 