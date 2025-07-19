from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *
from . import views

router = DefaultRouter()
router.register(r'members', MemberViewSet)
router.register(r'trainers', TrainerViewSet)
router.register(r'plan', PlanViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'payments', PaymentViewSet)
urlpatterns = [
    path('', views.home_view, name='home'),
    path('about/', views.about_view, name='about'),
    path('plans/', views.plans_view, name='plans'),
    path('trainer/', views.trainer_view, name='trainer'),
    path('contact/', views.contact_view, name='contact'),
    path('api/', include(router.urls)),

    path('login/', views.login_view,name= 'login'),
    path('signup/', views.signup_view,name='signup'),
    path('logout/', logout_view,name='logout'),

    path('contact/', contact_view, name='contact'),

    path('purchase/<str:selected_plan_type>/', views.purchase_plan, name='purchase_plan'),

    path('register-member/', views.register_member, name='register_member'),
    path('privacy/', views.privacy_policy, name='privacy_policy'),
    path('terms/', views.terms_view, name='terms'),
    path('bmi-calculator/', bmi_calculator_view, name='bmi_calculator'),
]