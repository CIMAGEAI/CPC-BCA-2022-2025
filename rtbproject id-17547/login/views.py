from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
import re


# Login view
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            print("Login success for:", user.username) 
            return redirect('/home/')  # Redirect to homepage or dashboard
        
          
        else:
            messages.error(request, "Invalid username or password")
            return redirect('/login/')
    return render(request, 'login.html')  # Your form template name

# Signup view
def signup_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        email = request.POST.get("email")

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
            return redirect('/signup/')
        
        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_regex, email):
            messages.error(request, "Please enter a valid email address")
            return redirect('/signup/')
        
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        messages.success(request, "Account created successfully. Please log in.")
        return redirect('/login/')
    
    return render(request, 'login.html')  # Same template contains both forms

# Logout view
def logout_view(request):
    logout(request)
    messages.success(request, "Logged out successfully.")
    return redirect('/login/')

# Create your views here.
