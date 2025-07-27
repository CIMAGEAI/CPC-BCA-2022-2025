import tkinter as tk
from tkinter import messagebox, scrolledtext
import cv2
import face_recognition
import os
import numpy as np
import pandas as pd
import sqlite3
from datetime import datetime
import time

current_frame = None  # Global frame holder for snapshot

# ------------------------ DATABASE SETUP ------------------------
def mark_attendance(name, roll):
    now = datetime.now()
    date = now.strftime("%Y-%m-%d")
    time_now = now.strftime("%H:%M:%S")

    conn = sqlite3.connect('attendance.db')
    c = conn.cursor()
    c.execute("INSERT INTO attendance (student_name, roll_number, date, time) VALUES (?, ?, ?, ?)",
              (name, roll, date, time_now))
    conn.commit()
    conn.close()

    log_box.insert(tk.END, f"✔️ {name} ({roll}) marked at {time_now}\n")
    log_box.see(tk.END)

# ------------------------ SNAPSHOT FEATURE ------------------------
def take_snapshot():
    global current_frame
    if current_frame is not None:
        if not os.path.exists("snapshots"):
            os.makedirs("snapshots")
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"snapshots/snapshot_{timestamp}.jpg"
        cv2.imwrite(filename, current_frame)
        log_box.insert(tk.END, f"📸 Snapshot saved: {filename}\n")
        log_box.see(tk.END)
    else:
        messagebox.showerror("Error", "No frame to capture.")

# ------------------------ GUI FUNCTIONS ------------------------
def start_attendance():
    status_label.config(text="Starting attendance...", fg="#007acc")
    root.update()

    known_faces_dir = "known_faces"
    known_encodings = []
    known_names = []

    for filename in os.listdir(known_faces_dir):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            path = os.path.join(known_faces_dir, filename)
            image = face_recognition.load_image_file(path)
            encodings = face_recognition.face_encodings(image)
            if len(encodings) > 0:
                known_encodings.append(encodings[0])
                full_name = os.path.splitext(filename)[0]
                parts = full_name.split()
                if len(parts) >= 2:
                    name = parts[0]
                    roll = parts[1]
                else:
                    name = full_name
                    roll = "Unknown"
                known_names.append((name, roll))
            else:
                print(f"[⚠️] Warning: No face found in {filename}, skipping.")

    if len(known_encodings) == 0:
        messagebox.showwarning("No Faces Found", "No valid face encodings were found. Please check your images.")
        return

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        status_label.config(text="❌ Could not open webcam", fg="red")
        messagebox.showerror("Webcam Error", "Camera not accessible!")
        return

    print("✅ Webcam accessed successfully.")
    marked_names = set()

    while True:
        ret, frame = cap.read()
        if not ret:
            status_label.config(text="❌ Failed to grab frame", fg="red")
            break

        global current_frame
        current_frame = frame

        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        faces = face_recognition.face_locations(rgb_small)
        encodings = face_recognition.face_encodings(rgb_small, faces)

        for encoding, location in zip(encodings, faces):
            matches = face_recognition.compare_faces(known_encodings, encoding)
            name = "Unknown"
            roll = "Unknown"

            face_distances = face_recognition.face_distance(known_encodings, encoding)
            best_match = np.argmin(face_distances)

            if matches[best_match]:
                name, roll = known_names[best_match]
                if name not in marked_names:
                    mark_attendance(name, roll)
                    marked_names.add(name)
                    status_label.config(text=f"✔️ Marked: {name}", fg="green")
                    root.update()

            top, right, bottom, left = [v * 4 for v in location]
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 255, 0), cv2.FILLED)
            cv2.putText(frame, name, (left + 6, bottom - 6),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)

        cv2.imshow("📸 Smart Attendance System", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    status_label.config(text="✅ Attendance Completed", fg="blue")
    root.update()

def export_report():
    try:
        conn = sqlite3.connect('attendance.db')
        df = pd.read_sql_query("SELECT * FROM attendance", conn)
        conn.close()

        df['date'] = pd.to_datetime(df['date']).dt.strftime('%Y-%m-%d')
        df.to_csv("attendance_report.csv", index=False)

        status_label.config(text="📁 Attendance report exported", fg="green")
        messagebox.showinfo("Success", "CSV report saved as 'attendance_report.csv'")
    except PermissionError:
        messagebox.showerror("File Permission Error", "Close 'attendance_report.csv' if it is open and try again.")
        status_label.config(text="❌ Export Failed: File in use", fg="red")

# ------------------------ GUI DESIGN ------------------------
root = tk.Tk()
root.title("Smart Attendance System")
root.geometry("720x600")
root.configure(bg="#e9f1f7")

try:
    root.iconbitmap("icon.ico")
except:
    pass

title_font = ("Segoe UI Black", 22, "bold")
button_font = ("Segoe UI Semibold", 13)
label_font = ("Segoe UI", 10)

# Header
title_frame = tk.Frame(root, bg="#e9f1f7")
title_frame.pack(pady=10)
tk.Label(title_frame, text="🧠", font=("Segoe UI Emoji", 22), bg="#e9f1f7").pack(side=tk.LEFT, padx=(0, 10))
tk.Label(title_frame, text="Smart Attendance System", font=title_font, fg="#002c54", bg="#e9f1f7").pack(side=tk.LEFT)

# Buttons
button_frame = tk.Frame(root, bg="#e9f1f7")
button_frame.pack(pady=20)

btn_style = {"font": button_font, "width": 22, "height": 2, "bd": 0, "relief": "flat", "activeforeground": "white", "cursor": "hand2"}

start_btn = tk.Button(button_frame, text="📸 Start Attendance", bg="#008cff", fg="white", activebackground="#0073cc", command=start_attendance, **btn_style)
start_btn.grid(row=0, column=0, padx=10, pady=10)

snapshot_btn = tk.Button(button_frame, text="📷 Take Snapshot", bg="#6f42c1", fg="white", activebackground="#5a32a3", command=take_snapshot, **btn_style)
snapshot_btn.grid(row=1, column=0, padx=10, pady=10)

export_btn = tk.Button(button_frame, text="📁 Export Report", bg="#28a745", fg="white", activebackground="#1e7e34", command=export_report, **btn_style)
export_btn.grid(row=2, column=0, padx=10, pady=10)

exit_btn = tk.Button(button_frame, text="❌ Exit Application", bg="#dc3545", fg="white", activebackground="#a71d2a", command=root.quit, **btn_style)
exit_btn.grid(row=3, column=0, padx=10, pady=10)

# Status and Clock
status_label = tk.Label(root, text="", font=label_font, bg="#e9f1f7", fg="#003366")
status_label.pack(pady=5)

clock_label = tk.Label(root, text="", font=label_font, bg="#e9f1f7", fg="#555555")
clock_label.pack(pady=5)

def update_clock():
    now = time.strftime("%A, %d %B %Y   |   %I:%M:%S %p")
    clock_label.config(text=now)
    clock_label.after(1000, update_clock)

update_clock()

# Live Logs Box
log_box = scrolledtext.ScrolledText(root, height=10, width=70, font=("Consolas", 10), bg="#fefefe", fg="#333")
log_box.pack(pady=10)
log_box.insert(tk.END, "[ℹ️] System Initialized.\n")
log_box.config(state="normal")

root.mainloop()
