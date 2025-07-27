from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from backend.reports.models import CrimeReport
from .serializers import CrimeReportSerializer, CrimeReportListSerializer
from django.shortcuts import render

class CrimeReportCreateListAPI(generics.ListCreateAPIView):
    queryset = CrimeReport.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'priority']
    search_fields = ['case_number', 'description', 'incident_location']
    ordering_fields = ['created_at', 'incident_date', 'status']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CrimeReportSerializer
        return CrimeReportListSerializer

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user, created_by_ip=self.request.META.get('REMOTE_ADDR'))

    def get_queryset(self):
        """Filter to show only user's reports or all reports for officers/admins."""
        if self.request.user.role in ['officer', 'admin', 'supervisor']:
            return CrimeReport.objects.all()
        return CrimeReport.objects.filter(reporter=self.request.user)

class CrimeReportDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = CrimeReport.objects.all()
    serializer_class = CrimeReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter based on user permissions."""
        if self.request.user.role in ['officer', 'admin', 'supervisor']:
            return CrimeReport.objects.all()
        return CrimeReport.objects.filter(reporter=self.request.user)

    def perform_update(self, serializer):
        serializer.save(last_modified_by=self.request.user)

def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html') 