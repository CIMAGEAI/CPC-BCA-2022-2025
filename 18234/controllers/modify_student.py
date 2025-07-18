from flask import Blueprint, jsonify, render_template, request, session, redirect, url_for, flash
import pyodbc
import os
from werkzeug.utils import secure_filename
from datetime import datetime

modify_student_bp = Blueprint('modify_student', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

def format_date_for_display(date_str):
    if not date_str:
        return ''
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        return date_obj.strftime('%d-%m-%Y')
    except:
        return date_str

def format_date_for_db(date_str):
    if not date_str:
        return None
    try:
        date_obj = datetime.strptime(date_str, '%d-%m-%Y')
        return date_obj.strftime('%Y-%m-%d')
    except:
        return date_str

def save_uploaded_file(file, student_id, field_name):
    if file and file.filename:
        # Get file extension
        _, ext = os.path.splitext(file.filename)
        # Create unique filename with student ID and field name
        filename = f"{student_id}_{field_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"
        filename = secure_filename(filename)
        filepath = os.path.join('static/AdminAssets/Image', filename)
        file.save(filepath)
        return f"AdminAssets/Image/{filename}"
    return None

@modify_student_bp.route('/modify-student', methods=['GET', 'POST'])
def modify_student():
    if 'Student_ID' not in session:
        return redirect(url_for('admin.student_list.student_list'))
    
    student_id = session['Student_ID']
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        if request.method == 'POST':
            # Handle form submission
            return handle_modify_student(cursor, conn, student_id)
        
        # GET request - load student data
        return load_student_data(cursor, student_id)
        
    except Exception as e:
        flash(f'Error: {str(e)}', 'error')
        return redirect(url_for('admin.student_list.student_list'))
    finally:
        if conn:
            conn.close()

def handle_modify_student(cursor, conn, student_id):
    # First get current student data to preserve existing file values
    cursor.execute("SELECT DobCertificate, LeavingCertificate, LastQualCertificate, StudentImage, AdharImage FROM TblStudent WHERE Student_ID=?", student_id)
    current_files = cursor.fetchone()
    
    # Get form data
    form_data = {
        'name': request.form.get('name'),
        'mobile': request.form.get('mobile'),
        'email': request.form.get('email'),
        'blood_group': request.form.get('blood_group'),
        'adhar': request.form.get('adhar'),
        'gender': request.form.get('gender'),
        'nationality': request.form.get('nationality'),
        'religion': request.form.get('religion'),
        'caste': request.form.get('caste'),
        'category': request.form.get('category'),
        'dob': format_date_for_db(request.form.get('dob')),
        'admission_date': format_date_for_db(request.form.get('admission_date')),
        'class': request.form.get('class'),
        'section': request.form.get('section'),
        'roll': request.form.get('roll'),
        't_location': request.form.get('t_location'),
        't_city': request.form.get('t_city'),
        't_pin': request.form.get('t_pin'),
        't_state': request.form.get('t_state'),
        'p_location': request.form.get('p_location'),
        'p_city': request.form.get('p_city'),
        'p_pin': request.form.get('p_pin'),
        'p_state': request.form.get('p_state'),
        'father_name': request.form.get('father_name'),
        'father_mobile': request.form.get('father_mobile'),
        'father_qualification': request.form.get('father_qualification'),
        'father_occupation': request.form.get('father_occupation'),
        'father_annual': request.form.get('father_annual'),
        'mother_name': request.form.get('mother_name'),
        'mother_mobile': request.form.get('mother_mobile'),
        'mother_qualification': request.form.get('mother_qualification'),
        'mother_occupation': request.form.get('mother_occupation'),
        'mother_annual': request.form.get('mother_annual'),
        'guardian': request.form.get('guardian'),
        'relationship': request.form.get('relationship'),
        'guardian_mobile': request.form.get('guardian_mobile'),
        'bus_facility': request.form.get('bus_facility'),
        'bus_number': request.form.get('bus_number'),
        'bus_route': request.form.get('bus_route'),
        'bus_fee': request.form.get('bus_fee')
    }

    # Handle file uploads
    file_data = {
        'dob_certificate': save_uploaded_file(request.files.get('dob_certificate'), student_id, 'dob') or current_files.DobCertificate,
        'leaving_certificate': save_uploaded_file(request.files.get('leaving_certificate'), student_id, 'leaving') or current_files.LeavingCertificate,
        'last_qual_certificate': save_uploaded_file(request.files.get('last_qual_certificate'), student_id, 'qual') or current_files.LastQualCertificate,
        'student_image': save_uploaded_file(request.files.get('student_image'), student_id, 'image') or current_files.StudentImage,
        'adhar_image': save_uploaded_file(request.files.get('adhar_image'), student_id, 'adhar') or current_files.AdharImage
    }

    # Build the update query
    update_query = """
        UPDATE TblStudent SET 
            Name=?, Mobile=?, Email=?, Blood=?, Adhar=?, Gender=?, Nationality=?, 
            Religion=?, Caste=?, Category=?, Dob=?, AdmissionDate=?, Class=?, Section=?, Roll=?, 
            TLocation=?, TCity=?, TPin=?, TState=?, PLocation=?, PCity=?, PPin=?, PState=?, 
            FatherName=?, FatherMobile=?, FatherQualification=?, FatherOccupation=?, FatherAnnual=?, 
            MotherName=?, MotherMobile=?, MotherQualification=?, MotherOccupation=?, MotherAnnual=?, 
            Guardian=?, Relationship=?, GaurdianMobile=?, BusFacility=?, BusNumber=?, BusRoute=?, BusFee=?, 
            DobCertificate=?, LeavingCertificate=?, LastQualCertificate=?, StudentImage=?, AdharImage=?
        WHERE Student_ID=?
    """
    
    params = [
        form_data['name'], form_data['mobile'], form_data['email'], form_data['blood_group'], 
        form_data['adhar'], form_data['gender'], form_data['nationality'], form_data['religion'], 
        form_data['caste'], form_data['category'], form_data['dob'], form_data['admission_date'], 
        form_data['class'], form_data['section'], form_data['roll'], form_data['t_location'], 
        form_data['t_city'], form_data['t_pin'], form_data['t_state'], form_data['p_location'], 
        form_data['p_city'], form_data['p_pin'], form_data['p_state'], form_data['father_name'], 
        form_data['father_mobile'], form_data['father_qualification'], form_data['father_occupation'], 
        form_data['father_annual'], form_data['mother_name'], form_data['mother_mobile'], 
        form_data['mother_qualification'], form_data['mother_occupation'], form_data['mother_annual'], 
        form_data['guardian'], form_data['relationship'], form_data['guardian_mobile'], 
        form_data['bus_facility'], form_data['bus_number'], form_data['bus_route'], form_data['bus_fee'],
        file_data['dob_certificate'], file_data['leaving_certificate'], file_data['last_qual_certificate'], 
        file_data['student_image'], file_data['adhar_image'], student_id
    ]
    
    cursor.execute(update_query, params)
    conn.commit()

    flash('Student details updated successfully!', 'success')
    return redirect(url_for('admin.student_details.student_details'))

def load_student_data(cursor, student_id):
    # Get student data
    cursor.execute("SELECT * FROM TblStudent WHERE Student_ID=?", student_id)
    student = cursor.fetchone()
    
    if not student:
        flash('Student not found', 'error')
        return redirect(url_for('admin.student_list.student_list'))
    
    # Format dates for display
    student.Dob = format_date_for_display(student.Dob)
    student.AdmissionDate = format_date_for_display(student.AdmissionDate)
    
    # Get bus numbers for dropdown
    cursor.execute("SELECT DISTINCT BusNumber FROM TblBusFee")
    bus_numbers = [row[0] for row in cursor.fetchall()]
    
    # Get bus routes for selected bus number (if any)
    bus_routes = []
    if student.BusNumber:
        cursor.execute("SELECT DISTINCT Stopage FROM TblBusFee WHERE BusNumber=?", student.BusNumber)
        bus_routes = [row[0] for row in cursor.fetchall()]
    
    return render_template('Admin/Modify_Student.html',
                         student=student,
                         bus_numbers=bus_numbers,
                         bus_routes=bus_routes,
                         classes=['Nursery', 'L.K.G', 'U.K.G', 'Std 01', 'Std 02', 'Std 03', 
                                 'Std 04', 'Std 05', 'Std 06', 'Std 07', 'Std 08', 'Std 09',
                                 'Std 10', 'Std 11', 'Std 12'],
                         sections=['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
                         genders=['Male', 'Female', 'Other'],
                         nationalities=['Indian', 'Others'],
                         religions=['Hindu', 'Sikh', 'Christan', 'Muslim'],
                         categories=['Bc', 'EWS', 'GEN', 'OBC', 'SC', 'ST'],
                         bus_facilities=['Yes', 'No'])

@modify_student_bp.route('/get-bus-routes/<bus_number>')
def get_bus_routes(bus_number):
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT Stopage FROM TblBusFee WHERE BusNumber=?", bus_number)
        routes = [row[0] for row in cursor.fetchall()]
        return {'routes': routes}
    except Exception as e:
        return {'error': str(e)}, 500
    finally:
        if conn:
            conn.close()

@modify_student_bp.route('/get-bus-fee/<bus_number>/<route>')
def get_bus_fee(bus_number, route):
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT Fee FROM TblBusFee WHERE BusNumber=? AND Stopage=?", (bus_number, route))
        fee = cursor.fetchone()
        return {'fee': fee[0] if fee else ''}
    except Exception as e:
        return {'error': str(e)}, 500
    finally:
        if conn:
            conn.close()
            
@modify_student_bp.route('/get-next-roll/<class_name>/<section>')
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
        
        return jsonify({
            'success': True,
            'next_roll': next_roll,
            'class': class_name,
            'section': section
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to fetch next roll number'
        }), 500
        
    finally:
        if conn:
            conn.close()