package university_managment_system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import java.util.*;
import  com.toedter.calendar.JDateChooser;

public class AddTeacher extends JFrame implements ActionListener {
    JLabel heading, lablename, lblempid,labelempid,lbl12percent,lbl10percent, lbladdress, lblemail, lblfathername, lblDOB, lblphone, lbladhar,lbldepartment,lblqualification;
    JTextField tfname, tfaddress, tfemail, tf10percent, tffather, tfphone, tf12percent, tfadhar;
    JComboBox educationDropdown, departmentDropdown;
    JButton submitbutton, cancelbutton;
    Random random=new Random();//to generate random number
    long first4= Math.abs((random.nextLong() % 9000L) +1000L);//to create a four digit roll no

    JDateChooser dcDOB;


    AddTeacher() {
        // Frame setup
        setSize(900, 700);
        setLocation(350, 50);
        setLayout(null);

        // Main heading
        heading = new JLabel("New Teacher Details");
        heading.setBounds(310, 30, 500, 50);
        heading.setFont(new Font("serif", Font.BOLD, 30));
        add(heading);

        // Labels and Text Fields
        lablename = new JLabel("Name");
        lablename.setBounds(50, 100, 150, 30);
        add(lablename);

        tfname = new JTextField();
        tfname.setBounds(200, 100, 200, 30);
        add(tfname);

        lblempid = new JLabel("Employee ID");
        lblempid.setBounds(450, 100, 150, 30);
        add(lblempid);

        labelempid = new JLabel("101"+first4);
        labelempid.setBounds(600, 100, 200, 30);
        add(labelempid);


        lblfathername = new JLabel("Father's Name");
        lblfathername.setBounds(50, 150, 150, 30);
        add(lblfathername);

        tffather = new JTextField();
        tffather.setBounds(200, 150, 200, 30);
        add(tffather);

        lblDOB = new JLabel("Date of Birth (DD/MM/YYYY)");
        lblDOB.setBounds(450, 150, 200, 30);
        add(lblDOB);

        dcDOB=new JDateChooser();
        dcDOB.setBounds(600,150,200,30);
        add(dcDOB);

        lbladdress = new JLabel("Address");
        lbladdress.setBounds(50, 200, 150, 30);
        add(lbladdress);

        tfaddress = new JTextField();
        tfaddress.setBounds(200, 200, 200, 30);
        add(tfaddress);

        lblemail = new JLabel("Email");
        lblemail.setBounds(450, 200, 150, 30);
        add(lblemail);

        tfemail = new JTextField();
        tfemail.setBounds(600, 200, 200, 30);
        add(tfemail);

        lblphone = new JLabel("Phone Number");
        lblphone.setBounds(50, 250, 150, 30);
        add(lblphone);

        tfphone = new JTextField();
        tfphone.setBounds(200, 250, 200, 30);
        add(tfphone);

        lbladhar = new JLabel("Aadhar Number");
        lbladhar.setBounds(450, 250, 150, 30);
        add(lbladhar);

        tfadhar = new JTextField();
        tfadhar.setBounds(600, 250, 200, 30);
        add(tfadhar);

        lbl10percent = new JLabel("Class X(%)");
        lbl10percent.setBounds(50, 300, 150, 30);
        add(lbl10percent);

        tf10percent = new JTextField();
        tf10percent.setBounds(200, 300, 200, 30);
        add(tf10percent);

        lbl12percent = new JLabel("Class XII(%)");
        lbl12percent.setBounds(450, 300, 150, 30);
        add(lbl12percent);

        tf12percent = new JTextField();
        tf12percent.setBounds(600, 300, 200, 30);
        add(tf12percent);

        lblqualification = new JLabel("Qualification");
        lblqualification.setBounds(50, 350, 150, 30);
        add(lblqualification);

        String[] education = {"B.Tech", "B.Sc", "B.Com","BCA", "B.A", "M.Tech", "M.Sc", "MBA","MCA"};
        educationDropdown = new JComboBox(education);
        educationDropdown.setBounds(200, 350, 200, 30);
        add(educationDropdown);

        lbldepartment = new JLabel("Department");
        lbldepartment.setBounds(450, 350, 150, 30);
        add(lbldepartment);

        String[] department = {"Computer Science", "Mechanical", "Electrical", "Civil", "Electronics","IT"};
        departmentDropdown = new JComboBox(department);
        departmentDropdown.setBounds(600, 350, 200, 30);
        add(departmentDropdown);

        // Buttons
        submitbutton = new JButton("Submit");
        submitbutton.setBounds(300, 450, 120, 30);
        submitbutton.setBackground(Color.black);
        submitbutton.setForeground(Color.black);
        submitbutton.addActionListener(this);
        add(submitbutton);

        cancelbutton = new JButton("Cancel");
        cancelbutton.setBounds(450, 450, 120, 30);
        cancelbutton.setBackground(Color.black);
        cancelbutton.setForeground(Color.black);
        cancelbutton.addActionListener(this);
        add(cancelbutton);

        // Frame visibility
        setVisible(true);
    }
    public void actionPerformed(ActionEvent ae){
        if(ae.getSource() == submitbutton){
            String name =tfname.getText();
            String fathername =tffather.getText();
            String rollno =labelempid.getText();
            String dob =((JTextField) dcDOB.getDateEditor().getUiComponent()).getText();//fetching the date from calender
            String address =tfaddress.getText();
            String phone =tfphone.getText();
            String email =tfemail.getText();
            String X =tf10percent.getText();
            String XII =tf12percent.getText();
            String adhar =tfadhar.getText();
            String qualification =(String) educationDropdown.getSelectedItem();
            String department =(String) departmentDropdown.getSelectedItem();

            try{
                String query= "insert into teachers values('"+name+"','"+fathername+"','"+rollno+"','"+dob+"','"+address+"','"+phone+"','"+email+"','"+X+"','"+XII+"','"+adhar+"','"+qualification+"','"+department+"')";
                Conn con= new Conn();
                con.s.executeUpdate(query);

                JOptionPane.showMessageDialog(null,"Teacher details inserted successfully");
                setVisible(false);

            }catch (SQLException e){
                e.printStackTrace();
            }
        }
        else if(ae.getSource() == cancelbutton){
            setVisible(false);
        }

    }


    public static void main(String[] args) {
        new AddTeacher();
    }
}
