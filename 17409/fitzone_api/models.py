from django.contrib.auth.models import User
from django.db import models

############################################################################################
MEMBERSHIP_CHOICES = [
    ('Basic', 'Basic'),
    ('Standard', 'Standard'),
    ('Premium', 'Premium'),
]
GENDER_CHOICES = [
    ('male', 'Male'),
    ('female', 'Female'),
    ('others', 'Others'),
]
class Member(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    address = models.TextField()
    membership_type = models.CharField(max_length=20, choices=MEMBERSHIP_CHOICES)
    join_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}({self.membership_type})"

#############################################################################################
class Trainer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    specialization = models.CharField(max_length=50)  # e.g., Weight Training, Cardio
    experience = models.PositiveIntegerField(help_text="Experience in years")
    join_date = models.DateField(auto_now_add=True)

    def _str_(self):
        return f"{self.name} ({self.specialization})"

#############################################################################################
class Plan(models.Model):
    PLAN_TYPE_CHOICES = [
        ('Basic', 'Basic Plan'),
        ('Standard', 'Standard Plan'),
        ('Premium','Premium Plan'),
    ]
    name = models.CharField(max_length=100)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPE_CHOICES)
    duration_months = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=7, decimal_places=2)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.plan_type}"

#########################################################################################
class Attendance(models.Model):
    ATTENDENCE_CHOICE = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
    ]
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    check_in_date = models.DateField(auto_now_add=True)
    check_in_time = models.TimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=ATTENDENCE_CHOICE,default='Present')

    def __str__(self):
        return f"{self.member.name} - {self.check_in_date} at {self.check_in_time} - {self.status}"


########################################################################################
PAYMENT_METHOD_CHOICES = [
    ('CASH', 'Cash'),
    ('CARD', 'Card'),
    ('UPI', 'UPI'),
    ('NET_BANKING', 'Net Banking'),
]

class Payment(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    amount_paid = models.DecimalField(max_digits=8, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.member.name} - ₹{self.amount_paid} - {self.payment_method}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField()
    subject = models.CharField(max_length=100)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"


class BMIRecord(models.Model):
    user = models.ForeignKey(Member, on_delete=models.CASCADE)
    height_cm = models.FloatField()
    weight_kg = models.FloatField()
    bmi_value = models.FloatField()
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - BMI: {self.bmi_value:.2f}"