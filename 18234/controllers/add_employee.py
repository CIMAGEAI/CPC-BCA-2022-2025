from flask import Blueprint, render_template, request, redirect, url_for, flash
import pyodbc
from datetime import datetime
import random
import string
import hashlib

add_employee_bp = Blueprint('add_employee', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

def generate_employee_id(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT TOP 1 Name FROM TblSchool")
        school_row = cursor.fetchone()
        school_abbreviation = "EMP"
        
        if school_row:
            school_name = school_row[0]
            school_abbreviation = school_name.replace(".", "")[:3].upper() + "EMP"
        
        cursor.execute("SELECT MAX(Id) FROM TblEmployee")
        max_id = cursor.fetchone()[0] or 0
        next_id = max_id + 1
        
        return f"{school_abbreviation}{next_id:03d}"
    except Exception as e:
        print(f"Error generating employee ID: {str(e)}")
        return f"EMP{random.randint(100, 999)}"

def generate_employee_password(emp_id, name):
    return f"{emp_id}{name[:4].upper()}"

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def check_duplicate_mobile(conn, mobile, emp_id=None):
    try:
        cursor = conn.cursor()
        # Check in both TblEmployee and LoginMaster
        query = """
            SELECT COUNT(*) FROM (
                SELECT Mobile FROM TblEmployee WHERE Mobile=?
                UNION ALL
                SELECT Mobile FROM LoginMaster WHERE Mobile=?
            ) AS combined
        """
        params = [mobile, mobile]
        
        if emp_id:
            query = """
                SELECT COUNT(*) FROM (
                    SELECT Mobile FROM TblEmployee WHERE Mobile=? AND Emp_Id!=?
                    UNION ALL
                    SELECT Mobile FROM LoginMaster WHERE Mobile=? AND UserName!=?
                ) AS combined
            """
            params = [mobile, emp_id, mobile, emp_id]
        
        cursor.execute(query, params)
        return cursor.fetchone()[0] > 0
    except Exception as e:
        print(f"Error checking duplicate mobile: {str(e)}")
        return True

def check_duplicate_email(conn, email, emp_id=None):
    try:
        cursor = conn.cursor()
        # Check in both TblEmployee and LoginMaster
        query = """
            SELECT COUNT(*) FROM (
                SELECT Email FROM TblEmployee WHERE Email=?
                UNION ALL
                SELECT Email FROM LoginMaster WHERE Email=?
            ) AS combined
        """
        params = [email, email]
        
        if emp_id:
            query = """
                SELECT COUNT(*) FROM (
                    SELECT Email FROM TblEmployee WHERE Email=? AND Emp_Id!=?
                    UNION ALL
                    SELECT Email FROM LoginMaster WHERE Email=? AND UserName!=?
                ) AS combined
            """
            params = [email, emp_id, email, emp_id]
        
        cursor.execute(query, params)
        return cursor.fetchone()[0] > 0
    except Exception as e:
        print(f"Error checking duplicate email: {str(e)}")
        return True

def format_html_date_to_db(date_str):
    """Convert HTML date (YYYY-MM-DD) to database format (YYYY-MM-DD)"""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").strftime("%Y-%m-%d")
    except:
        return None

def format_db_date_to_display(date_str):
    """Convert database date to DD-MM-YYYY for display"""
    if not date_str:
        return ""
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").strftime("%d-%m-%Y")
    except:
        return date_str

def format_db_date_to_html(date_str):
    """Convert database date to HTML date input format (YYYY-MM-DD)"""
    if not date_str:
        return ""
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").strftime("%Y-%m-%d")
    except:
        return ""

@add_employee_bp.route('/add-employee', methods=['GET', 'POST'])
def add_employee():
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        # Fetch static data
        cursor.execute("SELECT Name FROM TblDepartment ORDER BY Name")
        departments = [row[0] for row in cursor.fetchall()]
        
        cursor.execute("SELECT Subject FROM TblSubject ORDER BY Subject")
        subjects = [row[0] for row in cursor.fetchall()]
        
        # Initialize variables
        employees = []
        emp_id = generate_employee_id(conn)
        form_data = {}
        
        if request.method == 'POST':
            # Get form data
            form_data = {
                'name': request.form.get('name', '').strip(),
                'father_name': request.form.get('father_name', '').strip(),
                'mobile': request.form.get('mobile', '').strip(),
                'email': request.form.get('email', '').strip(),
                'salary': request.form.get('salary', '0').strip(),
                'doj': format_html_date_to_db(request.form.get('doj', '')),
                'department': request.form.get('department', ''),
                'designation': request.form.get('designation', ''),
                'subject': request.form.get('subject', '')
            }
            
            # Validate required fields
            validation_errors = []
            
            if not all([form_data['name'], form_data['father_name'], form_data['mobile'], 
                       form_data['email'], form_data['salary'], form_data['doj'], 
                       form_data['department'], form_data['designation']]):
                validation_errors.append('All required fields must be filled')
            
            if len(form_data['mobile']) != 10 or not form_data['mobile'].isdigit():
                validation_errors.append('Please enter a valid 10-digit mobile number')
            
            if '@' not in form_data['email'] or '.' not in form_data['email']:
                validation_errors.append('Please enter a valid email address')
            
            if check_duplicate_mobile(conn, form_data['mobile']):
                validation_errors.append('Mobile number already exists')
            
            if check_duplicate_email(conn, form_data['email']):
                validation_errors.append('Email address already exists')
            
            if form_data['designation'].lower() == 'teacher' and not form_data['subject']:
                validation_errors.append('Subject is required for teachers')
            
            if validation_errors:
                for error in validation_errors:
                    flash(error, 'error')
            else:
                try:
                    # Generate employee data
                    password = generate_employee_password(emp_id, form_data['name'])
                    hashed_password = hash_password(password)
                    current_date = datetime.now().strftime('%Y-%m-%d')
                    
                    # Insert employee
                    cursor.execute("""
                        INSERT INTO TblEmployee 
                        (Emp_Id, Name, FatherName, Mobile, Email, Department, 
                         Designation, Subject, Salary, DateOfJoining, Date)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        emp_id, form_data['name'], form_data['father_name'], 
                        form_data['mobile'], form_data['email'], form_data['department'],
                        form_data['designation'], 
                        form_data['subject'] if form_data['designation'].lower() == 'teacher' else None,
                        float(form_data['salary']), form_data['doj'], current_date
                    ))
                    
                    # Create login credentials
                    cursor.execute("""
                        INSERT INTO LoginMaster 
                        (Name, Mobile, Email, UserName, Password, Role)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (
                        form_data['name'], form_data['mobile'], form_data['email'],
                        emp_id, hashed_password, form_data['designation']
                    ))
                    
                    conn.commit()
                    flash(f'Employee added successfully! Password: {password}', 'success')
                    return redirect(url_for('admin.add_employee.add_employee'))
                    
                except Exception as e:
                    conn.rollback()
                    flash(f'Error saving employee: {str(e)}', 'error')
        
        # Fetch employees for display
        cursor.execute("""
            SELECT 
                ID as id, 
                Emp_Id as emp_id, 
                Name as name, 
                FatherName as father_name, 
                Mobile as mobile, 
                Email as email, 
                Department as department, 
                Designation as designation, 
                Subject as subject, 
                Salary as salary, 
                DateOfJoining as dateofjoining_db,
                Resignation as resignation_db
            FROM TblEmployee 
            ORDER BY ID DESC
        """)
        
        employees = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            emp = dict(zip(columns, row))
            emp['dateofjoining'] = format_db_date_to_display(emp['dateofjoining_db'])
            emp['resignation'] = format_db_date_to_display(emp['resignation_db'])
            emp['dateofjoining_html'] = format_db_date_to_html(emp['dateofjoining_db'])
            emp['resignation_html'] = format_db_date_to_html(emp['resignation_db'])
            employees.append(emp)
        
    except Exception as e:
        flash(f'Database error: {str(e)}', 'error')
    finally:
        if conn:
            conn.close()
    
    return render_template('Admin/Add_Employee.html', 
                         departments=departments,
                         subjects=subjects,
                         employees=employees,
                         emp_id=emp_id,
                         form_data=form_data,
                         get_designations=get_designations)

@add_employee_bp.route('/get-designations/<department>')
def get_designations(department):
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT DesignationName 
            FROM TblDesignation 
            WHERE DepartmentName=?
            GROUP BY DesignationName
            ORDER BY DesignationName
        """, department)
        designations = [row[0] for row in cursor.fetchall()]
        return {'designations': designations}
    except Exception as e:
        return {'error': str(e)}
    finally:
        if conn:
            conn.close()

@add_employee_bp.route('/delete-employee/<int:employee_id>', methods=['POST'])
def delete_employee(employee_id):
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT Emp_Id FROM TblEmployee WHERE ID=?", employee_id)
        emp_id = cursor.fetchone()
        
        if not emp_id:
            flash('Employee not found', 'error')
            return redirect(url_for('admin.add_employee.add_employee'))
        
        emp_id = emp_id[0]
        
        cursor.execute("DELETE FROM TblEmployee WHERE ID=?", employee_id)
        cursor.execute("DELETE FROM LoginMaster WHERE UserName=?", emp_id)
        
        conn.commit()
        flash('Employee deleted successfully', 'success')
    except Exception as e:
        if conn:
            conn.rollback()
        flash(f'Error deleting employee: {str(e)}', 'error')
    finally:
        if conn:
            conn.close()
    
    return redirect(url_for('admin.add_employee.add_employee'))

@add_employee_bp.route('/update-employee/<int:employee_id>', methods=['POST'])
def update_employee(employee_id):
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT Emp_Id FROM TblEmployee WHERE ID=?", employee_id)
        current_emp_id = cursor.fetchone()[0]
        
        form_data = {
            'emp_id': request.form.get('emp_id', '').strip(),
            'name': request.form.get('name', '').strip(),
            'father_name': request.form.get('father_name', '').strip(),
            'mobile': request.form.get('mobile', '').strip(),
            'email': request.form.get('email', '').strip(),
            'salary': request.form.get('salary', '0').strip(),
            'doj': format_html_date_to_db(request.form.get('doj', '')),
            'department': request.form.get('department', ''),
            'designation': request.form.get('designation', ''),
            'subject': request.form.get('subject', ''),
            'resignation': format_html_date_to_db(request.form.get('resignation', ''))
        }
        
        # Validate data
        validation_errors = []
        
        if not all([form_data['name'], form_data['father_name'], form_data['mobile'],
                   form_data['email'], form_data['salary'], form_data['doj'],
                   form_data['department'], form_data['designation']]):
            validation_errors.append('All required fields must be filled')
        
        if len(form_data['mobile']) != 10 or not form_data['mobile'].isdigit():
            validation_errors.append('Please enter a valid 10-digit mobile number')
        
        if '@' not in form_data['email'] or '.' not in form_data['email']:
            validation_errors.append('Please enter a valid email address')
        
        if check_duplicate_mobile(conn, form_data['mobile'], form_data['emp_id']):
            validation_errors.append('Mobile number already exists')
        
        if check_duplicate_email(conn, form_data['email'], form_data['emp_id']):
            validation_errors.append('Email address already exists')
        
        if form_data['designation'].lower() == 'teacher' and not form_data['subject']:
            validation_errors.append('Subject is required for teachers')
        
        if validation_errors:
            for error in validation_errors:
                flash(error, 'error')
        else:
            try:
                cursor.execute("""
                    UPDATE TblEmployee SET
                    Emp_Id=?, Name=?, FatherName=?, Mobile=?, Email=?,
                    Department=?, Designation=?, Subject=?, Salary=?,
                    DateOfJoining=?, Resignation=?
                    WHERE ID=?
                """, (
                    form_data['emp_id'], form_data['name'], form_data['father_name'],
                    form_data['mobile'], form_data['email'], form_data['department'],
                    form_data['designation'], 
                    form_data['subject'] if form_data['designation'].lower() == 'teacher' else None,
                    float(form_data['salary']), form_data['doj'],
                    form_data['resignation'] if form_data['resignation'] else None,
                    employee_id
                ))
                
                cursor.execute("""
                    UPDATE LoginMaster SET
                    Name=?, Mobile=?, Email=?, Role=?
                    WHERE UserName=?
                """, (
                    form_data['name'], form_data['mobile'], form_data['email'],
                    form_data['designation'], current_emp_id
                ))
                
                if form_data['emp_id'] != current_emp_id:
                    cursor.execute("""
                        UPDATE LoginMaster SET UserName=?
                        WHERE UserName=?
                    """, (form_data['emp_id'], current_emp_id))
                
                conn.commit()
                flash('Employee updated successfully', 'success')
                
            except Exception as e:
                conn.rollback()
                flash(f'Error updating employee: {str(e)}', 'error')
    except Exception as e:
        if conn:
            conn.rollback()
        flash(f'Error updating employee: {str(e)}', 'error')
    finally:
        if conn:
            conn.close()
    
    return redirect(url_for('admin.add_employee.add_employee'))