from flask import Blueprint, render_template, request
import pyodbc

monthly_fee_receipt_bp = Blueprint('monthly_fee_receipt', __name__)

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

@monthly_fee_receipt_bp.route('/monthly-fee-receipt/<int:invoice_number>')
def monthly_fee_receipt(invoice_number):
    con = db_connection()
    cursor = con.cursor()

    # 1. School Details
    cursor.execute("SELECT TOP 1 * FROM TblSchool")
    school = cursor.fetchone()
    school_data = None
    if school:
        school_data = {
            'Image': school.Image,
            'Name': school.Name,
            'Address': school.Address,
            'Mobile': school.Mobile,
            'Affiliation_Number': getattr(school, 'Affiliation_Number', '')
        }

    # 2. Student Details
    cursor.execute("SELECT TOP 1 * FROM Tblbill WHERE InvoiceNo = ?", invoice_number)
    row = cursor.fetchone()
    student_details = dict(zip([column[0] for column in cursor.description], row)) if row else None

    # 3. Fee Details Aggregated
    fee_query = """
    SELECT FeeHead, 
        STUFF((SELECT ', ' + Month 
               FROM Tblbill AS b 
               WHERE b.FeeHead = a.FeeHead AND b.InvoiceNo = ? 
               FOR XML PATH('')), 1, 2, '') AS Months, 
        SUM(CONVERT(decimal, FeeAmount)) AS TotalFeeAmount, 
        MAX(Amount) AS Amount, 
        MAX(PreviousDues) AS PreviousDues, 
        MAX(LateFine) AS LateFine, 
        MAX(ConcessionAmount) AS ConcessionAmount, 
        MAX(TotalAmount) AS TotalAmount, 
        MAX(PaidAmount) AS PaidAmount, 
        MAX(Dues) AS Dues, 
        MAX(PayType) AS PayType 
    FROM Tblbill AS a 
    WHERE InvoiceNo = ? 
    GROUP BY FeeHead
    """
    cursor.execute(fee_query, (invoice_number, invoice_number))
    fee_details = []
    for row in cursor.fetchall():
        fee_details.append({
            'FeeHead': row.FeeHead,
            'Months': row.Months,
            'TotalFeeAmount': float(row.TotalFeeAmount or 0),
            'Amount': float(row.Amount or 0),
            'PreviousDues': float(row.PreviousDues or 0),
            'LateFine': float(row.LateFine or 0),
            'ConcessionAmount': float(row.ConcessionAmount or 0),
            'TotalAmount': float(row.TotalAmount or 0),
            'PaidAmount': float(row.PaidAmount or 0),
            'Dues': float(row.Dues or 0),
            'PayType': row.PayType
        })

    # 4. Fee Other Details
    cursor.execute("SELECT TOP 1 * FROM Tblbill WHERE InvoiceNo = ?", invoice_number)
    row = cursor.fetchone()
    fee_other_details = dict(zip([column[0] for column in cursor.description], row)) if row else None
    if fee_other_details:
        # Safely convert all numeric fields to float
        for key in ['Amount', 'PreviousDues', 'LateFine', 'ConcessionAmount', 'TotalAmount', 'PaidAmount', 'Dues']:
            try:
                fee_other_details[key] = float(fee_other_details.get(key) or 0)
            except:
                fee_other_details[key] = 0.0

    # 5. Bill Date and PaidInWords
    cursor.execute("SELECT TOP 1 Date, PaidInWords FROM TblBill WHERE InvoiceNo = ?", invoice_number)
    result = cursor.fetchone()
    bill_date = result.Date if result else None
    paid_in_words = (result.PaidInWords + " ONLY /.") if result else ""

    con.close()

    return render_template(
        'Admin/Monthly_Fee_Receipt.html',
        invoice_number=invoice_number,
        school_details=school_data,
        student_details=student_details,
        fee_details=fee_details,
        other_details=fee_other_details,
        bill_date=bill_date,
        paid_in_words=paid_in_words
    )
