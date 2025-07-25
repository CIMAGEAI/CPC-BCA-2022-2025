# Generated by Django 5.2.4 on 2025-07-06 11:09

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('courses', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('student_id', models.CharField(max_length=20, unique=True)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1)),
                ('date_of_birth', models.DateField()),
                ('address', models.TextField()),
                ('phone', models.CharField(max_length=15)),
                ('parent_name', models.CharField(max_length=100)),
                ('parent_phone', models.CharField(max_length=15)),
                ('emergency_contact', models.CharField(max_length=15)),
                ('photo', models.ImageField(blank=True, null=True, upload_to='student_photos/')),
                ('enrollment_date', models.DateField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.course')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
