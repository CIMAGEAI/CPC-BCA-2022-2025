from django.contrib import admin
# hospo/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('',               views.index,              name='index'),
    path('home/',          views.home,               name='home'),

    # auth
    path('login/',         views.login_view,         name='login'),
    path('signup/',        views.signup_view,        name='signup'),
    path('logout/',        views.logout_view,        name='logout'),

    # static pages
    path('emergency/',     views.emergency,          name='emergency'),
    path('services/',      views.services,           name='services'),
    path('about/',         views.about,              name='about'),
    path('contact/',       views.contact,            name='contact'),

    # booking
    path('booking.html',   views.booking_page,       name='booking_page'),

    # hospital login & dashboard
    path('hospital/login/',     views.hospital_login,     name='hospital_login'),
    path('hospital/dashboard/', views.hospital_dashboard, name='hospital_dashboard'),
]
