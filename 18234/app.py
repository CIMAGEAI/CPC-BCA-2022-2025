from flask import Flask, session, redirect, url_for # type: ignore
from controllers.auth import auth_bp
from controllers.admin import admin_bp


app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Register blueprints with proper names
app.register_blueprint(auth_bp, name='auth')
app.register_blueprint(admin_bp, name='admin', url_prefix='/admin')


@app.route('/')
def home():
    return redirect(url_for('auth.home'))

if __name__ == '__main__':
   app.run(host='127.0.0.1', port=5000, debug=True)