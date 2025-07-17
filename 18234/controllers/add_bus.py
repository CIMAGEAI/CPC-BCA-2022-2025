from flask import Blueprint, render_template, request, redirect, url_for, flash
import pyodbc

add_bus_bp = Blueprint('add_bus', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

@add_bus_bp.route('/add-bus', methods=['GET', 'POST'])
def add_bus():
    conn = None
    try:
        conn = db_connection()
        cursor = conn.cursor()

        bus_data = {
            'bus_number': '',
            'registration_no': '',
            'stopage': '',
            'fee': ''
        }

        buses = []
        error = None
        success = None

        if request.method == 'POST':
            # ----------------- SAVE -----------------
            if 'save' in request.form:
                bus_data['bus_number'] = request.form.get('bus_number', '').strip()
                bus_data['registration_no'] = request.form.get('registration_no', '').strip()
                bus_data['stopage'] = request.form.get('stopage', '').strip()
                bus_data['fee'] = request.form.get('fee', '').strip()

                if not bus_data['bus_number']:
                    error = "Bus number is required"
                elif not bus_data['registration_no']:
                    error = "Registration number is required"
                elif not bus_data['stopage']:
                    error = "Stopage is required"
                elif not bus_data['fee'] or not bus_data['fee'].isdigit():
                    error = "Valid fee is required"
                else:
                    # Check if same registration no used in different bus number
                    cursor.execute("""
                        SELECT COUNT(*) FROM TblBusFee 
                        WHERE RegistrationNo = ? AND BusNumber != ?
                    """, (bus_data['registration_no'], bus_data['bus_number']))
                    if cursor.fetchone()[0] > 0:
                        error = "This registration number is already used with another bus number."
                    else:
                        # Check for exact duplicate (BusNumber + RegistrationNo + Stopage)
                        cursor.execute("""
                            SELECT COUNT(*) FROM TblBusFee 
                            WHERE BusNumber = ? AND RegistrationNo = ? AND Stopage = ?
                        """, (bus_data['bus_number'], bus_data['registration_no'], bus_data['stopage']))
                        if cursor.fetchone()[0] > 0:
                            error = "This stopage for the bus and registration already exists."
                        else:
                            cursor.execute("""
                                INSERT INTO TblBusFee 
                                (BusNumber, RegistrationNo, Stopage, Fee, FeeName) 
                                VALUES (?, ?, ?, ?, 'Bus Fee')
                            """, (bus_data['bus_number'], bus_data['registration_no'], 
                                  bus_data['stopage'], bus_data['fee']))
                            conn.commit()
                            success = "Bus stopage added successfully"
                            bus_data = {'bus_number': '', 'registration_no': '', 'stopage': '', 'fee': ''}

            # ----------------- UPDATE -----------------
            elif 'update' in request.form:
                bus_id = request.form.get('bus_id')
                updated_data = {
                    'bus_number': request.form.get('updated_bus_number', '').strip(),
                    'registration_no': request.form.get('updated_registration_no', '').strip(),
                    'stopage': request.form.get('updated_stopage', '').strip(),
                    'fee': request.form.get('updated_fee', '').strip()
                }

                if not updated_data['bus_number']:
                    error = "Bus number is required"
                elif not updated_data['registration_no']:
                    error = "Registration number is required"
                elif not updated_data['stopage']:
                    error = "Stopage is required"
                elif not updated_data['fee'] or not updated_data['fee'].isdigit():
                    error = "Valid fee is required"
                else:
                    # Check if same registration no used in another bus number
                    cursor.execute("""
                        SELECT COUNT(*) FROM TblBusFee 
                        WHERE RegistrationNo = ? AND BusNumber != ? AND ID != ?
                    """, (updated_data['registration_no'], updated_data['bus_number'], bus_id))
                    if cursor.fetchone()[0] > 0:
                        error = "This registration number is already used with another bus number."
                    else:
                        # Check for exact duplicate of BusNumber + RegNo + Stopage excluding current row
                        cursor.execute("""
                            SELECT COUNT(*) FROM TblBusFee 
                            WHERE BusNumber = ? AND RegistrationNo = ? AND Stopage = ? AND ID != ?
                        """, (updated_data['bus_number'], updated_data['registration_no'], updated_data['stopage'], bus_id))
                        if cursor.fetchone()[0] > 0:
                            error = "This stopage for the bus and registration already exists."
                        else:
                            cursor.execute("""
                                UPDATE TblBusFee 
                                SET BusNumber=?, RegistrationNo=?, Stopage=?, Fee=?, FeeName='Bus Fee'
                                WHERE ID=?
                            """, (updated_data['bus_number'], updated_data['registration_no'], 
                                  updated_data['stopage'], updated_data['fee'], bus_id))
                            conn.commit()
                            success = "Bus stopage updated successfully"

            # ----------------- DELETE -----------------
            elif 'delete' in request.form:
                bus_id = request.form.get('bus_id')
                cursor.execute("DELETE FROM TblBusFee WHERE ID=?", bus_id)
                conn.commit()
                success = "Bus deleted successfully"

        # Fetch all bus stopages
        cursor.execute("SELECT ID, BusNumber, RegistrationNo, Stopage, Fee FROM TblBusFee ORDER BY ID")
        buses = [{
            'id': row.ID,
            'bus_number': row.BusNumber,
            'registration_no': row.RegistrationNo,
            'stopage': row.Stopage,
            'fee': row.Fee
        } for row in cursor.fetchall()]

    except Exception as e:
        error = f"Database error: {str(e)}"
    finally:
        if conn:
            conn.close()

    return render_template('Admin/add_bus.html', 
                           bus_data=bus_data,
                           buses=buses,
                           error=error,
                           success=success)
