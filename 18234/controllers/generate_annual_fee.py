from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app
import pyodbc
from datetime import datetime

generate_annual_fee_bp = Blueprint('generate_annual_fee', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

def get_financial_year():
    now = datetime.now()
    if now.month >= 4:  # April to March is financial year
        return f"{now.year}-{now.year + 1}"
    else:
        return f"{now.year - 1}-{now.year}"

def generate_invoice_number():
    conn = db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT ISNULL(MAX(CAST(InvoiceNo AS INT)), 0) FROM TblBill")
    result = cursor.fetchone()[0] + 1
    conn.close()
    return result

def get_student_details(student_id):
    conn = db_connection()
    cursor = conn.cursor()
    
    # Get basic student info
    cursor.execute("SELECT Student_ID, Name, Class, Section, Roll FROM TblStudent WHERE Student_ID=?", student_id)
    student = cursor.fetchone()
    
    # Get fee structure for the student's class
    cursor.execute("""
        SELECT F.FeeName, F.Fee, F.FeeType 
        FROM TblFee F 
        WHERE F.Class=? AND F.FeeType <> 'Monthly'
    """, student.Class)
    fees = cursor.fetchall()
    
    conn.close()
    
    return {
        'student': student,
        'fees': fees
    }

def calculate_total_fee(fees):
    return sum(float(fee.Fee) for fee in fees)

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


@generate_annual_fee_bp.route('/generate-annual-fee', methods=['GET', 'POST'])
def generate_annual_fee():
    if 'student_id' not in session:
        flash('No student selected', 'error')
        return redirect(url_for('add_student.add_student'))
    
    student_id = session['student_id']
    financial_year = get_financial_year()
    invoice_number = generate_invoice_number()
    
    # Initialize form data
    form_data = {
        'amount': '0',
        'concession': 'No',
        'concession_amount': '0',
        'concession_remarks': '',
        'gross_amount': '0',
        'paid_amount': '0',
        'dues': '0',
        'payment_type': '',
        'transaction_number': ''
    }
    
    student_details = get_student_details(student_id)
    total_fee = calculate_total_fee(student_details['fees'])
    form_data['amount'] = str(total_fee)
    form_data['gross_amount'] = str(total_fee)
    
    if request.method == 'POST':
        # Update form data with submitted values
        form_data['concession'] = request.form.get('concession', 'No')
        form_data['concession_amount'] = request.form.get('concession_amount', '0')
        form_data['concession_remarks'] = request.form.get('concession_remarks', '')
        form_data['paid_amount'] = request.form.get('paid_amount', '0')
        form_data['payment_type'] = request.form.get('payment_type', '')
        form_data['transaction_number'] = request.form.get('transaction_number', '')
        
        # Validate form
        errors = []
        
        # Convert to float for calculations
        try:
            amount = float(form_data['amount'])
            concession_amount = float(form_data['concession_amount'])
            paid_amount = float(form_data['paid_amount'])
        except ValueError:
            errors.append('Invalid numeric values in amount fields')
        
        # Validate concession
        if form_data['concession'] == 'Yes':
            if concession_amount <= 0:
                errors.append('Concession amount must be greater than 0')
            elif concession_amount > amount:
                errors.append('Concession amount cannot exceed total amount')
            elif not form_data['concession_remarks']:
                errors.append('Concession remarks are required')
        
        # Calculate gross amount
        gross_amount = amount - (concession_amount if form_data['concession'] == 'Yes' else 0)
        form_data['gross_amount'] = str(gross_amount)
        
        # Validate payment
        if paid_amount <= 0:
            errors.append('Paid amount must be greater than 0')
        elif paid_amount > gross_amount:
            errors.append('Paid amount cannot exceed gross amount')
        
        if not form_data['payment_type']:
            errors.append('Payment type is required')
        elif form_data['payment_type'] == 'Online' and not form_data['transaction_number']:
            errors.append('Transaction number is required for online payments')
        
        if not errors:
            # Calculate dues
            dues = gross_amount - paid_amount
            form_data['dues'] = str(dues)
            
            # Convert amount to words
            paid_in_words = number_to_words(paid_amount)
            
            # Save to database
            conn = db_connection()
            cursor = conn.cursor()
            
            try:
                for fee in student_details['fees']:
                    cursor.execute("""
                        INSERT INTO TblBill (
                            InvoiceNo, StudentID, Name, Class, Section, Roll, FeeHead, FeeAmount,
                            Amount, ConcessionifAny, ConcessionAmount, ConcessionRemarks, TotalAmount,
                            PaidAmount, Dues, PayType, TransactionNumber, Month ,Year, Date, FeeType, PaidInWords
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        invoice_number,
                        student_details['student'].Student_ID,
                        student_details['student'].Name,
                        student_details['student'].Class,
                        student_details['student'].Section,
                        student_details['student'].Roll,
                        fee.FeeName,
                        fee.Fee,
                        form_data['amount'],
                        form_data['concession'],
                        form_data['concession_amount'],
                        form_data['concession_remarks'],
                        form_data['gross_amount'],
                        form_data['paid_amount'],
                        form_data['dues'],
                        form_data['payment_type'],
                        form_data['transaction_number'],
                        datetime.now().strftime('%B'),
                        datetime.now().year,
                        datetime.now().strftime('%d-%m-%Y'),
                        fee.FeeType,
                        paid_in_words
                    ))
                
                conn.commit()
                flash('Fee generated successfully!', 'success')
                return redirect(url_for('admin.generate_annual_fee.annual_fee_receipt', invoice=invoice_number))

            except Exception as e:
                conn.rollback()
                flash(f'Database error: {str(e)}', 'error')
            finally:
                conn.close()
        
        for error in errors:
            flash(error, 'error')
    
    return render_template('Admin/Generate_Annual_Fee.html',
        student=student_details['student'],
        fees=student_details['fees'],
        form_data=form_data,
        invoice_number=invoice_number,
        financial_year=financial_year
    )

@generate_annual_fee_bp.route('/annual-fee-receipt')
def annual_fee_receipt():
    invoice = request.args.get('invoice')
    if not invoice:
        flash('No invoice specified', 'error')
        return redirect(url_for('admin.generate_annual_fee.annual_fee_receipt'))
    
    conn = db_connection()
    cursor = conn.cursor()
    
    try:
        # Get school details
        cursor.execute("SELECT * FROM TblSchool")
        school_details = cursor.fetchone()
        
        if not school_details:
            flash('School details not found', 'error')
            return redirect(url_for('admin.generate_annual_fee.annual_fee_receipt'))
        
        # Get bill details
        cursor.execute("""
            SELECT * FROM TblBill 
            WHERE InvoiceNo = ?
            ORDER BY ID
        """, invoice)
        bill_details = cursor.fetchall()
        
        if not bill_details:
            flash('Invoice not found', 'error')
            return redirect(url_for('admin.generate_annual_fee.annual_fee_receipt'))
        
        # Get summary from first record
        summary = bill_details[0]
        
        # Format amounts with ₹ symbol
        formatted_fees = []
        for fee in bill_details:
            formatted_fees.append({
                'FeeHead': fee.FeeHead,
                'FeeAmount': f"₹{float(fee.FeeAmount):,.2f}"
            })
        
        # Format summary amounts
        formatted_summary = {
            'Amount': f"₹{float(summary.Amount):,.2f}",
            'ConcessionAmount': f"₹{float(summary.ConcessionAmount or 0):,.2f}",
            'TotalAmount': f"₹{float(summary.TotalAmount):,.2f}",
            'PaidAmount': f"₹{float(summary.PaidAmount):,.2f}",
            'Dues': f"₹{float(summary.Dues):,.2f}"
        }
        
        return render_template('Admin/Annual_Fee_Receipt.html',
            school_details=school_details,
            student_details={
                'InvoiceNo': summary.InvoiceNo,
                'StudentID': summary.StudentID,
                'Name': summary.Name,
                'Class': summary.Class,
                'Section': summary.Section,
                'Roll': summary.Roll
            },
            fee_details=formatted_fees,
            summary_details=formatted_summary,
            payment_details={
                'PayType': summary.PayType,
                'Date': summary.Date,
                'PaidInWords': f"{summary.PaidInWords} ONLY /."
            }
        )
        
    except Exception as e:
        current_app.logger.error(f"Error generating receipt: {str(e)}")
        flash('Error generating receipt', 'error')
        return redirect(url_for('admin.generate_annual_fee.annual_fee_receipt'))
    finally:
        conn.close()