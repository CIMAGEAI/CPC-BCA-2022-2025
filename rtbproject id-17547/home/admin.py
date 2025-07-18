from django.contrib import admin
from .models import ContactMessage
from .models import Restaurant, TableBooking
from .models import SearchQuery
from .models import AboutPage

#admin.site.register(ContactMessage)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'message', 'phone', 'subject')
# Register your models here.
admin.site.register(Restaurant)
admin.site.register(TableBooking)
admin.site.register(SearchQuery)

admin.site.register(AboutPage)