from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('', home_view, name='home'),
    path('about/', views.about_view, name='about'),
    path('courses/', views.course_list, name='course-list'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('courses/', CourseListCreateView.as_view(), name='course-list'),
    path('contact/', views.contact_view, name='contact'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    # path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('courses/<int:pk>/', views.course_detail, name='course-detail'),
    path('courses/<int:course_id>/enroll/', views.enroll_view, name='enroll_course'),


    path('lessons/', LessonListCreateView.as_view(), name='lesson-list'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),

    # path('contact/', ContactCreateView.as_view(), name='contact-create'),

    # path('enrollments/', EnrollmentListCreateView.as_view(), name='enrollments'),

]
