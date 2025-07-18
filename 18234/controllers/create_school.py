from flask import Blueprint, render_template, request, redirect, url_for, flash
import os
import uuid
import pyodbc
from werkzeug.utils import secure_filename

create_school_bp = Blueprint('create_school', __name__)

# Absolute path to static/AdminAssets/Image
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.normpath(os.path.join(BASE_DIR, '..', 'static', 'AdminAssets', 'Image'))

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB

def db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=DESKTOP-AN7D5IV;'
        'DATABASE=School_Management;'
        'Trusted_Connection=yes;'
    )

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_school_id():
    return str(uuid.uuid4().hex)[:8].upper()

@create_school_bp.route('/create-school', methods=['GET', 'POST'])
def create_school():
    if request.method == 'POST':
        try:
            # First check if any school exists
            conn = db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM TblSchool")
            school_count = cursor.fetchone()[0]
            
            if school_count > 0:
                flash('Only one school can be created. Delete existing school to create a new one.', 'error')
                return redirect(url_for('admin.create_school.create_school'))
            
            # Proceed with school creation
            name = request.form.get('name')
            mobile = request.form.get('mobile')
            email = request.form.get('email')
            afno = request.form.get('afno')
            address = request.form.get('address')
            file = request.files.get('logo')

            if not all([name, mobile, email, afno, address]):
                flash('All fields are required except logo', 'error')
                return redirect(url_for('admin.create_school.create_school'))

            school_id = generate_school_id()
            filename = None

            # Handle file upload
            if file and file.filename:
                if not allowed_file(file.filename):
                    flash('Invalid file type. Allowed: png, jpg, jpeg, gif', 'error')
                    return redirect(url_for('admin.create_school.create_school'))

                file.seek(0, os.SEEK_END)
                file_length = file.tell()
                file.seek(0)

                if file_length > MAX_FILE_SIZE:
                    flash('File size exceeds 2MB limit', 'error')
                    return redirect(url_for('admin.create_school.create_school'))

                filename = secure_filename(f"{school_id}_{file.filename}")
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(file_path)

            # Check for duplicate
            cursor.execute("SELECT * FROM TblSchool WHERE Mobile=? OR Email=?", (mobile, email))
            if cursor.fetchone():
                flash('School with this mobile or email already exists', 'error')
                return redirect(url_for('admin.create_school.create_school'))

            cursor.execute("""
                INSERT INTO TblSchool (School_Id, Name, Address, Affiliation_Number, Mobile, Email, Image)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (school_id, name, address, afno, mobile, email, filename))
            conn.commit()
            flash('School created successfully!', 'success')

        except Exception as e:
            conn.rollback() if 'conn' in locals() else None
            flash(f'Error: {str(e)}', 'error')
        finally:
            conn.close() if 'conn' in locals() else None

        return redirect(url_for('admin.create_school.create_school'))

    # GET: Fetch all schools
    schools = []
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM TblSchool")
        columns = [column[0] for column in cursor.description]
        schools = [dict(zip(columns, row)) for row in cursor.fetchall()]
    except Exception as e:
        flash(f'Error fetching schools: {str(e)}', 'error')
    finally:
        conn.close() if 'conn' in locals() else None

    return render_template('Admin/CreateSchool.html', schools=schools)

@create_school_bp.route('/delete-school/<int:school_id>', methods=['POST'])
def delete_school(school_id):
    try:
        conn = db_connection()
        cursor = conn.cursor()

        # Get old image filename
        cursor.execute("SELECT Image FROM TblSchool WHERE Id=?", (school_id,))
        result = cursor.fetchone()
        image_filename = result[0] if result else None

        cursor.execute("DELETE FROM TblSchool WHERE Id=?", (school_id,))
        conn.commit()

        # Delete file if it exists
        if image_filename:
            image_path = os.path.join(UPLOAD_FOLDER, image_filename)
            if os.path.exists(image_path):
                os.remove(image_path)

        flash('School deleted successfully!', 'success')

    except Exception as e:
        conn.rollback() if 'conn' in locals() else None
        flash(f'Error deleting school: {str(e)}', 'error')
    finally:
        conn.close() if 'conn' in locals() else None

    return redirect(url_for('admin.create_school.create_school'))

@create_school_bp.route('/update-school/<int:school_id>', methods=['POST'])
def update_school(school_id):
    try:
        name = request.form.get('name')
        mobile = request.form.get('mobile')
        email = request.form.get('email')
        afno = request.form.get('afno')
        address = request.form.get('address')
        file = request.files.get('logo')

        if not all([name, mobile, email, afno, address]):
            flash('All fields are required except logo', 'error')
            return redirect(url_for('admin.create_school.create_school'))

        conn = db_connection()
        cursor = conn.cursor()

        # Check for duplicate (excluding current)
        cursor.execute("""
            SELECT * FROM TblSchool 
            WHERE (Mobile=? OR Email=?) AND Id!=?
        """, (mobile, email, school_id))
        if cursor.fetchone():
            flash('Another school with this mobile or email already exists', 'error')
            return redirect(url_for('admin.create_school.create_school'))

        filename = None
        if file and file.filename:
            if not allowed_file(file.filename):
                flash('Invalid file type.', 'error')
                return redirect(url_for('admin.create_school.create_school'))

            file.seek(0, os.SEEK_END)
            file_length = file.tell()
            file.seek(0)
            if file_length > MAX_FILE_SIZE:
                flash('File too large. Max 2MB allowed.', 'error')
                return redirect(url_for('admin.create_school.create_school'))

            # Delete old image
            cursor.execute("SELECT Image FROM TblSchool WHERE Id=?", (school_id,))
            old_image = cursor.fetchone()[0]
            if old_image:
                old_path = os.path.join(UPLOAD_FOLDER, old_image)
                if os.path.exists(old_path):
                    os.remove(old_path)

            # Save new image
            filename = secure_filename(f"{school_id}_{file.filename}")
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            cursor.execute("""
                UPDATE TblSchool 
                SET Name=?, Mobile=?, Email=?, Affiliation_Number=?, Address=?, Image=?
                WHERE Id=?
            """, (name, mobile, email, afno, address, filename, school_id))
        else:
            # No image update
            cursor.execute("""
                UPDATE TblSchool 
                SET Name=?, Mobile=?, Email=?, Affiliation_Number=?, Address=?
                WHERE Id=?
            """, (name, mobile, email, afno, address, school_id))

        conn.commit()
        flash('School updated successfully!', 'success')

    except Exception as e:
        conn.rollback() if 'conn' in locals() else None
        flash(f'Error updating school: {str(e)}', 'error')
    finally:
        conn.close() if 'conn' in locals() else None

    return redirect(url_for('admin.create_school.create_school'))