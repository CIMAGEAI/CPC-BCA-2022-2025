from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import ContactMessage
from django.contrib.auth import authenticate, login
from .models import TableBooking, Restaurant
from django.contrib.admin.views.decorators import staff_member_required
from .forms import TableBookingForm
import random
from .models import SearchQuery
from django.http import JsonResponse
from .models import AboutPage

def index(request):
    return render(request, 'index.html')

#def about(request):
    #return render(request, 'about.html')

def about_page(request):
    about = AboutPage.objects.first()  # First object fetch karega
    return render(request, 'about.html', {'about': about})

@login_required
def  menu(request):
    return render(request, 'nav menu.html')

@login_required
def book(request):
    success_message = None
    form = TableBookingForm(request.POST or None)

    if request.method == 'POST' and form.is_valid():
        booking = form.save(commit=False)
        restaurant = booking.restaurant
        date = booking.date
        time = booking.time

        # Get already booked table numbers for that restaurant, date, and time
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        all_tables = list(range(1, 21))  # assuming 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)
            booking.table_number = table_number
            booking.save()
            success_message = f"Booking confirmed successfully! Your table number is: {table_number}"
        else:
            success_message = "❌ ❌ All tables are booked for the selected date and time."

    return render(request, 'nav table.html', {'form': form, 'success_message': success_message})

@login_required
def contact(request):
   if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        subject = request.POST.get("subject")
        message = request.POST.get("message")

        ContactMessage.objects.create(
            name=name,
            email=email,
            phone=phone,
            subject=subject,
            message=message
        )
        messages.success(request, "Your message has been sent successfully!")
        return redirect('/contact/')

   return render(request, 'contact.html', )

#def login(request):
   # return render(request, 'login.html')

def ownerlogin(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)
        if user:
            if user.groups.filter(name='Restaurant Owner').exists():
                login(request, user)
                return redirect('owner_dashboard')
            else:
                messages.error(request, "You are not a restaurant owner.")
                return redirect('owner_login')
        else:
            messages.error(request, "Invalid credentials")
            return redirect('owner_login')

    return render(request, 'owner login.html')

@login_required
def owner_dashboard(request):
    user = request.user # owner username
    restaurant = Restaurant.objects.get(owner=request.user)
    # Show only bookings for that owner's restaurant
    bookings = TableBooking.objects.filter(restaurant__owner=user)

    return render(request, 'owner_dashboard.html', {'restaurant': restaurant,'bookings': bookings})
 # adding book table

@login_required
def book_atom(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="The Atmos 3")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)
    booking = None

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

         # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

        booking = TableBooking.objects.create(
            restaurant=restaurant,
            name=name,
            phone=phone,
            date=date,
            time=time,
            guests=guests,
            menu=menu,
             table_number=table_number
        )
        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
        messages.error(request, "❌ All tables are booked for the selected date and time.")

    return render(request, 'atom table.html', {'booking': booking})



@login_required
def book_hello(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="Hello Restaurant & Cafe")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)

    booking = None  # 👈 yeh use hoga table number dikhane ke liye

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

        # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

            booking = TableBooking.objects.create(
                restaurant=restaurant,
                name=name,
                phone=phone,
                date=date,
                time=time,
                guests=guests,
                menu=menu,
                table_number=table_number
            )

        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
         messages.error(request, "❌ All tables are booked for the selected date and time.")

    return render(request, 'hello table.html', {'booking': booking})

@login_required
def book_vrihi(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="Vrihi Skydeck")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)
    booking = None

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

         # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

        booking = TableBooking.objects.create( 
            restaurant=restaurant,
            name=name,
            phone=phone,
            date=date,
            time=time,
            guests=guests,
            menu=menu,
            table_number=table_number 
        )

        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
        messages.error(request, "❌ All tables are booked for the selected date and time.")

    return render(request, 'vrihi table.html', {'booking': booking})

    

@login_required
def book_lacasa(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="La Casa cafe")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)
    booking = None

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

         # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

        booking = TableBooking.objects.create( 
            restaurant=restaurant,
            name=name,
            phone=phone,
            date=date,
            time=time,
            guests=guests,
            menu=menu,
            table_number=table_number 
        )
        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
        messages.error(request, "❌ All tables are booked for the selected date and time.")

    return render(request, 'lacasa table.html', {'booking': booking})

@login_required
def book_rq(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="RQ Dine & Banquet")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)
    booking = None

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

         # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

        booking = TableBooking.objects.create( 
            restaurant=restaurant,
            name=name,
            phone=phone,
            date=date,
            time=time,
            guests=guests,
            menu=menu,
            table_number=table_number 
        )
        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
        messages.error(request, "❌ All tables are booked for the selected date and time.")
    return render(request, 'RQ table.html', {'booking': booking})

@login_required
def book_dropout(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="Dropout Cafe & Restaurant")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)
    booking = None

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

         # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

        booking = TableBooking.objects.create( 
            restaurant=restaurant,
            name=name,
            phone=phone,
            date=date,
            time=time,
            guests=guests,
            menu=menu,
            table_number=table_number 
        )
        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
        messages.error(request, "❌ All tables are booked for the selected date and time.")
    return render(request, 'dropout table.html', {'booking': booking})

@login_required
def book_grind(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="The Grind House")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)
    booking = None

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

         # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

        booking = TableBooking.objects.create( 
            restaurant=restaurant,
            name=name,
            phone=phone,
            date=date,
            time=time,
            guests=guests,
            menu=menu,
            table_number=table_number 
        )
        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
        messages.error(request, "❌ All tables are booked for the selected date and time.")
    return render(request, 'grind table.html', {'booking': booking})

@login_required
def book_skyfall(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="Skyfall rooftop restaurant")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)
    booking = None 

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

         # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

        booking = TableBooking.objects.create(
            restaurant=restaurant,
            name=name,
            phone=phone,
            date=date,
            time=time,
            guests=guests,
            menu=menu,
            table_number=table_number 
        )
        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
        messages.error(request, "❌ All tables are booked for the selected date and time.")
    return render(request, 'skyfall table.html', {'booking': booking})

@login_required
def book_pyne(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="Pyne Square")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)
    booking = None 

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

         # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

        booking = TableBooking.objects.create( 
            restaurant=restaurant,
            name=name,
            phone=phone,
            date=date,
            time=time,
            guests=guests,
            menu=menu,
            table_number=table_number 
        )
        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
        messages.error(request, "❌ All tables are booked for the selected date and time.")
    return render(request, 'pyne table.html', {'booking': booking})

@login_required
def book_bloom(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="Bloom Kitchen")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)
    booking = None 

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

         # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

        booking = TableBooking.objects.create( 
            restaurant=restaurant,
            name=name,
            phone=phone,
            date=date,
            time=time,
            guests=guests,
            menu=menu,
            table_number=table_number 
        )
        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
        messages.error(request, "❌ All tables are booked for the selected date and time.")
    return render(request, 'bloom table.html', {'booking': booking})

@login_required
def book_backstreet(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="The Backstreet Kitchen")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)
    booking = None 

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

         # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

        booking = TableBooking.objects.create(
            restaurant=restaurant,
            name=name,
            phone=phone,
            date=date,
            time=time,
            guests=guests,
            menu=menu,
            table_number=table_number 
        )
        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
        messages.error(request, "❌ All tables are booked for the selected date and time.")
    return render(request, 'backstreet table.html', {'booking': booking})

@login_required
def book_garage(request):
    try:
        restaurant = Restaurant.objects.get(name__iexact="Garage Kitchen")
    except Restaurant.DoesNotExist:
        return HttpResponse("Restaurant not found", status=404)
    booking = None 

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get('phone')
        date = request.POST.get("date")
        time = request.POST.get("time")
        guests = request.POST.get("guests")
        menu = request.POST.get("menu")

         # Step 1: Get already booked tables
        booked_tables = TableBooking.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time
        ).values_list('table_number', flat=True)

        # Step 2: Get available tables
        all_tables = list(range(1, 21))  # Total 20 tables
        available_tables = list(set(all_tables) - set(booked_tables))

        if available_tables:
            table_number = random.choice(available_tables)

        booking = TableBooking.objects.create( 
            restaurant=restaurant,
            name=name,
            phone=phone,
            date=date,
            time=time,
            guests=guests,
            menu=menu,
            table_number=table_number 
        )
        messages.success(request, f"Table booked successfully! Your Table Number is: {table_number}")
    else:
        messages.error(request, "❌ All tables are booked for the selected date and time.")
    return render(request, 'garage table.html', {'booking': booking})

#adding see menu

@login_required
def menu_lacasa(request):
    return render(request, 'la casa menu.html')

@login_required
def menu_vrihi(request):
    return render(request, 'vrihi menu.html')

@login_required
def menu_grind(request):
    return render(request, 'menu.html')

@login_required
def menu_hello(request):
    return render(request, 'hello menu.html')

@login_required
def menu_pyne(request):
    return render(request, 'pyne menu.html')

@login_required
def menu_bloom(request):
    return render(request, 'bloom menu.html')

@login_required
def menu_garage(request):
    return render(request, 'garge menu.html')

@login_required
def menu_rq(request):
    return render(request, 'rq menu.html')

@login_required
def menu_dropout(request):
    return render(request, 'dropout menu.html')


@login_required
def menu_backstreet(request):
    return render(request, 'backstreet menu.html')


@login_required
def menu_skyfall(request):
    return render(request, 'skyfall menu.html')

@login_required
def menu_atom(request):
    return render(request, 'atom menu.html')

# restaurants dashboards


@login_required
def index_view(request):
    return render(request, 'index.html')  # this will be shown after login

#def is_owner(user):
    #return user.groups.filter(name='Restaurant Owner').exists()

#def is_customer(user):
   # return user.groups.filter(name='Customer').exists()

#admin dashboard
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.shortcuts import render, redirect

def admin_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user and user.is_staff:
            login(request, user)
            return redirect('admin_dashboard')  # your custom admin dashboard
        else:
            messages.error(request, "Invalid admin credentials")
            return redirect('admin_login')

    return render(request, 'admin_login.html')

@staff_member_required
def admin_dashboard(request):
    restaurants = Restaurant.objects.all()
    bookings = TableBooking.objects.all()
    return render(request, 'admin_dashboard.html', {
        'restaurants': restaurants,
        'bookings': bookings
    })

def save_search_query(request):
    query = request.GET.get('q')
    if query:
        SearchQuery.objects.create(query=query)
    return JsonResponse({'status': 'saved'})