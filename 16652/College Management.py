from tkinter import *
from tkinter import ttk
from tkinter import messagebox

import sqlite3
from tkinter import filedialog
import random
from datetime import datetime
from PIL import Image, ImageTk
import os

import re 
def validate_name(name):
    if not re.match("^[A-Za-z ]+$", name):
        messagebox.showerror("Invalid Input", "Name should not contain numbers or special characters.")
        return False
    return True

def validate_mobile(mobile):
    if not mobile.isdigit():
        messagebox.showerror("Invalid Mobile", "Mobile number must contain only digits.")
        return False
    elif len(mobile) != 10:
        messagebox.showerror("Invalid Mobile", "Mobile number must be exactly 10 digits.")
        return False
    return True
def validate_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(pattern, email):
        messagebox.showerror("Invalid Email", "Please enter a valid email address.")
        return False
    return True

import re

def validate_name(name):
    if not re.match("^[A-Za-z ]+$", name):
        messagebox.showerror("Invalid Input", "Name should not contain numbers or special characters.")
        return False
    return True

import re

def validate_name(name):
    if not re.match("^[A-Za-z ]+$", name):
        messagebox.showerror("Invalid Input", "Name should not contain numbers or special characters.")
        return False
    return True

import re

def validate_name(name):
    if not re.match("^[A-Za-z ]+$", name):
        messagebox.showerror("Invalid Input", "Name should not contain numbers or special characters.")
        return False
    return True

global frame0
global buttonabout




global filetodelete
global counterhome
global counterteacher
global counterstudent
global counterattendance
global counterfee
global countercourses
global counteraddteacher
global counteraddstudent
global counteraddcourse
global framehome
global frameteachers
global framestudent
global frameattendance
global framecourses
global framefee
global frameaddteacher
global frameaddstudent
global click_updateteacher
global frameupdateteacher
global click_updatestudent
global frameupdatestudent
global frameaddcourse
global frameupdatecourse
global imgadd
global imgback
global frameshowfee
global frameshowstudent
global teachersearchname
global updateteachername
global deleteteachername
global studentsearchname
global updatestudentname
global deletestudentname
global coursesearchname
global updatecoursename
global deletecoursename
global searchstudentfee
global updatestudentfee
global frameupdatefee
global entryfeeremaining
global entryfeedeposited
global attdate
global attcourse
global counterupdateteacher
global counterupdatestudent
global counterupdatecourse
global counterupdatefee
global frameshowteachers
global imagepluswhite
global frameimage
global treeimages
global click_addimage
global click_deleteimage

counterteacher = 0
counterstudent = 0
countercourses = 0
counterfee = 0
counterattendance = 0
counterhome = 1
counteraddteacher = 0
counteraddstudent = 0
counteraddcourse = 0
counterupdateteacher = 0
counterupdatestudent = 0
counterupdatecourse = 0
counterupdatefee = 0

root = Tk()
root.title("Institute Record Manager")

root.geometry("1360x700+0+0")
root.minsize(1020,600)
root.maxsize(1920,1080)





con=sqlite3.connect("database.db")
cursor=con.cursor()

try:
    cursor.execute("""CREATE TABLE ATTENDANCE(
                        Student_id text,
                        Student_name text,
                        course text,
                        Date text,
                        Attendance text)""")
    con.commit()
    con.close()
except:
    pass

try:
    cursor.execute("""CREATE TABLE IMAGE(
                        NAME TEXT,
                        DATA BLOB)""")
    con.commit()
    con.close()
except:
    pass

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

def click_updatefee(event):
    global entryfeeremaining
    global entryfeedeposited
    global framefee
    global frameupdatefee
    global counterfee
    global imgback
    global updatestudentfee
    global counterupdatefee

    counterupdatefee += 1
    def depositfee():
        global entryfeeremaining
        global entryfeedeposited
        global updatestudentfee
        try:
            tempfee = int(newdeposit.get())
        except:
            messagebox.showerror("Error.","Please Enter Amount to in Numbers.")
        if len(newdeposit.get()) == 0:
            messagebox.showerror("Error.","Please Enter Amount to Deposit.")
        elif tempfee == 0:
            messagebox.showerror("Error.", "Amount can not be 0.")

        else:
            try:
                feedepositing = int(newdeposit.get())
                query = """select Fee_remaining from student where Student_id = {}""".format(updatestudentfee.get())
                cursor.execute(query)
                for row in cursor:
                    feeremaining.set(row[0])
                if feedepositing > int(feeremaining.get()):
                    messagebox.showerror("Error!", "Amount Can not be greater than Reamining.")
                else:
                    query = """update student set Fee_deposited = Fee_deposited + {} where Student_id = '{}' """.format(
                        feedepositing, updatestudentfee.get())
                    cursor.execute(query)
                    connection.commit()
                    query = """update student set Fee_remaining = Fee - Fee_deposited where Student_id = '{}' """.format(
                        updatestudentfee.get())
                    cursor.execute(query)
                    connection.commit()
                    query = """insert into feerecord values('{}','{}','{}')""".format(updatestudentfee.get(),
                                                                                      feedepositing, datetime.now())
                    cursor.execute(query)
                    connection.commit()

                    messagebox.showinfo("Congrats.", "Fee deposited successfully.")

                    query = """select count(*) from feerecord where Student_id = '{}'""".format(updatestudentfee.get())
                    cursor.execute(query)
                    for row in cursor:
                        count = row[0]
                    if count != 0:
                        label = Label(frameright, text="Fee Deposited", bg="white", borderwidth=1, relief=SOLID,
                                      font=("", 11, "bold"))
                        label.grid(row=0, column=3, sticky=EW, pady=(10, 1), padx=(50, 0), ipadx=5, ipady=5)
                        label = Label(frameright, text="Date", bg="white", borderwidth=1, relief=SOLID,
                                      font=("", 11, "bold"))
                        label.grid(row=0, column=4, sticky=EW, pady=(10, 1), ipadx=5, ipady=5)
                        query = """select Fee_deposited, Date from feerecord where Student_id = {}""".format(
                            updatestudentfee.get())
                        cursor.execute(query)
                        record = cursor.fetchall()
                        x = 1
                        for row in record:
                            label = Label(frameright, text='{}'.format(row[0]), bg="white", borderwidth=1, relief=SOLID)
                            label.grid(row=x, column=3, sticky=EW, pady=1, padx=(50, 0), ipadx=5, ipady=5)
                            label = Label(frameright, text='{}'.format(row[1]), bg="white", borderwidth=1, relief=SOLID)
                            label.grid(row=x, column=4, sticky=EW, pady=1, ipadx=5, ipady=5)
                            x += 1
                        query = """select Fee_deposited,Fee_remaining from student where Student_id = {}""".format(
                            updatestudentfee.get())
                        cursor.execute(query)
                        for row in cursor:
                            feedeposited.set(row[0])
                            feeremaining.set(row[1])
                        newdeposit.set("")
            except:
                messagebox.showerror("Errror.","Please enter amount in numbers.")



    if len(updatestudentfee.get()) == 0:
        messagebox.showerror("Error","Please Enter ID.")
    else:
        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        query = """SELECT count(*) FROM STUDENT WHERE Student_id = '{}'""".format(updatestudentfee.get())
        cursor.execute(query)
        for row in cursor:
            temp = row[0]
        if temp == 0:
            messagebox.showinfo("Error", "ID '{}' doesn't exist".format(updatestudentfee.get()))
        else:
            counterfee = 0
            framefee.destroy()
            frameupdatefee = Frame(root,bg="white", borderwidth=2, relief="solid")
            frameupdatefee.pack(side=TOP, fill=BOTH, expand=True)

            frametop = Frame(frameupdatefee,bg="white")
            frametop.pack(anchor="nw", padx=10, pady=10)

            imgback = PhotoImage(file="back.png", width=30, height=30)
            labelimgback = Label(frametop, image=imgback, bg="white")
            labelimgback.pack(side="left")

            labelimgback.bind("<Button-1>", click_fee)

            frameBottom = Frame(frameupdatefee, bg="white")
            frameBottom.pack(side="top",fill=X,pady=20)

            frameleft = Frame(frameBottom, bg="white")
            frameleft.pack(anchor='nw',side="left", pady=20)

            frameright = Frame(frameBottom, bg="white")
            frameright.pack(side="left",pady=20,fill=BOTH,expand=True)

            name = StringVar()
            totelfee = StringVar()
            course = StringVar()
            feeremaining = StringVar()
            feedeposited = StringVar()
            newdeposit = StringVar()

            labelname = Label(frameleft,text="Name:",bg="white")
            labelname.grid(row=0,column=0,padx=10,pady=10,sticky=E)
            entryname = Entry(frameleft,bg="white",borderwidth=1,relief="solid",textvariable=name,state='disabled')
            entryname.grid(row=0,column=1,padx=10,pady=10,columnspan=2)

            labelcourse = Label(frameleft,text="Course:",bg="white")
            labelcourse.grid(row=1,column=0,padx=10,pady=10,sticky=E)

            entrycourse = Entry(frameleft,bg="white",borderwidth=1,relief="solid",textvariable=course,state='disabled')
            entrycourse.grid(row=1,column=1,padx=10,pady=10,columnspan=2)


            labeltotalfee = Label(frameleft,text="Totel Fee:",bg="white")
            labeltotalfee.grid(row=2,column=0,padx=10,pady=10,sticky=E)

            entrytotelfee = Entry(frameleft,borderwidth=1,relief="solid",textvariable=totelfee,state='disabled')
            entrytotelfee.grid(row=2,column=1,padx=10,pady=10,columnspan=2)

            labelfeeremaining = Label(frameleft,bg="white",text="Fee Remaining:")
            labelfeeremaining.grid(row=3,column=0,padx=10,pady=10,sticky=E)

            entryfeeremaining = Entry(frameleft,bg="white",borderwidth=1,relief="solid",textvariable=feeremaining,state='disabled')
            entryfeeremaining.grid(row=3,column=1,padx=10,pady=10,columnspan=2)

            labelfeedeposited = Label(frameleft, bg="white", text="Fee Deposited:")
            labelfeedeposited.grid(row=4, column=0, padx=10, pady=10, sticky=E)

            entryfeedeposited = Entry(frameleft, bg="white", borderwidth=1, relief="solid", textvariable=feedeposited,state='disabled')
            entryfeedeposited.grid(row=4, column=1, padx=10, pady=10,columnspan=2)

            labelnewdeposit = Label(frameleft,bg="white",text="New Deposit:")
            labelnewdeposit.grid(row=5,column=0,padx=10,pady=10,sticky=E)

            entrynewdeposit = Entry(frameleft,bg="white",textvariable=newdeposit,borderwidth=1,relief="solid")
            entrynewdeposit.grid(row=5,column=1,padx=10,pady=10,columnspan=2)

            buttondeposit = Button(frameleft,text="Deposit",bg="lightblue",command = lambda: depositfee())
            buttondeposit.grid(row=6,column=1,padx=10,pady=10)

            connection = sqlite3.connect("database.db")
            cursor = connection.cursor()
            query = """SELECT Name,Course,Fee,Fee_remaining,Fee_deposited FROM STUDENT WHERE Student_id = '{}'""".format(updatestudentfee.get())
            cursor.execute(query)

            newrecord = cursor.fetchall()
            for row in newrecord:
                name.set(row[0])
                course.set(row[1])
                totelfee.set(row[2])
                feeremaining.set(row[3])
                feedeposited.set(row[4])




            query = """select count(*) from feerecord where Student_id = '{}'""".format(updatestudentfee.get())
            cursor.execute(query)
            for row in cursor:
                count = row[0]
            if count != 0:
                label = Label(frameright,text="Fee Deposited",bg="white",borderwidth=1,relief=SOLID,font=("", 11, "bold"))
                label.grid(row=0,column=3,sticky=EW,pady=(10,1),padx=(50,0),ipadx=5,ipady=5)
                label = Label(frameright, text="Date", bg="white",borderwidth=1,relief=SOLID,font=("", 11, "bold"))
                label.grid(row=0, column=4,sticky=EW,pady=(10,1),ipadx=5,ipady=5)
                query = """select Fee_deposited, Date from feerecord where Student_id = {}""".format(updatestudentfee.get())
                cursor.execute(query)
                record=cursor.fetchall()
                x=1
                for row in record:
                    label = Label(frameright,text='{}'.format(row[0]),bg="white",borderwidth=1,relief=SOLID)
                    label.grid(row=x,column=3,sticky=EW,pady=1,padx=(50,0),ipadx=5,ipady=5)
                    label = Label(frameright,text='{}'.format(row[1]),bg="white",borderwidth=1,relief=SOLID)
                    label.grid(row=x,column=4,sticky=EW,pady=1,ipadx=5,ipady=5)
                    x+=1


def click_updatestudent(event):
    global framestudent
    global frameupdatestudent
    global counterstudent
    global imgback
    global counterupdatestudent

    counterupdatestudent += 1
    def updatestudent():
        if len(name.get()) == 0:
            messagebox.showinfo("Error!", 'Please enter Name at least.')
            return
        elif not  validate_name(name.get()):
            messagebox.showinfo("ERROR!", 'Please enter valid name.')
            return
        else:
            connection = sqlite3.connect("database.db")
            cursor = connection.cursor()
            query = """UPDATE student SET Name = '{}',
                    Course = '{}',
                    Gender = '{}',
                    Date_of_birth = '{}',
			        Mobile_no = '{}',
			        City = '{}',
			        District = '{}',
			        State = '{}',
			        Nationality = '{}',
			        Email = '{}',
			        Qualification = '{}',
			        fee = '{}'
			        where Student_id = '{}'""".format(name.get(),course.get(),gender.get(),dateofbirth.get(),mobileno.get(),city.get(),district.get(),State.get(),Nationality.get(),emailid.get(),qualificatoin.get(),fee.get(),updatestudentname.get())
            cursor.execute(query)
            connection.commit()
            cursor.close()
            messagebox.showinfo("Congratulations", 'Record Updated successfully.')

    def clear():
        name.set("")
        course.set("")
        gender.set(None)
        dateofbirth.set("")
        mobileno.set("")
        course.set("")
        city.set("")
        district.set("")
        State.set("")
        Nationality.set("")
        emailid.set("")
        qualificatoin.set("")

    if len(updatestudentname.get()) == 0:
        messagebox.showinfo("Warining", 'Please enter ID.')
    else:
        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        query = """SELECT count(*) FROM STUDENT WHERE Student_id = '{}'""".format(updatestudentname.get())
        cursor.execute(query)
        for row in cursor:
            temp = row[0]
        if temp == 0:
            messagebox.showinfo("Error", "'{}' doesn't exist".format(updatestudentname.get()))
        else:
            counterstudent = 0
            framestudent.destroy()
            frameupdatestudent = Frame(root, width=100, height=100, bg="white", borderwidth=2, relief="solid")
            frameupdatestudent.pack(side=TOP, fill=BOTH, expand=True)

            frametop = Frame(frameupdatestudent, width=150, height=40, bg="white")
            frametop.pack(anchor="nw", padx=10, pady=10)

            imgback = PhotoImage(file="back.png", width=30, height=30)
            labelimgback = Label(frametop, image=imgback,bg="white")
            labelimgback.pack(side="left")


            labelimgback.bind("<Button-1>", click_students)



            frameBottom = Frame(frameupdatestudent, bg="white", width=100, height=100)
            frameBottom.pack(side="bottom", fill=BOTH, expand=True, pady=20)

            name = StringVar()
            course = StringVar()
            gender = StringVar()
            gender.set("Male")
            dateofbirth = StringVar()
            mobileno = StringVar()
            city = StringVar()
            district = StringVar()
            State = StringVar()
            Nationality = StringVar()
            emailid = StringVar()
            qualificatoin = StringVar()
            fee = StringVar()

            connection = sqlite3.connect("database.db")
            cursor = connection.cursor()
            result = cursor.execute("SELECT * FROM STUDENT WHERE Student_id = '{}'".format(updatestudentname.get()))
            for row in result:
                name.set(row[1])
                course.set(row[2])
                gender.set(row[3])
                dateofbirth.set(row[4])
                mobileno.set(row[5])
                city.set(row[6])
                district.set(row[7])
                State.set(row[8])
                Nationality.set(row[9])
                emailid.set(row[10])
                qualificatoin.set(row[11])
                fee.set(row[12])
            cursor.close()

            labelname = Label(frameBottom, text="Name:", bg="white")
            labelname.grid(row=0, column=0, padx=10, pady=10, sticky="e")

            entryname = Entry(frameBottom, width=25, textvariable=name,relief="solid")
            entryname.grid(row=0, column=1, columnspan=2, padx=10, pady=10)

            labelcourse = Label(frameBottom, text="Course:", bg="white")
            labelcourse.grid(row=1, column=0, padx=10, pady=10, sticky="e")

            listcourse = []
            con = sqlite3.connect("database.db")
            cursor = con.cursor()
            cursor.execute("select Name from course order by Name ASC")
            record = cursor.fetchall()
            for row in record:
                listcourse.append(row[0])

            entrycourse = OptionMenu(frameBottom, course, *listcourse)
            entrycourse.config(compound='left', bg="white", relief="solid", borderwidth=1,state='disabled')
            entrycourse.grid(row=1, column=1, sticky='EW', columnspan=2, padx=10, pady=10)

            labelgender = Label(frameBottom, text="Gender:", bg="white")
            labelgender.grid(row=2, column=0, padx=10, pady=10, sticky="e")

            male = Radiobutton(frameBottom, text="Male", variable=gender, value="Male", bg="white")
            male.grid(row=2, column=1, padx=10, pady=10)

            female = Radiobutton(frameBottom, text="Female", variable=gender, value="Female", bg="white")
            female.grid(row=2, column=2, padx=10, pady=10)

            labeldob = Label(frameBottom, text="Date Of Birth:", bg="white")
            labeldob.grid(row=3, column=0, padx=10, pady=10, sticky="e")

            entrydob = Entry(frameBottom, width=25, textvariable=dateofbirth,relief="solid")
            entrydob.grid(row=3, column=1, columnspan=2)

            labelMnumber = Label(frameBottom, text="Mobile Number:", bg="white")
            labelMnumber.grid(row=4, column=0, sticky="e", padx=10, pady=10)

            entryMnumber = Entry(frameBottom, width=25, textvariable=mobileno,relief="solid")
            entryMnumber.grid(row=4, column=1, columnspan=2, padx=10, pady=10)

            labelcity = Label(frameBottom, text="city:", bg="white")
            labelcity.grid(row=5, column=0, padx=10, pady=10, sticky="e")

            entryaddress = Entry(frameBottom, width=25, textvariable=city,relief="solid")
            entryaddress.grid(row=5, column=1, columnspan=2, padx=10, pady=10)

            labeldistrict = Label(frameBottom, text="District:", bg="white")
            labeldistrict.grid(row=5, column=3, padx=10, pady=10, sticky="e")

            entrydistrict = Entry(frameBottom, width=25, textvariable=district,relief="solid")
            entrydistrict.grid(row=5, column=4, columnspan=2, padx=10, pady=10)

            labelstate = Label(frameBottom, text="State:", bg="white")
            labelstate.grid(row=5, column=7, padx=10, pady=10, sticky="e")

            entrystate = Entry(frameBottom, width=25, textvariable=State,relief="solid")
            entrystate.grid(row=5, column=8, columnspan=2, padx=10, pady=10)

            labelnation = Label(frameBottom, text="Nationality:", bg="white")
            labelnation.grid(row=6, column=0, padx=10, pady=10, sticky="e")

            entrynation = Entry(frameBottom, width=25, textvariable=Nationality,relief="solid")
            entrynation.grid(row=6, column=1, columnspan=2, padx=10, pady=10)

            labelemail = Label(frameBottom, text="Email ID:", bg="white")
            labelemail.grid(row=7, column=0, padx=10, pady=10, sticky="e")

            entryemail = Entry(frameBottom, width=25, textvariable=emailid,relief="solid")
            entryemail.grid(row=7, column=1, columnspan=2, padx=10, pady=10)

            labelqual = Label(frameBottom, text="Qualificatoin:", bg="white")
            labelqual.grid(row=8, column=0, padx=10, pady=10, sticky="e")

            entryqual = Entry(frameBottom, width=25, textvariable=qualificatoin,relief="solid")
            entryqual.grid(row=8, column=1, columnspan=2, padx=10, pady=10)

            labelfee = Label(frameBottom, text="Fee:", bg="white")
            labelfee.grid(row=9, column=0, padx=10, pady=10, sticky="e")

            entryfee = Entry(frameBottom, width=25, textvariable=fee, relief="solid",state='disabled')
            entryfee.grid(row=9, column=1, columnspan=2, padx=10, pady=10)

            buttonadd = Button(frameBottom, text="Update", bg="lightblue", command=lambda: updatestudent())
            buttonadd.grid(row=10, column=1, pady=10)

            buttonclear = Button(frameBottom, text="Clear", bg="lightblue", command=clear)
            buttonclear.grid(row=10, column=2, pady=10)


def click_updateteacher(event):
    global updateteachername
    global frameteachers
    global frameupdateteacher
    global counterteacher
    global imgback
    global counterupdateteacher

    counterupdateteacher += 1
    def updateteacher():
        if len(updateteachername.get()) == 0:
            messagebox.showinfo("Error!", 'Please enter Name at least.')
        else:
            connection = sqlite3.connect("database.db")
            cursor = connection.cursor()
            query = """UPDATE teacher SET Name = '{}',
                    Course = '{}',
                    Gender = '{}',
                    Date_of_birth = '{}',
			        Mobile_no = '{}',
			        City = '{}',
			        District = '{}',
			        State = '{}',
			        Nationality = '{}',
			        Email = '{}',
			        Qualification = '{}'
			        where Teacher_id = '{}'""".format(name.get(),course.get(),gender.get(),dateofbirth.get(),mobileno.get(),city.get(),district.get(),State.get(),Nationality.get(),emailid.get(),qualificatoin.get(),updateteachername.get())
            cursor.execute(query)
            connection.commit()
            cursor.close()
            messagebox.showinfo("Congratulations", 'Record Updated successfully.')

    def clear():
        name.set("")
        course.set("")
        gender.set(None)
        dateofbirth.set("")
        mobileno.set("")
        city.set("")
        district.set("")
        State.set("")
        Nationality.set("")
        emailid.set("")
        qualificatoin.set("")

    if len(updateteachername.get()) == 0:
        messagebox.showinfo("Warining", 'Please enter ID.')
    else:
        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        query = """SELECT count(*) FROM TEACHER WHERE Teacher_id = '{}'""".format(updateteachername.get())
        cursor.execute(query)
        for row in cursor:
            temp = row[0]
        if temp == 0:
            messagebox.showinfo("Error", "'{}' doesn't exist".format(updateteachername.get()))
        else:
            counterteacher = 0
            frameteachers.destroy()
            frameupdateteacher = Frame(root, width=100, height=100, bg="white", borderwidth=2, relief="solid")
            frameupdateteacher.pack(side=TOP, fill=BOTH, expand=True)

            frametop = Frame(frameupdateteacher, width=150, height=40, bg="white")
            frametop.pack(anchor="nw", padx=10, pady=10)

            imgback = PhotoImage(file="back.png", width=30, height=30)
            labelimgback = Label(frametop, image=imgback,bg="white")
            labelimgback.pack(side="left")


            frametop.bind("<Button-1>", click_teachers)
            labelimgback.bind("<Button-1>", click_teachers)

            frameBottom = Frame(frameupdateteacher, bg="white", width=100, height=100)
            frameBottom.pack(side="bottom", fill=BOTH, expand=True, pady=20)

            name = StringVar()
            course = StringVar()
            gender = StringVar()
            gender.set("Male")
            dateofbirth = StringVar()
            mobileno = StringVar()
            city = StringVar()
            district = StringVar()
            State = StringVar()
            Nationality = StringVar()
            emailid = StringVar()
            qualificatoin = StringVar()

            connection = sqlite3.connect("database.db")
            cursor = connection.cursor()
            result = cursor.execute("SELECT * FROM TEACHER WHERE Teacher_id = '{}'".format(updateteachername.get()))
            for row in result:
                name.set(row[1])
                course.set(row[2])
                gender.set(row[3])
                dateofbirth.set(row[4])
                mobileno.set(row[5])
                city.set(row[6])
                district.set(row[7])
                State.set(row[8])
                Nationality.set(row[9])
                emailid.set(row[10])
                qualificatoin.set(row[11])
            cursor.close()

            labelname = Label(frameBottom, text="Name:", bg="white")
            labelname.grid(row=0, column=0, padx=10, pady=10, sticky="e")

            entryname = Entry(frameBottom, width=25, textvariable=name,relief="solid")
            entryname.grid(row=0, column=1, columnspan=2, padx=10, pady=10)

            labelcourse = Label(frameBottom, text="Course:", bg="white")
            labelcourse.grid(row=1, column=0, padx=10, pady=10, sticky="e")

            listcourse = []
            con = sqlite3.connect("database.db")
            cursor = con.cursor()
            cursor.execute("select Name from course order by Name asc")
            record = cursor.fetchall()
            for row in record:
                listcourse.append(row[0])

            entrycourse = OptionMenu(frameBottom, course, *listcourse)
            entrycourse.config(compound='left', bg="white", relief="solid", borderwidth=1)
            entrycourse.grid(row=1, column=1, sticky='EW', columnspan=2, padx=10, pady=10)

            labelgender = Label(frameBottom, text="Gender:", bg="white")
            labelgender.grid(row=2, column=0, padx=10, pady=10, sticky="e")

            male = Radiobutton(frameBottom, text="Male", variable=gender, value="Male", bg="white")
            male.grid(row=2, column=1, padx=10, pady=10)

            female = Radiobutton(frameBottom, text="Female", variable=gender, value="Female", bg="white")
            female.grid(row=2, column=2, padx=10, pady=10)

            labeldob = Label(frameBottom, text="Date Of Birth:", bg="white")
            labeldob.grid(row=3, column=0, padx=10, pady=10, sticky="e")

            entrydob = Entry(frameBottom, width=25, textvariable=dateofbirth,relief="solid")
            entrydob.grid(row=3, column=1, columnspan=2)

            labelMnumber = Label(frameBottom, text="Mobile Number:", bg="white")
            labelMnumber.grid(row=4, column=0, sticky="e", padx=10, pady=10)

            entryMnumber = Entry(frameBottom, width=25, textvariable=mobileno,relief="solid")
            entryMnumber.grid(row=4, column=1, columnspan=2, padx=10, pady=10)

            labelcity = Label(frameBottom, text="city:", bg="white")
            labelcity.grid(row=5, column=0, padx=10, pady=10, sticky="e")

            entryaddress = Entry(frameBottom, width=25, textvariable=city,relief="solid")
            entryaddress.grid(row=5, column=1, columnspan=2, padx=10, pady=10)

            labeldistrict = Label(frameBottom, text="District:", bg="white")
            labeldistrict.grid(row=5, column=3, padx=10, pady=10, sticky="e")

            entrydistrict = Entry(frameBottom, width=25, textvariable=district,relief="solid")
            entrydistrict.grid(row=5, column=4, columnspan=2, padx=10, pady=10)

            labelstate = Label(frameBottom, text="State:", bg="white")
            labelstate.grid(row=5, column=7, padx=10, pady=10, sticky="e")

            entrystate = Entry(frameBottom, width=25, textvariable=State,relief="solid")
            entrystate.grid(row=5, column=8, columnspan=2, padx=10, pady=10)

            labelnation = Label(frameBottom, text="Nationality:", bg="white")
            labelnation.grid(row=6, column=0, padx=10, pady=10, sticky="e")

            entrynation = Entry(frameBottom, width=25, textvariable=Nationality,relief="solid")
            entrynation.grid(row=6, column=1, columnspan=2, padx=10, pady=10)

            labelemail = Label(frameBottom, text="Email ID:", bg="white")
            labelemail.grid(row=7, column=0, padx=10, pady=10, sticky="e")

            entryemail = Entry(frameBottom, width=25, textvariable=emailid,relief="solid")
            entryemail.grid(row=7, column=1, columnspan=2, padx=10, pady=10)

            labelqual = Label(frameBottom, text="Qualificatoin:", bg="white")
            labelqual.grid(row=8, column=0, padx=10, pady=10, sticky="e")

            entryqual = Entry(frameBottom, width=25, textvariable=qualificatoin,relief="solid")
            entryqual.grid(row=8, column=1, columnspan=2, padx=10, pady=10)

            buttonadd = Button(frameBottom, text="Update", bg="lightblue", command=lambda: updateteacher())
            buttonadd.grid(row=9, column=1, pady=10)

            buttonclear = Button(frameBottom, text="Clear", bg="lightblue", command=clear)
            buttonclear.grid(row=9, column=2, pady=10)


def click_updatecourse(event):
    global framecourses
    global frameupdatecourse
    global countercourses
    global imgback
    global updatecoursename
    global counterupdatecourse

    counterupdatecourse += 1
    def updatecourse():
        global updatecoursename
        if len(name.get()) == 0:
            messagebox.showinfo("Error!", 'Please enter Name at least.')
        else:
            connection = sqlite3.connect("database.db")
            cursor = connection.cursor()
            query = """UPDATE course SET Name = '{}',
                        Duration = '{}',
                        Teacher = '{}',
    			        Fee = '{}'
    			        where Course_id = '{}'""".format(name.get(), duration.get(), teacher.get(), fee.get(), updatecoursename.get())
            cursor.execute(query)
            connection.commit()
            cursor.close()
            messagebox.showinfo("Congratulations", 'Record Updated successfully.')

    def clear():
        name.set("")
        duration.set("")
        teacher.set("")
        fee.set("")

    if len(updatecoursename.get()) == 0:
        messagebox.showinfo("Warining", 'Please enter ID.')
    else:
        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        query = """SELECT count(*) FROM course WHERE Course_id = '{}'""".format(updatecoursename.get())
        cursor.execute(query)
        for row in cursor:
            temp = row[0]
        if temp == 0:
            messagebox.showinfo("Error", "'{}' doesn't exist".format(updatecoursename.get()))
        else:
            countercourses = 0
            framecourses.destroy()
            frameupdatecourse = Frame(root, width=100, height=100, bg="white", borderwidth=2, relief="solid")
            frameupdatecourse.pack(side=TOP, fill=BOTH, expand=True)

            frametop = Frame(frameupdatecourse, width=150, height=40, bg="white")
            frametop.pack(anchor="nw", padx=10, pady=10)

            imgback = PhotoImage(file="back.png", width=30, height=30)
            labelimgback = Label(frametop, image=imgback, bg="white")
            labelimgback.pack(side="left")

            frametop.bind("<Button-1>", click_courses)
            labelimgback.bind("<Button-1>", click_courses)


            frameBottom = Frame(frameupdatecourse, bg="white", width=100, height=100)
            frameBottom.pack(side="bottom", fill=BOTH, expand=True, pady=20)

            name = StringVar()
            duration = StringVar()
            teacher = StringVar()
            fee = StringVar()


            connection = sqlite3.connect("database.db")
            cursor = connection.cursor()
            result = cursor.execute("SELECT * FROM course WHERE Course_id = '{}'".format(updatecoursename.get()))
            for row in result:
                name.set(row[1])
                duration.set(row[2])
                teacher.set(row[3])
                fee.set(row[4])
            cursor.close()

            labelname = Label(frameBottom, text="Course Name:", bg="white")
            labelname.grid(row=0, column=0, padx=10, pady=10, sticky="e")

            entryname = Entry(frameBottom, width=25, textvariable=name, relief="solid")
            entryname.grid(row=0, column=1, columnspan=2, padx=10, pady=10)

            labelduration = Label(frameBottom, text="Duration:", bg="white")
            labelduration.grid(row=1, column=0, padx=10, pady=10, sticky="e")

            entryduration = Entry(frameBottom, width=25, textvariable=duration, relief="solid")
            entryduration.grid(row=1, column=1, columnspan=2)

            labelteacher = Label(frameBottom, text="Teacher:", bg="white")
            labelteacher.grid(row=2, column=0, sticky="e", padx=10, pady=10)

            listteacher = []
            con = sqlite3.connect("database.db")
            cursor = con.cursor()
            cursor.execute("select Name from teacher order by Name asc")
            record = cursor.fetchall()
            for row in record:
                listteacher.append(row[0])

            entryteacher = OptionMenu(frameBottom, teacher, *listteacher)
            entryteacher.config(compound='left', bg="white", relief="solid", borderwidth=1)
            entryteacher.grid(row=2, column=1, sticky='EW', columnspan=2, padx=10, pady=10)

            labelfee = Label(frameBottom, text="Fee:", bg="white")
            labelfee.grid(row=3, column=0, sticky="e", padx=10, pady=10)

            entryfee = Entry(frameBottom, width=25, textvariable=fee, relief="solid")
            entryfee.grid(row=3, column=1, columnspan=2, padx=10, pady=10)

            buttonadd = Button(frameBottom, text="Update", bg="lightblue", command=lambda: updatecourse())
            buttonadd.grid(row=4, column=1, pady=10)

            buttonclear = Button(frameBottom, text="Clear", bg="lightblue", command=clear)
            buttonclear.grid(row=4, column=2, pady=10)


def click_addcourse(event):
    global framecourses
    global frameaddcourse
    global countercourses
    global frameaddcourse
    global counteraddcourse
    global imgback

    counteraddcourse+=1
    countercourses=0

    def addnewcourse():
        if len(name.get()) == 0:
            messagebox.showinfo("Error!", 'Please enter Name at least.')
            return
        elif not validate_name(name.get()):
            messagebox.showinfo("Error!", 'Please eenter valid name.')
            return
        else:
            if teacher.get() == "Select Teacher":
                messagebox.showwarning("Warning","Please select a Teacher.")
            else:

                connect = sqlite3.connect("database.db")
                query = f"INSERT INTO course values('{random.randint(1000000000,9999999999)}','{name.get()}','{duration.get()}','{teacher.get()}','{fee.get()}')"
                cursor = connect.cursor()
                cursor.execute(query)
                if cursor.rowcount > 0:
                    messagebox.showinfo("Congratulations", 'Record Added successfully.')

                connect.commit()
                cursor.close()
                connect.close()

    def clear():
        name.set("")
        duration.set("")
        teacher.set("")
        fee.set("")


    framecourses.destroy()

    frameaddcourse = Frame(root, bg="white", width=100, height=100, bd=2, relief="solid")
    frameaddcourse.pack(side="left", fill=BOTH, expand=True)

    frametop = Frame(frameaddcourse, width=150, height=40, bg="white")
    frametop.pack(anchor="nw", padx=10, pady=10)

    imgback = PhotoImage(file="back.png", width=30, height=30)
    labelimgback = Label(frametop, image=imgback,bg="white")
    labelimgback.pack(side="left")


    frametop.bind("<Button-1>", click_courses)
    labelimgback.bind("<Button-1>", click_courses)

    frameBottom = Frame(frameaddcourse, bg="white", width=100, height=100)
    frameBottom.pack(side="bottom", fill=BOTH, expand=True, pady=20)

    name = StringVar()
    duration = StringVar()
    teacher = StringVar()
    fee = StringVar()

    labelname = Label(frameBottom, text="Course Name:", bg="white")
    labelname.grid(row=0, column=0, padx=10, pady=10, sticky="e")

    entryname = Entry(frameBottom, width=25, textvariable=name,relief="solid")
    entryname.grid(row=0, column=1, columnspan=2, padx=10, pady=10)

    labelduration = Label(frameBottom, text="Duration:", bg="white")
    labelduration.grid(row=1, column=0, padx=10, pady=10, sticky="e")

    entryduration = Entry(frameBottom, width=25, textvariable=duration,relief="solid")
    entryduration.grid(row=1, column=1, columnspan=2)

    labelteacher = Label(frameBottom, text="Teacher:", bg="white")
    labelteacher.grid(row=2, column=0, sticky="e", padx=10, pady=10)

    listteacher = []
    con = sqlite3.connect("database.db")
    cursor = con.cursor()
    cursor.execute("select Name from teacher order by Name asc")
    cursor.execute("select Name from teacher order by Name asc")
    record = cursor.fetchall()
    for row in record:
        listteacher.append(row[0])

    entryteacher = OptionMenu(frameBottom, teacher,"Select Teacher", *listteacher)
    entryteacher.config(compound='left',bg="white",relief="solid",borderwidth=1)
    entryteacher.grid(row=2, column=1, sticky='EW',columnspan=2, padx=10, pady=10)

    labelfee = Label(frameBottom, text="Fee:", bg="white")
    labelfee.grid(row=3, column=0, padx=10, pady=10, sticky="e")

    entryfee = Entry(frameBottom, width=25, textvariable=fee,relief="solid")
    entryfee.grid(row=3, column=1, columnspan=2, padx=10, pady=10)

    buttonadd = Button(frameBottom, text="Add", bg="lightblue", command=addnewcourse)
    buttonadd.grid(row=4, column=1, pady=10)

    buttonclear = Button(frameBottom, text="Clear", bg="lightblue", command=clear)
    buttonclear.grid(row=4, column=2, pady=10)


def click_addteacher(event):
    global counteraddteacher
    global frameaddteacher
    global frameteachers
    global counterteacher
    global imgback

    counteraddteacher += 1
    counterteacher = 0


    def addnewteacher():
        if len(name.get()) == 0:
            messagebox.showerror("Error!", 'Please enter Name at least.')
            return
        elif not validate_name(name.get()):
            messagebox.showerror("Error!", 'please enter vlid name.')
            return
        elif not validate_mobile(mobileno.get()):
            return
        elif not validate_email(emailid.get()):
             return
        else:
            if course.get() == "Select Option":
                messagebox.showwarning("Warning","Please select a course.")
            else:

                connect = sqlite3.connect("database.db")
                cursor = connect.cursor()
                query = f"INSERT INTO teacher values('{random.randint(1000000000,9999999999)}','{name.get()}','{course.get()}','{gender.get()}','{dateofbirth.get()}','{mobileno.get()}','{city.get()}','{district.get()}','{State.get()}','{Nationality.get()}','{emailid.get()}','{qualificatoin.get()}')"
                cursor.execute(query)
                if cursor.rowcount > 0:
                    messagebox.showinfo("Congratulations", 'Record Added successfully.')

                connect.commit()
                cursor.close()
                connect.close()

                connect = sqlite3.connect("database.db")
                cursor = connect.cursor()
                query = "update course set Teacher = '{}' where Name = '{}'".format(name.get(),course.get())
                cursor.execute(query)

                connect.commit()
                cursor.close()
                connect.close()

    def clear():
        name.set("")
        gender.set("Male")
        course.set("")
        dateofbirth.set("")
        mobileno.set("")
        city.set("")
        district.set("")
        State.set("")
        Nationality.set("")
        emailid.set("")
        qualificatoin.set("")

    if counteraddteacher >= 1:
        frameteachers.destroy()

        frameaddteacher = Frame(root, bg="white", width=100, height=100, bd=2, relief="solid")
        frameaddteacher.pack(side="left", fill=BOTH, expand=True)

        frametop = Frame(frameaddteacher, width=150, height=40, bg="white")
        frametop.pack(anchor="nw", padx=10, pady=10)

        imgback = PhotoImage(file="back.png", width=30, height=30)
        labelimgback = Label(frametop, image=imgback,bg="white")
        labelimgback.pack(side="left")


        frametop.bind("<Button-1>", click_teachers)
        labelimgback.bind("<Button-1>", click_teachers)

        frameBottom = Frame(frameaddteacher, bg="white", width=100, height=100)
        frameBottom.pack(side="bottom", fill=BOTH, expand=True, pady=20)

        name = StringVar()
        course = StringVar()
        gender = StringVar()
        gender.set("Male")
        dateofbirth = StringVar()
        mobileno = StringVar()
        city = StringVar()
        district = StringVar()
        State = StringVar()
        Nationality = StringVar()
        emailid = StringVar()
        qualificatoin = StringVar()

        labelname = Label(frameBottom, text="Name:", bg="white")
        labelname.grid(row=0, column=0, padx=10, pady=10, sticky="e")

        entryname = Entry(frameBottom, width=25, textvariable=name,relief="solid")
        entryname.grid(row=0, column=1, columnspan=2, padx=10, pady=10)

        labelcourse = Label(frameBottom, text="Course:", bg="white")
        labelcourse.grid(row=1, column=0, padx=10, pady=10, sticky="e")

        listcourse = []
        con = sqlite3.connect("database.db")
        cursor = con.cursor()
        cursor.execute("select Name from course order by Name asc")
        record = cursor.fetchall()
        for row in record:
            listcourse.append(row[0])

        entrycourse = OptionMenu(frameBottom, course,'Select Option',*listcourse)
        entrycourse.config(compound='left', bg="white", relief="solid", borderwidth=1)
        entrycourse.grid(row=1, column=1, sticky='EW', columnspan=2, padx=10, pady=10)

        labelgender = Label(frameBottom, text="Gender:", bg="white")
        labelgender.grid(row=2, column=0, padx=10, pady=10, sticky="e")

        male = Radiobutton(frameBottom, text="Male", variable=gender, value="Male", bg="white")
        male.grid(row=2, column=1, padx=10, pady=10)

        female = Radiobutton(frameBottom, text="Female", variable=gender, value="Female", bg="white")
        female.grid(row=2, column=2, padx=10, pady=10)

        labeldob = Label(frameBottom, text="Date Of Birth:", bg="white")
        labeldob.grid(row=3, column=0, padx=10, pady=10, sticky="e")

        entrydob = Entry(frameBottom, width=25, textvariable=dateofbirth,relief="solid")
        entrydob.grid(row=3, column=1, columnspan=2)

        labelMnumber = Label(frameBottom, text="Mobile Number:", bg="white")
        labelMnumber.grid(row=4, column=0, sticky="e", padx=10, pady=10)

        entryMnumber = Entry(frameBottom, width=25, textvariable=mobileno,relief="solid")
        entryMnumber.grid(row=4, column=1, columnspan=2, padx=10, pady=10)

        labelcity = Label(frameBottom, text="city:", bg="white")
        labelcity.grid(row=5, column=0, padx=10, pady=10, sticky="e")

        entryaddress = Entry(frameBottom, width=25, textvariable=city,relief="solid")
        entryaddress.grid(row=5, column=1, columnspan=2, padx=10, pady=10)

        labeldistrict = Label(frameBottom, text="District:", bg="white")
        labeldistrict.grid(row=5, column=3, padx=10, pady=10, sticky="e")

        entrydistrict = Entry(frameBottom, width=25, textvariable=district,relief="solid")
        entrydistrict.grid(row=5, column=4, columnspan=2, padx=10, pady=10)

        labelstate = Label(frameBottom, text="State:", bg="white")
        labelstate.grid(row=5, column=7, padx=10, pady=10, sticky="e")

        entrystate = Entry(frameBottom, width=25, textvariable=State,relief="solid")
        entrystate.grid(row=5, column=8, columnspan=2, padx=10, pady=10)

        labelnation = Label(frameBottom, text="Nationality:", bg="white")
        labelnation.grid(row=6, column=0, padx=10, pady=10, sticky="e")

        entrynation = Entry(frameBottom, width=25, textvariable=Nationality,relief="solid")
        entrynation.grid(row=6, column=1, columnspan=2, padx=10, pady=10)

        labelemail = Label(frameBottom, text="Email ID:", bg="white")
        labelemail.grid(row=7, column=0, padx=10, pady=10, sticky="e")

        entryemail = Entry(frameBottom, width=25, textvariable=emailid,relief="solid")
        entryemail.grid(row=7, column=1, columnspan=2, padx=10, pady=10)

        labelqual = Label(frameBottom, text="Qualificatoin:", bg="white")
        labelqual.grid(row=8, column=0, padx=10, pady=10, sticky="e")

        entryqual = Entry(frameBottom, width=25, textvariable=qualificatoin,relief="solid")
        entryqual.grid(row=8, column=1, columnspan=2, padx=10, pady=10)

        buttonadd = Button(frameBottom, text="Add", bg="lightblue", command=addnewteacher)
        buttonadd.grid(row=9, column=1, pady=10)

        buttonclear = Button(frameBottom, text="Clear", bg="lightblue", command=clear)
        buttonclear.grid(row=9, column=2, pady=10)


def click_addstudent(event):
    global counteraddstudent
    global frameaddstudent
    global framestudent
    global counterstudent
    global imgback

    counteraddstudent += 1
    counterstudent = 0


    def addnewstudent():
        if len(name.get()) == 0:
            messagebox.showerror("Error!", 'Please enter Name at least.')
            return
        elif not validate_name(name.get()):
            messagebox.showerror("Error!", 'Please enter a vlid name.')
            return
        elif not validate_mobile(mobileno.get()):
            return
        elif not validate_email(emailid.get()):
            return
        else:
            if len(course.get())==0:
                messagebox.showerror("Error!", 'Please select a course.')
            else:
                if course.get() == "Select Option":
                    messagebox.showwarning("Warning", "Please select a course.")
                else:
                    connect = sqlite3.connect("database.db")
                    randomnum = random.randint(1000000000, 9999999999)
                    if len(fee.get())==0:
                        c = connect.cursor()
                        c.execute("select Fee from course where Name = '{}'".format(course.get()))
                        for row in c:
                            temp=row[0]
                        query = f"INSERT INTO student values('{randomnum}','{name.get()}','{course.get()}','{gender.get()}','{dateofbirth.get()}','{mobileno.get()}','{city.get()}','{district.get()}','{State.get()}','{Nationality.get()}','{emailid.get()}','{qualificatoin.get()}','{temp}','0','{temp}')"
                    else:
                        query = f"INSERT INTO student values('{randomnum}','{name.get()}','{course.get()}','{gender.get()}','{dateofbirth.get()}','{mobileno.get()}','{city.get()}','{district.get()}','{State.get()}','{Nationality.get()}','{emailid.get()}','{qualificatoin.get()}','{fee.get()}','0','{fee.get()}')"
                    cursor = connect.cursor()
                    cursor.execute(query)
                    connect.commit()
                    if cursor.rowcount > 0:
                        messagebox.showinfo("Congratulations", 'Record Added successfully.')
                    try:
                        query = """create table feerecord(
                        Student_id TEXT,
                        Fee_deposited TEXT,
                        Date Text)"""
                        cursor.execute(query)
                        connect.commit()
                    except:
                        pass
                    cursor.close()
                    connect.close()

    def clear():
        name.set("")
        course.set("")
        gender.set("Male")
        dateofbirth.set("")
        mobileno.set("")
        city.set("")
        district.set("")
        State.set("")
        Nationality.set("")
        emailid.set("")
        qualificatoin.set("")
        course.set('')

    if counteraddstudent >= 1:
        framestudent.destroy()

        frameaddstudent = Frame(root, bg="white", width=100, height=100, bd=2, relief="solid")
        frameaddstudent.pack(side="left", fill=BOTH, expand=True)

        frametop = Frame(frameaddstudent, width=150, height=40, bg="white")
        frametop.pack(anchor="nw", padx=10, pady=10)

        imgback = PhotoImage(file="back.png", width=30, height=30)
        labelimgback = Label(frametop, image=imgback,bg="white")
        labelimgback.pack(side="left")


        frametop.bind("<Button-1>", click_students)
        labelimgback.bind("<Button-1>", click_students)


        frameBottom = Frame(frameaddstudent, bg="white", width=100, height=100)
        frameBottom.pack(side="bottom", fill=BOTH, expand=True, pady=20)

        name = StringVar()
        course= StringVar()
        gender = StringVar()
        gender.set("Male")
        dateofbirth = StringVar()
        mobileno = StringVar()
        city = StringVar()
        district = StringVar()
        State = StringVar()
        Nationality = StringVar()
        emailid = StringVar()
        course = StringVar()
        qualificatoin = StringVar()
        fee = StringVar()


        labelname = Label(frameBottom, text="Name:", bg="white")
        labelname.grid(row=0, column=0, padx=10, pady=10, sticky="e")

        entryname = Entry(frameBottom, width=25, textvariable=name,relief="solid")
        entryname.grid(row=0, column=1, columnspan=2, padx=10, pady=10)

        labelcourse = Label(frameBottom, text="Course:", bg="white")
        labelcourse.grid(row=1, column=0, sticky="e", padx=10, pady=10)

        listcourse = []
        con = sqlite3.connect("database.db")
        cursor = con.cursor()
        cursor.execute("select Name from course order by Name asc")
        record = cursor.fetchall()
        for row in record:
            listcourse.append(row[0])

        entrycourse = OptionMenu(frameBottom, course,"Select Option", *listcourse)
        entrycourse.config(compound='left', bg="white", relief="solid", borderwidth=1)
        entrycourse.grid(row=1, column=1, sticky='EW', columnspan=2, padx=10, pady=10)

        labelgender = Label(frameBottom, text="Gender:", bg="white")
        labelgender.grid(row=2, column=0, padx=10, pady=10, sticky="e")

        male = Radiobutton(frameBottom, text="Male", variable=gender, value="Male", bg="white")
        male.grid(row=2, column=1, padx=10, pady=10)

        female = Radiobutton(frameBottom, text="Female", variable=gender, value="Female", bg="white")
        female.grid(row=2, column=2, padx=10, pady=10)

        labeldob = Label(frameBottom, text="Date Of Birth:", bg="white")
        labeldob.grid(row=3, column=0, padx=10, pady=10, sticky="e")

        entrydob = Entry(frameBottom, width=25, textvariable=dateofbirth,relief="solid")
        entrydob.grid(row=3, column=1, columnspan=2)

        labelMnumber = Label(frameBottom, text="Mobile Number:", bg="white")
        labelMnumber.grid(row=4, column=0, sticky="e", padx=10, pady=10)

        entryMnumber = Entry(frameBottom, width=25, textvariable=mobileno,relief="solid")
        entryMnumber.grid(row=4, column=1, columnspan=2, padx=10, pady=10)

        labelcity = Label(frameBottom, text="city:", bg="white")
        labelcity.grid(row=5, column=0, padx=10, pady=10, sticky="e")

        entryaddress = Entry(frameBottom, width=25, textvariable=city,relief="solid")
        entryaddress.grid(row=5, column=1, columnspan=2, padx=10, pady=10)

        labeldistrict = Label(frameBottom, text="District:", bg="white")
        labeldistrict.grid(row=5, column=3, padx=10, pady=10, sticky="e")

        entrydistrict = Entry(frameBottom, width=25, textvariable=district,relief="solid")
        entrydistrict.grid(row=5, column=4, columnspan=2, padx=10, pady=10)

        labelstate = Label(frameBottom, text="State:", bg="white")
        labelstate.grid(row=5, column=7, padx=10, pady=10, sticky="e")

        entrystate = Entry(frameBottom, width=25, textvariable=State,relief="solid")
        entrystate.grid(row=5, column=8, columnspan=2, padx=10, pady=10)

        labelnation = Label(frameBottom, text="Nationality:", bg="white")
        labelnation.grid(row=6, column=0, padx=10, pady=10, sticky="e")

        entrynation = Entry(frameBottom, width=25, textvariable=Nationality,relief="solid")
        entrynation.grid(row=6, column=1, columnspan=2, padx=10, pady=10)

        labelemail = Label(frameBottom, text="Email ID:", bg="white")
        labelemail.grid(row=7, column=0, padx=10, pady=10, sticky="e")

        entryemail = Entry(frameBottom, width=25, textvariable=emailid,relief="solid")
        entryemail.grid(row=7, column=1, columnspan=2, padx=10, pady=10)

        labelqual = Label(frameBottom, text="Qualificatoin:", bg="white")
        labelqual.grid(row=8, column=0, padx=10, pady=10, sticky="e")

        entryqual = Entry(frameBottom, width=25, textvariable=qualificatoin,relief="solid")
        entryqual.grid(row=8, column=1, columnspan=2, padx=10, pady=10)

        labelfee = Label(frameBottom, text="Fee:", bg="white")
        labelfee.grid(row=9, column=0, padx=10, pady=10, sticky="e")

        entryfee = Entry(frameBottom, width=25, textvariable=fee, relief="solid")
        entryfee.grid(row=9, column=1, columnspan=2, padx=10, pady=10)

        label = Label(frameBottom, text="*Leave Blank for default Fee", bg="white",fg="red")
        label.grid(row=9, column=3,columnspan=3, padx=10, pady=10, sticky="w")


        buttonadd = Button(frameBottom, text="Add", bg="lightblue", command=addnewstudent)
        buttonadd.grid(row=10, column=1, pady=10)

        buttonclear = Button(frameBottom, text="Clear", bg="lightblue", command=clear)
        buttonclear.grid(row=10, column=2, pady=10)


def click_home(event):
    global counterteacher
    global counterstudent
    global counterhome
    global counterattendance
    global counterfee
    global countercourses
    global framehome
    global frameteachers
    global framestudent
    global frameattendance
    global framecourses
    global framefee
    global counteraddteacher
    global frameaddteacher
    global counteraddstudent
    global frameaddstudent
    global click_updateteacher
    global frameupdateteacher
    global click_updatestudent
    global frameupdatestudent
    global frameaddcourse
    global frameupdatecourse
    global frameupdatefee
    global counteraddcourse
    global counterupdateteacher
    global counterupdatestudent
    global counterupdatecourse
    global counterupdatefee
    global frameimage
    global frame0
    global buttonabout


    counterhome += 1
    counterteacher = 0
    counterstudent = 0
    counterattendance = 0
    countercourses = 0
    counterfee = 0
    counteraddteacher = 0
    counteraddstudent = 0
    counteraddcourse = 0
    counterupdateteacher = 0
    counterupdatestudent = 0
    counterupdatecourse = 0
    counterupdatefee = 0

    frame1.config(bg="#74bc3c")
    home.config(bg="#74bc3c")
    frame2.config(bg="#383c44")
    teachers.config(bg="#383c44")
    frame3.config(bg="#383c44")
    students.config(bg="#383c44")
    frame4.config(bg="#383c44")
    courses.config(bg="#383c44")
    frame5.config(bg="#383c44")
    attendance.config(bg="#383c44")
    frame6.config(bg="#383c44")
    fee.config(bg="#383c44")

    try:
        frameteachers.destroy()
    except:
        pass
    try:
        framestudent.destroy()
    except:
        pass
    try:
        framecourses.destroy()
    except:
        pass
    try:
        framefee.destroy()
    except:
        pass
    try:
        frameattendance.destroy()
    except:
        pass
    try:
        frameaddteacher.destroy()
    except:
        pass
    try:
        frameaddstudent.destroy()
    except:
        pass
    try:
        frameupdateteacher.destroy()
    except:
        pass
    try:
        frameupdatestudent.destroy()
    except:
        pass
    try:
        frameaddcourse.destroy()
    except:
        pass
    try:
        frameupdatecourse.destroy()
    except:
        pass
    try:
        frameupdatefee.destroy()
    except:
        pass

    if (counterhome <= 1):
        try:
            buttonabout.destroy()
        except:
            pass
        frameimage = Frame(frame0, bg="#383c44")
        frameimage.pack(side="bottom", fill=X)
        buttonaddimage = Button(frameimage, text="Add Image", bg="#383c44", command=lambda: click_addimage())
        buttonaddimage.pack(side="left", fill=X, expand=True)

        buttondeleteimage = Button(frameimage, text="Delete Image", bg="#383c44",  command=lambda: click_deleteimage())
        buttondeleteimage.pack(side="left", fill=X, expand=True)
        framehome = Frame(root, bg="white", width=100, height=100, bd=2, relief="solid")
        framehome.pack(side="left", fill=BOTH, expand=True)

        connection = sqlite3.connect("database.db")
        query = 'SELECT count(NAME) FROM IMAGE order by Name asc'
        cursor = connection.cursor()
        cursor.execute(query)
        for row in cursor:
            count = row[0]
        if count != 0:
            cursor.execute("""
            SELECT * FROM IMAGE
            """)
            files = cursor.fetchall()
            image = random.choice(files)
            imagename = image[0]
            imge = image[1]
            realimage = open("wallpaper.jpg", 'wb')
            realimage.write(imge)

            Tk.update(root)
            w = framehome.winfo_width()
            h = framehome.winfo_height()

            img = Image.open("wallpaper.jpg")
            img = img.resize((w, h), Image.ANTIALIAS)
            realpic = ImageTk.PhotoImage(img)

            label = ttk.Label(framehome, image=realpic, text=imagename, compound = "bottom")
            label.image = realpic
            label.pack(fill=BOTH,expand = True)


def about():
    messagebox.showinfo("About.","Institute Record Manager \nVersion 1.0\nCreated By Jasraj Pannu\nCopyright ©️ jasraj Pannu")


def click_teachers(event):
    global counterhome
    global counterteacher
    global counterstudent
    global counterattendance
    global counterfee
    global countercourses
    global framehome
    global frameteachers
    global framestudent
    global frameattendance
    global framecourses
    global framefee
    global counteraddteacher
    global frameaddteacher
    global counteraddstudent
    global frameaddstudent
    global click_updateteacher
    global frameupdateteacher
    global click_updatestudent
    global frameupdatestudent
    global imgplus
    global frameaddcourse
    global frameupdatecourse
    global teachersearchname
    global updateteachername
    global deleteteachername
    global frameupdatefee
    global counteraddcourse
    global counterupdateteacher
    global counterupdatestudent
    global counterupdatecourse
    global counterupdatefee
    global frameshowteachers
    global frameimage
    global frame0
    global buttonabout


    counterteacher += 1
    counterstudent = 0
    counterattendance = 0
    countercourses = 0
    counterfee = 0
    counterhome = 0
    counteraddteacher = 0
    counteraddstudent = 0
    counteraddcourse = 0
    counterupdateteacher = 0
    counterupdatestudent = 0
    counterupdatecourse = 0
    counterupdatefee = 0


    def treeviewselect(event):
        global updateteachername
        global deleteteachername
        global frameshowteachers
        temp132 = tree.selection()
        updateteachername.set(tree.item(temp132)['values'][0])
        deleteteachername.set(tree.item(temp132)['values'][0])

    def click_searchteacher(event):
        global teachersearchname
        if len(teachersearchname.get())==0:
            messagebox.showerror("Error","Please enter tag")
        else:
            connection = sqlite3.connect("database.db")
            query = "SELECT count(*) FROM teacher where Name = '{0}' or Teacher_id like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}'".format(teachersearchname.get())
            cursor = connection.cursor()
            cursor.execute(query)
            record = cursor.fetchall()
            for row in record:
                temp=row[0]
            if temp != 0:
                screensearch=Tk()
                screensearch.title("Search Result")
                screensearch.geometry("1280x720")
                screensearch.config(bg="white")

                label = Label(screensearch, text="Sr.", bg="white", font=("", 11, "bold"), borderwidth=1, relief="solid")
                label.grid(row=0, column=0, sticky='EW')
                label = Label(screensearch, text="Teacher ID", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=1, sticky='EW')
                label = Label(screensearch, text="Name", bg="white", font=("", 11, "bold"), borderwidth=1, relief="solid")
                label.grid(row=0, column=2, sticky='EW')
                label = Label(screensearch, text="Course", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=3, sticky='EW')
                label = Label(screensearch, text="Gender", bg="white", font=("", 11, "bold"), borderwidth=1, relief="solid")
                label.grid(row=0, column=4, sticky='EW')
                label = Label(screensearch, text="Date Of Birth", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=5, sticky='EW')
                label = Label(screensearch, text="Mobile No.", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=6, sticky='EW')
                label = Label(screensearch, text="City", bg="white", font=("", 11, "bold"), borderwidth=1, relief="solid")
                label.grid(row=0, column=7, sticky='EW')
                label = Label(screensearch, text="District", bg="white", font=("", 11, "bold"), borderwidth=1, relief="solid")
                label.grid(row=0, column=8, sticky='EW')
                label = Label(screensearch, text="State", bg="white", font=("", 11, "bold"), borderwidth=1, relief="solid")
                label.grid(row=0, column=9, sticky='EW')
                label = Label(screensearch, text="Nationality", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=10, sticky='EW')
                label = Label(screensearch, text="Email", bg="white", font=("", 11, "bold"), borderwidth=1, relief="solid")
                label.grid(row=0, column=11, sticky='EW')
                label = Label(screensearch, text="Qualificatoin", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=12, sticky='EW')
                connection = sqlite3.connect("database.db")
                query = "SELECT * FROM teacher where Name like '{0}' or Teacher_id like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}'".format(teachersearchname.get())
                cursor = connection.cursor()
                cursor.execute(query)
                record = cursor.fetchall()
                x = 1
                for row in record:
                    label1 = Label(screensearch, text="{}.".format(x), bg="white", borderwidth=1, relief="solid")
                    label1.grid(row=x, column=0, sticky='EW', pady=1)
                    label2 = Text(screensearch, height=1, width=10, bg="white", borderwidth=1, relief="solid")
                    label2.insert(1.0, "{}".format(row[0]))
                    label2.grid(row=x, column=1, sticky='EW', pady=1)
                    label3 = Label(screensearch, text="{}".format(row[1]), bg="white", borderwidth=1, relief="solid")
                    label3.grid(row=x, column=2, sticky='EW')
                    label4 = Label(screensearch, text="{}".format(row[2]), bg="white", borderwidth=1, relief="solid")
                    label4.grid(row=x, column=3, sticky='EW')
                    label5 = Label(screensearch, text="{}".format(row[3]), bg="white", borderwidth=1, relief="solid")
                    label5.grid(row=x, column=4, sticky='EW')
                    label6 = Label(screensearch, text="{}".format(row[4]), bg="white", borderwidth=1, relief="solid")
                    label6.grid(row=x, column=5, sticky='EW')
                    label7 = Label(screensearch, text="{}".format(row[5]), bg="white", borderwidth=1, relief="solid")
                    label7.grid(row=x, column=6, sticky='EW')
                    label8 = Label(screensearch, text="{}".format(row[6]), bg="white", borderwidth=1, relief="solid")
                    label8.grid(row=x, column=7, sticky='EW')
                    label9 = Label(screensearch, text="{}".format(row[7]), bg="white", borderwidth=1, relief="solid")
                    label9.grid(row=x, column=8, sticky='EW')
                    label10 = Label(screensearch, text="{}".format(row[8]), bg="white", borderwidth=1, relief="solid")
                    label10.grid(row=x, column=9, sticky='EW')
                    label11 = Label(screensearch, text="{}".format(row[9]), bg="white", borderwidth=1, relief="solid")
                    label11.grid(row=x, column=10, sticky='EW')
                    label12 = Label(screensearch, text="{}".format(row[10]), bg="white", borderwidth=1, relief="solid")
                    label12.grid(row=x, column=11, sticky='EW')
                    label13 = Label(screensearch, text="{}".format(row[11]), bg="white", borderwidth=1, relief="solid")
                    label13.grid(row=x, column=12, sticky='EW')
                    x += 1
                cursor.close()
            else:
                data = '%'+teachersearchname.get()+'%'
                connection = sqlite3.connect("database.db")
                query = "SELECT count(*) FROM teacher where Name like '{0}' or Teacher_id like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}'".format(data)
                cursor = connection.cursor()
                cursor.execute(query)
                record = cursor.fetchall()
                for row in record:
                    temp = row[0]
                if temp == 0:
                    messagebox.showerror("Error","No Data Found.")
                else:
                    screensearch = Tk()
                    screensearch.title("Search Result")
                    screensearch.geometry("1280x720")
                    screensearch.config(bg="white")

                    label = Label(screensearch, text="Sr.", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=0, sticky='EW')
                    label = Label(screensearch, text="Teacher ID", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=1, sticky='EW')
                    label = Label(screensearch, text="Name", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=2, sticky='EW')
                    label = Label(screensearch, text="Course", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=3, sticky='EW')
                    label = Label(screensearch, text="Gender", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=4, sticky='EW')
                    label = Label(screensearch, text="Date Of Birth", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=5, sticky='EW')
                    label = Label(screensearch, text="Mobile No.", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=6, sticky='EW')
                    label = Label(screensearch, text="City", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=7, sticky='EW')
                    label = Label(screensearch, text="District", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=8, sticky='EW')
                    label = Label(screensearch, text="State", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=9, sticky='EW')
                    label = Label(screensearch, text="Nationality", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=10, sticky='EW')
                    label = Label(screensearch, text="Email", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=11, sticky='EW')
                    label = Label(screensearch, text="Qualificatoin", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=12, sticky='EW')
                    connection = sqlite3.connect("database.db")
                    query = "SELECT * FROM teacher where Name like '{0}' or Teacher_id like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}'".format(data)
                    cursor = connection.cursor()
                    cursor.execute(query)
                    record = cursor.fetchall()
                    x = 1
                    for row in record:
                        label1 = Label(screensearch, text="{}.".format(x), bg="white", borderwidth=1, relief="solid")
                        label1.grid(row=x, column=0, sticky='EW', pady=1)
                        label2 = Text(screensearch, height=1, width=10, bg="white", borderwidth=1, relief="solid")
                        label2.insert(1.0, "{}".format(row[0]))
                        label2.grid(row=x, column=1, sticky='EW', pady=1)
                        label3 = Label(screensearch, text="{}".format(row[1]), bg="white", borderwidth=1,
                                       relief="solid")
                        label3.grid(row=x, column=2, sticky='EW')
                        label4 = Label(screensearch, text="{}".format(row[2]), bg="white", borderwidth=1,
                                       relief="solid")
                        label4.grid(row=x, column=3, sticky='EW')
                        label5 = Label(screensearch, text="{}".format(row[3]), bg="white", borderwidth=1,
                                       relief="solid")
                        label5.grid(row=x, column=4, sticky='EW')
                        label6 = Label(screensearch, text="{}".format(row[4]), bg="white", borderwidth=1,
                                       relief="solid")
                        label6.grid(row=x, column=5, sticky='EW')
                        label7 = Label(screensearch, text="{}".format(row[5]), bg="white", borderwidth=1,
                                       relief="solid")
                        label7.grid(row=x, column=6, sticky='EW')
                        label8 = Label(screensearch, text="{}".format(row[6]), bg="white", borderwidth=1,
                                       relief="solid")
                        label8.grid(row=x, column=7, sticky='EW')
                        label9 = Label(screensearch, text="{}".format(row[7]), bg="white", borderwidth=1,
                                       relief="solid")
                        label9.grid(row=x, column=8, sticky='EW')
                        label10 = Label(screensearch, text="{}".format(row[8]), bg="white", borderwidth=1,
                                        relief="solid")
                        label10.grid(row=x, column=9, sticky='EW')
                        label11 = Label(screensearch, text="{}".format(row[9]), bg="white", borderwidth=1,
                                        relief="solid")
                        label11.grid(row=x, column=10, sticky='EW')
                        label12 = Label(screensearch, text="{}".format(row[10]), bg="white", borderwidth=1,
                                        relief="solid")
                        label12.grid(row=x, column=11, sticky='EW')
                        label13 = Label(screensearch, text="{}".format(row[11]), bg="white", borderwidth=1,
                                        relief="solid")
                        label13.grid(row=x, column=12, sticky='EW')
                        x += 1
                    cursor.close()




    def click_deleteteacher(event):
        global deleteteachername
        global counterteacher
        global frameshowteachers
        global updateteachername
        global deleteteachername

        def treeviewselect(event):
            global updateteachername
            global deleteteachername
            global frameshowteachers
            temp132 = tree.selection()
            updateteachername.set(tree.item(temp132)['values'][0])
            deleteteachername.set(tree.item(temp132)['values'][0])
        if len(deleteteachername.get()) == 0:
            messagebox.showinfo("Error!", 'Please enter ID.')
        else:
            connection = sqlite3.connect("database.db")
            cursor = connection.cursor()
            query = """SELECT count(*) FROM teacher WHERE Teacher_id = '{}'""".format(deleteteachername.get())
            c=cursor.execute(query)
            for row in c:
                temp=row[0]
            if temp == 0:
                messagebox.showinfo("Error!", "ID '{}' doesn't exist".format(deleteteachername.get()))
            else:
                cursor.execute("select * from teacher where Teacher_id = '{}'".format(deleteteachername.get()))
                for row in cursor:
                    temp=row[1]
                ans=messagebox.askyesno("Warning!","Do you really want to delete '{}'?".format(temp))
                if ans == True:
                    cursor.execute("delete from teacher where Teacher_id = '{}'".format(deleteteachername.get()))
                    connection.commit()

                    frameshowteachers.destroy()
                    frameshowteachers = Frame(frameteachers, width=100, height=50, bg="white")
                    frameshowteachers.pack(side=TOP, fill=BOTH, expand=True, padx=1)
                    scrollbarx = Scrollbar(frameshowteachers, orient='horizontal')
                    scrollbarx.pack(side=BOTTOM, fill=X)
                    scrollbary = Scrollbar(frameshowteachers, orient="vertical")
                    scrollbary.pack(side='right', fill=Y)
                    tree = ttk.Treeview(frameshowteachers, columns=(
                    'teacherid', 'name', 'course', 'gender', 'dateofbirth', 'mobileno', 'city', 'district', 'state',
                    'nationality', 'email', 'qualification'), selectmode="extended")
                    tree.pack(side=TOP, fill=BOTH, expand=True)
                    tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
                    scrollbarx.config(command=tree.xview)
                    scrollbary.config(command=tree.yview)
                    connection = sqlite3.connect("database.db")
                    cursor = connection.cursor()
                    query = 'SELECT * FROM teacher order by Name asc'
                    query1 = 'SELECT count(*) FROM teacher order by Name asc'
                    cursor.execute(query1)
                    for row in cursor:
                        count = row[0]
                    if count != 0:
                        tree.heading('teacherid', text='Teacher ID')
                        tree.heading('name', text='Name')
                        tree.heading('course', text='Course')
                        tree.heading('gender', text='Gender')
                        tree.heading('dateofbirth', text='Date of Birth')
                        tree.heading('mobileno', text='Mobile No.')
                        tree.heading('city', text='City')
                        tree.heading('district', text='District')
                        tree.heading('state', text='State')
                        tree.heading('nationality', text='Nationality')
                        tree.heading('email', text='Email Id')
                        tree.heading('qualification', text='Qualification')

                        tree.column("#0", stretch=NO, minwidth=0, width=0)
                        tree.column("teacherid", stretch=NO, minwidth=100, width=100)
                        tree.column('name', stretch=NO, minwidth=100, width=100)
                        tree.column('course', stretch=NO, minwidth=100, width=100)
                        tree.column('gender', stretch=NO, minwidth=100, width=100)
                        tree.column('dateofbirth', stretch=NO, minwidth=100, width=100)
                        tree.column('mobileno', stretch=NO, minwidth=100, width=100)
                        tree.column('city', stretch=NO, minwidth=100, width=100)
                        tree.column('district', stretch=NO, minwidth=100, width=100)
                        tree.column('state', stretch=NO, minwidth=100, width=100)
                        tree.column('nationality', stretch=NO, minwidth=100, width=100)
                        tree.column('email', stretch=NO, minwidth=100, width=100)
                        tree.column('qualification', stretch=NO, minwidth=100, width=100)
                        tree.bind("<<TreeviewSelect>>", lambda event=0: treeviewselect(event))
                    cursor.execute(query)
                    record = cursor.fetchall()
                    x = 1
                    for row in record:
                        tree.insert("", END, values=row)
                        x += 1
                    cursor.close()
                    messagebox.showinfo("Warning!", "Name '{}' deleted successfully.".format(temp))

    frame2.config(bg="#74bc3c")
    teachers.config(bg="#74bc3c")
    frame3.config(bg="#383c44")
    students.config(bg="#383c44")
    frame4.config(bg="#383c44")
    courses.config(bg="#383c44")
    frame5.config(bg="#383c44")
    attendance.config(bg="#383c44")
    frame6.config(bg="#383c44")
    fee.config(bg="#383c44")
    frame1.config(bg="#383c44")
    home.config(bg="#383c44")

    try:
        framehome.destroy()
    except:
        pass
    try:
        framestudent.destroy()
    except:
        pass
    try:
        framecourses.destroy()
    except:
        pass
    try:
        framefee.destroy()
    except:
        pass
    try:
        frameattendance.destroy()
    except:
        pass
    try:
        frameaddteacher.destroy()
    except:
        pass
    try:
        frameaddstudent.destroy()
    except:
        pass
    try:
        frameupdateteacher.destroy()
    except:
        pass
    try:
        frameupdatestudent.destroy()
    except:
        pass
    try:
        frameaddcourse.destroy()
    except:
        pass
    try:
        frameupdatecourse.destroy()
    except:
        pass

    try:
        frameupdatefee.destroy()
    except:
        pass
    if (counterteacher <= 1):
        frameimage.destroy()
        try:
            buttonabout.destroy()
        except:
            pass
        buttonabout = Button(frame0, text="About",bg="#383c44",command = lambda: about())
        buttonabout.pack(side=BOTTOM,fill = X)
        frameteachers = Frame(root, bg="white", width=100, height=100, bd=2, relief="solid")
        frameteachers.pack(side="left", fill=BOTH, expand=True)
        frametoptop = Frame(frameteachers, width=150, height=35, bg="white")
        frametoptop.pack(anchor="nw", fill=X)

        frametop = Frame(frametoptop, width=150, height=35, bg="white")
        frametop.pack(side=LEFT, padx=10, pady=10)

        imgplus = PhotoImage(file="Webp.net-resizeimage (7).png", width="30", height="30")
        imglabel = Label(frametop, image=imgplus,bg="white")
        imglabel.pack(side=LEFT)

        frameright = Frame(frametoptop, width=500, height=35, bg="white")
        frameright.pack(side="right")


        teachersearchname = StringVar()
        teachersearchname.set("Enter Tag.")
        deleteteachername = StringVar()
        deleteteachername.set("Enter ID Here.")
        updateteachername=StringVar()
        updateteachername.set("Enter Id Here")

        entrysearch = Entry(frameright, width=20, textvariable=teachersearchname,relief="solid",borderwidth=2)
        entrysearch.pack(side=LEFT, padx=10)
        entrysearch.bind("<Return>",lambda event: click_searchteacher(event))
        buttonsearch = Button(frameright, text="Search", bg="lightblue",
                              command=lambda event=0: click_searchteacher(event))
        buttonsearch.pack(side=LEFT)


        entryupdate = Entry(frameright, width=20, textvariable=updateteachername,relief="solid",borderwidth=2)
        entryupdate.pack(side=LEFT, padx=10)


        entryupdate.bind("<Return>",lambda event: click_updateteacher(event))
        buttonupdate = Button(frameright, text="Update", bg="lightblue",
                              command=lambda event=0: click_updateteacher(event))
        buttonupdate.pack(side=LEFT)

        entrydelete = Entry(frameright, width=20, textvariable=deleteteachername,relief="solid",borderwidth=2)
        entrydelete.pack(side=LEFT, padx=10)

        entrydelete.bind("<Return>",lambda event: click_deleteteacher(event))
        buttondelete = Button(frameright, text="Delete", bg="lightblue",
                              command=lambda event=0: click_deleteteacher(event))
        buttondelete.pack(side=LEFT, padx=1)


        frametop.bind("<Button-1>", click_addteacher)
        imglabel.bind("<Button-1>", click_addteacher)

        frameshowteachers = Frame(frameteachers, width=100, height=50, bg="white")
        frameshowteachers.pack(side=TOP, fill=BOTH, expand=True,padx=1)
        scrollbarx=Scrollbar(frameshowteachers,orient='horizontal')
        scrollbarx.pack(side=BOTTOM,fill=X)
        scrollbary=Scrollbar(frameshowteachers,orient="vertical")
        scrollbary.pack(side='right',fill=Y)
        tree=ttk.Treeview(frameshowteachers,columns=('teacherid','name','course','gender','dateofbirth','mobileno','city','district','state','nationality','email','qualification'),selectmode="extended")
        tree.pack(side=TOP,fill=BOTH,expand=True)
        tree.config(xscrollcommand=scrollbarx.set,yscrollcommand=scrollbary.set)
        scrollbarx.config(command=tree.xview)
        scrollbary.config(command=tree.yview)
        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        query = 'SELECT * FROM teacher order by Name asc'
        query1='SELECT count(*) FROM teacher order by Name asc'
        cursor.execute(query1)
        for row in cursor:
            count=row[0]
        if count != 0:
            tree.heading('teacherid',text='Teacher ID')
            tree.heading('name', text='Name')
            tree.heading('course', text='Course')
            tree.heading('gender', text='Gender')
            tree.heading('dateofbirth', text='Date of Birth')
            tree.heading('mobileno', text='Mobile No.')
            tree.heading('city', text='City')
            tree.heading('district', text='District')
            tree.heading('state', text='State')
            tree.heading('nationality', text='Nationality')
            tree.heading('email', text='Email Id')
            tree.heading('qualification', text='Qualification')

            tree.column("#0",stretch=NO,minwidth=0,width=0)
            tree.column("teacherid",stretch=NO,minwidth=100,width=100)
            tree.column('name',stretch=NO, minwidth=100,width=100)
            tree.column('course', stretch=NO, minwidth=100, width=100)
            tree.column('gender', stretch=NO, minwidth=100, width=100)
            tree.column('dateofbirth', stretch=NO, minwidth=100, width=100)
            tree.column('mobileno', stretch=NO, minwidth=100, width=100)
            tree.column('city', stretch=NO, minwidth=100, width=100)
            tree.column('district', stretch=NO, minwidth=100, width=100)
            tree.column('state', stretch=NO, minwidth=100, width=100)
            tree.column('nationality', stretch=NO, minwidth=100, width=100)
            tree.column('email', stretch=NO, minwidth=100, width=100)
            tree.column('qualification', stretch=NO, minwidth=100, width=100)
            tree.bind("<<TreeviewSelect>>", lambda event=0: treeviewselect(event))
        cursor.execute(query)
        record = cursor.fetchall()
        x = 1
        for row in record:
            tree.insert("", END,values=row)
            x += 1
        cursor.close()


def click_students(event):
    global counterhome
    global counterteacher
    global counterstudent
    global counterattendance
    global counterfee
    global countercourses
    global counteraddstudent
    global framehome
    global frameteachers
    global framestudent
    global frameattendance
    global framecourses
    global framefee
    global frameaddteacher
    global counteraddteacher
    global frameaddstudent
    global click_updateteacher
    global frameupdateteacher
    global click_updatestudent
    global frameupdatestudent
    global imgplus
    global frameaddcourse
    global frameupdatecourse
    global frameshowstudent
    global studentsearchname
    global updatestudentname
    global deletestudentname
    global frameupdatefee
    global counteraddcourse
    global counterupdateteacher
    global counterupdatestudent
    global counterupdatecourse
    global counterupdatefee
    global frameimage
    global frame0
    global buttonabout

    counterstudent += 1
    counterhome = 0
    counterteacher = 0
    counterattendance = 0
    countercourses = 0
    counterfee = 0
    counteraddteacher = 0
    counteraddstudent = 0
    counteraddcourse = 0
    counterupdateteacher = 0
    counterupdatestudent = 0
    counterupdatecourse = 0
    counterupdatefee = 0

    def treeviewselect(event):
        item = tree.selection()
        updatestudentname.set(tree.item(item)['values'][0])
        deletestudentname.set(tree.item(item)['values'][0])

    def showstudent(course):
        global frameshowstudent
        global updatestudentname
        global deletestudentname
        def treeviewselect(event):
            global updatesruentname
            global deletestudentname
            item = tree.selection()
            updatestudentname.set(tree.item(item)['values'][0])
            deletestudentname.set(tree.item(item)['values'][0])
        frameshowstudent.destroy()

        frameshowstudent = Frame(framestudent, width=100, height=50, bg="white")
        frameshowstudent.pack(side=TOP, fill=BOTH, expand=True, padx=1)
        scrollbarx = Scrollbar(frameshowstudent, orient=HORIZONTAL)
        scrollbarx.pack(side=BOTTOM, fill=X)
        scrollbary = Scrollbar(frameshowstudent, orient=VERTICAL)
        scrollbary.pack(side=RIGHT, fill=Y)
        tree = ttk.Treeview(frameshowstudent, columns=(
            "studentid", "name", "course", "gender", "dateofbirth", "mobileno", "city", "district",
            "state", "nationality", "email", "qualification"), selectmode="extended")
        tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
        tree.pack(side=TOP, fill=BOTH,expand=TRUE)
        scrollbarx.config(command=tree.xview)
        scrollbary.config(command=tree.yview)

        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        query = """select count(*) from STUDENT"""
        cursor.execute(query)
        count = 0
        for row in cursor:
            count = row[0]
        if count != 0:
            tree.heading("studentid", text="Student ID")
            tree.heading("name", text="Name")
            tree.heading("course", text="Course")
            tree.heading("gender", text="Gender")
            tree.heading("dateofbirth", text="Date of Birth")
            tree.heading("mobileno", text="Mobile No")
            tree.heading("city", text="City")
            tree.heading("district", text="District")
            tree.heading("state", text="State")
            tree.heading("nationality", text="Nationality")
            tree.heading("email", text="Email id")
            tree.heading("qualification", text="Qualification")

            tree.column("#0", stretch=NO, minwidth=0, width=0)
            tree.column("studentid", stretch=NO, minwidth=100, width=100)
            tree.column("name", stretch=NO, minwidth=100, width=100)
            tree.column("course", stretch=NO, minwidth=100, width=120)
            tree.column("gender", stretch=NO, minwidth=100, width=60)
            tree.column("dateofbirth", stretch=NO, minwidth=100, width=120)
            tree.column("mobileno", stretch=NO, minwidth=100, width=100)
            tree.column("city", stretch=NO, minwidth=100, width=100)
            tree.column("district", stretch=NO, minwidth=100, width=120)
            tree.column("state", stretch=NO, minwidth=100, width=120)
            tree.column("nationality", stretch=NO, minwidth=100, width=120)
            tree.column("email", stretch=NO, minwidth=100, width=120)
            tree.column("qualification", stretch=NO, minwidth=100, width=120)
            tree.bind('<<TreeviewSelect>>', lambda event=0: treeviewselect(event))

            connection = sqlite3.connect("database.db")
            if course == 'All':
                query = 'SELECT * FROM student order by Name asc'
            else:
                query = "SELECT * FROM student where Course = '{}' order by Name asc".format(course)
            cursor = connection.cursor()
            cursor.execute(query)
            record = cursor.fetchall()
            x = 1
            for row in record:
                tree.insert("", END, values=row)
                x += 1
            cursor.close()

    def click_searchstudent(event):
        global frameshowstudent
        global studentsearchname
        global updatestudentname
        global deletestudentname

        def treeviewselect(event):
            item = tree.selection()
            updatestudentname.set(tree.item(item)['values'][0])
            deletestudentname.set(tree.item(item)['values'][0])
        if len(studentsearchname.get())==0:
            messagebox.showerror("Error","Please enter search tag.")
        else:
            connection = sqlite3.connect("database.db")
            query = "SELECT count(*) FROM student where Student_id like '{0}' or Name like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}' order by Name asc".format(
                studentsearchname.get())
            cursor = connection.cursor()
            cursor.execute(query)
            record = cursor.fetchall()
            for row in record:
                count=row[0]
            if count != 0:
                frameshowstudent.destroy()
                frameshowstudent.destroy()
                frameshowstudent = Frame(framestudent, width=100, height=50, bg="white")
                frameshowstudent.pack(side=TOP, fill=BOTH, expand=True, padx=1)
                scrollbarx = Scrollbar(frameshowstudent, orient=HORIZONTAL)
                scrollbarx.pack(side=BOTTOM, fill=X)
                scrollbary = Scrollbar(frameshowstudent, orient=VERTICAL)
                scrollbary.pack(side=RIGHT, fill=Y)
                tree = ttk.Treeview(frameshowstudent, columns=(
                    "studentid", "name", "course", "gender", "dateofbirth", "mobileno", "city", "district",
                    "state", "nationality", "email", "qualification"), selectmode="extended")
                tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
                tree.pack(side=TOP, fill=BOTH, expand=TRUE)
                scrollbarx.config(command=tree.xview)
                scrollbary.config(command=tree.yview)

                tree.heading("studentid", text="Student ID")
                tree.heading("name", text="Name")
                tree.heading("course", text="Course")
                tree.heading("gender", text="Gender")
                tree.heading("dateofbirth", text="Date of Birth")
                tree.heading("mobileno", text="Mobile No")
                tree.heading("city", text="City")
                tree.heading("district", text="District")
                tree.heading("state", text="State")
                tree.heading("nationality", text="Nationality")
                tree.heading("email", text="Emain id")
                tree.heading("qualification", text="Qualification")


                tree.column("#0", stretch=NO, minwidth=0, width=0)
                tree.column("studentid", stretch=NO, minwidth=100, width=100)
                tree.column("name", stretch=NO, minwidth=100, width=100)
                tree.column("course", stretch=NO, minwidth=100, width=120)
                tree.column("gender", stretch=NO, minwidth=100, width=60)
                tree.column("dateofbirth", stretch=NO, minwidth=100, width=120)
                tree.column("mobileno", stretch=NO, minwidth=100, width=100)
                tree.column("city", stretch=NO, minwidth=100, width=100)
                tree.column("district", stretch=NO, minwidth=100, width=120)
                tree.column("state", stretch=NO, minwidth=100, width=120)
                tree.column("nationality", stretch=NO, minwidth=100, width=120)
                tree.column("email", stretch=NO, minwidth=100, width=120)
                tree.column("qualification", stretch=NO, minwidth=100, width=120)
                tree.bind('<<TreeviewSelect>>',lambda event=0: treeviewselect(event))
                connection = sqlite3.connect("database.db")
                query = "SELECT * FROM student where Student_id like '{0}' or Name like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}' order by Name asc".format(studentsearchname.get())
                cursor = connection.cursor()
                cursor.execute(query)
                record = cursor.fetchall()
                x = 1
                for row in record:
                    tree.insert("", END, values=row)
                    x += 1
                cursor.close()

            else:
                data = '%' + studentsearchname.get() + '%'
                connection = sqlite3.connect("database.db")
                query = "SELECT count(*) FROM student where Student_id like '{0}' or Name like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}' order by Name asc".format(
                    data)
                cursor = connection.cursor()
                cursor.execute(query)
                record = cursor.fetchall()
                for row in record:
                    count = row[0]
                if count == 0:
                    messagebox.showwarning("Error!","No data found.")
                else:
                    frameshowstudent.destroy()
                    frameshowstudent = Frame(framestudent, width=100, height=50, bg="white")
                    frameshowstudent.pack(side=TOP, fill=BOTH, expand=True, padx=1)
                    scrollbarx = Scrollbar(frameshowstudent, orient=HORIZONTAL)
                    scrollbarx.pack(side=BOTTOM, fill=X)
                    scrollbary = Scrollbar(frameshowstudent, orient=VERTICAL)
                    scrollbary.pack(side=RIGHT, fill=Y)
                    tree = ttk.Treeview(frameshowstudent, columns=(
                        "studentid", "name", "course", "gender", "dateofbirth", "mobileno", "city", "district",
                        "state", "nationality", "email", "qualification"), selectmode="extended")
                    tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
                    tree.pack(side=TOP, fill=BOTH, expand=TRUE)
                    scrollbarx.config(command=tree.xview)
                    scrollbary.config(command=tree.yview)

                    tree.heading("studentid", text="Student ID")
                    tree.heading("name", text="Name")
                    tree.heading("course", text="Course")
                    tree.heading("gender", text="Gender")
                    tree.heading("dateofbirth", text="Date of Birth")
                    tree.heading("mobileno", text="Mobile No")
                    tree.heading("city", text="City")
                    tree.heading("district", text="District")
                    tree.heading("state", text="State")
                    tree.heading("nationality", text="Nationality")
                    tree.heading("email", text="Emain id")
                    tree.heading("qualification", text="Qualification")

                    tree.column("#0", stretch=NO, minwidth=0, width=0)
                    tree.column("studentid", stretch=NO, minwidth=100, width=100)
                    tree.column("name", stretch=NO, minwidth=100, width=100)
                    tree.column("course", stretch=NO, minwidth=100, width=120)
                    tree.column("gender", stretch=NO, minwidth=100, width=60)
                    tree.column("dateofbirth", stretch=NO, minwidth=100, width=120)
                    tree.column("mobileno", stretch=NO, minwidth=100, width=100)
                    tree.column("city", stretch=NO, minwidth=100, width=100)
                    tree.column("district", stretch=NO, minwidth=100, width=120)
                    tree.column("state", stretch=NO, minwidth=100, width=120)
                    tree.column("nationality", stretch=NO, minwidth=100, width=120)
                    tree.column("email", stretch=NO, minwidth=100, width=120)
                    tree.column("qualification", stretch=NO, minwidth=100, width=120)
                    tree.bind('<<TreeviewSelect>>',lambda event=0: treeviewselect(event))
                    connection = sqlite3.connect("database.db")
                    query = "SELECT * FROM student where Student_id like '{0}' or Name like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}' order by Name asc".format(
                        data)
                    cursor = connection.cursor()
                    cursor.execute(query)
                    record = cursor.fetchall()
                    x = 1
                    for row in record:
                        tree.insert("", END, values=row)
                        x += 1
                    cursor.close()






    def click_deletestudent(event):
        global deletestudentname
        global frameshowstudent
        global updatestudentname
        global deletestudentname

        def treeviewselect(event):
            global updatestudentname
            global deletestudentname
            item = tree.selection()
            updatestudentname.set(tree.item(item)['values'][0])
            deletestudentname.set(tree.item(item)['values'][0])
        if len(deletestudentname.get()) == 0:
            messagebox.showinfo("Error!", 'Please enter ID.')
        else:
            connection = sqlite3.connect("database.db")
            cursor = connection.cursor()
            query = """SELECT count(*) FROM student WHERE Student_id = '{}'""".format(deletestudentname.get())
            c=cursor.execute(query)
            for row in c:
                temp=row[0]
            if temp == 0:
                messagebox.showinfo("Error!", "ID '{}' doesn't exist".format(deletestudentname.get()))
            else:
                cursor.execute("select * from student where Student_id = '{}'".format(deletestudentname.get()))
                for row in cursor:
                    temp=row[1]
                ans=messagebox.askyesno("Warning!","Do you really want to delete '{}'?".format(temp))
                if ans == True:
                    cursor.execute("delete from student where Student_id = '{}'".format(deletestudentname.get()))
                    connection.commit()
                    query = """delete from feerecord where Student_id = '{}'""".format(deletestudentname.get())
                    cursor.execute(query)
                    connection.commit()
                    frameshowstudent.destroy()
                    frameshowstudent = Frame(framestudent, width=100, height=50, bg="white")
                    frameshowstudent.pack(side=TOP, fill=BOTH, expand=True, padx=1)

                    connection = sqlite3.connect("database.db")
                    cursor = connection.cursor()
                    query = """select count(*) from STUDENT"""
                    cursor.execute(query)
                    count = 0
                    for row in cursor:
                        count = row[0]
                    if count != 0:
                        scrollbarx = Scrollbar(frameshowstudent, orient=HORIZONTAL)
                        scrollbarx.pack(side=BOTTOM, fill=X)
                        scrollbary = Scrollbar(frameshowstudent, orient=VERTICAL)
                        scrollbary.pack(side=RIGHT, fill=Y)
                        tree = ttk.Treeview(frameshowstudent, columns=(
                            "studentid", "name", "course", "gender", "dateofbirth", "mobileno", "city", "district",
                            "state", "nationality", "email", "qualification"), selectmode="extended")
                        tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
                        tree.pack(side=TOP, fill=BOTH, expand=TRUE)
                        scrollbarx.config(command=tree.xview)
                        scrollbary.config(command=tree.yview)
                        tree.heading("studentid", text="Student ID")
                        tree.heading("name", text="Name")
                        tree.heading("course", text="Course")
                        tree.heading("gender", text="Gender")
                        tree.heading("dateofbirth", text="Date of Birth")
                        tree.heading("mobileno", text="Mobile No")
                        tree.heading("city", text="City")
                        tree.heading("district", text="District")
                        tree.heading("state", text="State")
                        tree.heading("nationality", text="Nationality")
                        tree.heading("email", text="Emain id")
                        tree.heading("qualification", text="Qualification")

                        tree.column("#0", stretch=NO, minwidth=0, width=0)
                        tree.column("studentid", stretch=NO, minwidth=100, width=100)
                        tree.column("name", stretch=NO, minwidth=100, width=100)
                        tree.column("course", stretch=NO, minwidth=100, width=120)
                        tree.column("gender", stretch=NO, minwidth=100, width=60)
                        tree.column("dateofbirth", stretch=NO, minwidth=100, width=120)
                        tree.column("mobileno", stretch=NO, minwidth=100, width=100)
                        tree.column("city", stretch=NO, minwidth=100, width=100)
                        tree.column("district", stretch=NO, minwidth=100, width=120)
                        tree.column("state", stretch=NO, minwidth=100, width=120)
                        tree.column("nationality", stretch=NO, minwidth=100, width=120)
                        tree.column("email", stretch=NO, minwidth=100, width=120)
                        tree.column("qualification", stretch=NO, minwidth=100, width=120)
                        tree.bind('<<TreeviewSelect>>', lambda event=0: treeviewselect(event))

                        connection = sqlite3.connect("database.db")
                        query = 'SELECT * FROM student order by Name asc'
                        cursor = connection.cursor()
                        cursor.execute(query)
                        record = cursor.fetchall()
                        x = 1
                        for row in record:
                            tree.insert("", END, values=row)
                        cursor.close()
                        messagebox.showinfo("Warning!", "Name '{}' deleted successfully.".format(temp))



    frame3.config(bg="#74bc3c")
    students.config(bg="#74bc3c")
    frame2.config(bg="#383c44")
    teachers.config(bg="#383c44")
    frame4.config(bg="#383c44")
    courses.config(bg="#383c44")
    frame5.config(bg="#383c44")
    attendance.config(bg="#383c44")
    frame6.config(bg="#383c44")
    fee.config(bg="#383c44")
    frame1.config(bg="#383c44")
    home.config(bg="#383c44")

    try:
        frameteachers.destroy()
    except:
        pass
    try:
        framehome.destroy()
    except:
        pass
    try:
        framecourses.destroy()
    except:
        pass
    try:
        framefee.destroy()
    except:
        pass
    try:
        frameattendance.destroy()
    except:
        pass
    try:
        frameaddteacher.destroy()
    except:
        pass
    try:
        frameaddstudent.destroy()
    except:
        pass
    try:
        frameupdateteacher.destroy()
    except:
        pass
    try:
        frameupdatestudent.destroy()
    except:
        pass
    try:
        frameaddcourse.destroy()
    except:
        pass
    try:
        frameupdatecourse.destroy()
    except:
        pass
    try:
        frameupdatefee.destroy()
    except:
        pass
    if (counterstudent <= 1):
        try:
            frameimage.destroy()
        except:
            pass
        try:
            buttonabout.destroy()
        except:
            pass
        buttonabout = Button(frame0, text="About",bg="#383c44",command = lambda: about())
        buttonabout.pack(side=BOTTOM,fill = X)
        framestudent = Frame(root, width=100, height=100, bg="white", bd=2, relief="solid")
        framestudent.pack(side=TOP, fill=BOTH, expand=True)

        frametoptop = Frame(framestudent, width=150, height=35, bg="white")
        frametoptop.pack(side=TOP, padx=10, pady=10, fill=X)
        frametop = Frame(frametoptop, width=150, height=35, bg="white")
        frametop.pack(side="left")

        imgplus = PhotoImage(file="Webp.net-resizeimage (7).png", width="30", height="30")
        imglabel = Label(frametop, image=imgplus,bg="white")
        imglabel.pack(side=LEFT)

        course = StringVar()
        course.set("All")
        listcourse = []
        con = sqlite3.connect("database.db")
        cursor = con.cursor()
        cursor.execute("select Name from course order by Name asc")
        record = cursor.fetchall()
        for row in record:
            listcourse.append(row[0])

        entrycourse = OptionMenu(frametop, course, 'All', *listcourse)
        entrycourse.config(compound='left', bg="white", relief="solid", borderwidth=1, width=20)
        entrycourse.pack(side="left", padx=(10, 0))

        buttonaply = Button(frametop, text="Apply", bg="lightblue", command=lambda: showstudent(course.get()))
        buttonaply.pack(side="left", padx=(10, 0))


        frameright = Frame(frametoptop, width=150, height=35, bg="white")
        frameright.pack(side="right")

        updatestudentname = StringVar()
        updatestudentname.set("Enter ID Here.")
        deletestudentname = StringVar()
        deletestudentname.set("Enter ID Here.")
        studentsearchname = StringVar()
        studentsearchname.set("Search Tag")

        entrysearch = Entry(frameright, width=20, textvariable=studentsearchname,relief="solid",borderwidth=2)
        entrysearch.pack(side=LEFT, padx=10)
        entrysearch.bind("<Return>",lambda event: click_searchstudent(event))
        buttonsearch = Button(frameright, text="Search", bg="lightblue",
                              command=lambda event=0: click_searchstudent(event))
        buttonsearch.pack(side=LEFT)

        entryupdate = Entry(frameright, width=20, textvariable=updatestudentname,relief="solid",borderwidth=2)
        entryupdate.pack(side=LEFT, padx=10)
        entryupdate.bind("<Return>",lambda event: click_updatestudent(event))
        buttonupdate = Button(frameright, text="Update", bg="lightblue",command= lambda event=0: click_updatestudent(event))
        buttonupdate.pack(side=LEFT)

        entrydelete = Entry(frameright, width=20, textvariable=deletestudentname,relief="solid",borderwidth=2)
        entrydelete.pack(side=LEFT, padx=10)
        entrydelete.bind("<Return>",lambda event: click_deletestudent(event))
        buttondelete = Button(frameright, text="Delete", bg="lightblue",command= lambda event=0: click_deletestudent(event))
        buttondelete.pack(side=LEFT, padx=1)

        imglabel.bind("<Button-1>", click_addstudent)


        frameshowstudent = Frame(framestudent, width=100, height=50, bg="white")
        frameshowstudent.pack(side=TOP, fill=BOTH, expand=True, padx=1)
        scrollbarx = Scrollbar(frameshowstudent, orient=HORIZONTAL)
        scrollbarx.pack(side=BOTTOM, fill=X)
        scrollbary = Scrollbar(frameshowstudent, orient=VERTICAL)
        scrollbary.pack(side=RIGHT, fill=Y)
        tree = ttk.Treeview(frameshowstudent, columns=(
        "studentid", "name", "course", "gender", "dateofbirth", "mobileno", "city", "district",
        "state", "nationality", "email", "qualification"), selectmode="extended")
        tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
        tree.pack(side=TOP,fill=BOTH,expand=True)
        scrollbarx.config(command=tree.xview)
        scrollbary.config(command=tree.yview)

        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        query = """select count(*) from STUDENT"""
        cursor.execute(query)
        count = 0
        for row in cursor:
            count = row[0]
        if count != 0:
            tree.heading("studentid", text="Student ID")
            tree.heading("name", text="Name")
            tree.heading("course", text="Course")
            tree.heading("gender", text="Gender")
            tree.heading("dateofbirth", text="Date of Birth")
            tree.heading("mobileno", text="Mobile No")
            tree.heading("city", text="City")
            tree.heading("district", text="District")
            tree.heading("state", text="State")
            tree.heading("nationality", text="Nationality")
            tree.heading("email", text="Email id")
            tree.heading("qualification", text="Qualification")

            tree.column("#0", stretch=NO, minwidth=0, width=0)
            tree.column("studentid", stretch=NO, minwidth=100, width=100)
            tree.column("name", stretch=NO, minwidth=100, width=100)
            tree.column("course", stretch=NO, minwidth=100, width=120)
            tree.column("gender", stretch=NO, minwidth=100, width=60)
            tree.column("dateofbirth", stretch=NO, minwidth=100, width=120)
            tree.column("mobileno", stretch=NO, minwidth=100, width=100)
            tree.column("city", stretch=NO, minwidth=100, width=100)
            tree.column("district", stretch=NO, minwidth=100, width=120)
            tree.column("state", stretch=NO, minwidth=100, width=120)
            tree.column("nationality", stretch=NO, minwidth=100, width=120)
            tree.column("email", stretch=NO, minwidth=100, width=120)
            tree.column("qualification", stretch=NO, minwidth=100, width=120)
            tree.bind("<<TreeviewSelect>>",lambda event=0: treeviewselect(event))



            connection = sqlite3.connect("database.db")
            query = 'SELECT * FROM student order by Name asc'
            cursor = connection.cursor()
            cursor.execute(query)
            record = cursor.fetchall()
            x = 1
            for row in record:
                tree.insert("", END, values=row)
                x += 1
            cursor.close()


def click_courses(event):
    global counterhome
    global counterteacher
    global counterstudent
    global counterattendance
    global counterfee
    global countercourses
    global framehome
    global frameteachers
    global framestudent
    global frameattendance
    global framecourses
    global framefee
    global frameaddteacher
    global counteraddteacher
    global frameaddstudent
    global counteraddstudent
    global click_updateteacher
    global frameupdateteacher
    global click_updatestudent
    global frameupdatecourse
    global imgplus
    global click_addcousre
    global frameaddcourse
    global coursesearchname
    global updatecoursename
    global deletecoursename
    global frameupdatefee
    global counteraddcourse
    global counterupdateteacher
    global counterupdatestudent
    global counterupdatecourse
    global counterupdatefee
    global frameshowcourse
    global frameimage
    global frame0
    global buttonabout

    def treeviewselect(event):
        global updatecoursename
        global deletecoursename
        item = tree.selection()
        updatecoursename.set(tree.item(item)['values'][0])
        deletecoursename.set(tree.item(item)['values'][0])

    countercourses += 1
    counterstudent = 0
    counterhome = 0
    counterteacher = 0
    counterattendance = 0
    counterfee = 0
    counteraddteacher = 0
    counteraddstudent = 0
    counteraddcourse = 0
    counterupdateteacher = 0
    counterupdatestudent = 0
    counterupdatecourse = 0
    counterupdatefee = 0


    def click_searchcourse(event):
        global coursesearchname
        if len(coursesearchname.get())==0:
            messagebox.showerror("Error","Please enter search tag.")
        else:
            connection = sqlite3.connect("database.db")
            query = 'SELECT count(*) FROM course where Name like "{0}" or Course_id like "{0}" or Duration like "{0}" or Teacher like "{0}" or Fee like "{0}"'.format(coursesearchname.get())
            cursor = connection.cursor()
            cursor.execute(query)
            record= cursor.fetchall()
            for row in record:
                temp=row[0]
            if temp != 0:
                screensearch = Tk()
                screensearch.title("Search Result")
                screensearch.geometry("1280x720")
                screensearch.config(bg="white")

                label = Label(screensearch, text="Sr.", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=0, sticky='EW')
                label = Label(screensearch, text="Course ID", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=1, sticky='EW')
                label = Label(screensearch, text="Course Name", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=2, sticky='EW')
                label = Label(screensearch, text="Duration", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=3, sticky='EW')
                label = Label(screensearch, text="Teacher", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=4, sticky='EW')
                label = Label(screensearch, text="Fee", bg="white", font=("", 11, "bold"), borderwidth=1,
                              relief="solid")
                label.grid(row=0, column=5, sticky='EW')

                connection = sqlite3.connect("database.db")
                query = "SELECT * FROM course where Name like '{0}' or Course_id like '{0}' or Duration like '{0}' or Teacher like '{0}' or fee like '{0}' order by Name asc".format(coursesearchname.get())
                cursor = connection.cursor()
                cursor.execute(query)
                record = cursor.fetchall()
                x = 1
                for row in record:
                    label1 = Label(screensearch, text="{}.".format(x), bg="white", borderwidth=1, relief="solid")
                    label1.grid(row=x, column=0, sticky='EW', pady=1)
                    label2 = Text(screensearch, height=1, width=10, bg="white", borderwidth=1, relief="solid")
                    label2.insert(1.0, "{}".format(row[0]))
                    label2.grid(row=x, column=1, sticky='EW', pady=1)
                    label3 = Label(screensearch, text="{}".format(row[1]), bg="white", borderwidth=1, relief="solid")
                    label3.grid(row=x, column=2, sticky='EW')
                    label4 = Label(screensearch, text="{}".format(row[2]), bg="white", borderwidth=1, relief="solid")
                    label4.grid(row=x, column=3, sticky='EW')
                    label5 = Label(screensearch, text="{}".format(row[3]), bg="white", borderwidth=1, relief="solid")
                    label5.grid(row=x, column=4, sticky='EW')
                    label5 = Label(screensearch, text="{}".format(row[4]), bg="white", borderwidth=1, relief="solid")
                    label5.grid(row=x, column=5, sticky='EW')
                    x += 1
                cursor.close()
            else:
                data = '%' + coursesearchname.get() + '%'
                connection = sqlite3.connect("database.db")
                query = 'SELECT count(*) FROM course where Name like "{0}" or Course_id like "{0}" or Duration like "{0}" or Teacher like "{0}" or Fee like "{0}"'.format(data)
                cursor = connection.cursor()
                cursor.execute(query)
                record = cursor.fetchall()
                for row in record:
                    temp = row[0]
                print(temp)
                if temp == 0:
                    messagebox.showerror("Error","No Data Found.")
                else:
                    screensearch = Tk()
                    screensearch.title("Search Result")
                    screensearch.geometry("1280x720")
                    screensearch.config(bg="white")

                    label = Label(screensearch, text="Sr.", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=0, sticky='EW')
                    label = Label(screensearch, text="Course ID", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=1, sticky='EW')
                    label = Label(screensearch, text="Course Name", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=2, sticky='EW')
                    label = Label(screensearch, text="Duration", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=3, sticky='EW')
                    label = Label(screensearch, text="Teacher", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=4, sticky='EW')
                    label = Label(screensearch, text="Fee", bg="white", font=("", 11, "bold"), borderwidth=1,
                                  relief="solid")
                    label.grid(row=0, column=5, sticky='EW')

                    connection = sqlite3.connect("database.db")
                    query = "SELECT * FROM course where Name like '{0}' or Course_id like '{0}' or Duration like '{0}' or Teacher like '{0}' or fee like '{0}' order by Name asc".format(data)
                    cursor = connection.cursor()
                    cursor.execute(query)
                    record = cursor.fetchall()
                    x = 1
                    for row in record:
                        label1 = Label(screensearch, text="{}.".format(x), bg="white", borderwidth=1, relief="solid")
                        label1.grid(row=x, column=0, sticky='EW', pady=1)
                        label2 = Text(screensearch, height=1, width=10, bg="white", borderwidth=1, relief="solid")
                        label2.insert(1.0, "{}".format(row[0]))
                        label2.grid(row=x, column=1, sticky='EW', pady=1)
                        label3 = Label(screensearch, text="{}".format(row[1]), bg="white", borderwidth=1,
                                       relief="solid")
                        label3.grid(row=x, column=2, sticky='EW')
                        label4 = Label(screensearch, text="{}".format(row[2]), bg="white", borderwidth=1,
                                       relief="solid")
                        label4.grid(row=x, column=3, sticky='EW')
                        label5 = Label(screensearch, text="{}".format(row[3]), bg="white", borderwidth=1,
                                       relief="solid")
                        label5.grid(row=x, column=4, sticky='EW')
                        label5 = Label(screensearch, text="{}".format(row[4]), bg="white", borderwidth=1,
                                       relief="solid")
                        label5.grid(row=x, column=5, sticky='EW')
                        x += 1
                    cursor.close()





    def click_deletecourse(event):
        global deletecoursename
        global countercourses
        global frameshowcourse
        def treeviewselect(event):
            global updatecoursename
            global deletecoursename
            item = tree.selection()
            updatecoursename.set(tree.item(item)['values'][0])
            deletecoursename.set(tree.item(item)['values'][0])
        if len(deletecoursename.get()) == 0:
            messagebox.showinfo("Error!", 'Please enter ID.')
        else:
            connection = sqlite3.connect("database.db")
            cursor = connection.cursor()
            query = """SELECT count(*) FROM course WHERE Course_id = '{}'""".format(deletecoursename.get())
            c=cursor.execute(query)
            for row in c:
                temp=row[0]
            if temp == 0:
                messagebox.showinfo("Error!", "ID '{}' doesn't exist".format(deletecoursename.get()))
            else:
                cursor.execute("select * from course where Course_id = '{}'".format(deletecoursename.get()))
                for row in cursor:
                    temp=row[1]
                ans=messagebox.askyesno("Warning!","Do you really want to delete '{}'?".format(temp))
                if ans == True:
                    cursor.execute("delete from course where Course_id = '{}'".format(deletecoursename.get()))
                    connection.commit()

                    frameshowcourse.destroy()
                    frameshowcourse = Frame(framecourses, width=100, height=50, bg="white")
                    frameshowcourse.pack(side=TOP, fill=BOTH, expand=True, padx=1)
                    scrollbarx = Scrollbar(frameshowcourse, orient=HORIZONTAL)
                    scrollbarx.pack(side=BOTTOM, fill=X)
                    scrollbary = Scrollbar(frameshowcourse, orient=VERTICAL)
                    scrollbary.pack(side=RIGHT, fill=Y)
                    tree = ttk.Treeview(frameshowcourse, columns=("courseid", "name", "duration", "teacher", "fee"),
                                        selectmode="extended")
                    tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
                    tree.pack(side=TOP, fill=BOTH, expand=TRUE)
                    scrollbarx.config(command=tree.xview)
                    scrollbary.config(command=tree.yview)

                    tree.heading("courseid", text="Course Id")
                    tree.heading("name", text="Name")
                    tree.heading("duration", text="Duration")
                    tree.heading("teacher", text="Teacher")
                    tree.heading("fee", text="Fee")

                    tree.column("#0", stretch=NO, minwidth=0, width=0)
                    tree.column("courseid", stretch=NO, minwidth=0, width=120)
                    tree.column("name", stretch=NO, minwidth=0, width=150)
                    tree.column("duration", stretch=NO, minwidth=0, width=120)
                    tree.column("teacher", stretch=NO, minwidth=0, width=120)
                    tree.column("fee", stretch=NO, minwidth=0, width=120)
                    tree.bind("<<TreeviewSelect>>", lambda event=0: treeviewselect(event))

                    connection = sqlite3.connect("database.db")
                    query = 'SELECT * FROM course order by Name asc'
                    cursor = connection.cursor()
                    cursor.execute(query)
                    record = cursor.fetchall()
                    x = 1
                    for row in record:
                        tree.insert("", END, values=row)
                        x += 1
                    cursor.close()
                    messagebox.showinfo("Warning!", "Name '{}' deleted successfully.".format(temp))

    frame4.config(bg="#74bc3c")
    courses.config(bg="#74bc3c")
    frame3.config(bg="#383c44")
    students.config(bg="#383c44")
    frame2.config(bg="#383c44")
    teachers.config(bg="#383c44")
    frame5.config(bg="#383c44")
    attendance.config(bg="#383c44")
    frame6.config(bg="#383c44")
    fee.config(bg="#383c44")
    frame1.config(bg="#383c44")
    home.config(bg="#383c44")

    try:
        frameteachers.destroy()
    except:
        pass
    try:
        framehome.destroy()
    except:
        pass
    try:
        frameattendance.destroy()
    except:
        pass
    try:
        framefee.destroy()
    except:
        pass
    try:
        framestudent.destroy()
    except:
        pass
    try:
        frameaddteacher.destroy()
    except:
        pass
    try:
        frameaddstudent.destroy()
    except:
        pass
    try:
        frameupdateteacher.destroy()
    except:
        pass
    try:
        frameupdatestudent.destroy()
    except:
        pass
    try:
        frameaddcourse.destroy()
    except:
        pass
    try:
        frameupdatecourse.destroy()
    except:
        pass
    try:
        frameupdatefee.destroy()
    except:
        pass



    if (countercourses <= 1):
        try:
            frameimage.destroy()
        except:
            pass
        try:
            buttonabout.destroy()
        except:
            pass
        buttonabout = Button(frame0, text="About",bg="#383c44",command = lambda: about())
        buttonabout.pack(side=BOTTOM,fill = X)
        framecourses = Frame(root, width=100, height=100, bg="white", bd=2, relief="solid")
        framecourses.pack(side=TOP, fill=BOTH, expand=True)

        frametoptop = Frame(framecourses, width=150, height=35, bg="white")
        frametoptop.pack(side=TOP, padx=10, pady=10, fill=X)
        frametop = Frame(frametoptop, width=150, height=35, bg="white")
        frametop.pack(side="left")

        imgplus = PhotoImage(file="Webp.net-resizeimage (7).png", width="30", height="30")
        imglabel = Label(frametop, image=imgplus, bg="white")
        imglabel.pack(side=LEFT)

        frameright = Frame(frametoptop, width=150, height=35, bg="white")
        frameright.pack(side="right")

        updatecoursename = StringVar()
        updatecoursename.set("Enter ID Here.")
        deletecoursename = StringVar()
        deletecoursename.set("Enter ID Here.")
        coursesearchname = StringVar()
        coursesearchname.set("Search Tag")

        entrysearch = Entry(frameright, width=20, textvariable=coursesearchname, relief="solid", borderwidth=2)
        entrysearch.pack(side=LEFT, padx=10)
        entrysearch.bind("<Return>",lambda event: click_searchcourse(event))
        buttonsearch = Button(frameright, text="Search", bg="lightblue",
                              command=lambda event=0: click_searchcourse(event))
        buttonsearch.pack(side=LEFT)

        entryupdate = Entry(frameright, width=20, textvariable=updatecoursename, relief="solid", borderwidth=2)
        entryupdate.pack(side=LEFT, padx=10)
        entryupdate.bind("<Return>",lambda event: click_updatecourse(event))
        buttonupdate = Button(frameright, text="Update", bg="lightblue",
                              command=lambda event=0: click_updatecourse(event))
        buttonupdate.pack(side=LEFT)

        entrydelete = Entry(frameright, width=20, textvariable=deletecoursename, relief="solid", borderwidth=2)
        entrydelete.pack(side=LEFT, padx=10)
        entrydelete.bind("<Return>",lambda event: click_deletecourse(event))
        buttondelete = Button(frameright, text="Delete", bg="lightblue",
                              command=lambda event=0: click_deletecourse(event))
        buttondelete.pack(side=LEFT, padx=1)

        frametop.bind("<Button-1>", click_addcourse)
        imglabel.bind("<Button-1>", click_addcourse)

        frameshowcourse = Frame(framecourses, width=100, height=50, bg="white")
        frameshowcourse.pack(side=TOP, fill=BOTH, expand=True, padx=1)
        scrollbarx = Scrollbar(frameshowcourse, orient=HORIZONTAL)
        scrollbarx.pack(side=BOTTOM, fill=X)
        scrollbary = Scrollbar(frameshowcourse, orient=VERTICAL)
        scrollbary.pack(side=RIGHT, fill=Y)
        tree = ttk.Treeview(frameshowcourse, columns=("courseid", "name", "duration", "teacher", "fee"), selectmode="extended")
        tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
        tree.pack(side=TOP, fill=BOTH, expand=TRUE)
        scrollbarx.config(command=tree.xview)
        scrollbary.config(command=tree.yview)

        tree.heading("courseid", text="Course Id")
        tree.heading("name", text="Name")
        tree.heading("duration", text="Duration")
        tree.heading("teacher", text="Teacher")
        tree.heading("fee", text="Fee")


        tree.column("#0", stretch=NO, minwidth=0, width=0)
        tree.column("courseid", stretch=NO, minwidth=100, width=120)
        tree.column("name", stretch=NO, minwidth=100, width=150)
        tree.column("duration", stretch=NO, minwidth=100, width=120)
        tree.column("teacher", stretch=NO, minwidth=100, width=120)
        tree.column("fee", stretch=NO, minwidth=100, width=120)
        tree.bind("<<TreeviewSelect>>", lambda event=0: treeviewselect(event))



        connection = sqlite3.connect("database.db")
        query = 'SELECT * FROM course order by Name asc'
        cursor = connection.cursor()
        cursor.execute(query)
        record = cursor.fetchall()
        x = 1
        for row in record:
            tree.insert("",END,values=row)
            x += 1
        cursor.close()


def click_attendance(event):
    global counterhome
    global counterteacher
    global counterstudent
    global counterattendance
    global counterfee
    global countercourses
    global framehome
    global frameteachers
    global framestudent
    global frameattendance
    global framecourses
    global framefee
    global frameaddteacher
    global counteraddteacher
    global frameaddstudent
    global counteraddstudent
    global click_updateteacher
    global frameupdateteacher
    global click_updatestudent
    global frameupdatestudent
    global frameaddcourse
    global frameupdatecourse
    global frameupdatefee
    global counteraddcourse
    global imgplus
    global attdate
    global attcourse
    global counterupdateteacher
    global counterupdatestudent
    global counterupdatecourse
    global counterupdatefee

    counterattendance += 1
    countercourses = 0
    counterstudent = 0
    counterhome = 0
    counterteacher = 0
    counterfee = 0
    counteraddteacher = 0
    counteraddstudent = 0
    counteraddcourse = 0
    counterupdateteacher = 0
    counterupdatestudent = 0
    counterupdatecourse = 0
    counterupdatefee = 0

    frame5.config(bg="#74bc3c")
    attendance.config(bg="#74bc3c")
    frame4.config(bg="#383c44")
    courses.config(bg="#383c44")
    frame3.config(bg="#383c44")
    students.config(bg="#383c44")
    frame2.config(bg="#383c44")
    teachers.config(bg="#383c44")
    frame6.config(bg="#383c44")
    fee.config(bg="#383c44")
    frame1.config(bg="#383c44")
    home.config(bg="#383c44")

    try:
        framehome.destroy()
    except:
        pass
    try:
        frameteachers.destroy()
    except:
        pass
    try:
        framestudent.destroy()
    except:
        pass
    try:
        framefee.destroy()
    except:
        pass
    try:
        framecourses.destroy()
    except:
        pass
    try:
        frameaddteacher.destroy()
    except:
        pass
    try:
        frameaddstudent.destroy()
    except:
        pass
    try:
        frameupdateteacher.destroy()
    except:
        pass
    try:
        frameupdatestudent.destroy()
    except:
        pass
    try:
        frameaddcourse.destroy()
    except:
        pass
    try:
        frameupdatecourse.destroy()
    except:
        pass
    try:
        frameupdatefee.destroy()
    except:
        pass

    if (counterattendance <= 1):
        frameattendance = Frame(root, width=100, height=100, bg="white", bd=2, relief="solid")
        frameattendance.pack(side=TOP, fill=BOTH, expand=True)

        frametoptop = Frame(frameattendance, width=150, height=35, bg="white")
        frametoptop.pack(side=TOP, padx=10, pady=10, fill=X)
        frameleft = Frame(frametoptop, width=150, height=35, bg="white")
        frameleft.pack(side="left")

        attcourse = StringVar()
        attdate = StringVar()

        attcourse.set("All")
        listcourse = []
        con = sqlite3.connect("database.db")
        cursor = con.cursor()
        cursor.execute("select Name from course order by Name asc")
        record = cursor.fetchall()
        for row in record:
            listcourse.append(row[0])

        entrycourse = OptionMenu(frameleft, attcourse, 'All', *listcourse)
        entrycourse.config(compound='left', bg="white", relief="solid", borderwidth=1, width=20)
        entrycourse.pack(side="left", padx=(10, 10))

        entrydate = Entry(frameleft, width=18, textvariable = attdate, bg = "white", borderwidth=1, relief = "solid",font=13)
        entrydate.pack(side=LEFT,ipady=2)

        buttonapply = Button(frameleft,text = "Apply",bg= 'lightblue')
        buttonapply.pack(side="left",padx=(10,0))

        frameshowattendance = Frame(frameattendance,bg="white")
        frameshowattendance.pack(side="top",fill=X)

        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()

        query = """select count(*) from attendance where course = '{}' and Date = '{}'""".format(attcourse.get(),attdate.get())
        cursor.execute(query)
        for row in cursor:
            countresult = row[0]
        if countresult != 0:
            label = Label(frameshowattendance,bg="white",text="Student Id", borderwidth=1, relief="solid")
            label.grid(row=0, column=0, sticky="ew")
            label = Label(frameshowattendance,bg="white", text="Student Name", borderwidth=1, relief="solid")
            label.grid(row=0, column=1, sticky="ew")
            label = Label(frameshowattendance, bg="white",text="Course", borderwidth=1, relief="solid")
            label.grid(row=0, column=2, sticky="ew")
            label = Label(frameshowattendance,bg="white", text="Date", borderwidth=1, relief="solid")
            label.grid(row=0, column=3, sticky="ew")
            label = Label(frameshowattendance, bg="white",text="Attendance", borderwidth=1, relief="solid")
            label.grid(row=0, column=4, sticky="ew")

            connection = sqlite3.connect("database.db")
            cursor = connection.cursor()

            query = """select * from attendance order by Student_name"""
            cursor.execute(query)
            result = cursor.fetchall()
            x=1
            for row in result:
                label = Label(frameshowattendance,text="{}".format(row[0]),bg="white",borderwidth=1,relief="solid")
                label.grid(row=x,column=0,sticky='ew')
                label = Label(frameshowattendance, text="{}".format(row[1]), bg="white", borderwidth=1, relief="solid")
                label.grid(row=x, column=1, sticky='ew')
                label = Label(frameshowattendance, text="{}".format(row[2]), bg="white", borderwidth=1, relief="solid")
                label.grid(row=0, column=2, sticky='ew')
                label = Label(frameshowattendance, text="{}".format(row[3]), bg="white", borderwidth=1, relief="solid")
                label.grid(row=0, column=3, sticky='ew')
                label = Label(frameshowattendance, text="{}".format(row[4]), bg="white", borderwidth=1, relief="solid")
                label.grid(row=0, column=4, sticky='ew')
        else:
            if attcourse.get()=="All":
                query = """select Student_id, Name from STUDENT order by Name"""
                query1 = """select count(*) from STUDENT"""
            else:
                query = """select Student_id, Name from STUDENT where Course = '{}' order by Name""".format(attcourse.get())
            cursor = connection.cursor()
            cursor.execute(query)
            record = cursor.fetchall()
            dict={}
            x=0
            newframe = Frame(frameshowattendance, bg="white")
            newframe.pack(anchor="ne", side="left")
            for row in record:
                dict[row[0]]=StringVar()
                label = Label(newframe,text="{}".format(row[1]),bg="white")
                label.grid(row=x,column=0,sticky='ew',padx=10)
                check = Checkbutton(newframe,bg="white",variable=dict[row[0]])
                check.grid(row=x,column=1)
                x+=1
            Button(frameshowattendance,text="click",command=lambda: print(dict)).pack(side=BOTTOM)


def click_fee(event):
    global counterhome
    global counterteacher
    global counterstudent
    global counterattendance
    global counterfee
    global countercourses
    global framehome
    global frameteachers
    global framestudent
    global frameattendance
    global framecourses
    global framefee
    global frameaddteacher
    global counteraddteacher
    global frameaddstudent
    global counteraddstudent
    global click_updateteacher
    global frameupdateteacher
    global click_updatestudent
    global frameupdatestudent
    global frameaddcourse
    global frameupdatecourse
    global frameshowfee
    global searchstudentfee
    global updatestudentfee
    global frameupdatefee
    global counteraddcourse
    global counterupdateteacher
    global counterupdatestudent
    global counterupdatecourse
    global counterupdatefee
    global frameimage
    global frame0
    global buttonabout
    def treeviewselect(event):
        global searchstudentfee
        global updatestudentfee
        item=tree.selection()
        updatestudentfee.set(tree.item(item)['values'][0])


    counterfee += 1
    counterattendance = 0
    countercourses = 0
    counterstudent = 0
    counterhome = 0
    counterteacher = 0
    counteraddteacher = 0
    counteraddstudent = 0
    counteraddcourse = 0
    counterupdateteacher = 0
    counterupdatestudent = 0
    counterupdatecourse = 0
    counterupdatefee = 0

    def searchstudentinfee(event):
        global frameshowfee
        global searchstudentfee
        global updatestudentfee
        def treeviewselect(event):
            global searchstudentfee
            global updatestudentfee
            item = tree.selection()
            updatestudentfee.set(tree.item(item)['values'][0])

        connection = sqlite3.connect("database.db")
        query = "SELECT count(*) FROM student where Student_id like '{0}' or Name like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}' or Fee like '{0}' or Fee_remaining like '{0}' or Fee_deposited like '{0}' order by Name asc".format(
            searchstudentfee.get())
        cursor = connection.cursor()
        cursor.execute(query)
        record = cursor.fetchall()
        for row in record:
            count = row[0]
        if count != 0:
            frameshowfee.destroy()

            frameshowfee = Frame(framefee, width=100, height=50, bg="white")
            frameshowfee.pack(side=TOP, fill=BOTH, expand=True, padx=1)

            scrollbarx = Scrollbar(frameshowfee, orient=HORIZONTAL)
            scrollbarx.pack(side=BOTTOM, fill=X)
            scrollbary = Scrollbar(frameshowfee, orient=VERTICAL)
            scrollbary.pack(side=RIGHT, fill=Y)
            tree = ttk.Treeview(frameshowfee,
                                columns=("studentid", "name", "course", "fee", "feedeposited", 'feeremaining'),
                                selectmode="extended")
            tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
            tree.pack(side=TOP, fill=BOTH, expand=TRUE)
            scrollbarx.config(command=tree.xview)
            scrollbary.config(command=tree.yview)

            tree.heading("studentid", text="Student Id")
            tree.heading("name", text="Name")
            tree.heading("course", text="Course")
            tree.heading("fee", text="Totel Fee")
            tree.heading("feedeposited", text="Deposited")
            tree.heading("feeremaining", text="Remaining")

            tree.column("#0", stretch=NO, minwidth=0, width=0)
            tree.column("studentid", stretch=NO, minwidth=100, width=120)
            tree.column("name", stretch=NO, minwidth=100, width=150)
            tree.column("course", stretch=NO, minwidth=100, width=120)
            tree.column("fee", stretch=NO, minwidth=100, width=120)
            tree.column("feedeposited", stretch=NO, minwidth=100, width=120)
            tree.column("feeremaining", stretch=NO, minwidth=100, width=120)
            tree.bind("<<TreeviewSelect>>", lambda event=0: treeviewselect(event))

            connection = sqlite3.connect("database.db")

            query = "SELECT Student_id, Name, Course, Fee, Fee_deposited, Fee_remaining FROM student where Student_id like '{0}' or Name like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}' or Fee like '{0}' or Fee_remaining like '{0}' or Fee_deposited like '{0}' order by Name asc".format(
                searchstudentfee.get())
            cursor = connection.cursor()
            cursor.execute(query)
            record = cursor.fetchall()
            x = 1
            for row in record:
                tree.insert("", END,values=row)
                x += 1
            cursor.close()
        else:
            data = '%'+searchstudentfee.get()+'%'
            connection = sqlite3.connect("database.db")
            query = "SELECT count(*) FROM student where Student_id like '{0}' or Name like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}' or Fee like '{0}' or Fee_remaining like '{0}' or Fee_deposited like '{0}'".format(
                data)
            cursor = connection.cursor()
            cursor.execute(query)
            record = cursor.fetchall()
            for row in record:
                count = row[0]
            if count == 0:
                messagebox.showerror('Error',"No Data Found.")
            else:
                frameshowfee.destroy()

                frameshowfee = Frame(framefee, width=100, height=50, bg="white")
                frameshowfee.pack(side=TOP, fill=BOTH, expand=True, padx=1)
                scrollbarx = Scrollbar(frameshowfee, orient=HORIZONTAL)
                scrollbarx.pack(side=BOTTOM, fill=X)
                scrollbary = Scrollbar(frameshowfee, orient=VERTICAL)
                scrollbary.pack(side=RIGHT, fill=Y)
                tree = ttk.Treeview(frameshowfee,
                                    columns=("studentid", "name", "course", "fee", "feedeposited", 'feeremaining'),
                                    selectmode="extended")
                tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
                tree.pack(side=TOP, fill=BOTH, expand=TRUE)
                scrollbarx.config(command=tree.xview)
                scrollbary.config(command=tree.yview)

                tree.heading("studentid", text="Student Id")
                tree.heading("name", text="Name")
                tree.heading("course", text="Course")
                tree.heading("fee", text="Totel Fee")
                tree.heading("feedeposited", text="Deposited")
                tree.heading("feeremaining", text="Remaining")

                tree.column("#0", stretch=NO, minwidth=0, width=0)
                tree.column("studentid", stretch=NO, minwidth=0, width=120)
                tree.column("name", stretch=NO, minwidth=0, width=150)
                tree.column("course", stretch=NO, minwidth=0, width=120)
                tree.column("fee", stretch=NO, minwidth=0, width=120)
                tree.column("feedeposited", stretch=NO, minwidth=0, width=120)
                tree.column("feeremaining", stretch=NO, minwidth=0, width=120)
                tree.bind("<<TreeviewSelect>>", lambda event=0: treeviewselect(event))


                connection = sqlite3.connect("database.db")

                query = "SELECT Student_id, Name, Course, Fee, Fee_deposited, Fee_remaining FROM student where Student_id like '{0}' or Name like '{0}' or Course like '{0}' or Gender like '{0}' or Date_of_birth like '{0}' or Mobile_no like '{0}' or City like '{0}' or District like '{0}' or State like '{0}' or Nationality like '{0}' or Email like '{0}' or Qualification like '{0}' or Fee like '{0}' or Fee_remaining like '{0}' or Fee_deposited like '{0}' order by Name asc".format(
                    data)
                cursor = connection.cursor()
                cursor.execute(query)
                record = cursor.fetchall()
                x = 1
                for row in record:
                    tree.insert("",END,values=row)
                    x += 1
                cursor.close()



    def showfee(course):
        global frameshowfee
        global updatestudentfee
        def treeviewselect(event):
            global searchstudentfee
            global updatestudentfee
            item = tree.selection()
            updatestudentfee.set(tree.item(item)['values'][0])
        frameshowfee.destroy()

        frameshowfee = Frame(framefee, width=100, height=50, bg="white")
        frameshowfee.pack(side=TOP, fill=BOTH, expand=True, padx=1)
        scrollbarx = Scrollbar(frameshowfee, orient=HORIZONTAL)
        scrollbarx.pack(side=BOTTOM, fill=X)
        scrollbary = Scrollbar(frameshowfee, orient=VERTICAL)
        scrollbary.pack(side=RIGHT, fill=Y)
        tree = ttk.Treeview(frameshowfee,
                            columns=("studentid", "name", "course", "fee", "feedeposited", 'feeremaining'),
                            selectmode="extended")
        tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
        tree.pack(side=TOP, fill=BOTH, expand=TRUE)
        scrollbarx.config(command=tree.xview)
        scrollbary.config(command=tree.yview)

        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        query = """select count(*) from STUDENT"""
        cursor.execute(query)
        count = 0
        for row in cursor:
            count = row[0]
        if count != 0:
            tree.heading("studentid", text="Student Id")
            tree.heading("name", text="Name")
            tree.heading("course", text="Course")
            tree.heading("fee", text="Totel Fee")
            tree.heading("feedeposited", text="Deposited")
            tree.heading("feeremaining", text="Remaining")

            tree.column("#0", stretch=NO, minwidth=0, width=0)
            tree.column("studentid", stretch=NO, minwidth=0, width=120)
            tree.column("name", stretch=NO, minwidth=0, width=150)
            tree.column("course", stretch=NO, minwidth=0, width=120)
            tree.column("fee", stretch=NO, minwidth=0, width=120)
            tree.column("feedeposited", stretch=NO, minwidth=0, width=120)
            tree.column("feeremaining", stretch=NO, minwidth=0, width=120)
            tree.bind("<<TreeviewSelect>>", lambda event=0: treeviewselect(event))

            connection = sqlite3.connect("database.db")
            if course == "All":
                query = "SELECT Student_id, Name, Course, Fee, Fee_deposited, Fee_remaining FROM student order by Name asc"
            else:
                query = "SELECT Student_id, Name, Course, Fee, Fee_deposited, Fee_remaining FROM student where Course = '{}' order by Name asc".format(course)
            cursor = connection.cursor()
            cursor.execute(query)
            record = cursor.fetchall()
            x = 1
            for row in record:
                tree.insert("",END,values=row)
                x += 1
            cursor.close()



    frame6.config(bg="#74bc3c")
    fee.config(bg="#74bc3c")
    frame5.config(bg="#383c44")
    attendance.config(bg="#383c44")
    frame4.config(bg="#383c44")
    courses.config(bg="#383c44")
    frame3.config(bg="#383c44")
    students.config(bg="#383c44")
    frame2.config(bg="#383c44")
    teachers.config(bg="#383c44")
    frame1.config(bg="#383c44")
    home.config(bg="#383c44")

    try:
        framehome.destroy()
    except:
        pass
    try:
        frameteachers.destroy()
    except:
        pass
    try:
        framestudent.destroy()
    except:
        pass
    try:
        frameattendance.destroy()
    except:
        pass
    try:
        framecourses.destroy()
    except:
        pass
    try:
        frameaddteacher.destroy()
    except:
        pass
    try:
        frameaddstudent.destroy()
    except:
        pass
    try:
        frameupdateteacher.destroy()
    except:
        pass
    try:
        frameupdatestudent.destroy()
    except:
        pass
    try:
        frameaddcourse.destroy()
    except:
        pass
    try:
        frameupdatecourse.destroy()
    except:
        pass

    try:
        frameupdatefee.destroy()
    except:
        pass

    if (counterfee <= 1):
        try:
            frameimage.destroy()
        except:
            pass
        try:
            buttonabout.destroy()
        except:
            pass
        buttonabout = Button(frame0, text="About",bg="#383c44",command = lambda: about())
        buttonabout.pack(side=BOTTOM,fill = X)
        framefee = Frame(root, width=100, height=100, bg="white", bd=2, relief="solid")
        framefee.pack(side=TOP, fill=BOTH, expand=True)

        frametoptop = Frame(framefee, bg="white")
        frametoptop.pack(anchor="nw", fill=X)

        frametop = Frame(frametoptop, bg="white")
        frametop.pack(side=LEFT, padx=10, pady=10)

        course=StringVar()
        course.set("All")
        listcourse = []
        con = sqlite3.connect("database.db")
        cursor = con.cursor()
        cursor.execute("select Name from course order by Name asc")
        record = cursor.fetchall()
        for row in record:
            listcourse.append(row[0])

        entrycourse = OptionMenu(frametop, course, 'All', *listcourse)
        entrycourse.config(compound='left', bg="white", relief="solid", borderwidth=1,width=20)
        entrycourse.pack(side="left")

        buttonaply = Button(frametop, text="Apply",bg="lightblue", command =lambda: showfee(course.get()))
        buttonaply.pack(side="left",padx=(10,0))

        frameright = Frame(frametoptop, bg="white")
        frameright.pack(side="right")


        searchstudentfee = StringVar()
        searchstudentfee.set("Search Tag")
        updatestudentfee = StringVar()
        updatestudentfee.set("Enter ID Here.")

        entrysearch = Entry(frameright, width=20, textvariable=searchstudentfee, relief="solid", borderwidth=2)
        entrysearch.pack(side=LEFT, padx=10)
        entrysearch.bind("<Return>", lambda event: searchstudentinfee(event))

        buttonsearch = Button(frameright, text="Search", bg="lightblue",
                              command=lambda event=0: searchstudentinfee(event))
        buttonsearch.pack(side=LEFT)

        entryupdate = Entry(frameright, width=20, textvariable=updatestudentfee, relief="solid", borderwidth=2)
        entryupdate.pack(side=LEFT, padx=10)
        entryupdate.bind("<Return>", lambda event: click_updatefee(event))
        buttonupdate = Button(frameright, text="Update", bg="lightblue",
                              command=lambda event=0: click_updatefee(event))
        buttonupdate.pack(side=LEFT,padx=10)









        frameshowfee = Frame(framefee, width=100, height=50, bg="white")
        frameshowfee.pack(side=TOP, fill=BOTH, expand=True, padx=1)
        scrollbarx = Scrollbar(frameshowfee, orient=HORIZONTAL)
        scrollbarx.pack(side=BOTTOM, fill=X)
        scrollbary = Scrollbar(frameshowfee, orient=VERTICAL)
        scrollbary.pack(side=RIGHT, fill=Y)
        tree = ttk.Treeview(frameshowfee, columns=("studentid", "name", "course", "fee", "feedeposited",'feeremaining'),
                            selectmode="extended")
        tree.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
        tree.pack(side=TOP, fill=BOTH, expand=TRUE)
        scrollbarx.config(command=tree.xview)
        scrollbary.config(command=tree.yview)



        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        query = """select count(*) from STUDENT"""
        cursor.execute(query)
        count = 0
        for row in cursor:
            count = row[0]
        if count != 0:
            tree.heading("studentid", text="Student Id")
            tree.heading("name", text="Name")
            tree.heading("course", text="Course")
            tree.heading("fee", text="Totel Fee")
            tree.heading("feedeposited", text="Deposited")
            tree.heading("feeremaining", text="Remaining")

            tree.column("#0", stretch=NO, minwidth=0, width=0)
            tree.column("studentid", stretch=NO, minwidth=100, width=120)
            tree.column("name", stretch=NO, minwidth=100, width=150)
            tree.column("course", stretch=NO, minwidth=100, width=120)
            tree.column("fee", stretch=NO, minwidth=100, width=120)
            tree.column("feedeposited", stretch=NO, minwidth=100, width=120)
            tree.column("feeremaining", stretch=NO, minwidth=100, width=120)
            tree.bind("<<TreeviewSelect>>", lambda event=0: treeviewselect(event))

            connection = sqlite3.connect("database.db")
            query = 'SELECT Student_id, Name, Course, Fee, Fee_deposited, Fee_remaining FROM student order by Name asc'
            cursor = connection.cursor()
            cursor.execute(query)
            record = cursor.fetchall()
            x = 1
            for row in record:
                tree.insert("", END,values=row)
                x += 1
            cursor.close()


frame0 = Frame(root, bg="#383c44", width="165", height=700)
frame0.pack(side="left", fill=Y)

framehome = Frame(root, bg="white", bd=2, relief="solid")
framehome.pack(side="left", fill=BOTH, expand=True)

connection = sqlite3.connect("database.db")
query = 'SELECT count(NAME) FROM IMAGE order by Name asc'
cursor = connection.cursor()
cursor.execute(query)
for row in cursor:
    count = row[0]
if count != 0:
    cursor.execute("""
    SELECT * FROM IMAGE
    """)
    files = cursor.fetchall()
    image = random.choice(files)
    imagename = image[0]
    imge = image[1]
    realimage = open("wallpaper.jpg",'wb')
    realimage.write(imge)

    Tk.update(root)
    w = framehome.winfo_width()
    h = framehome.winfo_height()

    img = Image.open("wallpaper.jpg")
    img = img.resize((w, h), Image.ANTIALIAS)
    realpic = ImageTk.PhotoImage(img)

    label = ttk.Label(framehome, image=realpic,text = imagename, compound  = 'bottom')
    label.image = realpic
    label.pack(fill = BOTH)

frame1 = Frame(frame0, bg="#74bc3c")
frame1.pack(side="top", fill=X)

frame2 = Frame(frame0, bg="#383c44")
frame2.pack(side="top", fill=X)

frame3 = Frame(frame0, bg="#383c44")
frame3.pack(side="top", fill=X)

frame4 = Frame(frame0, bg="#383c44")
frame4.pack(side="top", fill=X)

frame5 = Frame(frame0, bg="#383c44")
#frame5.pack(side="top", fill=X)

frame6 = Frame(frame0, bg="#383c44")
frame6.pack(side="top", fill=X)

frameimage = Frame(frame0, bg="#383c44")
frameimage.pack(side="bottom", fill=X)

home = Label(frame1, text="Home", fg="white", bg="#74bc3c", font=(10),height=1)
home.pack(side=LEFT,padx=(20,60),ipady=5)

teachers = Label(frame2, text="Teachers", fg="white", bg="#383c44", font=(10),height=1)
teachers.pack(side=LEFT,padx=(20,60),ipady=5)

students = Label(frame3, text="Students", fg="white", bg="#383c44", font=(10),height=1)
students.pack(side=LEFT,padx=(20,60),ipady=5)

courses = Label(frame4, text="Courses", fg="white", bg="#383c44", font=(10),height=1)
courses.pack(side=LEFT,padx=(20,60),ipady=5)

attendance = Label(frame5, text="Attendance", fg="white", bg="#383c44", font=(10),height=1)
#attendance.pack(side=LEFT,padx=(20,60),ipady=5)

fee = Label(frame6, text="Fee", fg="white", bg="#383c44", font=(10),height=1)
fee.pack(side=LEFT,padx=(20,60),ipady=5)


def treeviewselection(event):
    global treeimages
    global filetodelete
    item = treeimages.selection()
    filetodelete = treeimages.item(item)['values'][0]



def click_addimage():
    try:
        path = filedialog.askopenfilename(title = "Select file",filetypes = (("jpg file","*.jpg"),("jpeg file","*.jpeg"),("png file","*.png")))
        file = open(path,'rb')
        filedata = file.read()
        filename = os.path.split(path)[1]
        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        cursor.execute("""
        INSERT INTO IMAGE VALUES(?,?)
        """,(filename,filedata))
        connection.commit()
        messagebox.showinfo("Info.","Image Uploaded Successfully.")
    except:
        pass






def click_deleteimage():
    global filetodelete
    global treeimages
    def delteimage(event):
        global filetodelete
        if len(filetodelete) == 0:
            messagebox. showerror("Error.","Please select a file to delete.")
            screen.destroy()
        else:
            ans = messagebox.askyesno("Selecto Optioin.","Do you really want to delete selected file {}".format(filetodelete))
            if ans:
                connection = sqlite3.connect("database.db")
                cursor = connection.cursor()
                cursor.execute("""DELETE FROM IMAGE WHERE NAME = '{}'""".format(filetodelete))
                connection.commit()
                messagebox.showinfo("Info.","Image delete successfully.")
                screen.destroy()

    connection = sqlite3.connect("database.db")
    query = 'SELECT count(NAME) FROM IMAGE order by Name asc'
    cursor = connection.cursor()
    cursor.execute(query)
    count = cursor.fetchall()
    for row in count:
        num = row[0]
    if num != 0:
        screen = Tk()
        filetodelete = ""



        windowWidth = screen.winfo_reqwidth()
        windowHeight = screen.winfo_reqheight()



        positionRight = int((root.winfo_screenwidth()-100) / 2 - windowWidth / 2)
        positionDown = int((root.winfo_screenheight()-100) / 2 - windowHeight / 2)


        screen.geometry("400x400+{}+{}".format(positionRight, positionDown))

        screen.minsize(400,400)
        screen.maxsize(400,400)
        screen.title("Select and click enter to delete a photo.")


        scrollbarx = Scrollbar(screen, orient=HORIZONTAL)
        scrollbarx.pack(side=BOTTOM, fill=X)
        scrollbary = Scrollbar(screen, orient=VERTICAL)
        scrollbary.pack(side=RIGHT, fill=Y)
        treeimages = ttk.Treeview(screen, columns=(
            "filename"), selectmode="extended")
        treeimages.config(xscrollcommand=scrollbarx.set, yscrollcommand=scrollbary.set)
        treeimages.pack(side=TOP, fill=BOTH, expand=True)
        scrollbarx.config(command=treeimages.xview)
        scrollbary.config(command=treeimages.yview)


        treeimages.heading("filename", text="File Name")


        treeimages.column("#0", stretch=NO, minwidth=0, width=0)
        treeimages.column("filename", stretch=NO, minwidth=100, width=400)

        treeimages.bind("<<TreeviewSelect>>", lambda event=0: treeviewselection(event))

        connection = sqlite3.connect("database.db")
        query = 'SELECT NAME FROM IMAGE order by Name asc'
        cursor = connection.cursor()
        cursor.execute(query)
        record = cursor.fetchall()
        x = 1
        for row in record:
            treeimages.insert("", END, values=row)
            x += 1
        cursor.close()
        screen.bind("<Return>",lambda event: delteimage(event))
        screen.mainloop()
    else:
        messagebox.showerror("Error!","No Images Found.")


buttonaddimage = Button(frameimage, text="Add Image", bg="#383c44", command = lambda: click_addimage())
buttonaddimage.pack(side="left", fill = X, expand = True)

buttondeleteimage = Button(frameimage, text="Delete Image", bg="#383c44", command = lambda: click_deleteimage())
buttondeleteimage.pack(side="left", fill = X, expand = True)


frame1.bind("<Button-1>", click_home)
home.bind("<Button-1>", click_home)
def enterhome(event):
    global counterhome
    if counterhome == 0:
        frame1.config(bg="#212121")
        home.config(bg="#212121")

def exithome(event):
    global counterhome
    if counterhome == 0:
        frame1.config(bg="#383c44")
        home.config(bg='#383c44')


def enterteachers(event):
    global counterteacher
    global counteraddteacher
    if counterteacher == 0 and counteraddteacher == 0 and counterupdateteacher == 0:
        frame2.config(bg="#212121")
        teachers.config(bg="#212121")

def exitteachers(event):
    global counterteacher
    counteraddteacher
    if counterteacher == 0 and counteraddteacher == 0 and counterupdateteacher == 0:
        frame2.config(bg="#383c44")
        teachers.config(bg='#383c44')

def enterstudents(event):
    global counterstudent
    global counteraddstudent
    global counterupdatestudent
    if counterstudent == 0 and counteraddstudent == 0 and counterupdatestudent == 0:
        frame3.config(bg="#212121")
        students.config(bg="#212121")

def exitstudents(event):
    global counterstudent
    global counteraddstudent
    global counterupdatestudent
    if counterstudent == 0 and counteraddstudent == 0 and counterupdatestudent == 0:
        frame3.config(bg="#383c44")
        students.config(bg='#383c44')

def entercourse(event):
    global countercourses
    global counteraddstudent
    global counterupdatecourse
    if countercourses == 0 and counteraddcourse == 0 and counterupdatecourse == 0:
        frame4.config(bg="#212121")
        courses.config(bg="#212121")

def exitcourse(event):
    global countercourses
    global counteraddcourse
    global counterupdatecourse
    if countercourses == 0 and counteraddcourse == 0 and counterupdatecourse == 0:
        frame4.config(bg="#383c44")
        courses.config(bg='#383c44')


def enterattendance(event):
    global counterattendance
    if counterattendance == 0:
        frame5.config(bg="#212121")
        attendance.config(bg="#212121")

def exitattendance(event):
    global counterattendance
    if counterattendance == 0:
        frame5.config(bg="#383c44")
        attendance.config(bg='#383c44')


def enterfee(event):
    global counterfee
    global counterupdatefee
    if counterfee == 0 and counterupdatefee == 0:
        frame6.config(bg="#212121")
        fee.config(bg="#212121")

def exitfee(event):
    global counterfee
    global counterupdatefee
    if counterfee == 0 and counterupdatefee == 0:
        frame6.config(bg="#383c44")
        fee.config(bg='#383c44')


frame1.bind("<Enter>", enterhome)
frame1.bind("<Leave>", exithome)

frame2.bind("<Button-1>", click_teachers)
teachers.bind("<Button-1>", click_teachers)

frame2.bind("<Enter>", enterteachers)
frame2.bind("<Leave>",exitteachers)

frame3.bind("<Button-1>", click_students)
students.bind("<Button-1>", click_students)

frame3.bind("<Enter>", enterstudents)
frame3.bind("<Leave>", exitstudents)


frame4.bind("<Button-1>", click_courses)
courses.bind("<Button-1>", click_courses)

frame4.bind("<Enter>", entercourse)
frame4.bind("<Leave>", exitcourse)


frame5.bind("<Button-1>", click_attendance)
attendance.bind("<Button-1>", click_attendance)

frame5.bind("<Enter>", enterattendance)
frame5.bind("<Leave>", exitattendance)

frame6.bind("<Button-1>", click_fee)
fee.bind("<Button-1>", click_fee)

frame6.bind("<Enter>", enterfee)
frame6.bind("<Leave>", exitfee)



def askexit(event):
    ans = messagebox.askokcancel("Confirm Exit","Are you sure you want to exit?")
    if ans:
        root.destroy()


root.bind("<Escape>",askexit)

root.mainloop()