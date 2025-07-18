import tkinter as tk
from tkinter import messagebox
import pyodbc



# 1. SQL Server DB Connection
def db_connection():
    return pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=localhost\\SQLEXPRESS;'   # Change if you have a different instance
        'DATABASE=School_Management;'           # Change to your database name
        'UID=sa;'                         # Change to your DB user
        'PWD=your_password_here'          # Change to your DB password
    )

# 2. Login Function
def login():
    user = username_entry.get().strip()
    pwd = password_entry.get().strip()

    if not user or not pwd:
        messagebox.showwarning("Input Error", "Please enter both username and password.")
        return

    try:
        conn = db_connection()
        cursor = conn.cursor()

        query = "SELECT name, Role FROM LoginMaster WHERE UserName=? AND Password=?"
        cursor.execute(query, (user, pwd))
        result = cursor.fetchone()
        conn.close()

        if result:
            name, role = result
            messagebox.showinfo("Login Successful", f"Welcome, {name}!\nRole: {role}")
        else:
            messagebox.showerror("Login Failed", "Incorrect username or password.")

    except Exception as ex:
        messagebox.showerror("Database Error", str(ex))

# 3. Forgot Password Placeholder
def forgot_password():
    messagebox.showinfo("Forgot Password", "Contact admin@example.com to reset your password.")

# 4. GUI Design
root = tk.Tk()
root.title("Login Page")
root.geometry("450x350")
root.configure(bg="#1E90FF")

# Title
tk.Label(root, text="Login Page", font=("Helvetica", 22, "bold"), bg="#1E90FF", fg="white").pack(pady=20)

# Username
tk.Label(root, text="Username:", font=("Arial", 14), bg="#1E90FF", fg="white").pack()
username_entry = tk.Entry(root, font=("Arial", 14), width=30)
username_entry.pack(pady=5)

# Password
tk.Label(root, text="Password:", font=("Arial", 14), bg="#1E90FF", fg="white").pack()
password_entry = tk.Entry(root, font=("Arial", 14), width=30, show="*")
password_entry.pack(pady=5)

# Login Button
tk.Button(root, text="Login", font=("Arial", 14), bg="white", fg="#1E90FF", width=20, command=login).pack(pady=20)

# Forgot Password
tk.Button(root, text="Forgot Password?", font=("Arial", 10), bg="#1E90FF", fg="white", bd=0, command=forgot_password).pack()

root.mainloop()
