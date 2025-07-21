from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from backend.reports.models import CrimeReport, CrimeCategory, ReportEvidence
from backend.notifications.models import ReportNotification
from django.core.files.uploadedfile import SimpleUploadedFile
import uuid

User = get_user_model()

class PoliceDashboardTests(TestCase):
    def setUp(self):
        # Create officer user
        self.officer = User.objects.create_user(username='officer1', password='testpass', role='officer')
        self.client = Client()
        self.client.login(username='officer1', password='testpass')
        # Create category
        self.category = CrimeCategory.objects.create(name='Theft', priority_level=2)
        # Create report
        self.report = CrimeReport.objects.create(
            id=uuid.uuid4(),
            case_number='CR2025000001',
            category=self.category,
            status='submitted',
            priority='medium',
            assigned_officer=self.officer
        )

    def test_update_status(self):
        url = reverse('update_report_status', args=[str(self.report.id)])
        response = self.client.post(url, {'status': 'investigating', 'notes': 'Testing status update'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('success', response.json())
        self.report.refresh_from_db()
        self.assertEqual(self.report.status, 'investigating')

    def test_add_comment(self):
        url = reverse('add_comment', args=[str(self.report.id)])
        response = self.client.post(url, {'content': 'Test comment', 'is_internal': False})
        self.assertEqual(response.status_code, 200)
        self.assertIn('success', response.json())
        self.assertTrue(self.report.comments.filter(content='Test comment').exists())

    def test_upload_evidence(self):
        url = reverse('upload_evidence', args=[str(self.report.id)])
        file = SimpleUploadedFile('test.txt', b'file_content', content_type='text/plain')
        data = {'file': file, 'description': 'Test evidence', 'file_type': 'document'}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, 200)
        self.assertIn('success', response.json())
        self.assertTrue(self.report.evidence.filter(description='Test evidence').exists())

    def test_notifications_check(self):
        # Create a notification
        ReportNotification.objects.create(
            report=self.report,
            user=self.officer,
            notification_type='status_change',
            message='Status changed!'
        )
        url = reverse('check_notifications')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('notifications', response.json())
        self.assertTrue(any('Status changed!' in n['message'] for n in response.json()['notifications'])) 