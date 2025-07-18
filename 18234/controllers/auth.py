from flask import Blueprint, render_template, request, redirect, url_for, session, flash
import pyodbc
import hashlib


auth_bp = Blueprint('auth', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

@auth_bp.route('/')
def home():
    return render_template('Home.html')


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hashed_password = hash_password(password);
        
        try:
            conn = db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT Name, Mobile, Email, Role , username
                FROM LoginMaster 
                WHERE UserName=? AND Password=?
            """, (username, password))
            result = cursor.fetchone()
            conn.close()

            if result:
                session['name'] = result[0]
                session['mobile'] = result[1]
                session['email'] = result[2]
                session['role'] = result[3]
                session['username'] = result[4]
                
                if result[3] == 'Admin':
                    return redirect(url_for('admin.dashboard'))
                else:
                    return redirect(url_for('auth.home'))
            else:
                flash('Invalid username or password', 'error')
        except Exception as e:
            flash(f'Error: {str(e)}', 'error')
    
    return render_template('Login.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.home'))