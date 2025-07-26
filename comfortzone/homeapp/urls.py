from django.contrib import admin
from django.urls import path
from homeapp import views

urlpatterns = [
    # ✅ Django Admin Panel
    path('admin/', admin.site.urls),

    # ✅ Home & Static Pages
    path('', views.home, name='home'),
    path('contact/', views.contact_page, name='contact'),
    path('help/', views.help_page, name='help'),
    path('buy/', views.buy, name='buy'),

    # ✅ Checkout & Order
    path('checkout/', views.checkout_view, name='checkout'),
    path('place-order/', views.place_order_view, name='place_order'),
    path('order-success/<str:order_id>/', views.order_success, name='order_success'),
    path('invoice/<str:order_id>/', views.generate_invoice, name='generate_invoice'),
    path('cancel-order/<str:order_id>/', views.cancel_order, name='cancel_order'),

    # ✅ Cart Management
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('cart/', views.cart_view, name='cart'),
    path('remove-from-cart/<int:product_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/update/<int:product_id>/', views.update_quantity, name='update_quantity'),

    # ✅ User Account
    path('login/', views.login_view, name='login'),         # ✅ Updated to individual login view
    path('signup/', views.signup_view, name='signup'),       # ✅ Separate signup view
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.user_profile, name='user_profile'),
    path('my-orders/', views.my_orders, name='my_orders'),
    path('user/', views.user_dashboard, name='user_dashboard'),

    # ✅ Admin Auth
    path('admin-login/', views.admin_login, name='admin_login'),
    path('admin-logout/', views.admin_logout, name='admin_logout'),
]
