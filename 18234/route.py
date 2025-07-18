# routes.py

from flask import render_template, redirect, url_for

def setup_routes(app):

    @app.route('/')
    def login():
        return render_template("logins.html")

    @app.route('/dashboard')
    def dashboard():
        return render_template("Admin/Dashboard.html")

    @app.route('/logout')
    def logout():
        return redirect(url_for("login"))
