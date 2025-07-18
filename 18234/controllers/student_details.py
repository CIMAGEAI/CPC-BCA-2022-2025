from flask import Blueprint, flash, render_template, request, session, redirect, url_for
import pyodbc
from datetime import datetime

student_details_bp = Blueprint('student_details', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

def get_financial_year():
    today = datetime.now()
    year = today.year
    month = today.month

    if month >= 4:
        start_year = year
        end_year = year + 1
    else:
        start_year = year - 1
        end_year = year

    return f"{start_year}-{end_year}"

@student_details_bp.route('/student-details')
def student_details():
    conn = None
    try:
        student_id = session.get('Student_ID')
        financial_year = session.get('FinancialYear')

        if not student_id:
            flash("Student ID not found in session.", "error")
            return redirect(url_for('admin.student_list.student_list'))

        conn = db_connection()
        cursor = conn.cursor()

        # Get school details
        cursor.execute("SELECT * FROM TblSchool")
        school_details = cursor.fetchone()

        # Get student details
        if financial_year:
            cursor.execute("""
                SELECT * FROM TblStudent 
                WHERE Student_ID = ? AND FinancialYear = ?
            """, (student_id, financial_year))
        else:
            cursor.execute("""
                SELECT * FROM TblStudent 
                WHERE Student_ID = ?
            """, (student_id,))
        
        student = cursor.fetchone()

        if not student:
            flash("Student not found.", "error")
            return redirect(url_for('admin.student_list.student_list'))

        # Check if leaving certificate exists
        cursor.execute("""
            SELECT COUNT(*) FROM TblLeaving
            WHERE StudentID = ?
        """, (student_id,))
        has_leaving_certificate = cursor.fetchone()[0] > 0

        return render_template('Admin/Student_Details.html',
                               school=school_details,
                               student=student,
                               has_leaving_certificate=has_leaving_certificate)

    except Exception as e:
        flash(f"Error: {str(e)}", "error")
        return render_template('Admin/Student_Details.html',
                               error=str(e),
                               school=None,
                               student=None,
                               has_leaving_certificate=False)
    finally:
        if conn:
            conn.close()

@student_details_bp.route('/set-student-session', methods=['POST'])
def set_student_session_and_redirect():
    student_id = request.form.get('student_id')
    action = request.form.get('action')

    if student_id:
        session['Student_ID'] = student_id

    # Redirect based on action
    if action == 'leaving_certificate':
        return redirect(url_for('admin.view_leaving_certificate.view_leaving_certificate'))
    elif action == 'preview_id_card':
        return redirect(url_for('admin.preview_id_card.preview_id_card'))
    elif action == 'modify_student':
        return redirect(url_for('admin.modify_student.modify_student'))
    else:
        return redirect(url_for('admin.student_details.student_details'))