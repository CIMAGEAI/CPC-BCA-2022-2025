from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required   #attendence
from django.utils.timezone import now
from rest_framework import viewsets
from .models import *
from .serializers import *
from .forms import *

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


def home_view(request):
    return render(request, 'frontend/index.html')

def about_view(request):
    return render(request, 'frontend/about.html')

def plans_view(request):
    return render(request, 'frontend/plans.html')

def trainer_view(request):
    return render(request, 'frontend/trainer.html')

def contact_view(request):
    return render(request, 'frontend/contact.html')

def signup_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            if not Member.objects.filter(user=user).exists():
                Member.objects.create(
                    user=user,
                    name = user.username,
                    email = user.email,
                    age = 18,
                    phone = '0000000000',
                    gender = 'male',
                    address = "",
                    membership_type = 'Basic'
                )
            messages.success(request, 'Your account has been created successfully :)')
            return redirect('login')
        else:
            messages.error(request, 'Please correct the error below.')
            return render(request, 'frontend/signup.html', {'form': form})
    else:
        form = CustomUserCreationForm()
        return render(request, 'frontend/signup.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'frontend/login.html', {'error': 'Invalid credentials'})
    else:
        return render(request, 'frontend/login.html')

def logout_view(request):
    logout(request)
    return redirect('home')

def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Than you for contacting us! We will get back to you shortly')
            form = ContactForm()
        return render(request, 'frontend/contact.html', {'form': form})
    else:
        form = ContactForm()
        return render(request, 'frontend/contact.html', {'form': form})


def purchase_plan(request,selected_plan_type=None):
    if request.method == 'POST':
        form = PlanPurchaseForm(request.POST)
        if form.is_valid():
            form.save()
            selected_plan = form.cleaned_data.get('plan_type')
            messages.success(request,f'Thank you for choosing the {selected_plan} plan! Our team will contact you soon :)')
            form = PlanPurchaseForm()
        return render(request, 'frontend/purchase_plans.html', {'form': form})
    else:
        form = PlanPurchaseForm(initial={'plan_type': selected_plan_type})
        return render(request, 'frontend/purchase_plans.html', {'form': form})


def register_member(request):
    if request.method == 'POST':
        form = MemberRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request,'You have successfully registered as a FitZone member :)')
            return redirect('register_member')
        else:
            messages.error(request, 'There was an error in your form. Please check the details and try again :(')
            return render(request, 'frontend/register.html', {'form': form})
    else:
        form = MemberRegistrationForm()
        return render(request, 'frontend/register_member.html', {'form': form})

@login_required
def bmi_calculator_view(request):
    try:
        member = Member.objects.get(user=request.user)
    except Member.DoesNotExist:
        messages.error(request, "You are not registered as a gym member yet.")
        return redirect('home')  # Or send to registration page

    bmi_history = BMIRecord.objects.filter(user=member).order_by('-recorded_at')

    if request.method == 'POST':
        form = BMICalculatorForm(request.POST)
        if form.is_valid():
            height_cm = form.cleaned_data['height_cm']
            weight_kg = form.cleaned_data['weight_kg']
            height_m = height_cm / 100
            bmi = weight_kg / (height_m ** 2)

            if bmi < 18.5:
                result = 'Underweight'
            elif 18.5 <= bmi < 25:
                result = 'Normal'
            elif 25 <= bmi < 30:
                result = 'Overweight'
            else:
                result = 'Obese'

            BMIRecord.objects.create(
                user=member,
                height_cm=height_cm,
                weight_kg=weight_kg,
                bmi_value=bmi,
            )
            messages.success(request, f"Your BMI is {bmi:.2f} ({result})")
            return redirect('bmi_calculator')
    else:
        form = BMICalculatorForm()

    return render(request, 'frontend/bmi_calculator.html', {
        'form': form,
        'bmi_history': bmi_history
    })



def privacy_policy(request):
    return render(request, 'frontend/privacy.html')

def terms_view(request):
    return render(request, 'frontend/terms.html')




