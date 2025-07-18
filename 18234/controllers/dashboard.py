from flask import Blueprint, render_template

# Note: This is a sub-blueprint without URL prefix
dashboard_routes = Blueprint('dashboard', __name__)

@dashboard_routes.route('/dashboard')
def show_dashboard():
    dashboard_data = {
        'student_count': 1250,
        'teacher_count': 45,
        'fees_collected': "1,85,000",
        'fees_due': "25,000"
    }
    return render_template('admin/dashboard.html', **dashboard_data)