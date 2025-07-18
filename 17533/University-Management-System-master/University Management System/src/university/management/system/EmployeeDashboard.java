package university.management.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class EmployeeDashboard extends JFrame implements ActionListener {

    JButton addStudent, viewStudent, updateStudent, enterMarks, logout;

    EmployeeDashboard() {
        setTitle("Employee Dashboard");
        setSize(800, 500);
        setLocation(400, 200);
        setLayout(null);
        getContentPane().setBackground(new Color(240, 240, 240));

        JLabel heading = new JLabel("Employee Panel");
        heading.setFont(new Font("Tahoma", Font.BOLD, 30));
        heading.setBounds(250, 30, 300, 40);
        add(heading);

        addStudent = new JButton("Add Student");
        addStudent.setBounds(280, 100, 200, 40);
        addStudent.addActionListener(this);
        add(addStudent);

        viewStudent = new JButton("View Student Info");
        viewStudent.setBounds(280, 160, 200, 40);
        viewStudent.addActionListener(this);
        add(viewStudent);

        updateStudent = new JButton("Update Student Info");
        updateStudent.setBounds(280, 220, 200, 40);
        updateStudent.addActionListener(this);
        add(updateStudent);

        enterMarks = new JButton("Enter Student Marks");
        enterMarks.setBounds(280, 280, 200, 40);
        enterMarks.addActionListener(this);
        add(enterMarks);

        logout = new JButton("Logout");
        logout.setBounds(280, 340, 200, 40);
        logout.addActionListener(this);
        add(logout);

        setVisible(true);
    }

    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == addStudent) {
            new AddStudent(); // opens AddStudent.java
        } else if (ae.getSource() == viewStudent) {
            new StudentDetails(); // opens StudentDetails.java
        } else if (ae.getSource() == updateStudent) {
            new UpdateStudent(); // opens UpdateStudent.java
        } else if (ae.getSource() == enterMarks) {
            new EnterMarks(); // opens EnterMarks.java
        } else if (ae.getSource() == logout) {
            setVisible(false);
           // newLogin(); // back to login screen
        }
    }

    public static void main(String[] args) {
        new EmployeeDashboard();
    }
}
