# 🚨 Crime Report Portal

A comprehensive, secure, and user-friendly crime reporting system built with Django. This portal allows citizens to report crimes anonymously, track their reports, and provides law enforcement with powerful tools for case management.

## ✨ Features

### 🔐 Security & Authentication
- **Two-Factor Authentication (2FA)** - Email OTP verification
- **Secure Password Reset** - Token-based email reset
- **Role-Based Access Control** - Admin, Officer, Supervisor, Citizen roles
- **Encrypted Data Storage** - Sensitive information encryption
- **CSRF Protection** - Built-in security measures

### 📝 Crime Reporting
- **Anonymous Reporting** - Report crimes without revealing identity
- **File Upload Support** - Evidence upload with security scanning
- **Location Tracking** - GPS coordinates for incident location
- **Category Classification** - Organized crime categorization
- **Priority Levels** - Urgent, High, Medium, Low priority system

### 📊 Dashboard & Analytics
- **Admin Dashboard** - Comprehensive statistics and user management
- **Officer Dashboard** - Case assignment and tracking
- **Public Statistics** - Transparent crime statistics
- **Real-time Charts** - Interactive analytics with Chart.js
- **Performance Metrics** - Resolution time and response tracking

### 🔔 Notifications
- **Email Notifications** - Automated status updates
- **In-app Notifications** - Real-time notification system
- **SMS Integration Ready** - Twilio SMS support (configurable)

### 🛡️ Security Features
- **File Upload Security** - Virus scanning and type validation
- **Rate Limiting** - Protection against abuse
- **Audit Logging** - Complete activity tracking
- **Data Encryption** - Sensitive data protection
- **Access Control** - Role-based permissions

### 📱 User Experience
- **Responsive Design** - Mobile-friendly interface
- **Modern UI/UX** - Bootstrap 5 with custom styling
- **Accessibility** - WCAG compliant design
- **Multi-language Ready** - Internationalization support
- **Search Functionality** - Global search across reports

---

## 🔄 Project Workflow

1. **User Registration & Login**: Users (citizens, officers, supervisors, admins) register and log in with secure authentication and optional 2FA.
2. **Crime Reporting**: Citizens submit crime reports, optionally uploading evidence and specifying location and category.
3. **Case Assignment**: Supervisors/admins assign cases to officers. Officers can view and manage their assigned cases.
4. **Case Management**: Officers update case status, add comments, and upload additional evidence. All actions are logged.
5. **Notifications**: Reporters and officers receive notifications (email, in-app, SMS) for status changes, assignments, and comments.
6. **Tracking & Analytics**: Users can track report status. Admins and supervisors access dashboards with statistics and analytics.
7. **Resolution & Reporting**: Cases are resolved, and reports can be exported in CSV, Excel, or PDF formats for record-keeping and analysis.

---

## 📁 Project Structure

```
crime-portal/
├── backend/                 # Django backend applications
│   ├── authentication/     # User authentication & 2FA
│   ├── reports/           # Crime reporting system
│   ├── crime_statistics/  # Analytics & statistics
│   ├── security/          # Security features
│   ├── notifications/     # Notification system
│   └── api/              # REST API endpoints
├── frontend/              # Frontend templates & static files
│   ├── templates/        # HTML templates
│   └── static/          # CSS, JS, images
├── manage.py            # Django management script
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

---

## 🗂️ Main Code Structure

- **backend/authentication/**: Handles user registration, login, 2FA, and user roles.
- **backend/reports/**: Main crime reporting logic, including models, forms, and views for submitting, tracking, and managing reports.
- **backend/notifications/**: Manages notifications (email, in-app, SMS).
- **backend/crime_statistics/**: Provides analytics and statistics features.
- **backend/security/**: Security-related models and logic.
- **frontend/templates/**: All HTML templates for the web interface.
- **frontend/static/**: CSS, JavaScript, and images for the frontend.

---

## 🧩 Key Code Sections

### backend/reports/views.py (Main Views for Crime Reporting)

This file contains the main logic for handling crime reports, including submission, export, advanced search, officer dashboard, and AJAX endpoints for status updates and evidence uploads.

#### Example: Complaint Submission View

```python
@transaction.atomic
def submit_complaint(request):
    if request.method == 'POST':
        report_form = CrimeReportForm(request.POST)
        evidence_form = ReportEvidenceForm(request.POST, request.FILES)
        if report_form.is_valid() and (not request.FILES or evidence_form.is_valid()):
            report = report_form.save(commit=False)
            if request.user.is_authenticated:
                report.reporter = request.user
            report.created_by_ip = request.META.get('REMOTE_ADDR')
            if not report.station:
                messages.error(request, 'कृपया स्टेशन चुनें (Please select a station).')
                categories = CrimeCategory.objects.filter(is_active=True)
                stations = Station.objects.all()
                return render(request, 'reports/submit_complaint.html', {
                    'report_form': report_form,
                    'evidence_form': evidence_form,
                    'categories': categories,
                    'stations': stations
                })
            report.save()
            if request.FILES:
                evidence = evidence_form.save(commit=False)
                evidence.report = report
                if request.user.is_authenticated:
                    evidence.uploaded_by = request.user
                evidence.file_size = evidence.file.size
                if hasattr(evidence.file, 'content_type'):
                    evidence.mime_type = evidence.file.content_type
                else:
                    evidence.mime_type = ''
                hasher = hashlib.sha256()
                for chunk in evidence.file.chunks():
                    hasher.update(chunk)
                evidence.file_hash = hasher.hexdigest()
                evidence.save()
            messages.success(request, 'Your complaint has been submitted successfully.')
            if request.user.is_authenticated:
                return redirect('my_reports')
            else:
                return redirect('home')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        report_form = CrimeReportForm()
        evidence_form = ReportEvidenceForm()
    categories = CrimeCategory.objects.filter(is_active=True)
    stations = Station.objects.all()
    return render(request, 'reports/submit_complaint.html', {
        'report_form': report_form,
        'evidence_form': evidence_form,
        'categories': categories,
        'stations': stations
    })
```

#### Example: Officer Dashboard View

```python
@login_required
@user_passes_test(is_officer_or_admin)
def officer_dashboard(request):
    if request.user.is_authenticated:
        if request.user.role == 'admin':
            reports = CrimeReport.objects.all()
        elif request.user.role == 'supervisor':
            reports = CrimeReport.objects.filter(
                Q(assigned_officer__isnull=True) | 
                Q(assigned_officer__role='police')
            )
        else:  # police
            user_station = getattr(request.user.userprofile, 'station', None)
            if user_station:
                reports = CrimeReport.objects.filter(
                    Q(station=user_station) & (
                        Q(assigned_officer=request.user) |
                        (Q(status='pending') & Q(assigned_officer__isnull=True))
                    )
                ).distinct().order_by('-created_at')
            else:
                reports = CrimeReport.objects.none()
        # ... (filtering, pagination, stats, context setup)
        return render(request, 'reports/officer_dashboard.html', context)
    else:
        return redirect('authentication:login')
```

#### Example: Export Reports to CSV

```python
def export_reports_csv(request):
    if not request.user.is_authenticated or request.user.role not in ['admin', 'officer', 'supervisor']:
        messages.error(request, 'Access denied.')
        return redirect('home')
    reports = CrimeReport.objects.all()
    # ... (apply filters)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="crime_reports_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
    writer = csv.writer(response)
    writer.writerow([
        'Case Number', 'Category', 'Status', 'Priority', 'Incident Date', 
        'Location', 'Description', 'Reporter', 'Assigned Officer', 'Created Date'
    ])
    for report in reports:
        writer.writerow([
            report.case_number,
            report.category.name,
            report.get_status_display(),
            report.get_priority_display(),
            report.incident_date.strftime('%Y-%m-%d %H:%M'),
            report.incident_location,
            report.description[:100] + '...' if len(report.description) > 100 else report.description,
            report.reporter.get_full_name() if report.reporter else 'Anonymous',
            report.assigned_officer.get_full_name() if report.assigned_officer else 'Unassigned',
            report.created_at.strftime('%Y-%m-%d %H:%M')
        ])
    return response
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Django 4.2+
- SQLite (default) or PostgreSQL/MySQL

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd crime-portal
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup environment variables**
```bash
cp env.example .env
# Edit .env with your configuration
```

5. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
```

7. **Run the development server**
```bash
python manage.py runserver
```

8. **Access the application**
- Main site: http://localhost:8000
- Admin panel: http://localhost:8000/admin

## 📁 Project Structure

```
crime-portal/
├── backend/                 # Django backend applications
│   ├── authentication/     # User authentication & 2FA
│   ├── reports/           # Crime reporting system
│   ├── crime_statistics/  # Analytics & statistics
│   ├── security/          # Security features
│   ├── notifications/     # Notification system
│   └── api/              # REST API endpoints
├── frontend/              # Frontend templates & static files
│   ├── templates/        # HTML templates
│   └── static/          # CSS, JS, images
├── manage.py            # Django management script
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# Email Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# SMS Settings (Optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
```

### Email Configuration
For Gmail:
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in EMAIL_HOST_PASSWORD

## 👥 User Roles

### Citizen
- Register and login
- Submit crime reports
- Track report status
- Upload evidence
- View public statistics

### Officer
- View assigned cases
- Update case status
- Add case comments
- Upload case files
- Access officer dashboard

### Supervisor
- All officer permissions
- Assign cases to officers
- Review case progress
- Generate reports
- Manage officer accounts

### Admin
- All system permissions
- User management
- System configuration
- Analytics dashboard
- Security monitoring

## 🔐 Security Features

### Data Protection
- **Encryption**: Sensitive data encrypted at rest
- **Access Control**: Role-based permissions
- **Audit Logging**: Complete activity tracking
- **File Security**: Virus scanning for uploads

### Authentication Security
- **2FA**: Email OTP verification
- **Password Policy**: Strong password requirements
- **Session Management**: Secure session handling
- **CSRF Protection**: Built-in CSRF tokens

### Application Security
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive form validation
- **SQL Injection Protection**: Django ORM protection
- **XSS Protection**: Template auto-escaping

## 📊 Analytics & Reporting

### Dashboard Features
- **Real-time Statistics**: Live crime statistics
- **Interactive Charts**: Chart.js powered visualizations
- **Performance Metrics**: Resolution time tracking
- **Geographic Analysis**: Location-based statistics

### Report Types
- **Daily Reports**: Daily crime summaries
- **Monthly Reports**: Monthly trend analysis
- **Category Reports**: Crime type breakdown
- **Performance Reports**: Officer performance metrics

## 🚀 Deployment

### Production Setup
1. **Server Requirements**
   - Ubuntu 20.04+ or CentOS 8+
   - Python 3.8+
   - Nginx
   - PostgreSQL/MySQL
   - Redis (optional)

2. **Security Checklist**
   - [ ] SSL certificate installed
   - [ ] DEBUG=False in production
   - [ ] Secret key changed
   - [ ] Database secured
   - [ ] File permissions set

3. **Performance Optimization**
   - [ ] Static files served by Nginx
   - [ ] Database indexing
   - [ ] Caching configured
   - [ ] CDN setup (optional)

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 🧪 Testing

### Running Tests
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test backend.reports

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Test Coverage
- Unit tests for all models
- Integration tests for views
- Security tests for authentication
- Performance tests for large datasets

## 📈 Performance

### Optimization Features
- **Database Indexing**: Optimized queries
- **Caching**: Redis-based caching
- **Static Files**: CDN-ready static files
- **Image Optimization**: Compressed uploads

### Monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: Response time tracking
- **Security Monitoring**: Suspicious activity detection
- **Backup Monitoring**: Automated backup verification

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Standards
- Follow PEP 8 style guide
- Write comprehensive tests
- Update documentation
- Security review required

## 📞 Support

### Documentation
- [User Guide](docs/user-guide.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Security Guide](docs/security.md)

### Contact
- **Email**: support@crimeportal.com
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Django Framework
- Bootstrap 5
- Chart.js
- Font Awesome
- Security contributors

---

**⚠️ Important**: This is a production-ready system. Ensure proper security measures are in place before deployment.

**🔒 Security Notice**: Regularly update dependencies and monitor security advisories.

**📊 Analytics**: The system collects anonymous usage statistics for improvement purposes.
