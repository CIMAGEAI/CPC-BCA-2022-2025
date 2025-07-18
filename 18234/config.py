import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    DB_SERVER = 'DESKTOP-AN7D5IV'
    DB_NAME = 'School_Management'
    DB_USER = 'sa'
    DB_PASSWORD = 'your-password-here'