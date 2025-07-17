from flask import Blueprint, render_template, request, redirect, url_for, session, flash
import pyodbc
from datetime import datetime

modify_id_card_bp = Blueprint('modify_id_card', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

@modify_id_card_bp.route('/modify-id-card', methods=['GET', 'POST'])
def modify_id_card():
    if 'Student_ID' not in session:
        flash('Student ID not found in session', 'error')
        return redirect(url_for('student_list.student_list'))  # Updated
    
    student_id = session['Student_ID']
    
    if request.method == 'POST':
        # Validate form data
        required_fields = ['name', 'father_name', 'dob', 'mobile']
        for field in required_fields:
            if not request.form.get(field):
                flash(f'Please fill in all required fields', 'error')
                return redirect(url_for('admin.modify_id_card.modify_id_card'))
        
        # Get form data
        name = request.form['name']
        father_name = request.form['father_name']
        dob = request.form['dob']
        mobile = request.form['mobile']
        
        conn = db_connection()
        cursor = conn.cursor()
        
        try:
            # Check if ID card exists
            cursor.execute("SELECT * FROM TblIDCard WHERE Student_ID = ?", student_id)
            if cursor.fetchone():
                # Update existing record
                cursor.execute("""
                    UPDATE TblIDCard 
                    SET Name = ?, FatherName = ?, Dob = ?, FatherMobile = ?
                    WHERE Student_ID = ?
                """, (name, father_name, dob, mobile, student_id))
            else:
                # Get class/section/roll from student record
                cursor.execute("SELECT Class, Section, Roll FROM TblStudent WHERE Student_ID = ?", student_id)
                student_data = cursor.fetchone()
                
                if student_data:
                    # Insert new ID card record
                    cursor.execute("""
                        INSERT INTO TblIDCard 
                        (Student_ID, Name, FatherName, Dob, Class, Section, Roll, FatherMobile) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        student_id, name, father_name, dob, 
                        student_data.Class, student_data.Section, student_data.Roll, 
                        mobile
                    ))
            
            conn.commit()
            flash('ID card updated successfully', 'success')
            session['Student_ID'] = student_id
            return redirect(url_for('admin.preview_id_card.preview_id_card'))  # Updated
        except Exception as e:
            conn.rollback()
            flash(f'Error updating ID card: {str(e)}', 'error')
            return redirect(url_for('admin.modify_id_card.modify_id_card'))
        finally:
            conn.close()
    
    # GET request - load student data
    conn = db_connection()
    cursor = conn.cursor()
    
    try:
        # Get student details
        cursor.execute("""
            SELECT s.Student_ID, s.Name, s.FatherName, s.Dob, s.Class, 
                   s.Section, s.Roll, s.FatherMobile, 
                   id.Name as id_name, id.FatherName as id_father_name, 
                   id.Dob as id_dob, id.FatherMobile as id_mobile
            FROM TblStudent s
            LEFT JOIN TblIDCard id ON s.Student_ID = id.Student_ID
            WHERE s.Student_ID = ?
        """, student_id)
        
        student = cursor.fetchone()
        
        if not student:
            flash('Student not found', 'error')
            return redirect(url_for('admin.student_list.student_list'))  # Updated
        
        return render_template('Admin/Modify_ID_Card.html', student=student)
    except Exception as e:
        flash(f'Error loading student data: {str(e)}', 'error')
        return redirect(url_for('admin.student_list.student_list'))  # Updated
    finally:
        conn.close()