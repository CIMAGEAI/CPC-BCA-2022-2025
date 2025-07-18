from flask import Blueprint, render_template, request, redirect, url_for, flash
import pyodbc
from datetime import datetime

create_fee_name_bp = Blueprint('create_fee_name', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

@create_fee_name_bp.route('/create-fee-name', methods=['GET', 'POST'])
def create_fee_name():
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        # Initialize variables
        fee_name = ''
        fee_names = []
        error = None
        success = None
        
        if request.method == 'POST':
            if 'save' in request.form:
                # Handle Save button click
                fee_name = request.form.get('fee_name', '').strip()
                
                if not fee_name:
                    error = "Fee name is required"
                else:
                    # Check for duplicate
                    cursor.execute("SELECT COUNT(*) FROM TblFeeName WHERE Name=?", fee_name)
                    if cursor.fetchone()[0] > 0:
                        error = "Fee name already exists"
                    else:
                        # Insert new fee name
                        cursor.execute("INSERT INTO TblFeeName (Name) VALUES (?)", fee_name)
                        conn.commit()
                        success = "Fee name added successfully"
                        fee_name = ''  # Clear the input field
            
            elif 'update' in request.form:
                # Handle Update from grid
                fee_id = request.form.get('fee_id')
                updated_name = request.form.get('updated_name', '').strip()
                
                if not updated_name:
                    error = "Fee name is required"
                else:
                    cursor.execute("UPDATE TblFeeName SET Name=? WHERE ID=?", (updated_name, fee_id))
                    conn.commit()
                    success = "Fee name updated successfully"
            
            elif 'delete' in request.form:
                # Handle Delete from grid
                fee_id = request.form.get('fee_id')
                cursor.execute("DELETE FROM TblFeeName WHERE ID=?", fee_id)
                conn.commit()
                success = "Fee name deleted successfully"
        
        # Fetch all fee names for the grid
        cursor.execute("SELECT ID, Name FROM TblFeeName ORDER BY ID")
        fee_names = [{'id': row.ID, 'name': row.Name} for row in cursor.fetchall()]
        
    except Exception as e:
        error = f"Database error: {str(e)}"
    finally:
        if conn:
            conn.close()
    
    return render_template('Admin/Create_Fee_Name.html', 
                         fee_name=fee_name,
                         fee_names=fee_names,
                         error=error,
                         success=success)

@create_fee_name_bp.route('/delete-fee-name/<int:fee_id>', methods=['POST'])
def delete_fee_name(fee_id):
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM TblFeeName WHERE ID=?", fee_id)
        conn.commit()
        flash('Fee name deleted successfully', 'success')
    except Exception as e:
        flash(f'Error deleting fee name: {str(e)}', 'error')
    finally:
        if conn:
            conn.close()
    return redirect(url_for('admin.create_fee_name.create_fee_name'))