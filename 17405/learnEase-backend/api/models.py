from django.db import models

class UserSignup(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)  # You can hash this later

    def __str__(self):
        return self.full_name
