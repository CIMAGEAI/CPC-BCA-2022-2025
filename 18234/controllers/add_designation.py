# controller/add_designation.py
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
import pyodbc

add_designation_bp = Blueprint('add_designation', __name__)

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

@add_designation_bp.route('/add-designation', methods=['GET', 'POST'])
def add_designation():
    # Get departments for dropdown
    departments = []
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT Name FROM TblDepartment")
        departments = [row[0] for row in cursor.fetchall()]
    except Exception as e:
        flash(f'Error fetching departments: {str(e)}', 'error')
    
    if request.method == 'POST':
        department = request.form.get('department')
        designation_name = request.form.get('designation_name')
        
        if not department or department == "Select Department":
            flash('Please select a department', 'error')
        elif not designation_name:
            flash('Designation name is required', 'error')
        else:
            try:
                conn = db_connection()
                cursor = conn.cursor()
                
                # Check if designation already exists in this department
                cursor.execute(
                    "SELECT * FROM TblDesignation WHERE DepartmentName=? AND DesignationName=?",
                    (department, designation_name)
                )
                if cursor.fetchone():
                    flash('This designation already exists in the selected department', 'error')
                    return redirect(url_for('admin.add_designation.add_designation'))
                else:
                    # Insert new designation
                    cursor.execute(
                        "INSERT INTO TblDesignation (DepartmentName, DesignationName) VALUES (?, ?)",
                        (department, designation_name)
                    )
                    conn.commit()
                    flash('Designation added successfully!', 'success')
                    return redirect(url_for('admin.add_designation.add_designation'))
                
            except Exception as e:
                conn.rollback()
                flash(f'Error: {str(e)}', 'error')
            finally:
                conn.close()
    
    # Get all designations for display
    designations = []
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM TblDesignation")
        designations = [row_to_dict(row) for row in cursor.fetchall()]
    except Exception as e:
        flash(f'Error fetching designations: {str(e)}', 'error')
    
    return render_template(
        'Admin/Add_Designation.html',
        departments=departments,
        designations=designations
    )

@add_designation_bp.route('/delete-designation/<int:designation_id>', methods=['POST'])
def delete_designation(designation_id):
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM TblDesignation WHERE ID=?", (designation_id,))
        conn.commit()
        flash('Designation deleted successfully!', 'success')
    except Exception as e:
        conn.rollback()
        flash(f'Error deleting designation: {str(e)}', 'error')
    finally:
        conn.close()
    
    return redirect(url_for('admin.add_designation.add_designation'))

@add_designation_bp.route('/update-designation/<int:designation_id>', methods=['POST'])
def update_designation(designation_id):
    department = request.form.get('department')
    designation_name = request.form.get('designation_name')
    
    if not department or department == "Select Department":
        flash('Please select a department', 'error')
    elif not designation_name:
        flash('Designation name is required', 'error')
    else:
        try:
            conn = db_connection()
            cursor = conn.cursor()
            
            # Check if another designation with same name exists in this department
            cursor.execute(
                "SELECT * FROM TblDesignation WHERE DepartmentName=? AND DesignationName=? AND ID!=?",
                (department, designation_name, designation_id)
            )
            if cursor.fetchone():
                flash('This designation already exists in the selected department', 'error')
            else:
                # Update designation
                cursor.execute(
                    "UPDATE TblDesignation SET DepartmentName=?, DesignationName=? WHERE ID=?",
                    (department, designation_name, designation_id)
                )
                conn.commit()
                flash('Designation updated successfully!', 'success')
        except Exception as e:
            conn.rollback()
            flash(f'Error updating designation: {str(e)}', 'error')
        finally:
            conn.close()
    
    return redirect(url_for('admin.add_designation.add_designation'))