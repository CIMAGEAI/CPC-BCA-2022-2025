from django.contrib import admin
from django.urls import path
from home import views

urlpatterns = [
    path("", views.index, name='home'),
    path("home/", views.index, name='home'),
    path('home/', views.index_view, name='home'),
    #path("about/", views.about, name='about'),
    path('about/', views.about_page, name='about'),
    path("menu/", views.menu, name='menu'),
    path("book/", views.book, name='book'),
    path("contact/", views.contact, name='contact'),
    #path("login/", views.login, name='login'),
    path("owner/login/", views.ownerlogin, name='owner_login'),
    path('owner/dashboard/', views.owner_dashboard, name='owner_dashboard'),

    #adding book table
    path('book/atom/', views.book_atom, name='book_atom'),
    path('book/hello/', views.book_hello, name='book_hello'),
    path('book/vrihi/', views.book_vrihi, name='book_vrihi'),
    path('book/lacasa/', views.book_lacasa, name='book_lacasa'),
    path('book/rq/', views.book_rq, name='book_rq'),
    path('book/dropout/', views.book_dropout, name='book_dropout'),
    path('book/grind/', views.book_grind, name='book_grind'),
    path('book/skyfall/', views.book_skyfall, name='book_skyfall'),
    path('book/pyne/', views.book_pyne, name='book_pyne'),
    path('book/bloom/', views.book_bloom, name='book_bloom'),
    path('book/backstreet/', views.book_backstreet, name='book_backsreet'),
    path('book/garage/', views.book_garage, name='book_garage'),

    #adding see menu
    path('menu/lacasa/', views.menu_lacasa, name='menu_lacasa'),
    path('menu/vrihi/', views.menu_vrihi, name='menu_vrihi'),
    path('menu/grind/', views.menu_grind, name='menu_grind'),
    path('menu/hello/', views.menu_hello, name='menu_hello'),
    path('menu/pyne/', views.menu_pyne, name='menu_pyne'),
    path('menu/bloom/', views.menu_bloom, name='menu_bloom'),
    path('menu/garage/', views.menu_garage, name='menu_garage'),
    path('menu/rq/', views.menu_rq, name='menu_rq'),
    path('menu/dropout/', views.menu_dropout, name='menu_dropout'),
    path('menu/backstreet/', views.menu_backstreet, name='menu_backstreet'),
    path('menu/skyfall/', views.menu_skyfall, name='menu_skyfall'),
     path('menu/atom/', views.menu_atom, name='menu_atom'),

    #addind restaurant dashboard
    path('admin/login/', views.admin_login, name='admin_login'),

    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    #adding search 
    path('save-search/', views.save_search_query, name='save_search'),

]