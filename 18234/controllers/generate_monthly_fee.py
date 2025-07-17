from flask import Blueprint, current_app, render_template, request, redirect, url_for, flash, session, jsonify
import pyodbc
from datetime import datetime, timedelta
import json

generate_monthly_fee_bp = Blueprint('generate_monthly_fee', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

def number_to_words(n):
    ones = (
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
        "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    )
    tens = (
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    )

    def words(num):
        if num < 20:
            return ones[num]
        elif num < 100:
            return tens[num // 10] + (" " + ones[num % 10] if num % 10 != 0 else "")
        elif num < 1000:
            return ones[num // 100] + " Hundred" + (" " + words(num % 100) if num % 100 != 0 else "")
        elif num < 100000:
            return words(num // 1000) + " Thousand" + (" " + words(num % 1000) if num % 1000 != 0 else "")
        elif num < 10000000:
            return words(num // 100000) + " Lakh" + (" " + words(num % 100000) if num % 100000 != 0 else "")
        else:
            return words(num // 10000000) + " Crore" + (" " + words(num % 10000000) if num % 10000000 != 0 else "")

    if n == 0:
        return "Zero Rupees"
    else:
        return words(int(n)) + " Rupees"

def get_student_details(student_id):
    conn = db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT Student_ID, Name, Class, Section, Roll, BusNumber, BusRoute FROM TblStudent WHERE Student_ID=?", student_id)
    row = cursor.fetchone()
    if not row:
        return None

    student = {
        'Student_ID': row[0],
        'Name': row[1],
        'Class': row[2],
        'Section': row[3],
        'Roll': row[4],
        'BusNumber': row[5],
        'BusRoute': row[6]
    }

    cursor.execute("SELECT TOP 1 ISNULL(Dues, 0) FROM TblBill WHERE StudentID=? ORDER BY ID DESC", student_id)
    previous_dues_row = cursor.fetchone()
    previous_dues = previous_dues_row[0] if previous_dues_row else 0

    months = get_financial_year_months()
    
    # Get already paid months to disable them
    cursor.execute("SELECT DISTINCT Month FROM TblBill WHERE StudentID=?", student_id)
    paid_months = [row[0] for row in cursor.fetchall()]
    
    conn.close()
    return {
        'student': student,
        'previous_dues': previous_dues,
        'months': months,
        'paid_months': paid_months
    }

def get_financial_year_months():
    """Returns months in financial year sequence (April to March)"""
    today = datetime.now()
    current_year = today.year
    month_names = ['April', 'May', 'June', 'July', 'August', 'September', 
                   'October', 'November', 'December', 'January', 'February', 'March']
    
    months = []
    
    # Determine financial year
    if today.month >= 4:  # April or later - current year is start of financial year
        start_year = current_year
        end_year = current_year + 1
    else:  # January-March - previous year is start of financial year
        start_year = current_year - 1
        end_year = current_year
    
    # Create month entries
    for i, month_name in enumerate(month_names):
        month_num = (i + 4) % 12  # April is 4, May is 5, ..., March is 3
        if month_num == 0:
            month_num = 12
        
        # Determine year for this month
        if month_name in ['January', 'February', 'March']:
            year = end_year
        else:
            year = start_year
            
        months.append({
            'value': f"{month_num:02d}-{year}",
            'text': f"{month_name} {year}",
            'month_name': month_name,
            'year': year,
            'month_num': month_num
        })
    
    return months

def get_monthly_fees(student_class, selected_months, bus_number=None, bus_route=None):
    conn = db_connection()
    cursor = conn.cursor()
    
    # Get regular monthly fees
    cursor.execute("""
        SELECT FeeName, Fee, FeeType FROM TblFee WHERE Class=? AND FeeType='Monthly'
    """, student_class)
    fees = cursor.fetchall()
    fee_structure = []
    
    # Get bus fees if student has bus details
    bus_fees = []
    if bus_number and bus_route:
        cursor.execute("""
            SELECT FeeName, Fee FROM TblBusFee 
            WHERE BusNumber=? AND Stopage=?
        """, (bus_number, bus_route))
        bus_fees = cursor.fetchall()
    
    # Get month details for each selected month
    month_details = []
    for month in selected_months:
        month_num, year = month.split('-')
        month_num = int(month_num)
        month_names = ['January', 'February', 'March', 'April', 'May', 'June',
                                 'July', 'August', 'September', 'October', 'November', 'December']
        month_details.append({
            'month_name': month_names[month_num - 1],
            'year': year,
            'month_num': month_num,
            'value': month
        })
    
    # Group fees by month for edit modal
    monthly_fees = []
    for month in month_details:
        month_fees = []
        
        # Add regular monthly fees
        for fee in fees:
            month_fees.append({
                'FeeName': fee.FeeName,
                'Fee': float(fee.Fee),
                'FeeType': fee.FeeType
            })
        
        # Add bus fees if available
        for fee in bus_fees:
            month_fees.append({
                'FeeName': fee.FeeName,
                'Fee': float(fee.Fee),
                'FeeType': 'Bus'
            })
            
        monthly_fees.append({
            'month_name': month['month_name'],
            'year': month['year'],
            'month_num': month['month_num'],
            'value': month['value'],
            'fees': month_fees
        })
    
    # Process regular monthly fees
    for fee in fees:
        per_month_amount = float(fee.Fee)
        total_amount = per_month_amount * len(selected_months)
        month_display = ", ".join([f"{m['month_name']} {m['year']}" for m in month_details])
        
        fee_structure.append({
            'FeeName': fee.FeeName,
            'Fee': total_amount,
            'PerMonthAmount': per_month_amount,
            'FeeType': fee.FeeType,
            'Month': month_display,
            'MonthlyFees': monthly_fees
        })
    
    # Process bus fees
    for fee in bus_fees:
        per_month_amount = float(fee.Fee)
        total_amount = per_month_amount * len(selected_months)
        month_display = ", ".join([f"{m['month_name']} {m['year']}" for m in month_details])
        
        fee_structure.append({
            'FeeName': fee.FeeName,
            'Fee': total_amount,
            'PerMonthAmount': per_month_amount,
            'FeeType': 'Bus',
            'Month': month_display,
            'MonthlyFees': monthly_fees
        })
    
    conn.close()
    return fee_structure

@generate_monthly_fee_bp.route('/generate-monthly-fee', methods=['GET', 'POST'])
def generate_monthly_fee():
    if request.method == 'POST':
        action = request.form.get('action')

        if action == 'get_student':
            try:
                student_id = request.form.get('student_id')
                session['student_id'] = student_id
                student_details = get_student_details(student_id)

                if not student_details:
                    return jsonify({'success': False, 'message': 'Student not found'})

                return jsonify({
                    'success': True,
                    'student': student_details['student'],
                    'previous_dues': student_details['previous_dues'],
                    'months': student_details['months'],
                    'paid_months': student_details['paid_months']
                })
            except Exception as e:
                current_app.logger.error(f"Error in get_student: {str(e)}")
                return jsonify({'success': False, 'message': f'Internal Server Error: {str(e)}'})

        elif action == 'calculate_fee':
            try:
                selected_months = request.form.getlist('selected_months[]')
                student_id = session.get('student_id')

                if not student_id or not selected_months:
                    return jsonify({'success': False, 'message': 'Invalid request'})

                conn = db_connection()
                cursor = conn.cursor()
                cursor.execute("SELECT Class, BusNumber, BusRoute FROM TblStudent WHERE Student_ID=?", student_id)
                student_row = cursor.fetchone()
                conn.close()

                if not student_row:
                    return jsonify({'success': False, 'message': 'Student details not found'})

                student_class = student_row[0]
                bus_number = student_row[1]
                bus_route = student_row[2]
                fees = get_monthly_fees(student_class, selected_months, bus_number, bus_route)

                return jsonify({
                    'success': True,
                    'fees': fees,
                    'selected_months': selected_months
                })
            except Exception as e:
                current_app.logger.error(f"Error in calculate_fee: {str(e)}")
                return jsonify({'success': False, 'message': f'Internal Server Error: {str(e)}'})

        elif action == 'submit_fee':
            try:
                student_id = session.get('student_id')
                if not student_id:
                    return jsonify({'success': False, 'message': 'Student not selected'})

                amount = float(request.form.get('amount', 0))
                previous_dues = float(request.form.get('previous_dues', 0))
                late_fine = float(request.form.get('late_fine', 0))
                concession = request.form.get('concession', 'No')
                concession_amount = float(request.form.get('concession_amount', 0))
                concession_remarks = request.form.get('concession_remarks', '')
                paid_amount = float(request.form.get('paid_amount', 0))
                payment_type = request.form.get('payment_type', '')
                transaction_number = request.form.get('transaction_number', '')
                selected_fee_months = json.loads(request.form.get('selected_fee_months', '[]'))

                if concession == 'Yes' and concession_amount <= 0:
                    return jsonify({'success': False, 'message': 'Concession amount must be greater than 0'})

                if concession == 'Yes' and concession_amount > amount:
                    return jsonify({'success': False, 'message': 'Concession amount cannot exceed total amount'})

                if paid_amount <= 0:
                    return jsonify({'success': False, 'message': 'Paid amount must be greater than 0'})

                if payment_type == 'Online' and not transaction_number:
                    return jsonify({'success': False, 'message': 'Transaction number is required for online payments'})

                if not selected_fee_months:
                    return jsonify({'success': False, 'message': 'No fees selected for any month'})

                conn = db_connection()
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT Student_ID, Name, Class, Section, Roll, BusNumber, BusRoute 
                    FROM TblStudent 
                    WHERE Student_ID=?
                """, student_id)
                student = cursor.fetchone()

                if not student:
                    conn.close()
                    return jsonify({'success': False, 'message': 'Student details not found'})

                cursor.execute("SELECT ISNULL(MAX(CAST(InvoiceNo AS INT)), 0) FROM TblBill")
                invoice_number = cursor.fetchone()[0] + 1

                # Get all fees to reference per-month amounts
                all_fees = get_monthly_fees(student.Class, [fm['monthValue'] for fm in selected_fee_months], student.BusNumber, student.BusRoute)
                
                # Calculate per-record amounts
                per_record_paid = paid_amount 
                per_record_total = (amount + previous_dues + late_fine - (concession_amount if concession == 'Yes' else 0))
                per_record_dues = (amount + previous_dues + late_fine - (concession_amount if concession == 'Yes' else 0) - paid_amount)

                paid_in_words = number_to_words(paid_amount)

                # Insert records for each selected fee-month combination
                for fee_month in selected_fee_months:
                    fee_name = fee_month['feeName']
                    month_value = fee_month['monthValue']
                    
                    # Find the original fee to get per-month amount
                    original_fee = next((f for f in all_fees if f['FeeName'] == fee_name), None)
                    if not original_fee:
                        continue
                    
                    # Get month display name
                    month_num, year = month_value.split('-')
                    month_num = int(month_num)
                    month_names = ['January', 'February', 'March', 'April', 'May', 'June',
                                 'July', 'August', 'September', 'October', 'November', 'December']
                    month_name = month_names[month_num - 1]
                    
                    cursor.execute("""
                        INSERT INTO TblBill (
                            InvoiceNo, StudentID, Name, Class, Section, Roll, FeeHead, FeeAmount,
                            Amount, PreviousDues, LateFine, ConcessionifAny, ConcessionAmount, 
                            ConcessionRemarks, TotalAmount, PaidAmount, Dues, PayType, 
                            TransactionNumber, Year, Date, FeeType, Month, PaidInWords
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        invoice_number,
                        student.Student_ID,
                        student.Name,
                        student.Class,
                        student.Section,
                        student.Roll,
                        fee_name,
                        original_fee['PerMonthAmount'],
                        amount,
                        previous_dues,
                        late_fine,
                        concession,
                        concession_amount,
                        concession_remarks,
                        per_record_total,
                        per_record_paid,
                        per_record_dues,
                        payment_type,
                        transaction_number,
                        year,
                        datetime.now().strftime('%d-%m-%Y'),
                        "Monthly",
                        f"{month_name} {year}",
                        paid_in_words
                    ))

                conn.commit()
                return jsonify({
                    'success': True,
                    'message': 'Fee generated successfully!',
                    'invoice_number': invoice_number,
                    'redirect_url': url_for('admin.monthly_fee_receipt.monthly_fee_receipt', invoice_number=invoice_number)
                })
            except Exception as e:
                conn.rollback()
                current_app.logger.error(f"Error in submit_fee: {str(e)}")
                return jsonify({'success': False, 'message': f'Internal Server Error: {str(e)}'})
            finally:
                conn.close()
                

    # Handle GET request for invoice display
    invoice_number = request.args.get('invoice')
    if invoice_number:
        flash(f'Fee generated successfully! Invoice Number: {invoice_number}', 'success')
    
    return render_template('Admin/Generate_Monthly_Fee.html')