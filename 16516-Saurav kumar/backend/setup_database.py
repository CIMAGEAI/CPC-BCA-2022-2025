#!/usr/bin/env python
"""
Database setup script for Crime Report Portal.
Run this script to initialize the database with sample data.
"""

import os
import sys
import django
from django.core.management import execute_from_command_line
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.crime_portal.settings')
django.setup()

User = get_user_model()

def create_superuser():
    """Create a superuser account."""
    try:
        if not User.objects.filter(email='admin@crimeportal.com').exists():
            user = User.objects.create_superuser(
                email='admin@crimeportal.com',
                password='admin123',
                first_name='System',
                last_name='Administrator',
                role='admin'
            )
            print(f"✅ Superuser created: {user.email}")
        else:
            print("ℹ️  Superuser already exists")
    except Exception as e:
        print(f"❌ Error creating superuser: {e}")

def create_sample_officers():
    """Create sample officer accounts."""
    officers_data = [
        {
            'email': 'officer1@crimeportal.com',
            'password': 'officer123',
            'first_name': 'John',
            'last_name': 'Smith',
            'role': 'police',
            'phone_number': '+1234567890'
        },
        {
            'email': 'officer2@crimeportal.com',
            'password': 'officer123',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'role': 'police',
            'phone_number': '+1234567891'
        },
        {
            'email': 'supervisor@crimeportal.com',
            'password': 'supervisor123',
            'first_name': 'Michael',
            'last_name': 'Davis',
            'role': 'supervisor',
            'phone_number': '+1234567892'
        }
    ]
    
    for data in officers_data:
        try:
            if not User.objects.filter(email=data['email']).exists():
                user = User.objects.create_user(
                    email=data['email'],
                    password=data['password'],
                    first_name=data['first_name'],
                    last_name=data['last_name'],
                    role=data['role'],
                    phone_number=data['phone_number'],
                    is_staff=True
                )
                print(f"✅ Officer created: {user.email}")
            else:
                print(f"ℹ️  Officer already exists: {data['email']}")
        except Exception as e:
            print(f"❌ Error creating officer {data['email']}: {e}")

def create_sample_citizens():
    """Create sample citizen accounts."""
    citizens_data = [
        {
            'email': 'citizen1@example.com',
            'password': 'citizen123',
            'first_name': 'Alice',
            'last_name': 'Brown',
            'role': 'citizen',
            'phone_number': '+1234567893'
        },
        {
            'email': 'citizen2@example.com',
            'password': 'citizen123',
            'first_name': 'Bob',
            'last_name': 'Wilson',
            'role': 'citizen',
            'phone_number': '+1234567894'
        }
    ]
    
    for data in citizens_data:
        try:
            if not User.objects.filter(email=data['email']).exists():
                user = User.objects.create_user(
                    email=data['email'],
                    password=data['password'],
                    first_name=data['first_name'],
                    last_name=data['last_name'],
                    role=data['role'],
                    phone_number=data['phone_number']
                )
                print(f"✅ Citizen created: {user.email}")
            else:
                print(f"ℹ️  Citizen already exists: {data['email']}")
        except Exception as e:
            print(f"❌ Error creating citizen {data['email']}: {e}")

def create_sample_categories():
    """Create sample crime categories."""
    from backend.reports.models import CrimeCategory
    
    categories_data = [
        {'name': 'Theft', 'description': 'Property theft and burglary'},
        {'name': 'Assault', 'description': 'Physical assault and battery'},
        {'name': 'Vandalism', 'description': 'Property damage and vandalism'},
        {'name': 'Fraud', 'description': 'Financial fraud and scams'},
        {'name': 'Traffic Violation', 'description': 'Traffic-related incidents'},
        {'name': 'Drug Offense', 'description': 'Drug-related crimes'},
        {'name': 'Harassment', 'description': 'Harassment and stalking'},
        {'name': 'Other', 'description': 'Other types of crimes'},
    ]
    
    for data in categories_data:
        try:
            category, created = CrimeCategory.objects.get_or_create(
                name=data['name'],
                defaults={'description': data['description']}
            )
            if created:
                print(f"✅ Category created: {category.name}")
            else:
                print(f"ℹ️  Category already exists: {category.name}")
        except Exception as e:
            print(f"❌ Error creating category {data['name']}: {e}")

def create_sample_reports():
    """Create sample crime reports."""
    from backend.reports.models import CrimeReport, CrimeCategory
    from django.utils import timezone
    from datetime import timedelta
    import uuid
    
    # Get categories and users
    categories = list(CrimeCategory.objects.all())
    citizens = list(User.objects.filter(role='citizen'))
    officers = list(User.objects.filter(role='police'))
    
    if not categories or not citizens:
        print("⚠️  No categories or citizens found. Skipping sample reports.")
        return
    
    sample_reports = [
        {
            'title': 'Car Break-in at Downtown Parking',
            'description': 'My car was broken into while parked at the downtown parking garage. The passenger window was smashed and my laptop was stolen.',
            'incident_location': '123 Main St, Downtown',
            'incident_date': timezone.now() - timedelta(days=2),
            'priority': 'medium',
            'status': 'submitted'
        },
        {
            'title': 'Suspicious Activity in Neighborhood',
            'description': 'I noticed suspicious activity in my neighborhood. There are people loitering around at odd hours and I\'m concerned about safety.',
            'incident_location': '456 Oak Ave, Residential Area',
            'incident_date': timezone.now() - timedelta(days=1),
            'priority': 'low',
            'status': 'assigned'
        },
        {
            'title': 'Fraudulent Phone Call',
            'description': 'I received a phone call from someone claiming to be from the IRS. They demanded immediate payment and threatened legal action.',
            'incident_location': 'Home - 789 Pine St',
            'incident_date': timezone.now() - timedelta(hours=6),
            'priority': 'high',
            'status': 'under_review'
        }
    ]
    
    for i, data in enumerate(sample_reports):
        try:
            report = CrimeReport.objects.create(
                case_number=f"CR-{timezone.now().year}-{str(i+1).zfill(4)}",
                title=data['title'],
                description=data['description'],
                incident_location=data['incident_location'],
                incident_date=data['incident_date'],
                priority=data['priority'],
                status=data['status'],
                category=categories[i % len(categories)],
                reporter=citizens[i % len(citizens)],
                assigned_officer=officers[i % len(officers)] if data['status'] == 'assigned' and officers else None,
                assigned_date=timezone.now() if data['status'] == 'assigned' else None
            )
            print(f"✅ Report created: {report.case_number}")
        except Exception as e:
            print(f"❌ Error creating report {i+1}: {e}")

def setup_notification_templates():
    """Create default notification templates."""
    from notifications.models import NotificationTemplate
    
    templates_data = [
        {
            'name': 'Status Change Notification',
            'notification_type': 'status_change',
            'subject': 'Your case status has been updated',
            'email_template': 'Dear {{user.first_name}},\n\nYour case #{{report.case_number}} status has been updated to {{status}}.\n\nThank you for using our crime reporting system.',
            'sms_template': 'Case #{{report.case_number}} status updated to {{status}}.',
            'in_app_template': 'Your case #{{report.case_number}} status has been updated to {{status}}.'
        },
        {
            'name': 'Assignment Notification',
            'notification_type': 'assignment',
            'subject': 'Your case has been assigned to an officer',
            'email_template': 'Dear {{user.first_name}},\n\nYour case #{{report.case_number}} has been assigned to an officer and is now under investigation.\n\nWe will keep you updated on the progress.',
            'sms_template': 'Case #{{report.case_number}} assigned to officer.',
            'in_app_template': 'Your case #{{report.case_number}} has been assigned to an officer.'
        }
    ]
    
    for data in templates_data:
        try:
            template, created = NotificationTemplate.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            if created:
                print(f"✅ Template created: {template.name}")
            else:
                print(f"ℹ️  Template already exists: {template.name}")
        except Exception as e:
            print(f"❌ Error creating template {data['name']}: {e}")

def main():
    """Main setup function."""
    print("🚀 Setting up Crime Report Portal Database...")
    print("=" * 50)
    
    # Run migrations
    print("\n📦 Running migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Create sample data
    print("\n👥 Creating users...")
    create_superuser()
    create_sample_officers()
    create_sample_citizens()
    
    print("\n📋 Creating categories...")
    create_sample_categories()
    
    print("\n📝 Creating sample reports...")
    create_sample_reports()
    
    print("\n🔔 Setting up notifications...")
    setup_notification_templates()
    
    print("\n✅ Database setup complete!")
    print("\n📋 Login Credentials:")
    print("Admin: admin@crimeportal.com / admin123")
    print("Officer: officer1@crimeportal.com / officer123")
    print("Citizen: citizen1@example.com / citizen123")

if __name__ == '__main__':
    main() 