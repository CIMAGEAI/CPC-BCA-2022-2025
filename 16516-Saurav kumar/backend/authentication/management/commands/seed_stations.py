from django.core.management.base import BaseCommand
from backend.reports.models import Station

class Command(BaseCommand):
    help = 'Seed initial police stations'

    def handle(self, *args, **kwargs):
        stations = [
            'Central Police Station',
            'North Zone Station',
            'South Zone Station',
            'East Zone Station',
            'West Zone Station',
        ]
        for name in stations:
            obj, created = Station.objects.get_or_create(name=name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Station "{name}" created.'))
            else:
                self.stdout.write(self.style.WARNING(f'Station "{name}" already exists.')) 