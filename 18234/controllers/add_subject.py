from flask import Blueprint, render_template, request, redirect, url_for, flash
import pyodbc
from datetime import datetime

add_subject_bp = Blueprint('add_subject', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

@add_subject_bp.route('/add-subject', methods=['GET', 'POST'])
def add_subject():
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        # Initialize variables
        subject_name = ''
        subjects = []
        error = None
        success = None
        
        if request.method == 'POST':
            if 'save' in request.form:
                # Handle Save button click
                subject_name = request.form.get('subject_name', '').strip()
                
                if not subject_name:
                    error = "Subject name is required"
                else:
                    # Check for duplicate
                    cursor.execute("SELECT COUNT(*) FROM TblSubject WHERE Subject=?", subject_name)
                    if cursor.fetchone()[0] > 0:
                        error = "Subject already exists"
                    else:
                        # Insert new subject
                        cursor.execute("INSERT INTO TblSubject (Subject) VALUES (?)", subject_name)
                        conn.commit()
                        success = "Subject added successfully"
                        subject_name = ''  # Clear the input field
            
            elif 'update' in request.form:
                # Handle Update from modal
                subject_id = request.form.get('subject_id')
                updated_name = request.form.get('updated_name', '').strip()
                
                if not updated_name:
                    error = "Subject name is required"
                else:
                    cursor.execute("UPDATE TblSubject SET Subject=? WHERE ID=?", (updated_name, subject_id))
                    conn.commit()
                    success = "Subject updated successfully"
            
            elif 'delete' in request.form:
                # Handle Delete from grid
                subject_id = request.form.get('subject_id')
                cursor.execute("DELETE FROM TblSubject WHERE ID=?", subject_id)
                conn.commit()
                success = "Subject deleted successfully"
        
        # Fetch all subjects for the grid
        cursor.execute("SELECT ID, Subject FROM TblSubject ORDER BY ID")
        subjects = [{'id': row.ID, 'name': row.Subject} for row in cursor.fetchall()]
        
    except Exception as e:
        error = f"Database error: {str(e)}"
    finally:
        if conn:
            conn.close()
    
    if error:
        flash(error, 'error')
    if success:
        flash(success, 'success')
    
    return render_template('Admin/Add_Subject.html', 
                         subject_name=subject_name,
                         subjects=subjects)

@add_subject_bp.route('/delete-subject/<int:subject_id>', methods=['POST'])
def delete_subject(subject_id):
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM TblSubject WHERE ID=?", subject_id)
        conn.commit()
        flash('Subject deleted successfully', 'success')
    except Exception as e:
        flash(f'Error deleting subject: {str(e)}', 'error')
    finally:
        if conn:
            conn.close()
    return redirect(url_for('admin.add_subject.add_subject'))