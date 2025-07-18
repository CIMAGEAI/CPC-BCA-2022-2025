from flask import Blueprint, render_template, request, current_app
import pyodbc
from datetime import datetime

annual_fee_receipt_bp = Blueprint('annual_fee_receipt', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

@annual_fee_receipt_bp.route('/annual-fee-receipt')
def annual_fee_receipt():
    invoice = request.args.get('invoice')
    if not invoice:
        return render_template('Admin/error.html', message='No invoice specified')

    try:
        conn = db_connection()
        cursor = conn.cursor()

        # Get school details
        cursor.execute("SELECT * FROM TblSchool")
        school_details = cursor.fetchone()

        # Get student and fee details
        cursor.execute("""
            SELECT * FROM TblBill 
            WHERE InvoiceNo = ?
            ORDER BY ID
        """, invoice)
        fee_details = cursor.fetchall()

        if not fee_details:
            return render_template('Admin/error.html', message='Invoice not found')

        summary = fee_details[0]

        # Format individual fee entries
        formatted_fees = []
        for fee in fee_details:
            formatted_fees.append({
                'FeeHead': fee.FeeHead,
                'FeeAmount': f"₹{float(fee.FeeAmount):,.2f}"
            })

        # Format summary
        formatted_summary = {
            'Amount': f"₹{float(summary.Amount):,.2f}",
            'ConcessionAmount': f"₹{float(summary.ConcessionAmount or 0):,.2f}",
            'TotalAmount': f"₹{float(summary.TotalAmount):,.2f}",
            'PaidAmount': f"₹{float(summary.PaidAmount):,.2f}",
            'Dues': f"₹{float(summary.Dues):,.2f}"
        }

        # Current time
        now = datetime.now()
        time_str = now.strftime('%I:%M %p')  # Example: 01:23 PM

        # Dynamic PDF name via <title>
        safe_name = summary.Name.replace(' ', '_')
        pdf_title = f"Annual_Fee_Receipt_{summary.StudentID}_{safe_name}"

        return render_template('Admin/annual_fee_receipt.html',
            title=pdf_title,
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
                'PaidInWords': f"{summary.PaidInWords} ONLY /.",
                'Time': time_str
            }
        )

    except Exception as e:
        current_app.logger.error(f"Error generating receipt: {str(e)}")
        return render_template('Admin/error.html', message='Error generating receipt')
    finally:
        if 'conn' in locals():
            conn.close()
