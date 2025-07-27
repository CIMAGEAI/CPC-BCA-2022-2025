package university_managment_system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.ResultSet;

public class Marks extends JFrame implements ActionListener {
    String rollno;
    JButton backbutton;

    Marks(String rollno){
        this. rollno= rollno;

        setSize(500,600);
        setLocation(500,100);
        setLayout(null);
        getContentPane().setBackground(Color.WHITE);

        // Main heading
        JLabel heading = new JLabel("Cimage Professional College");
        heading.setBounds(100, 10, 500, 40);
        heading.setFont(new Font("Tahoma", Font.BOLD, 20));
        add(heading);

        // sub heading
        JLabel subheading = new JLabel("Result Of Examination 2024");
        subheading.setBounds(125, 50, 500, 20);
        subheading.setFont(new Font("Serial", Font.BOLD, 17));
        add(subheading);

        // rollno label
        JLabel lblrollno = new JLabel("Roll Number:-"+rollno);
        lblrollno.setBounds(60, 100, 500, 40);
        lblrollno.setFont(new Font("Tahoma", Font.PLAIN, 17));
        add(lblrollno);

        // semester label
        JLabel lblsemester = new JLabel("Semester");
        lblsemester.setBounds(60, 130, 500, 20);
        lblsemester.setFont(new Font("Tahoma", Font.PLAIN, 17));
        add(lblsemester);

        //subjects label
        JLabel lblsubject1 = new JLabel();
        lblsubject1.setBounds(100, 200, 500, 20);
        lblsubject1.setFont(new Font("Tahoma", Font.PLAIN, 17));
        add(lblsubject1);
        JLabel lblsubject2 = new JLabel();
        lblsubject2.setBounds(100, 230, 500, 20);
        lblsubject2.setFont(new Font("Tahoma", Font.PLAIN, 17));
        add(lblsubject2);
        JLabel lblsubject3 = new JLabel();
        lblsubject3.setBounds(100, 260, 500, 20);
        lblsubject3.setFont(new Font("Tahoma", Font.PLAIN, 17));
        add(lblsubject3);
        JLabel lblsubject4 = new JLabel();
        lblsubject4.setBounds(100, 290, 500, 20);
        lblsubject4.setFont(new Font("Tahoma", Font.PLAIN, 17));
        add(lblsubject4);
        JLabel lblsubject5 = new JLabel();
        lblsubject5.setBounds(100, 320, 500, 20);
        lblsubject5.setFont(new Font("Tahoma", Font.PLAIN, 17));
        add(lblsubject5);
        try{
            Conn con =new Conn();
            ResultSet rs=con.s.executeQuery("select * from subject where rollno= '"+rollno+"'");
            while (rs.next()){
                lblsubject1.setText(rs.getString("subject1"));
                lblsubject2.setText(rs.getString("subject2"));
                lblsubject3.setText(rs.getString("subject3"));
                lblsubject4.setText(rs.getString("subject4"));
                lblsubject5.setText(rs.getString("subject5"));
            }
            ResultSet rs2=con.s.executeQuery("select * from marks where rollno= '"+rollno+"'");
            while (rs2.next()){
                lblsubject1.setText(lblsubject1.getText()+"--------"+rs2.getString("marks1"));
                lblsubject2.setText(lblsubject2.getText()+"--------"+rs2.getString("marks2"));
                lblsubject3.setText(lblsubject3.getText()+"--------"+rs2.getString("marks3"));
                lblsubject4.setText(lblsubject4.getText()+"--------"+rs2.getString("marks4"));
                lblsubject5.setText(lblsubject5.getText()+"--------"+rs2.getString("marks5"));
                lblsemester.setText("Semester:- "+rs2.getString("semester"));


            }
        }catch (Exception e){
            e.printStackTrace();
        }
        backbutton = new JButton("Back");
        backbutton.setBounds(180, 400, 120, 30);
        backbutton.setBackground(Color.black);
        backbutton.setForeground(Color.black);
        backbutton.addActionListener(this);
        add(backbutton);

        setVisible(true);
    }
    public void actionPerformed(ActionEvent ae){
        if (ae.getSource()==backbutton){
            setVisible(false);
            new DisplayMarks();
        }
    }


    public static void main(String[] args) {
        new Marks("");
    }
}