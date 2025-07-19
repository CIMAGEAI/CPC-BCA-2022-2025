from django import  forms
from .models import ContactMessage, Plan, Member, BMIRecord
from django.core.validators import RegexValidator
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={
        'placeholder': 'Enter your email'
    }))
    first_name = forms.CharField(max_length=30, widget=forms.TextInput(attrs={
        'placeholder': 'First Name'
    }))
    last_name = forms.CharField(max_length=30, widget=forms.TextInput(attrs={
        'placeholder': 'Last Name'
    }))

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'placeholder': 'Username'})
        self.fields['password1'].widget.attrs.update({'placeholder': 'Password'})
        self.fields['password2'].widget.attrs.update({'placeholder': 'Confirm Password'})

class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']

class PlanPurchaseForm(forms.ModelForm):
    class Meta:
        model = Plan
        fields = ['name', 'plan_type', 'duration_months','price','description']
        widgets = {
            'price' : forms.NumberInput(attrs={'readonly':'readonly'}),
        }

class MemberRegistrationForm(forms.ModelForm):
    phone = forms.CharField(
        max_length=10,
        min_length=10,
        validators=[RegexValidator(r'^\d{10}$', message='Enter a valid 10-digit phone number')],
        widget=forms.TextInput(attrs={'placeholder': 'Enter your phone number'})
    )
    class Meta:
        model = Member
        fields = ['name', 'email', 'phone', 'age', 'gender', 'address', 'membership_type']
        widgets = {
            'gender' : forms.Select(attrs={'class':'form-control'}),
            'membership_type' : forms.Select(attrs={'class':'form-control'}),
            'address' : forms.Textarea(attrs={'rows': 3}),
        }

class BMICalculatorForm(forms.Form):
    height_cm = forms.FloatField(label='Height (cm)', min_value=0)
    weight_kg = forms.FloatField(label='Weight (kg)', min_value=0)