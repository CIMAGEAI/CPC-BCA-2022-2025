# controller/add_department.py
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
import pyodbc

add_department_bp = Blueprint('add_department', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

def row_to_dict(row):
    """Convert pyodbc.Row to dictionary with lowercase keys"""
    return {column[0].lower(): value for column, value in zip(row.cursor_description, row)}

@add_department_bp.route('/add-department', methods=['GET', 'POST'])
def add_department():
    if request.method == 'POST':
        name = request.form.get('name')
        
        if not name:
            flash('Department name is required', 'error')
            return redirect(url_for('admin.add_department.add_department'))
        
        try:
            conn = db_connection()
            cursor = conn.cursor()
            
            # Check if department already exists
            cursor.execute("SELECT * FROM TblDepartment WHERE Name=?", (name,))
            if cursor.fetchone():
                flash('Department with this name already exists', 'error')
                return redirect(url_for('admin.add_department.add_department'))
            
            # Insert new department
            cursor.execute("INSERT INTO TblDepartment (Name) VALUES (?)", (name,))
            conn.commit()
            flash('Department added successfully!', 'success')
            
        except Exception as e:
            conn.rollback()
            flash(f'Error: {str(e)}', 'error')
        finally:
            conn.close()
        
        return redirect(url_for('admin.add_department.add_department'))
    
    # For GET request - show form and list of departments
    departments = []
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM TblDepartment")
        departments = [row_to_dict(row) for row in cursor.fetchall()]
    except Exception as e:
        flash(f'Error fetching departments: {str(e)}', 'error')
    finally:
        conn.close()
    
    return render_template('Admin/Add_Department.html', departments=departments)

@add_department_bp.route('/delete-department/<int:department_id>', methods=['POST'])
def delete_department(department_id):
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        cursor.execute("DELETE FROM TblDepartment WHERE ID=?", (department_id,))
        conn.commit()
        
        flash('Department deleted successfully!', 'success')
    except Exception as e:
        conn.rollback()
        flash(f'Error deleting department: {str(e)}', 'error')
    finally:
        conn.close()
    
    return redirect(url_for('admin.add_department.add_department'))

@add_department_bp.route('/update-department/<int:department_id>', methods=['POST'])
def update_department(department_id):
    name = request.form.get('name')
    
    if not name:
        flash('Department name is required', 'error')
        return redirect(url_for('admin.add_department.add_department'))
    
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        # Check if another department with same name exists
        cursor.execute("SELECT * FROM TblDepartment WHERE Name=? AND ID!=?", (name, department_id))
        if cursor.fetchone():
            flash('Another department with this name already exists', 'error')
            return redirect(url_for('admin.add_department.add_department'))
        
        # Update department
        cursor.execute("UPDATE TblDepartment SET Name=? WHERE ID=?", (name, department_id))
        conn.commit()
        flash('Department updated successfully!', 'success')
    except Exception as e:
        conn.rollback()
        flash(f'Error updating department: {str(e)}', 'error')
    finally:
        conn.close()
    
    return redirect(url_for('admin.add_department.add_department'))