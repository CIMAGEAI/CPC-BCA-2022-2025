from django.urls import path
from . import views
from .views import UserSignupCreateView

urlpatterns = [
    path('signup/', UserSignupCreateView.as_view(), name='signup'),
    path('login/', views.login_user),
]
