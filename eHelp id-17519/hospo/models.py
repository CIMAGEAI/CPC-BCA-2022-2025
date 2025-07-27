from django.db import models
from django.contrib.auth.models import User 

# Contact model
class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)
    subject = models.CharField(max_length=100)
    message = models.TextField()
    date = models.DateField()

    def __str__(self):
        return self.name

# ✅ Hospital model — moved outside Contact
class Hospital(models.Model):
     user     = models.OneToOneField(User, on_delete=models.CASCADE)   # ← नया फ़ील्ड
     name     = models.CharField(max_length=255)
     address  = models.TextField()

     def __str__(self):
        return self.name

PAYMENT_CHOICES = [
    ('UPI', 'UPI'),
    ('QR', 'QR Code'),
    ('Cash', 'Cash'),
    ('Card', 'Card'),
    ('Other', 'Other'),
]

class BedBooking(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    patient_name = models.CharField(max_length=100)
    age = models.IntegerField()
    reason = models.TextField()
    payment_mode = models.CharField(max_length=50, choices=PAYMENT_CHOICES, default='Cash')
    payment_status = models.CharField(max_length=50, default='Pending')
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_name} - {self.hospital.name}"