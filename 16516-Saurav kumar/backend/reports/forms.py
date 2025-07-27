"""
Complaint submission form for Crime Report Portal.
"""

from django import forms
from .models import CrimeReport, ReportEvidence, CrimeCategory, Station
from django.utils import timezone

class CrimeReportForm(forms.ModelForm):
    reporter_name = forms.CharField(label='Victim/Complainant Name', required=False, widget=forms.TextInput(attrs={'class': 'form-control'}))
    reporter_email = forms.EmailField(label='Victim/Complainant Email', required=False, widget=forms.EmailInput(attrs={'class': 'form-control'}))
    reporter_phone = forms.CharField(label='Victim/Complainant Phone', required=False, widget=forms.TextInput(attrs={'class': 'form-control'}))
    station = forms.ModelChoiceField(queryset=Station.objects.all(), required=True, label='Police Station (पुलिस स्टेशन)')
    class Meta:
        model = CrimeReport
        fields = [
            'reporter_name', 'reporter_email', 'reporter_phone',
            'category', 'incident_date', 'incident_location', 'latitude', 'longitude',
            'description', 'additional_details', 'is_anonymous', 'is_sensitive', 'priority',
            'station',  # Ensure station is included
        ]
        widgets = {
            'incident_date': forms.DateTimeInput(attrs={'type': 'datetime-local', 'class': 'form-control'}),
            'incident_location': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'additional_details': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'category': forms.Select(attrs={'class': 'form-control'}),
            'priority': forms.Select(attrs={'class': 'form-control'}),
        }

    def clean_incident_date(self):
        date = self.cleaned_data['incident_date']
        # Disable future date check for now
        return date

    def clean_description(self):
        desc = self.cleaned_data['description']
        # Disable minimum length check for now
        return desc

class ReportEvidenceForm(forms.ModelForm):
    class Meta:
        model = ReportEvidence
        fields = ['file', 'file_type', 'description']
        widgets = {
            'file_type': forms.Select(attrs={'class': 'form-control'}),
            'description': forms.TextInput(attrs={'class': 'form-control'}),
        }

    def clean_file(self):
        file = self.cleaned_data['file']
        # Disable file size/type checks for now
        return file 