from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('pending', 'लंबित'),
        ('in_progress', 'प्रगति में'),
        ('resolved', 'सुलझा हुआ'),
        ('closed', 'बंद'),
    ]
    ticket_id = models.CharField(max_length=12, unique=True, editable=False, verbose_name='टिकट आईडी')
    user = models.ForeignKey(getattr(settings, 'AUTH_USER_MODEL', 'auth.User'), on_delete=models.SET_NULL, null=True, blank=True, verbose_name='यूज़र')
    name = models.CharField(max_length=100, verbose_name='नाम')
    email = models.EmailField(verbose_name='ईमेल')
    subject = models.CharField(max_length=200, verbose_name='विषय')
    message = models.TextField(verbose_name='संदेश')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='स्थिति')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='बनाया गया')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='अपडेट किया गया')

    def save(self, *args, **kwargs):
        if not self.ticket_id:
            self.ticket_id = str(uuid.uuid4()).replace('-', '')[:12].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Ticket {self.ticket_id} - {self.subject}"
