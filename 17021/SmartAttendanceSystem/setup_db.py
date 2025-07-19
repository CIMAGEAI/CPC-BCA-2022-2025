import sqlite3

conn = sqlite3.connect('attendance.db')
c = conn.cursor()

# Recreate the correct table
c.execute("DROP TABLE IF EXISTS attendance")

c.execute("""
    CREATE TABLE attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        roll_number TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL
    )
""")

conn.commit()
conn.close()
print("✅ Database and table created successfully.")

