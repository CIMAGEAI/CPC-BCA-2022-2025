#!/usr/bin/env python
"""
Test script to check Django setup.
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crime_portal.settings')

try:
    # Setup Django
    django.setup()
    print("✅ Django setup successful!")
    
    # Test basic imports
    from django.conf import settings
    print(f"✅ Settings loaded: DEBUG = {settings.DEBUG}")
    
    # Test database connection
    from django.db import connection
    connection.ensure_connection()
    print("✅ Database connection successful!")
    
    # Test apps
    print(f"✅ Installed apps: {len(settings.INSTALLED_APPS)} apps")
    
    print("\n🎉 All tests passed! Django is ready to run.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc() 