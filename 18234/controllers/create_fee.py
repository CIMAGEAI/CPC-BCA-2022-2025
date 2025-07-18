from flask import Blueprint, render_template, request, redirect, url_for, flash
import pyodbc
from datetime import datetime

create_fee_bp = Blueprint('create_fee', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

@create_fee_bp.route('/create-fee', methods=['GET', 'POST'])
def create_fee():
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        # Initialize variables
        fee_data = {
            'fee_name': '',
            'class_name': '',
            'fee_type': '',
            'fee_price': ''
        }
        
        fee_records = []
        fee_names = []
        classes = [
            'Nursery', 'L.K.G', 'U.K.G', 'Std 01', 'Std 02', 'Std 03', 'Std 04', 
            'Std 05', 'Std 06', 'Std 07', 'Std 08', 'Std 09', 'Std 10', 'Std 11', 'Std 12'
        ]
        fee_types = ['Once', 'Monthly', 'Yearly']
        edit_fee_types = ['Once', 'Monthly', 'Yearly']
        
        # Get fee names for dropdown
        cursor.execute("SELECT Name FROM TblFeeName")
        fee_names = [row[0] for row in cursor.fetchall()]
        
        if request.method == 'POST':
            if 'save' in request.form:
                # Handle Save button click
                fee_data = {
                    'fee_name': request.form.get('fee_name', '').strip(),
                    'class_name': request.form.get('class_name', '').strip(),
                    'fee_type': request.form.get('fee_type', '').strip(),
                    'fee_price': request.form.get('fee_price', '').strip()
                }
                
                # Validation
                if not all(fee_data.values()):
                    flash('All fields are required', 'error')
                elif not fee_data['fee_price'].isdigit():
                    flash('Fee price must be a number', 'error')
                else:
                    # Check for duplicate
                    cursor.execute("""
                        SELECT COUNT(*) FROM TblFee 
                        WHERE FeeName=? AND Class=?
                    """, (fee_data['fee_name'], fee_data['class_name']))
                    
                    if cursor.fetchone()[0] > 0:
                        flash('Fee structure already exists for this class', 'error')
                    else:
                        # Insert new fee
                        cursor.execute("""
                            INSERT INTO TblFee (FeeName, Class, Fee, FeeType)
                            VALUES (?, ?, ?, ?)
                        """, (
                            fee_data['fee_name'],
                            fee_data['class_name'],
                            fee_data['fee_price'],
                            fee_data['fee_type']
                        ))
                        conn.commit()
                        flash('Fee structure added successfully', 'success')
                        # Clear form
                        fee_data = {
                            'fee_name': '',
                            'class_name': '',
                            'fee_type': '',
                            'fee_price': ''
                        }
            
            elif 'update' in request.form:
                # Handle Update from form
                fee_id = request.form.get('fee_id')
                updated_data = {
                    'fee_price': request.form.get('updated_fee_price', '').strip(),
                    'fee_type': request.form.get('updated_fee_type', '').strip()
                }
                
                if not all(updated_data.values()):
                    flash('All fields are required for update', 'error')
                elif not updated_data['fee_price'].isdigit():
                    flash('Fee price must be a number', 'error')
                else:
                    cursor.execute("""
                        UPDATE TblFee 
                        SET Fee=?, FeeType=?
                        WHERE ID=?
                    """, (
                        updated_data['fee_price'],
                        updated_data['fee_type'],
                        fee_id
                    ))
                    conn.commit()
                    flash('Fee structure updated successfully', 'success')
            
            elif 'delete' in request.form:
                # Handle Delete
                fee_id = request.form.get('fee_id')
                cursor.execute("DELETE FROM TblFee WHERE ID=?", fee_id)
                conn.commit()
                flash('Fee structure deleted successfully', 'success')
        
        # Fetch all fee records for the grid
        cursor.execute("""
            SELECT ID, FeeName, Class, Fee, FeeType 
            FROM TblFee 
            ORDER BY Class, FeeName
        """)
        
        fee_records = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            fee_records.append(dict(zip(columns, row)))
        
    except Exception as e:
        flash(f'Database error: {str(e)}', 'error')
    finally:
        if conn:
            conn.close()
    
    return render_template('Admin/Create_Fee.html',
                         fee_data=fee_data,
                         fee_records=fee_records,
                         fee_names=fee_names,
                         classes=classes,
                         fee_types=fee_types,
                         edit_fee_types=edit_fee_types)

@create_fee_bp.route('/delete-fee/<int:fee_id>', methods=['POST'])
def delete_fee(fee_id):
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM TblFee WHERE ID=?", fee_id)
        conn.commit()
        flash('Fee structure deleted successfully', 'success')
    except Exception as e:
        flash(f'Error deleting fee structure: {str(e)}', 'error')
    finally:
        if conn:
            conn.close()
    return redirect(url_for('admin.create_fee.create_fee'))