from flask import Blueprint, render_template, request, session, redirect, url_for, flash
import pyodbc
from datetime import datetime

create_leaving_certificate_bp = Blueprint('create_leaving_certificate', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

@create_leaving_certificate_bp.route('/create-leaving-certificate', methods=['GET', 'POST'])
def create_leaving_certificate():
    if 'Student_ID' not in session:
        return redirect(url_for('admin.student_list.student_list'))
    
    student_id = session['Student_ID']
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        if request.method == 'POST':
            return handle_form_submission(cursor, conn, student_id)
        
        # GET request - load student data
        cursor.execute("""
            SELECT Student_ID, Name, FatherName, MotherName, Dob, Nationality, 
                   AdmissionDate, AdmittedClass, Class, Roll 
            FROM TblStudent 
            WHERE Student_ID = ?
        """, student_id)
        student = cursor.fetchone()
        
        if not student:
            flash('Student not found', 'error')
            return redirect(url_for('admin.student_list.student_list'))
        
        return render_template('Admin/Create_Leaving_Certificate.html', student=student)
        
    except Exception as e:
        flash(f'Error: {str(e)}', 'error')
        return redirect(url_for('admin.student_list.student_list'))
    finally:
        if conn:
            conn.close()

def handle_form_submission(cursor, conn, student_id):
    # Get form data
    studied_upto = request.form.get('studied_upto', '').strip()
    leaving_date = request.form.get('leaving_date', '').strip()
    reason = request.form.get('reason', '').strip()
    co_activities = request.form.get('co_activities', '').strip()
    behaviour = request.form.get('behaviour', '').strip()
    
    # Validation
    if not all([studied_upto, leaving_date, reason, co_activities, behaviour]):
        flash('All fields are required', 'error')
        return redirect(url_for('admin.create_leaving_certificate.create_leaving_certificate'))
    
    try:
        # Get student data
        cursor.execute("""
            SELECT Student_ID, Name, FatherName, MotherName, Dob, Nationality, 
                   AdmissionDate, AdmittedClass, Class, Roll 
            FROM TblStudent 
            WHERE Student_ID = ?
        """, student_id)
        student = cursor.fetchone()
        
        if not student:
            flash('Student not found', 'error')
            return redirect(url_for('admin.student_list.student_list'))
        
        # Insert leaving certificate
        cursor.execute("""
            INSERT INTO TblLeaving (
                StudentID, Name, FatherName, MotherName, Nationality, Dob,
                AdmissionDate, AdmittedClass, Class, Roll, LeavingDate,
                Reason, Activities, Behaviour, IssueDate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            student.Student_ID, student.Name, student.FatherName, student.MotherName,
            student.Nationality, student.Dob, student.AdmissionDate, student.AdmittedClass,
            studied_upto, student.Roll, leaving_date, reason, co_activities, 
            behaviour, datetime.now().strftime('%d-%m-%Y')
        ))
        
        # Update student status
        cursor.execute("""
            UPDATE TblStudent 
            SET Status = 'Deactive' 
            WHERE Student_ID = ?
        """, student_id)
        
        conn.commit()
        
        session['Student_ID'] = student_id
        flash('Leaving certificate created successfully', 'success')
        return redirect(url_for('admin.view_leaving_certificate.view_leaving_certificate', student_id=student_id))        
        
    except Exception as e:
        conn.rollback()
        flash(f'Error creating leaving certificate: {str(e)}', 'error')
        return redirect(url_for('admin.create_leaving_certificate.create_leaving_certificate'))