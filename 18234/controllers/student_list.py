from flask import Blueprint, render_template, request, session, redirect, url_for
import pyodbc

student_list_bp = Blueprint('student_list', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

def get_financial_year():
    import datetime
    today = datetime.datetime.now()
    year = today.year
    month = today.month
    
    if month >= 4:  # April or later
        start_year = year
        end_year = year + 1
    else:  # January-March
        start_year = year - 1
        end_year = year
        
    return f"{start_year}-{end_year}"

@student_list_bp.route('/student-list')
def student_list():
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        financial_year = get_financial_year()
        
        # Get student records
        cursor.execute("""
            SELECT ID, Student_ID, Name, Class, Section, FatherName 
            FROM TblStudent 
            WHERE FinancialYear = ?
            ORDER BY ID DESC
        """, (financial_year,))
        
        students = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            students.append(dict(zip(columns, row)))
            
        return render_template('Admin/Student_List.html', 
                             students=students,
                             record_count=len(students))
        
    except Exception as e:
        return render_template('Admin/Student_List.html', 
                             error=str(e),
                             students=[],
                             record_count=0)
    finally:
        if conn:
            conn.close()

@student_list_bp.route('/student-details/<student_id>')
def student_details(student_id):
    session['Student_ID'] = student_id
    return redirect(url_for('admin.student_details.student_details'))