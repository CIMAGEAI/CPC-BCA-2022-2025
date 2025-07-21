"""
WSGI config for Crime Report Portal.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crime_portal.settings')

application = get_wsgi_application() 