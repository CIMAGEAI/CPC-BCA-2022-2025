from tkinter import *
from tkinter import messagebox

# Dummy user & pass (baad me database se bhi kar sakte ho)
valid_username = "admin"
valid_password = "1234"

def login():
    user = entry_user.get()
    pwd = entry_pass.get()

    if user == "" or pwd == "":
        messagebox.showerror("Error", "All fields are required")
    elif user == valid_username and pwd == valid_password:
        messagebox.showinfo("Success", "Login Successful!")
        root.destroy()
        import College_Management  # ✅ Dashboard yahi se load hoga
    else:
        messagebox.showerror("Error", "Invalid username or password")

# GUI layout
root = Tk()
root.title("Login - College Management System")
root.geometry("400x300")
root.configure(bg="white")

Label(root, text="Login", font=("Arial", 20, "bold"), bg="white").pack(pady=20)

frame = Frame(root, bg="white")
frame.pack(pady=10)

Label(frame, text="Username", font=("Arial", 12), bg="white").grid(row=0, column=0, padx=10, pady=10)
entry_user = Entry(frame, font=("Arial", 12), bd=2, relief=SUNKEN)
entry_user.grid(row=0, column=1, padx=10, pady=10)

Label(frame, text="Password", font=("Arial", 12), bg="white").grid(row=1, column=0, padx=10, pady=10)
entry_pass = Entry(frame, font=("Arial", 12), bd=2, relief=SUNKEN, show="*")
entry_pass.grid(row=1, column=1, padx=10, pady=10)

Button(root, text="Login", font=("Arial", 12, "bold"), bg="#4CAF50", fg="white",
       command=login, width=15).pack(pady=20)

root.mainloop()