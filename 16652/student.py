import sqlite3


con=sqlite3.connect("database.db")
cursor=con.cursor()

try:
    cursor.execute("""CREATE TABLE STUDENT(
                            Student_id TEXT,
                            Name TEXT,
                            Course TEXT,
                            Gender TEXT,
                            Date_of_birth TEXT,
                            Mobile_no TEXT,
                            City TEXT,
                            District TEXT,
                            State TEXT,
                            Nationality TEXT,
                            Email TEXT,
                            Qualification TEXT,
                            Fee INTEGER,
                            Fee_deposited INTEGER,
                            Fee_remaining INTEGER)""")
    con.commit()
    con.close()
except:
    pass


