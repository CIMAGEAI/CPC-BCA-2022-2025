from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app, jsonify
import pyodbc
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import hashlib
import re

add_student_bp = Blueprint('add_student', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

def get_financial_year():
    now = datetime.now()
    if now.month >= 4:  # April to March is financial year
        return f"{now.year}-{now.year + 1}"
    else:
        return f"{now.year - 1}-{now.year}"

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg', 'png'}

def save_file(file, upload_folder):
    if file and allowed_file(file.filename):
        try:
            os.makedirs(upload_folder, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{timestamp}_{secure_filename(file.filename)}"
            filepath = os.path.join(upload_folder, filename)
            file.save(filepath)
            if os.path.exists(filepath):
                return f"AdminAssets/Image/{filename}"
            return None
        except Exception as e:
            print(f"Error saving file: {str(e)}")
            return None
    return None

def generate_student_password(student_id, student_name):
    return f"{student_id}{student_name[:4].upper()}"

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def check_duplicate_student_login(conn, mobile, email, aadhar, student_id=None):
    try:
        cursor = conn.cursor()
        # Check mobile and email in LoginMaster
        cursor.execute("SELECT COUNT(*) FROM LoginMaster WHERE Mobile=?", mobile)
        mobile_exists = cursor.fetchone()[0] > 0
        
        cursor.execute("SELECT COUNT(*) FROM LoginMaster WHERE Email=?", email)
        email_exists = cursor.fetchone()[0] > 0
        
        # Check aadhar in TblStudent
        cursor.execute("SELECT COUNT(*) FROM TblStudent WHERE Adhar=?", aadhar)
        aadhar_exists = cursor.fetchone()[0] > 0
        
        return {
            'mobile_exists': mobile_exists,
            'email_exists': email_exists,
            'aadhar_exists': aadhar_exists
        }
    except Exception as e:
        print(f"Error checking duplicates: {str(e)}")
        return {'mobile_exists': True, 'email_exists': True, 'aadhar_exists': True}

def format_date(date_str):
    try:
        if date_str:
            # Try parsing as YYYY-MM-DD first
            try:
                date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                return date_obj.strftime('%d-%m-%Y')
            except ValueError:
                # If already in DD-MM-YYYY format, return as-is
                datetime.strptime(date_str, '%d-%m-%Y')
                return date_str
        return None
    except ValueError:
        return None

@add_student_bp.route('/add-student', methods=['GET', 'POST'])
def add_student():
    conn = None
    form_data = {
        'Student_ID': '', 'name': '', 'mobile': '', 'email': '', 'bgroup': '', 'adhar': '',
        'gender': '', 'nationality': '', 'religion': '', 'caste': '', 'category': '',
        'dob': '', 'adate': '', 'class': '', 'section': '', 'roll': '',
        'tlocation': '', 'tcity': '', 'tpin': '', 'tstate': '',
        'plocation': '', 'pcity': '', 'ppin': '', 'pstate': '',
        'fathername': '', 'fathermobile': '', 'fatherquali': '', 'fatheroccupation': '', 'fatherannual': '',
        'mothername': '', 'mothermobile': '', 'motherquali': '', 'motheroccupation': '', 'motherannual': '',
        'localgaurdaian': '', 'relationship': '', 'guardianmobile': '',
        'busfacility': '', 'busnumber': '', 'busroute': '', 'busfee': ''
    }
    
    # Dropdown options
    genders = ['Male', 'Female', 'Other']
    nationalities = ['Indian', 'Others']
    religions = ['Hindu', 'Sikh', 'Christan', 'Muslim']
    categories = ['BC', 'EWS', 'GEN', 'OBC', 'SC', 'ST']
    classes = ['Nursery', 'L.K.G', 'U.K.G'] + [f'Std {i:02d}' for i in range(1, 13)]
    sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    bus_facilities = ['Yes', 'No']  # Changed to remove empty option
    bus_numbers = []
    bus_routes = []
    student_id = ""
    financial_year = get_financial_year()
    error_field = None

    try:
        conn = db_connection()
        cursor = conn.cursor()
        
            # Fetch school name
        cursor.execute("SELECT TOP 1 Name FROM TblSchool")
        school_row = cursor.fetchone()
        school_name = school_row[0] if school_row else "SCH"

        # Remove all non-alphabetic characters and take first 3 letters
        school_prefix = re.sub(r'[^A-Za-z]', '', school_name)[:3].upper()

        # Get max ID from TblStudent
        cursor.execute("SELECT MAX(ID) FROM TblStudent")
        max_id = cursor.fetchone()[0] or 0

        # Generate Student ID
        student_id = f"{school_prefix}{max_id + 1:03d}"

        # Get bus numbers
        cursor.execute("SELECT DISTINCT BusNumber FROM TblBusFee")
        bus_numbers = [row[0] for row in cursor.fetchall()]

        if request.method == 'POST':
            # Update form data with submitted values
            form_data.update({k: v.strip() if v else '' for k, v in request.form.items() if k in form_data})
            
            # Handle file uploads
            files = {
                'student_image': request.files.get('student_image'),
                'dob_cert': request.files.get('dob_cert'),
                'leaving_cert': request.files.get('leaving_cert'),
                'qual_cert': request.files.get('qual_cert'),
                'adhar_image': request.files.get('adhar_image')
            }
            
            # Validate form
            errors = []
            required_fields = [
                'name', 'mobile', 'email', 'bgroup', 'adhar',
                'gender', 'nationality', 'religion', 'caste', 'category',
                'dob', 'adate', 'class', 'section', 'roll',
                'plocation', 'pcity', 'ppin', 'pstate',
                'fathername', 'mothername', 'busfacility'
            ]
            
            # Check required fields
            for field in required_fields:
                if not form_data[field]:
                    errors.append(f"{field.replace('_', ' ').title()} is required")
                    if not error_field:
                        error_field = field
            
            # Bus facility validation
            if form_data['busfacility'] == 'Yes':
                if not form_data['busnumber']:
                    errors.append('Bus number is required when bus facility is selected')
                    if not error_field:
                        error_field = 'busnumber'
                if not form_data['busroute']:
                    errors.append('Bus route is required when bus facility is selected')
                    if not error_field:
                        error_field = 'busroute'
                if not form_data['busfee'] or not form_data['busfee'].isdigit():
                    errors.append('Valid bus fee is required')
                    if not error_field:
                        error_field = 'busfee'
            
            # Field validations
            field_validations = [
                ('mobile', r'^\d{10}$', 'Mobile must be 10 digits'),
                ('adhar', r'^\d{12}$', 'Aadhar must be 12 digits'),
                ('tpin', r'^(\d{6})?$', 'Temporary PIN must be 6 digits or empty'),
                ('ppin', r'^\d{6}$', 'Permanent PIN must be 6 digits'),
                ('fathermobile', r'^(\d{10})?$', 'Father mobile must be 10 digits or empty'),
                ('mothermobile', r'^(\d{10})?$', 'Mother mobile must be 10 digits or empty'),
                ('guardianmobile', r'^(\d{10})?$', 'Guardian mobile must be 10 digits or empty')
            ]
            
            for field, pattern, message in field_validations:
                if form_data[field] and not re.match(pattern, form_data[field]):
                    errors.append(message)
                    if not error_field:
                        error_field = field
            
            # Date validations
            for date_field in ['dob', 'adate']:
                try:
                    if form_data[date_field]:
                        # Try parsing the date to ensure it's valid
                        datetime.strptime(form_data[date_field], '%Y-%m-%d')
                except ValueError:
                    try:
                        # Try DD-MM-YYYY format
                        datetime.strptime(form_data[date_field], '%d-%m-%Y')
                    except ValueError:
                        errors.append(f"Invalid {date_field.replace('_', ' ')} format (use DD-MM-YYYY)")
                        if not error_field:
                            error_field = date_field
            
            # File validations
            for file_field, file_obj in files.items():
                if file_field in ['student_image', 'dob_cert', 'adhar_image']:
                    if not file_obj or not allowed_file(file_obj.filename):
                        errors.append(f"Valid {file_field.replace('_', ' ')} (JPG/JPEG/PNG) is required")
                        if not error_field:
                            error_field = file_field
            
            # Check for duplicates
            duplicates = check_duplicate_student_login(
                conn, form_data['mobile'], form_data['email'], form_data['adhar'])
            
            if duplicates['mobile_exists']:
                errors.append('Mobile number already exists')
                if not error_field:
                    error_field = 'mobile'
            if duplicates['email_exists']:
                errors.append('Email already exists')
                if not error_field:
                    error_field = 'email'
            if duplicates['aadhar_exists']:
                errors.append('Aadhar number already exists')
                if not error_field:
                    error_field = 'adhar'
            
            if not errors:
                # Save files
                upload_folder = os.path.join(current_app.root_path, 'static', 'AdminAssets', 'Image')
                file_paths = {
                    'student_img_name': save_file(files['student_image'], upload_folder),
                    'dob_cert_name': save_file(files['dob_cert'], upload_folder),
                    'leaving_cert_name': save_file(files['leaving_cert'], upload_folder) if files['leaving_cert'] else None,
                    'qual_cert_name': save_file(files['qual_cert'], upload_folder) if files['qual_cert'] else None,
                    'adhar_img_name': save_file(files['adhar_image'], upload_folder)
                }
                
                # Format dates to DD-MM-YYYY
                formatted_dob = format_date(form_data['dob'])
                formatted_adate = format_date(form_data['adate'])
                
                # Insert student record
                cursor.execute("""
                    INSERT INTO TblStudent (
                        Student_ID, Name, Mobile, Email, Blood, Adhar, Gender, Nationality, Religion, 
                        Caste, Category, Dob, AdmissionDate, Class, Section, Roll, 
                        TLocation, TCity, TPin, TState, PLocation, PCity, PPin, PState, 
                        FatherName, FatherMobile, FatherQualification, FatherOccupation, FatherAnnual,
                        MotherName, MotherMobile, MotherQualification, MotherOccupation, MotherAnnual,
                        DobCertificate, LeavingCertificate, LastQualCertificate, StudentImage, AdharImage,
                        BusFacility, BusNumber, BusRoute, BusFee, Guardian, Relationship, GaurdianMobile,
                        FinancialYear, AdmittedClass, Status, Date
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    student_id, form_data['name'], form_data['mobile'], form_data['email'], form_data['bgroup'], form_data['adhar'],
                    form_data['gender'], form_data['nationality'], form_data['religion'], form_data['caste'], form_data['category'],
                    formatted_dob, formatted_adate, form_data['class'], form_data['section'], form_data['roll'],
                    form_data['tlocation'], form_data['tcity'], form_data['tpin'], form_data['tstate'],
                    form_data['plocation'], form_data['pcity'], form_data['ppin'], form_data['pstate'],
                    form_data['fathername'], form_data['fathermobile'], form_data['fatherquali'], form_data['fatheroccupation'], form_data['fatherannual'],
                    form_data['mothername'], form_data['mothermobile'], form_data['motherquali'], form_data['motheroccupation'], form_data['motherannual'],
                    file_paths['dob_cert_name'], file_paths['leaving_cert_name'], file_paths['qual_cert_name'], 
                    file_paths['student_img_name'], file_paths['adhar_img_name'],
                    form_data['busfacility'], form_data['busnumber'], form_data['busroute'], form_data['busfee'],
                    form_data['localgaurdaian'], form_data['relationship'], form_data['guardianmobile'],
                    financial_year, form_data['class'], 'Active', datetime.now().strftime('%d-%m-%Y')
                ))
                
                # Create login credentials
                password = generate_student_password(student_id, form_data['name'])
                cursor.execute("""
                    INSERT INTO LoginMaster (Name, Mobile, Email, UserName, Password, Role)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (
                    form_data['name'], form_data['mobile'], form_data['email'],
                    student_id, hash_password(password), 'Student'
                ))
                
                conn.commit()
                session['student_id'] = student_id
                flash('Student added successfully!', 'success')
                return redirect(url_for('admin.generate_annual_fee.generate_annual_fee'))
            
            # Show validation errors
            for error in errors:
                flash(error, 'error')
            
            # Update bus routes if needed
            if form_data['busfacility'] == 'Yes' and form_data['busnumber']:
                cursor.execute("SELECT DISTINCT Stopage FROM TblBusFee WHERE BusNumber=?", form_data['busnumber'])
                bus_routes = [row[0] for row in cursor.fetchall()]

    except Exception as e:
        flash(f'Database error: {str(e)}', 'error')
        print(f"Error: {str(e)}")
    finally:
        if conn:
            conn.close()
    
    return render_template('Admin/Add_Student.html',
        form_data=form_data,
        student_id=student_id,
        financial_year=financial_year,
        genders=genders,
        nationalities=nationalities,
        religions=religions,
        categories=categories,
        classes=classes,
        sections=sections,
        bus_facilities=bus_facilities,
        bus_numbers=bus_numbers,
        bus_routes=bus_routes,
        error_field=error_field
    )

# AJAX endpoints
@add_student_bp.route('/get-bus-routes/<bus_number>')
def get_bus_routes(bus_number):
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT Stopage FROM TblBusFee WHERE BusNumber=?", bus_number)
        routes = [row[0] for row in cursor.fetchall()]
        return jsonify({'routes': routes})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@add_student_bp.route('/get-bus-fee/<bus_number>/<route>')
def get_bus_fee(bus_number, route):
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT Fee FROM TblBusFee WHERE BusNumber=? AND Stopage=?", (bus_number, route))
        fee = cursor.fetchone()
        return jsonify({'fee': fee[0] if fee else 0})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@add_student_bp.route('/get-next-roll/<class_name>/<section>')
def get_next_roll(class_name, section):
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        # Get the maximum roll number for the class and section
        cursor.execute("""
            SELECT MAX(CAST(Roll AS INT)) 
            FROM TblStudent 
            WHERE Class=? AND Section=?
        """, (class_name, section))
        max_roll = cursor.fetchone()[0]
        
        # If no students found, start from 1, otherwise increment by 1
        next_roll = 1 if max_roll is None else max_roll + 1
        return jsonify({'next_roll': next_roll})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()