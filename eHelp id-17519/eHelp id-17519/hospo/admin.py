from django.contrib import admin
from hospo.models import Contact  
from .models import Hospital, BedBooking

class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'subject', 'message', 'date')  

admin.site.register(Contact, ContactMessageAdmin)
admin.site.register(Hospital)

@admin.register(BedBooking)
class BedBookingAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'hospital', 'payment_mode', 'payment_status', 'booked_at')


