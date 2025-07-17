from flask import Blueprint, render_template, request, session, redirect, url_for, flash
import pyodbc
from datetime import datetime

modify_leaving_certificate_bp = Blueprint('modify_leaving_certificate', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

@modify_leaving_certificate_bp.route('/modify-leaving-certificate', methods=['GET', 'POST'])
def modify_leaving_certificate():
    if 'Student_ID' not in session:
        flash('Your session has expired. Please visit again.', 'error')
        return redirect(url_for('admin.student_list.student_list'))
    
    student_id = session['Student_ID']
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        if request.method == 'POST':
            # Get form data
            studied_upto = request.form.get('studied_upto', '').strip()
            leaving_date = request.form.get('leaving_date', '').strip()
            reason = request.form.get('reason', '').strip()
            co_activities = request.form.get('co_activities', '').strip()
            behaviour = request.form.get('behaviour', '').strip()
            
            # Validation
            if not all([studied_upto, leaving_date, reason, co_activities, behaviour]):
                flash('All fields are required', 'error')
                return redirect(url_for('admin.modify_leaving_certificate.modify_leaving_certificate'))
            
            # Update leaving certificate
            cursor.execute("""
                UPDATE TblLeaving 
                SET Class = ?, LeavingDate = ?, Reason = ?, 
                    Activities = ?, Behaviour = ?
                WHERE StudentID = ?
            """, (
                studied_upto, leaving_date, reason, 
                co_activities, behaviour, student_id
            ))
            
            conn.commit()
            
            flash('Leaving certificate updated successfully', 'success')
            return redirect(url_for('admin.view_leaving_certificate.view_leaving_certificate', student_id=student_id))        
        # GET request - load certificate data
        cursor.execute("""
            SELECT StudentID, Name, FatherName, MotherName, Dob, Nationality, 
                   AdmissionDate, AdmittedClass, Class, Roll, LeavingDate,
                   Reason, Activities, Behaviour 
            FROM TblLeaving 
            WHERE StudentID = ?
        """, student_id)
        certificate = cursor.fetchone()
        
        if not certificate:
            flash('Certificate not found', 'error')
            return redirect(url_for('admin.view_leaving_certificate.view_leaving_certificate'))
        
        return render_template('Admin/Modify_Leaving_Certificate.html', certificate=certificate)
        
    except Exception as e:
        flash(f'Error: {str(e)}', 'error')
        return redirect(url_for('admin.view_leaving_certificate.view_leaving_certificate'))
    finally:
        if conn:
            conn.close()