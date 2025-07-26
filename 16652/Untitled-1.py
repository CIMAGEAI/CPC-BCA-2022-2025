from tkinter import *
from tkinter import messagebox

# Predefined correct username & password
USERNAME = "admin"
PASSWORD = "1234"

def login():
    user = entry_username.get()
    pwd = entry_password.get()

    if user == "" or pwd == "":
        messagebox.showwarning("Warning ⚠️", "Bhai! Username aur Password dono daal.")
    elif user == USERNAME and pwd == PASSWORD:
        messagebox.showinfo("Login Success ✅", "Welcome Bhai, Login ho gaya!")
        # Yahan tu next window ya dashboard khol sakta hai
    else:
        messagebox.showerror("Login Failed ❌", "Galat Username ya Password!")

root = Tk()
root.title("Login Page")
root.geometry("350x250")
root.config(bg="#eef2f3")

Label(root, text="Login to System", font=("Arial", 16, "bold"), bg="#eef2f3").pack(pady=15)

Label(root, text="Username:", bg="#eef2f3").pack()
entry_username = Entry(root, width=25)
entry_username.pack(pady=5)

Label
