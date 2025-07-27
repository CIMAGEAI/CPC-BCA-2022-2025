"""
Django management command to test SMS functionality.
"""

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from backend.notifications.services import get_sms_service


class Command(BaseCommand):
    help = 'Test SMS functionality with Twilio'

    def add_arguments(self, parser):
        parser.add_argument(
            'phone_number',
            type=str,
            help='Phone number to send test SMS to (with country code, e.g., +1234567890)'
        )
        parser.add_argument(
            '--message',
            type=str,
            default='Test SMS from Crime Report Portal',
            help='Custom message to send (default: "Test SMS from Crime Report Portal")'
        )

    def handle(self, *args, **options):
        phone_number = options['phone_number']
        message = options['message']

        self.stdout.write(
            self.style.SUCCESS(f'Testing SMS functionality...')
        )
        self.stdout.write(f'Phone Number: {phone_number}')
        self.stdout.write(f'Message: {message}')
        self.stdout.write('')

        try:
            # Get SMS service
            sms_service = get_sms_service()
            
            self.stdout.write(f'SMS Provider: {sms_service.provider}')
            self.stdout.write('')

            # Send test SMS
            self.stdout.write('Sending SMS...')
            result = sms_service.send_sms(
                to_number=phone_number,
                message=message
            )

            if result['success']:
                self.stdout.write(
                    self.style.SUCCESS('✅ SMS sent successfully!')
                )
                self.stdout.write(f'Message SID: {result.get("sid", "N/A")}')
                self.stdout.write(f'Status: {result.get("status", "N/A")}')
            else:
                self.stdout.write(
                    self.style.ERROR('❌ SMS sending failed!')
                )
                self.stdout.write(f'Error: {result.get("message", "Unknown error")}')
                if 'error' in result:
                    self.stdout.write(f'Error Type: {result["error"]}')

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error: {str(e)}')
            )
            raise CommandError(f'SMS test failed: {str(e)}')

        self.stdout.write('')
        self.stdout.write('SMS test completed.') 