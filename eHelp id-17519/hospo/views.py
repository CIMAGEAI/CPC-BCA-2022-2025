from django.shortcuts import render, redirect
from django.contrib import messages
from datetime import datetime
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from hospo.models import Contact
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render


from django.shortcuts import render, redirect, get_object_or_404
from .forms import BedBookingForm
from .models import Hospital, BedBooking
from urllib.parse import unquote



def index(request):
    username = request.user.first_name if request.user.is_authenticated else None
    hospitals = Hospital.objects.all()
    return render(request, 'index.html', {'username': username, 'hospitals': hospitals})

@login_required(login_url='/login/')
def home(request):
    username = request.user.first_name if request.user.is_authenticated else None
    return render(request, 'index.html', {'username': username})

# ✅ Renamed this view to avoid conflict
#def login_view(request):
 #   return render(request, 'login.html')

def emergency(request):
    return render(request, 'emergency.html')

def services(request):
    return render(request, 'services.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        subject = request.POST.get("subject")
        message = request.POST.get("message")

        Contact.objects.create(
            name=name,
            email=email,
            phone=phone,
            subject=subject,
            message=message,
            date=datetime.today()
        )
        messages.success(request, "Your message has been sent successfully!")
        return redirect('contact')
    return render(request, 'contact.html')



def login_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, "User with this email does not exist.")
            return render(request, 'login.html')

        user = authenticate(username=user.username, password=password)

        if user is not None:
            login(request, user)
            return redirect('/home/')
        else:
            messages.error(request, "Invalid email or password.")
            return render(request, 'login.html')

    return render(request, 'login.html')



def signup_view(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists')
            return redirect('signup')

        username = email.split('@')[0]
        user = User.objects.create_user(username=username, email=email, password=password)
        user.first_name = name
        user.save()

        messages.success(request, "Account created! Please login.")
        return redirect('login')

    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('/')


def booking_page(request):
    hospital_name = request.GET.get('hospital')
    if not hospital_name:
        messages.error(request, "No hospital specified.")
        return redirect('index')

    hospital = get_object_or_404(Hospital, name=unquote(hospital_name))

    if request.method == 'POST':
        form = BedBookingForm(request.POST)
        if form.is_valid():
            booking = form.save(commit=False)
            booking.user      = request.user if request.user.is_authenticated else None
            booking.hospital  = hospital
            booking.payment_status = 'Paid'
            booking.save()

            messages.success(request, 'Bed successfully booked!')

            # where to go afterwards
            if request.user.is_authenticated:
                return redirect('home')
            return redirect('index')
    else:
        form = BedBookingForm()

    return render(request, 'booking.html', {'form': form, 'hospital': hospital})


def hospital_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, 'User does not exist.')
            return redirect('hospital_login')

        user = authenticate(username=user.username, password=password)

        if user is not None:
            try:
                hospital = user.hospital  # check if hospital profile exists
            except Hospital.DoesNotExist:
                messages.error(request, 'Not a registered hospital user.')
                return redirect('hospital_login')

            login(request, user)
            return redirect('hospital_dashboard')  # 👈 redirecting to hospital dashboard
        else:
            messages.error(request, 'Invalid email or password.')

    return render(request, 'hospital_login.html')



@login_required(login_url='hospital_login')
def hospital_dashboard(request):
    try:
        hospital = request.user.hospital
        print("✅ Logged in as hospital:", hospital)
    except Hospital.DoesNotExist:
        messages.error(request, "You are not registered as a hospital.")
        return redirect('hospital_login')

    bookings = BedBooking.objects.filter(hospital=hospital).order_by('-booked_at')
    return render(request, 'hospital_dashboard.html', {
        'hospital': hospital,
        'bookings': bookings
    })
