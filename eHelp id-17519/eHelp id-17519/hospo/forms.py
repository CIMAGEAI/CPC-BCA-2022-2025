from django import forms
from .models import BedBooking

class BedBookingForm(forms.ModelForm):
    class Meta:
        model  = BedBooking
        fields = ['patient_name', 'age', 'reason', 'payment_mode']

        widgets = {
            'patient_name': forms.TextInput(attrs={'class': 'w-full p-2 border rounded'}),
            'age'        : forms.NumberInput(attrs={'class': 'w-full p-2 border rounded'}),
            'reason'     : forms.Textarea(attrs={'class': 'w-full p-2 border rounded', 'rows': 3}),
'payment_mode': forms.Select(attrs={'class': 'w-full p-2 border rounded', 'id': 'payment-mode'}),
        }