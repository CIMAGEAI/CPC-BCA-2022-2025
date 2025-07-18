
from django import forms
from .models import TableBooking

class TableBookingForm(forms.ModelForm):
    class Meta:
        model = TableBooking
        fields = ['restaurant', 'name', 'phone', 'date', 'time', 'guests', 'menu']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'time': forms.TimeInput(attrs={'type': 'time'}),
            'phone': forms.TextInput(attrs={'type': 'tel', 'placeholder': '10-digit number'}),
        }
    
   