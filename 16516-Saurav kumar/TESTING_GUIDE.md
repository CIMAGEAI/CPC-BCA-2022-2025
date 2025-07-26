# 🧪 Crime Report Portal - Testing Guide

## 📋 Testing Overview

This guide covers comprehensive testing for the Crime Report Portal, including unit tests, integration tests, security tests, and user acceptance testing.

## 🚀 Quick Start Testing

### 1. Setup Test Environment

```bash
# Install test dependencies
pip install pytest pytest-django pytest-cov factory-boy

# Create test database
python manage.py test --keepdb
```

### 2. Run All Tests

```bash
# Run all tests with coverage
pytest --cov=. --cov-report=html --cov-report=term

# Run specific app tests
python manage.py test reports
python manage.py test authentication
python manage.py test notifications
```

## 🧪 Unit Tests

### Authentication Tests

```python
# tests/test_authentication.py
import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from authentication.forms import UserRegistrationForm, UserLoginForm

User = get_user_model()

class AuthenticationTestCase(TestCase):
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password1': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+1234567890'
        }

    def test_user_registration_form_valid(self):
        form = UserRegistrationForm(data=self.user_data)
        self.assertTrue(form.is_valid())

    def test_user_registration_form_invalid_email(self):
        self.user_data['email'] = 'invalid-email'
        form = UserRegistrationForm(data=self.user_data)
        self.assertFalse(form.is_valid())

    def test_user_login_form_valid(self):
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        form_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        form = UserLoginForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_password_validation(self):
        # Test weak password
        self.user_data['password1'] = '123'
        self.user_data['password2'] = '123'
        form = UserRegistrationForm(data=self.user_data)
        self.assertFalse(form.is_valid())
        self.assertIn('password', form.errors)
```

### Reports Tests

```python
# tests/test_reports.py
import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from reports.models import CrimeReport, CrimeCategory, Evidence
from reports.forms import CrimeReportForm

User = get_user_model()

class ReportsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='citizen@example.com',
            password='testpass123',
            role='citizen'
        )
        self.category = CrimeCategory.objects.create(
            name='Theft',
            description='Property theft'
        )
        self.report_data = {
            'title': 'Test Report',
            'description': 'Test description',
            'incident_location': '123 Test St',
            'category': self.category.id,
            'priority': 'medium'
        }

    def test_create_crime_report(self):
        report = CrimeReport.objects.create(
            reporter=self.user,
            category=self.category,
            **self.report_data
        )
        self.assertEqual(report.title, 'Test Report')
        self.assertEqual(report.status, 'submitted')

    def test_report_form_validation(self):
        form = CrimeReportForm(data=self.report_data)
        self.assertTrue(form.is_valid())

    def test_report_status_workflow(self):
        report = CrimeReport.objects.create(
            reporter=self.user,
            category=self.category,
            **self.report_data
        )
        
        # Test status transitions
        self.assertEqual(report.status, 'submitted')
        
        report.status = 'assigned'
        report.save()
        self.assertEqual(report.status, 'assigned')
        
        report.status = 'under_review'
        report.save()
        self.assertEqual(report.status, 'under_review')

    def test_evidence_upload(self):
        report = CrimeReport.objects.create(
            reporter=self.user,
            category=self.category,
            **self.report_data
        )
        
        evidence = Evidence.objects.create(
            report=report,
            file_name='test.jpg',
            file_type='image/jpeg',
            file_size=1024,
            description='Test evidence'
        )
        
        self.assertEqual(evidence.report, report)
        self.assertEqual(evidence.file_name, 'test.jpg')
```

### Notifications Tests

```python
# tests/test_notifications.py
import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from notifications.models import Notification, NotificationTemplate
from reports.models import CrimeReport, CrimeCategory

User = get_user_model()

class NotificationsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.category = CrimeCategory.objects.create(name='Test')
        self.report = CrimeReport.objects.create(
            reporter=self.user,
            category=self.category,
            title='Test Report',
            description='Test',
            incident_location='Test'
        )

    def test_notification_creation(self):
        notification = Notification.objects.create(
            user=self.user,
            notification_type='status_change',
            title='Status Updated',
            message='Your report status has been updated',
            related_object_id=self.report.id,
            related_object_type='reports.CrimeReport'
        )
        
        self.assertEqual(notification.user, self.user)
        self.assertEqual(notification.notification_type, 'status_change')
        self.assertFalse(notification.is_read)

    def test_notification_template(self):
        template = NotificationTemplate.objects.create(
            name='Test Template',
            notification_type='status_change',
            subject='Test Subject',
            email_template='Hello {{user.first_name}}',
            sms_template='Test SMS',
            in_app_template='Test in-app'
        )
        
        self.assertEqual(template.name, 'Test Template')
        self.assertEqual(template.notification_type, 'status_change')

    def test_mark_notification_read(self):
        notification = Notification.objects.create(
            user=self.user,
            notification_type='status_change',
            title='Test',
            message='Test message'
        )
        
        self.assertFalse(notification.is_read)
        notification.mark_as_read()
        self.assertTrue(notification.is_read)
```

## 🔒 Security Tests

### Authentication Security

```python
# tests/test_security.py
import pytest
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core import mail

User = get_user_model()

class SecurityTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    def test_login_rate_limiting(self):
        """Test that login attempts are rate limited"""
        login_url = reverse('login')
        
        # Try to login multiple times with wrong password
        for i in range(10):
            response = self.client.post(login_url, {
                'email': 'test@example.com',
                'password': 'wrongpassword'
            })
        
        # Should be blocked after too many attempts
        self.assertNotEqual(response.status_code, 200)

    def test_password_strength_validation(self):
        """Test password strength requirements"""
        register_url = reverse('register')
        
        # Test weak password
        response = self.client.post(register_url, {
            'email': 'new@example.com',
            'password1': '123',
            'password2': '123',
            'first_name': 'Test',
            'last_name': 'User'
        })
        
        self.assertNotEqual(response.status_code, 302)  # Should not redirect

    def test_csrf_protection(self):
        """Test CSRF protection"""
        client = Client(enforce_csrf_checks=True)
        login_url = reverse('login')
        
        response = client.post(login_url, {
            'email': 'test@example.com',
            'password': 'testpass123'
        })
        
        self.assertEqual(response.status_code, 403)  # CSRF error

    def test_session_security(self):
        """Test session security settings"""
        self.client.login(email='test@example.com', password='testpass123')
        
        # Test session timeout
        session = self.client.session
        session.set_expiry(0)  # Expire immediately
        session.save()
        
        response = self.client.get(reverse('dashboard'))
        self.assertNotEqual(response.status_code, 200)  # Should redirect to login

    def test_file_upload_security(self):
        """Test file upload security"""
        self.client.login(email='test@example.com', password='testpass123')
        
        # Test malicious file upload
        with open('test_malicious.php', 'w') as f:
            f.write('<?php echo "malicious"; ?>')
        
        with open('test_malicious.php', 'rb') as f:
            response = self.client.post(reverse('upload_evidence'), {
                'file': f,
                'description': 'Test'
            })
        
        # Should reject malicious files
        self.assertNotEqual(response.status_code, 200)
        
        # Cleanup
        import os
        os.remove('test_malicious.php')
```

### Authorization Tests

```python
# tests/test_authorization.py
import pytest
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

class AuthorizationTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.citizen = User.objects.create_user(
            email='citizen@example.com',
            password='testpass123',
            role='citizen'
        )
        self.officer = User.objects.create_user(
            email='officer@example.com',
            password='testpass123',
            role='officer'
        )
        self.admin = User.objects.create_user(
            email='admin@example.com',
            password='testpass123',
            role='admin'
        )

    def test_citizen_access_restrictions(self):
        """Test that citizens can't access officer/admin areas"""
        self.client.login(email='citizen@example.com', password='testpass123')
        
        # Try to access officer dashboard
        response = self.client.get(reverse('officer_dashboard'))
        self.assertEqual(response.status_code, 403)
        
        # Try to access admin area
        response = self.client.get(reverse('admin:index'))
        self.assertEqual(response.status_code, 403)

    def test_officer_access_restrictions(self):
        """Test that officers can't access admin areas"""
        self.client.login(email='officer@example.com', password='testpass123')
        
        # Try to access admin area
        response = self.client.get(reverse('admin:index'))
        self.assertEqual(response.status_code, 403)

    def test_report_ownership(self):
        """Test that users can only access their own reports"""
        from reports.models import CrimeReport, CrimeCategory
        
        category = CrimeCategory.objects.create(name='Test')
        
        # Create report for citizen
        report = CrimeReport.objects.create(
            reporter=self.citizen,
            category=category,
            title='Citizen Report',
            description='Test',
            incident_location='Test'
        )
        
        # Citizen should be able to view their report
        self.client.login(email='citizen@example.com', password='testpass123')
        response = self.client.get(reverse('report_detail', args=[report.id]))
        self.assertEqual(response.status_code, 200)
        
        # Officer should be able to view any report
        self.client.login(email='officer@example.com', password='testpass123')
        response = self.client.get(reverse('report_detail', args=[report.id]))
        self.assertEqual(response.status_code, 200)
        
        # Different citizen should not be able to view
        other_citizen = User.objects.create_user(
            email='other@example.com',
            password='testpass123',
            role='citizen'
        )
        self.client.login(email='other@example.com', password='testpass123')
        response = self.client.get(reverse('report_detail', args=[report.id]))
        self.assertEqual(response.status_code, 403)
```

## 🌐 Integration Tests

### API Tests

```python
# tests/test_api.py
import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from reports.models import CrimeReport, CrimeCategory

User = get_user_model()

class APITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.category = CrimeCategory.objects.create(name='Test')

    def test_user_registration_api(self):
        """Test user registration via API"""
        url = '/api/auth/register/'
        data = {
            'email': 'new@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+1234567890'
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='new@example.com').exists())

    def test_login_api(self):
        """Test login via API"""
        url = '/api/auth/login/'
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_create_report_api(self):
        """Test creating report via API"""
        self.client.force_authenticate(user=self.user)
        
        url = '/api/reports/'
        data = {
            'title': 'API Test Report',
            'description': 'Test description',
            'incident_location': '123 Test St',
            'category': self.category.id,
            'priority': 'medium'
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'API Test Report')

    def test_list_reports_api(self):
        """Test listing reports via API"""
        self.client.force_authenticate(user=self.user)
        
        # Create test report
        CrimeReport.objects.create(
            reporter=self.user,
            category=self.category,
            title='Test Report',
            description='Test',
            incident_location='Test'
        )
        
        url = '/api/reports/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_notifications_api(self):
        """Test notifications API"""
        self.client.force_authenticate(user=self.user)
        
        url = '/api/notifications/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
```

### End-to-End Tests

```python
# tests/test_e2e.py
import pytest
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from reports.models import CrimeReport, CrimeCategory

User = get_user_model()

class E2ETestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            role='citizen'
        )
        self.category = CrimeCategory.objects.create(name='Test')

    def test_complete_report_workflow(self):
        """Test complete report submission workflow"""
        # 1. Login
        self.client.login(email='test@example.com', password='testpass123')
        
        # 2. Submit report
        response = self.client.post(reverse('submit_complaint'), {
            'title': 'E2E Test Report',
            'description': 'Test description',
            'incident_location': '123 Test St',
            'category': self.category.id,
            'priority': 'medium'
        })
        self.assertEqual(response.status_code, 302)  # Redirect after success
        
        # 3. Check report was created
        report = CrimeReport.objects.get(title='E2E Test Report')
        self.assertEqual(report.status, 'submitted')
        
        # 4. View report list
        response = self.client.get(reverse('my_reports'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'E2E Test Report')
        
        # 5. View report detail
        response = self.client.get(reverse('report_detail', args=[report.id]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'E2E Test Report')

    def test_officer_workflow(self):
        """Test officer dashboard workflow"""
        officer = User.objects.create_user(
            email='officer@example.com',
            password='testpass123',
            role='officer'
        )
        
        # Create test report
        report = CrimeReport.objects.create(
            reporter=self.user,
            category=self.category,
            title='Officer Test Report',
            description='Test',
            incident_location='Test'
        )
        
        # Login as officer
        self.client.login(email='officer@example.com', password='testpass123')
        
        # Access officer dashboard
        response = self.client.get(reverse('officer_dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Officer Test Report')
        
        # Update report status
        response = self.client.post(reverse('update_report_status', args=[report.id]), {
            'status': 'assigned',
            'assigned_officer': officer.id
        })
        self.assertEqual(response.status_code, 302)
        
        # Check status was updated
        report.refresh_from_db()
        self.assertEqual(report.status, 'assigned')
```

## 🎯 User Acceptance Testing

### Test Scenarios

```python
# tests/test_uat.py
import pytest
from django.test import TestCase, Client
from django.contrib.auth import get_user_model

User = get_user_model()

class UATTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_citizen_registration_and_reporting(self):
        """UAT: Citizen can register and submit reports"""
        # 1. Register new citizen
        response = self.client.post(reverse('register'), {
            'email': 'newcitizen@example.com',
            'password1': 'SecurePass123!',
            'password2': 'SecurePass123!',
            'first_name': 'John',
            'last_name': 'Doe',
            'phone_number': '+1234567890'
        })
        self.assertEqual(response.status_code, 302)
        
        # 2. Login
        response = self.client.post(reverse('login'), {
            'email': 'newcitizen@example.com',
            'password': 'SecurePass123!'
        })
        self.assertEqual(response.status_code, 302)
        
        # 3. Submit report
        category = CrimeCategory.objects.create(name='Theft')
        response = self.client.post(reverse('submit_complaint'), {
            'title': 'My car was stolen',
            'description': 'Car stolen from parking lot',
            'incident_location': '123 Main St',
            'category': category.id,
            'priority': 'high'
        })
        self.assertEqual(response.status_code, 302)
        
        # 4. Verify report appears in list
        response = self.client.get(reverse('my_reports'))
        self.assertContains(response, 'My car was stolen')

    def test_officer_dashboard_functionality(self):
        """UAT: Officer can manage reports effectively"""
        # Setup
        officer = User.objects.create_user(
            email='officer@example.com',
            password='testpass123',
            role='officer'
        )
        citizen = User.objects.create_user(
            email='citizen@example.com',
            password='testpass123',
            role='citizen'
        )
        category = CrimeCategory.objects.create(name='Assault')
        
        # Create multiple reports
        for i in range(5):
            CrimeReport.objects.create(
                reporter=citizen,
                category=category,
                title=f'Report {i+1}',
                description=f'Description {i+1}',
                incident_location=f'Location {i+1}',
                priority='medium' if i % 2 == 0 else 'high'
            )
        
        # Login as officer
        self.client.login(email='officer@example.com', password='testpass123')
        
        # 1. View dashboard
        response = self.client.get(reverse('officer_dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Report 1')
        self.assertContains(response, 'Report 2')
        
        # 2. Filter reports
        response = self.client.get(reverse('officer_dashboard'), {
            'priority': 'high',
            'status': 'submitted'
        })
        self.assertEqual(response.status_code, 200)
        
        # 3. Assign report to self
        report = CrimeReport.objects.first()
        response = self.client.post(reverse('assign_report', args=[report.id]), {
            'assigned_officer': officer.id
        })
        self.assertEqual(response.status_code, 302)
        
        # 4. Update status
        response = self.client.post(reverse('update_report_status', args=[report.id]), {
            'status': 'under_review'
        })
        self.assertEqual(response.status_code, 302)

    def test_notification_system(self):
        """UAT: Notifications work correctly"""
        # Setup
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        category = CrimeCategory.objects.create(name='Test')
        report = CrimeReport.objects.create(
            reporter=user,
            category=category,
            title='Test Report',
            description='Test',
            incident_location='Test'
        )
        
        # Login
        self.client.login(email='test@example.com', password='testpass123')
        
        # 1. Check notifications page
        response = self.client.get(reverse('notifications'))
        self.assertEqual(response.status_code, 200)
        
        # 2. Mark notification as read
        notification = Notification.objects.create(
            user=user,
            notification_type='status_change',
            title='Test',
            message='Test message'
        )
        
        response = self.client.post(reverse('mark_notification_read', args=[notification.id]))
        self.assertEqual(response.status_code, 200)
        
        # 3. Check notification is marked as read
        notification.refresh_from_db()
        self.assertTrue(notification.is_read)
```

## 📊 Performance Tests

### Load Testing

```python
# tests/test_performance.py
import pytest
import time
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from reports.models import CrimeReport, CrimeCategory

User = get_user_model()

class PerformanceTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.category = CrimeCategory.objects.create(name='Test')

    def test_report_listing_performance(self):
        """Test performance of report listing with many reports"""
        # Create many reports
        for i in range(100):
            CrimeReport.objects.create(
                reporter=self.user,
                category=self.category,
                title=f'Report {i}',
                description=f'Description {i}',
                incident_location=f'Location {i}'
            )
        
        self.client.login(email='test@example.com', password='testpass123')
        
        # Time the request
        start_time = time.time()
        response = self.client.get(reverse('my_reports'))
        end_time = time.time()
        
        self.assertEqual(response.status_code, 200)
        self.assertLess(end_time - start_time, 1.0)  # Should complete in under 1 second

    def test_search_performance(self):
        """Test search performance"""
        # Create reports with searchable content
        for i in range(50):
            CrimeReport.objects.create(
                reporter=self.user,
                category=self.category,
                title=f'Theft Report {i}',
                description=f'Car stolen from location {i}',
                incident_location=f'Address {i}'
            )
        
        self.client.login(email='test@example.com', password='testpass123')
        
        # Test search performance
        start_time = time.time()
        response = self.client.get(reverse('my_reports'), {
            'search': 'theft'
        })
        end_time = time.time()
        
        self.assertEqual(response.status_code, 200)
        self.assertLess(end_time - start_time, 0.5)  # Should complete in under 0.5 seconds
```

## 🚀 Running Tests

### Command Line Options

```bash
# Run all tests
python manage.py test

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html

# Run specific test file
python manage.py test tests.test_authentication

# Run specific test method
python manage.py test tests.test_authentication.AuthenticationTestCase.test_user_registration

# Run tests in parallel
python manage.py test --parallel

# Run tests with verbose output
python manage.py test -v 2

# Run tests and stop on first failure
python manage.py test --failfast
```

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_db
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest pytest-django pytest-cov
    
    - name: Run tests
      env:
        DATABASE_URL: mysql://root:root@localhost:3306/test_db
        SECRET_KEY: test-secret-key
      run: |
        python manage.py test --keepdb
        pytest --cov=. --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v1
      with:
        file: ./coverage.xml
```

## 📋 Test Checklist

### Pre-Deployment Testing
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Security tests pass
- [ ] Performance tests meet requirements
- [ ] User acceptance tests pass
- [ ] Cross-browser compatibility tested
- [ ] Mobile responsiveness tested
- [ ] Accessibility tests pass

### Security Testing
- [ ] Authentication bypass attempts
- [ ] SQL injection attempts
- [ ] XSS attempts
- [ ] CSRF protection
- [ ] File upload security
- [ ] Rate limiting
- [ ] Session security
- [ ] Authorization checks

### Performance Testing
- [ ] Page load times under 3 seconds
- [ ] Database query optimization
- [ ] Memory usage monitoring
- [ ] Concurrent user testing
- [ ] File upload performance
- [ ] Search performance

### User Experience Testing
- [ ] Form validation messages
- [ ] Error handling
- [ ] Navigation flow
- [ ] Mobile usability
- [ ] Accessibility compliance
- [ ] Cross-browser compatibility

---

## 🎯 Next Steps

1. **Automate Testing**: Set up CI/CD pipeline
2. **Performance Monitoring**: Implement APM tools
3. **Security Scanning**: Add automated security scans
4. **User Feedback**: Collect and incorporate user feedback
5. **Regression Testing**: Maintain test suite for new features

The testing framework is now ready to ensure the Crime Report Portal meets all quality and security standards! 🧪 