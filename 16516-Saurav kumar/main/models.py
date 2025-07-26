from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('police', 'Police'),
        ('public', 'Public'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='public')
    # Add any other custom fields here 