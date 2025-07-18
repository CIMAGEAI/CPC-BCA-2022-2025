# controller/admin.py
from datetime import datetime
from flask import Blueprint, render_template, session, redirect, url_for
import pyodbc

from .create_school import create_school_bp
from .add_department import add_department_bp
from .add_designation import add_designation_bp
from .add_subject import add_subject_bp
from .add_employee import add_employee_bp
from .create_fee_name import create_fee_name_bp
from .create_fee import create_fee_bp
from .add_student import add_student_bp
from .generate_annual_fee import generate_annual_fee_bp
from .annual_fee_receipt import annual_fee_receipt_bp
from .student_list import student_list_bp
from .student_details import student_details_bp
from .modify_student import modify_student_bp
from .create_leaving_certificate import create_leaving_certificate_bp
from .view_leaving_certificate import view_leaving_certificate_bp
from .modify_leaving_certificate import modify_leaving_certificate_bp
from .preview_id_card import preview_id_card_bp
from .modify_id_card import modify_id_card_bp
from .generate_monthly_fee import generate_monthly_fee_bp
from .monthly_fee_receipt import monthly_fee_receipt_bp
from .add_bus import add_bus_bp

admin_bp = Blueprint('admin', __name__)

# Register the create_school blueprint
admin_bp.register_blueprint(create_school_bp)
admin_bp.register_blueprint(add_department_bp)
admin_bp.register_blueprint(add_designation_bp)
admin_bp.register_blueprint(add_subject_bp)
admin_bp.register_blueprint(add_employee_bp)
admin_bp.register_blueprint(create_fee_name_bp)
admin_bp.register_blueprint(create_fee_bp)
admin_bp.register_blueprint(add_student_bp)
admin_bp.register_blueprint(generate_annual_fee_bp)
admin_bp.register_blueprint(annual_fee_receipt_bp)
admin_bp.register_blueprint(student_list_bp)
admin_bp.register_blueprint(student_details_bp)
admin_bp.register_blueprint(modify_student_bp)
admin_bp.register_blueprint(create_leaving_certificate_bp)
admin_bp.register_blueprint(view_leaving_certificate_bp)
admin_bp.register_blueprint(modify_leaving_certificate_bp)
admin_bp.register_blueprint(preview_id_card_bp)
admin_bp.register_blueprint(modify_id_card_bp)
admin_bp.register_blueprint(generate_monthly_fee_bp)
admin_bp.register_blueprint(monthly_fee_receipt_bp)
admin_bp.register_blueprint(add_bus_bp)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )
@admin_bp.before_request
def check_admin():
    if 'role' not in session or session['role'] != 'Admin':
        return redirect(url_for('auth.login'))

@admin_bp.route('/dashboard')
def dashboard():
    conn = db_connection()
    cursor = conn.cursor()
    
    try:
        # Determine current financial year
        current_date = datetime.now()
        system_year = current_date.year
        financial_year = f"{system_year}-{system_year + 1}" if current_date.month >= 4 else f"{system_year - 1}-{system_year}"

        # Total active students in current financial year
        cursor.execute("""
            SELECT COUNT(*) FROM TblStudent 
            WHERE Status='Active' AND FinancialYear=?
        """, (financial_year,))
        student_count = cursor.fetchone()[0]

        # Total employees
        cursor.execute("SELECT COUNT(*) FROM TblEmployee")
        employee_count = cursor.fetchone()[0]

        # Total fee names
        cursor.execute("SELECT COUNT(*) FROM TblFeeName")
        fee_name_count = cursor.fetchone()[0]

        # Total departments
        cursor.execute("SELECT COUNT(*) FROM TblDepartment")
        department_count = cursor.fetchone()[0]

        # Total income
        cursor.execute("""
            SELECT ISNULL(SUM(CAST(PaidAmount AS DECIMAL(18, 2))), 0)
            FROM (
                SELECT *, ROW_NUMBER() OVER (PARTITION BY InvoiceNo ORDER BY Date DESC) AS RowNum
                FROM TblBill
            ) AS RankedRows
            WHERE RowNum = 1
        """)
        total_income = float(cursor.fetchone()[0])

        # Today's income
        today = current_date.strftime('%d-%m-%Y')
        cursor.execute("""
            SELECT ISNULL(SUM(CAST(PaidAmount AS DECIMAL(18, 2))), 0)
            FROM (
                SELECT *, ROW_NUMBER() OVER (PARTITION BY InvoiceNo ORDER BY Date DESC) AS RowNum
                FROM TblBill
            ) AS RankedRows
            WHERE RowNum = 1 AND Date=?
        """, (today,))
        today_income = float(cursor.fetchone()[0])

        # Recent students (TOP 10)
        cursor.execute("""
            SELECT TOP 10 Student_ID, Name, Class, Section, FatherName 
            FROM TblStudent 
            WHERE FinancialYear=? 
            ORDER BY ID DESC
        """, (financial_year,))
        recent_students = cursor.fetchall()  # each row will have attribute access

    finally:
        cursor.close()
        conn.close()

    return render_template('Admin/dashboard.html',
        financial_year=financial_year,
        student_count=student_count,
        employee_count=employee_count,
        fee_name_count=fee_name_count,
        department_count=department_count,
        total_income=total_income,
        today_income=today_income,
        recent_students=recent_students
    )