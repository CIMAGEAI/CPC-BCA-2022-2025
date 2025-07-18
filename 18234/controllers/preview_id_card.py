from flask import Blueprint, render_template, session, redirect, url_for, flash, request
import pyodbc
from datetime import datetime

preview_id_card_bp = Blueprint('preview_id_card', __name__)

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
    
    if month >= 4:  # April or later
        start_year = year
        end_year = year + 1
    else:  # January-March
        start_year = year - 1
        end_year = year
        
    return f"{start_year}-{end_year}"

@preview_id_card_bp.route('/preview-id-card')
def preview_id_card():
    conn = None
    try:
        student_id = session.get('Student_ID')
        if not student_id:
            flash('Student ID not found', 'error')
            return redirect(url_for('admin.student_list.student_list'))
            
        financial_year = get_financial_year()
        
        conn = db_connection()
        cursor = conn.cursor()
        
        # Get school details
        cursor.execute("SELECT * FROM TblSchool")
        school = cursor.fetchone()
        
        # Check if ID card exists
        cursor.execute("SELECT TOP 1 * FROM TblIDCard WHERE Student_ID = ? AND FinancialYear = ? ORDER BY ID DESC", 
                      (student_id, financial_year))
        id_card = cursor.fetchone()
        
        if not id_card:
            # If no ID card exists, get student details and create one
            cursor.execute("SELECT TOP 1 * FROM TblStudent WHERE Student_ID = ? ORDER BY ID DESC", student_id)
            student = cursor.fetchone()
            
            if student:
                # Insert new ID card record
                cursor.execute("""
                    INSERT INTO TblIDCard 
                    (Student_ID, Name, FatherName, Dob, Class, Section, Roll, FatherMobile, FinancialYear) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    student.Student_ID,
                    student.Name,
                    student.FatherName,
                    student.Dob,
                    student.Class,
                    student.Section,
                    student.Roll,
                    student.FatherMobile if student.FatherMobile else student.Mobile,
                    financial_year
                ))
                conn.commit()
                
                # Get the newly created ID card
                cursor.execute("SELECT TOP 1 * FROM TblIDCard WHERE Student_ID = ? AND FinancialYear = ? ORDER BY ID DESC", 
                              (student_id, financial_year))
                id_card = cursor.fetchone()
        
        # Get student image
        cursor.execute("SELECT StudentImage FROM TblStudent WHERE Student_ID = ?", student_id)
        student_image = cursor.fetchone()
        
        # Format financial year for display
        formatted_financial_year = ""
        if id_card and id_card.FinancialYear:
            try:
                start_year = int(id_card.FinancialYear.split('-')[0])
                end_year = int(id_card.FinancialYear.split('-')[1])
                start_date = datetime(start_year, 4, 1)
                end_date = datetime(end_year, 3, 31)
                formatted_financial_year = f"{start_date.strftime('%d %B %Y')} - {end_date.strftime('%d %B %Y')}"
            except:
                formatted_financial_year = id_card.FinancialYear
        
        return render_template('Admin/Preview_ID_Card.html',
                            school=school,
                            id_card=id_card,
                            student_image=student_image.StudentImage if student_image else None,
                            financial_year=financial_year,
                            formatted_financial_year=formatted_financial_year)
                            
    except Exception as e:
        flash(f'Error: {str(e)}', 'error')
        return render_template('Admin/Preview_ID_Card.html',
                            school=None,
                            id_card=None,
                            student_image=None,
                            financial_year=None,
                            formatted_financial_year=None)
    finally:
        if conn:
            conn.close()

@preview_id_card_bp.route('/modify-id-card', methods=['GET', 'POST'])
def modify_id_card():
    if 'Student_ID' not in session:
        flash('Student ID not found in session', 'error')
        return redirect(url_for('admin.student_list.student_list'))
    
    student_id = session['Student_ID']
    
    if request.method == 'POST':
        # Validate form data
        required_fields = ['name', 'father_name', 'dob', 'mobile']
        for field in required_fields:
            if not request.form.get(field):
                flash(f'Please fill in all required fields', 'error')
                return redirect(url_for('preview_id_card.modify_id_card'))
        
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
            return redirect(url_for('preview_id_card.preview_id_card'))
        except Exception as e:
            conn.rollback()
            flash(f'Error updating ID card: {str(e)}', 'error')
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
            return redirect(url_for('admin.student_list.student_list'))
        
        return render_template('Admin/Modify_ID_Card.html', student=student)
    except Exception as e:
        flash(f'Error loading student data: {str(e)}', 'error')
        return redirect(url_for('admin.student_list.student_list'))
    finally:
        conn.close()

@preview_id_card_bp.route('/delete-id-card', methods=['POST'])
def delete_id_card():
    if 'Student_ID' not in session:
        flash('Student ID not found in session', 'error')
        return redirect(url_for('admin.student_list.student_list'))
    
    student_id = session['Student_ID']
    conn = db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM TblIDCard WHERE Student_ID = ?", student_id)
        conn.commit()
        flash('ID card deleted successfully', 'success')
    except Exception as e:
        conn.rollback()
        flash(f'Error deleting ID card: {str(e)}', 'error')
    finally:
        conn.close()
    
    return redirect(url_for('admin.student_details.student_details'))