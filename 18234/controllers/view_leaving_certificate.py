from flask import Blueprint, flash, redirect, render_template, request, url_for
import pyodbc

view_leaving_certificate_bp = Blueprint('view_leaving_certificate', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

@view_leaving_certificate_bp.route('/leaving-certificate')
def view_leaving_certificate():
    try:
        # Get student_id from query parameters
        student_id = request.args.get('student_id')
        if not student_id:
            return "Student ID is required", 400
            
        conn = db_connection()
        cursor = conn.cursor()
        
        # Get leaving certificate for specific student
        cursor.execute("SELECT TOP 1 * FROM TblLeaving WHERE StudentID = ? ORDER BY ID DESC", (student_id,))
        certificate = cursor.fetchone()
        
        # Get school information
        cursor.execute("SELECT TOP 1 * FROM TblSchool")
        school = cursor.fetchone()
        
        if not certificate:
            return "Certificate not found for this student", 404
        if not school:
            return "School information not found", 404
            
        # Convert to dictionary for template
        certificate_data = {
            'Name': certificate.Name,
            'StudentID': certificate.StudentID,
            'FatherName': certificate.FatherName,
            'MotherName': certificate.MotherName,
            'Dob': certificate.Dob,
            'Nationality': certificate.Nationality,
            'AdmissionDate': certificate.AdmissionDate,
            'AdmittedClass': certificate.AdmittedClass,
            'LeavingDate': certificate.LeavingDate,
            'Class': certificate.Class,
            'Activities': certificate.Activities,
            'Behaviour': certificate.Behaviour,
            'Reason': certificate.Reason,
            'IssueDate': certificate.IssueDate
        }
        
        school_data = {
            'Name': school.Name,
            'Address': school.Address,
            'Mobile': school.Mobile
        }
        
        return render_template(
            'Admin/Leaving_Certificate.html',
            certificate=certificate_data,
            school=school_data
        )
        
    except Exception as e:
        return f"Error: {str(e)}", 500
    finally:
        if 'conn' in locals():
            conn.close()

@view_leaving_certificate_bp.route('/delete-leaving-certificate', methods=['POST'])
def delete_leaving_certificate():
    try:
        student_id = request.args.get('student_id')
        if not student_id:
         flash('Student ID is required', 'danger')
         return redirect(url_for('admin.student_list.student_list'))
            
        conn = db_connection()
        cursor = conn.cursor()
        
        # Delete the certificate
        cursor.execute("DELETE FROM TblLeaving WHERE StudentID = ?", (student_id,))
        conn.commit()
        
        flash('Leaving certificate deleted successfully', 'success')
        return redirect(url_for('admin.student_details.student_details', student_id=student_id))
        
    except Exception as e:
        flash(f'Error deleting certificate: {str(e)}', 'danger')
        return redirect(url_for('admin.student_details.student_details', student_id=student_id))
    finally:
        if 'conn' in locals():
            conn.close()