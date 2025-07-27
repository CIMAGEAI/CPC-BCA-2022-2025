import sqlite3


con=sqlite3.connect("database.db")
cursor=con.cursor()

try:
    cursor.execute("""CREATE TABLE COURSE  (
                            Course_id TEXT,
                            Name TEXT,
                            Duration TEXT,
                            Teacher TEXT,
                            Fee TEXT)""")
    con.commit()
    con.close()
except:
    pass
