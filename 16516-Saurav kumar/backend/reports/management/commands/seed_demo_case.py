from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from backend.reports.models import CrimeReport, CrimeCategory, Station
from django.utils import timezone

User = get_user_model()

class Command(BaseCommand):
    help = 'Assigns case CR2025000001 to user Ranvir12 and ensures all required demo data exists.'

    def handle(self, *args, **options):
        # Ensure station exists
        station, _ = Station.objects.get_or_create(name='Demo Station')
        # Ensure category exists
        category, _ = CrimeCategory.objects.get_or_create(name='Demo Category', priority_level=2)
        # Ensure user exists
        user, created = User.objects.get_or_create(username='Ranvir12', defaults={'role': 'officer'})
        if created:
            user.set_password('demo1234')
            self.stdout.write(self.style.SUCCESS('Created user Ranvir12 with password demo1234'))
        user.station = station
        user.role = 'officer'
        user.save()
        # Ensure case exists and assign
        case, created = CrimeReport.objects.get_or_create(
            case_number='CR2025000001',
            defaults={
                'category': category,
                'station': station,
                'status': 'submitted',
                'priority': 'medium',
                'assigned_officer': user,
                'description': 'Demo case for testing',
                'created_at': timezone.now(),
            }
        )
        if not created:
            case.assigned_officer = user
            case.station = station
            case.category = category
            case.save()
            self.stdout.write(self.style.SUCCESS('Updated existing case CR2025000001'))
        else:
            self.stdout.write(self.style.SUCCESS('Created new case CR2025000001'))
        self.stdout.write(self.style.SUCCESS('Demo setup complete! Now login as Ranvir12 to see the case on the dashboard.')) 