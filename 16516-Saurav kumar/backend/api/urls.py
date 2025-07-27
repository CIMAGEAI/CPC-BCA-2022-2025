from django.urls import path
from .views import CrimeReportCreateListAPI, CrimeReportDetailAPI

urlpatterns = [
    path('reports/', CrimeReportCreateListAPI.as_view(), name='api_report_create_list'),
    path('reports/<uuid:pk>/', CrimeReportDetailAPI.as_view(), name='api_report_detail'),
] 