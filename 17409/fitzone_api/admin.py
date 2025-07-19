from django.contrib import admin

# from .forms import ContactForm
from .models import *

##################################################
@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'membership_type', 'join_date']

##################################################
@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'specialization', 'experience', 'join_date']

##################################################
@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'plan_type', 'duration_months', 'price', 'created_at']

##################################################
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['member', 'check_in_date', 'check_in_time']

admin.site.register(ContactMessage)

admin.site.register(BMIRecord)
