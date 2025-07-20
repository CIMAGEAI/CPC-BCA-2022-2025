import sqlite3


con=sqlite3.connect("database.db")
cursor=con.cursor()

try:
    cursor.execute("""CREATE TABLE TEACHER(
                        Teacher_id TEXT,
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
                        Qualification TEXT)""")
    con.commit()
    con.close()
except:
    pass


