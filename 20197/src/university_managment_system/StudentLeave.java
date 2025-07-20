package university_managment_system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import  com.toedter.calendar.JDateChooser;


public class StudentLeave extends JFrame implements ActionListener {
    Choice cRollNo ,cTime;
    JDateChooser jdcDate ;
    JButton submitbutton,cancelbutton;


    StudentLeave(){
        setTitle("Student Leave");
        setSize(500,550);
        setLayout(null);
        setLocation(550,100);
        getContentPane().setBackground(Color.WHITE);

        JLabel heading=new JLabel("Apply Leave(Student)");
        heading.setBounds(40,50,300,30);
        heading.setFont(new Font("Tahona",Font.BOLD,20));
        add(heading);

        JLabel lblrollno= new JLabel("Search By Roll Number");
        lblrollno.setBounds(60,100,200,20);
        lblrollno.setFont(new Font("Tahona",Font.PLAIN,18));
        add(lblrollno);

        cRollNo= new Choice();
        cRollNo.setBounds(60,130,200,20);
        add(cRollNo);

//fetching the rollno data from students table
        try{
            Conn con=new Conn();
            ResultSet rs =con.s.executeQuery("select * from student ");
            //fetch while data is empty
            while (rs.next()){
                cRollNo.add(rs.getString("rollno"));//fetch the data from coloumn name
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        //inserting date
        JLabel lblDate=new JLabel("Date");
        lblDate.setBounds(60,180,200,20);
        lblDate.setFont(new Font("Tahona",Font.PLAIN,18));
        add(lblDate);

        jdcDate=new JDateChooser();
        jdcDate.setBounds(60,210,200,25);
        add(jdcDate);

        //leave type
        JLabel lbltime= new JLabel("Leave Type");
        lbltime.setBounds(60,260,200,20);
        lbltime.setFont(new Font("Tahona",Font.PLAIN,18));
        add(lbltime);

        cTime= new Choice();
        cTime.setBounds(60,300,200,20);
        cTime.add("Full Day");
        cTime.add("Half Day");
        add(cTime);

        // Buttons
        submitbutton = new JButton("Submit");
        submitbutton.setBounds(60, 350, 100, 25);
        submitbutton.setBackground(Color.black);
        submitbutton.setForeground(Color.black);
        submitbutton.addActionListener(this);
        add(submitbutton);

        cancelbutton = new JButton("Cancel");
        cancelbutton.setBounds(220, 350, 100, 25);
        cancelbutton.setBackground(Color.black);
        cancelbutton.setForeground(Color.black);
        cancelbutton.addActionListener(this);
        add(cancelbutton);

        setVisible(true);
    }
    public void actionPerformed(ActionEvent ae){
        if (ae.getSource()==submitbutton){
            String date =((JTextField) jdcDate.getDateEditor().getUiComponent()).getText();//fetching the date from calender
            String duration=cTime.getSelectedItem();
            String rollno=cRollNo.getSelectedItem();

            String query = "insert into studentleave values('"+rollno+"','"+date+"','"+duration+"')";
            System.out.println(query);


            try {
                Conn con = new Conn();
                con.s.executeUpdate(query);

                JOptionPane.showMessageDialog(null, "Leave Confirmed");
                setVisible(false);
            } catch (Exception e) {
                e.printStackTrace();
            }

        } else if (ae.getSource()==cancelbutton) {
            setVisible(false);
        }
    }


    public static void main(String[] args) {
        new StudentLeave();
    }
}
