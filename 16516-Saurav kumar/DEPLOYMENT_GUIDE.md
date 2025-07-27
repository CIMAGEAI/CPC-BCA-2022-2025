# 🚀 Crime Report Portal - Deployment Guide

## 📋 Prerequisites

- Python 3.8+
- MySQL 8.0+ or PostgreSQL 12+
- Redis (for caching and sessions)
- Nginx (for production)
- SSL Certificate
- Email service (Gmail, SendGrid, etc.)
- SMS service (Twilio, etc.) - Optional

## 🔧 Installation Steps

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd crime-portal

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env file with your settings
nano .env
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL=mysql://user:password@localhost/crime_portal

# Security
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@your-domain.com

# SMS Configuration (Optional)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# File Storage
MEDIA_ROOT=/path/to/media/files
STATIC_ROOT=/path/to/static/files

# Security Settings
CSRF_TRUSTED_ORIGINS=https://your-domain.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### 3. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE crime_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'crime_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON crime_portal.* TO 'crime_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 4. Static Files and Media

```bash
# Collect static files
python manage.py collectstatic --noinput

# Create media directory
mkdir -p media/evidence media/transparency_reports
chmod 755 media media/evidence media/transparency_reports
```

### 5. Security Setup

```bash
# Install ClamAV for file scanning
sudo apt-get update
sudo apt-get install clamav clamav-daemon

# Update virus definitions
sudo freshclam

# Test ClamAV
clamscan --version
```

### 6. Production Server Setup

#### Using Gunicorn

```bash
# Install Gunicorn
pip install gunicorn

# Create systemd service
sudo nano /etc/systemd/system/crime-portal.service
```

**Service Configuration:**
```ini
[Unit]
Description=Crime Report Portal
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/crime-portal
Environment="PATH=/path/to/crime-portal/venv/bin"
ExecStart=/path/to/crime-portal/venv/bin/gunicorn --workers 3 --bind unix:/run/crime-portal.sock crime_portal.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
```

#### Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/crime-portal
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Static files
    location /static/ {
        alias /path/to/crime-portal/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Media files (protected)
    location /media/ {
        alias /path/to/crime-portal/media/;
        auth_request /auth;
        expires 1y;
    }

    # Main application
    location / {
        proxy_pass http://unix:/run/crime-portal.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Authentication for media files
    location = /auth {
        internal;
        proxy_pass http://unix:/run/crime-portal.sock;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-URI $request_uri;
    }
}
```

### 7. Start Services

```bash
# Enable and start services
sudo systemctl enable crime-portal
sudo systemctl start crime-portal
sudo systemctl enable nginx
sudo systemctl start nginx

# Enable site
sudo ln -s /etc/nginx/sites-available/crime-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Security Checklist

### SSL/TLS Configuration
- [ ] SSL certificate installed
- [ ] HTTPS redirect enabled
- [ ] HSTS headers configured
- [ ] Modern SSL ciphers enabled

### Application Security
- [ ] DEBUG=False in production
- [ ] Secret key changed from default
- [ ] Allowed hosts configured
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] File upload restrictions set

### Database Security
- [ ] Database user with minimal privileges
- [ ] Database connection encrypted
- [ ] Regular backups configured
- [ ] Database firewall rules set

### File Security
- [ ] ClamAV installed and configured
- [ ] File upload size limits set
- [ ] Allowed file types restricted
- [ ] Media files protected with authentication

## 📊 Monitoring Setup

### Log Monitoring
```bash
# Application logs
sudo journalctl -u crime-portal -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Security logs
sudo tail -f /var/log/auth.log
```

### Performance Monitoring
```bash
# Install monitoring tools
sudo apt-get install htop iotop nethogs

# Monitor system resources
htop
iotop
nethogs
```

## 🔄 Backup Strategy

### Database Backups
```bash
#!/bin/bash
# Create backup script
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u crime_user -p crime_portal > backup_$DATE.sql
gzip backup_$DATE.sql
```

### File Backups
```bash
#!/bin/bash
# Backup media files
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf media_backup_$DATE.tar.gz /path/to/crime-portal/media/
```

### Automated Backups
```bash
# Add to crontab
0 2 * * * /path/to/backup_script.sh
```

## 🚀 Post-Deployment Tasks

### 1. Initial Setup
```bash
# Create initial data
python manage.py shell
```

```python
# Create sample categories
from reports.models import CrimeCategory
categories = [
    'Theft', 'Assault', 'Vandalism', 'Fraud', 
    'Traffic Violation', 'Drug Offense', 'Harassment'
]
for cat in categories:
    CrimeCategory.objects.get_or_create(name=cat)

# Create notification templates
from notifications.models import NotificationTemplate
# Add templates as needed
```

### 2. User Training
- [ ] Admin user training
- [ ] Officer training
- [ ] Documentation provided
- [ ] Support contact established

### 3. Testing
- [ ] User registration/login
- [ ] Report submission
- [ ] File upload
- [ ] Notification system
- [ ] Officer dashboard
- [ ] Statistics dashboard

## 📞 Support and Maintenance

### Regular Maintenance Tasks
- [ ] Weekly security updates
- [ ] Monthly database optimization
- [ ] Quarterly SSL certificate renewal
- [ ] Annual security audit

### Monitoring Alerts
- [ ] Server resource monitoring
- [ ] Application error monitoring
- [ ] Security incident monitoring
- [ ] Backup success monitoring

## 🔧 Troubleshooting

### Common Issues

**Database Connection Issues:**
```bash
# Check database status
sudo systemctl status mysql

# Test connection
mysql -u crime_user -p crime_portal
```

**Static Files Not Loading:**
```bash
# Check permissions
ls -la /path/to/crime-portal/static/

# Recollect static files
python manage.py collectstatic --noinput
```

**File Upload Issues:**
```bash
# Check ClamAV status
sudo systemctl status clamav-daemon

# Test file scanning
clamscan /path/to/test/file
```

**Email Not Sending:**
```bash
# Test email configuration
python manage.py shell
```

```python
from django.core.mail import send_mail
send_mail('Test', 'Test message', 'from@example.com', ['to@example.com'])
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_reports_status ON reports_crimereport(status);
CREATE INDEX idx_reports_created ON reports_crimereport(created_at);
CREATE INDEX idx_evidence_uploaded ON reports_evidence(uploaded_at);
```

### Caching Configuration
```python
# Add to settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### CDN Setup
- Configure CDN for static files
- Enable compression
- Set appropriate cache headers

---

## 🎯 Next Steps After Deployment

1. **User Onboarding**: Train administrators and officers
2. **Monitoring Setup**: Configure alerts and monitoring
3. **Backup Testing**: Verify backup and restore procedures
4. **Security Audit**: Conduct initial security assessment
5. **Performance Testing**: Load test the application
6. **Documentation**: Create user and admin documentation

The Crime Report Portal is now ready for production use! 🚀 