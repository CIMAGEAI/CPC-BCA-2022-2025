/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package college_project;

/**
 *
 * @author VISHALKUMAR
 */

import javax.swing.*;
import java.awt.*;
import java.sql.*;

public class ViewStudentProfile extends JFrame {

    public ViewStudentProfile(String rollno) {
        setSize(850, 550);
        setLocation(250, 100);
        setLayout(null);
        getContentPane().setBackground(new Color(230, 210, 252));

        JLabel heading = new JLabel("Student Profile");
        heading.setBounds(50, 10, 400, 40);
        heading.setFont(new Font("serif", Font.BOLD, 32));
        add(heading);

        String[] labels = {
            "Name", "Father's Name", "Roll Number", "Date of Birth", "Address",
            "Phone", "Email", "Class X (%)", "Class XII (%)", "Aadhar Number",
            "Course", "Branch"
        };

        JLabel[] fieldLabels = new JLabel[labels.length];
        JLabel[] valueLabels = new JLabel[labels.length];

        int y = 80;
        for (int i = 0; i < labels.length; i++) {
            fieldLabels[i] = new JLabel(labels[i] + ":");
            fieldLabels[i].setBounds(50, y, 150, 25);
            fieldLabels[i].setFont(new Font("serif", Font.BOLD, 18));
            add(fieldLabels[i]);

            valueLabels[i] = new JLabel();
            valueLabels[i].setBounds(250, y, 500, 25);
            valueLabels[i].setFont(new Font("serif", Font.PLAIN, 18));
            add(valueLabels[i]);

            y += 35;
        }

        try {
            Connection_Class c = new Connection_Class();
            String query = "SELECT * FROM student WHERE rollno = '" + rollno + "'";
            ResultSet rs = c.statement.executeQuery(query);

            if (rs.next()) {
                valueLabels[0].setText(rs.getString("name"));
                valueLabels[1].setText(rs.getString("fathername"));
                valueLabels[2].setText(rs.getString("rollno"));
                valueLabels[3].setText(rs.getString("dob"));
                valueLabels[4].setText(rs.getString("address"));
                valueLabels[5].setText(rs.getString("phone"));
                valueLabels[6].setText(rs.getString("email"));             // ✅ Email added
                valueLabels[7].setText(rs.getString("class_X"));
                valueLabels[8].setText(rs.getString("class_XII"));         // ✅ Use correct column name
                valueLabels[9].setText(rs.getString("adhar"));
                valueLabels[10].setText(rs.getString("course"));
                valueLabels[11].setText(rs.getString("branch"));

                System.out.println("Data found for rollno: " + rollno);   // ✅ Debug line
            } else {
                JOptionPane.showMessageDialog(this, "Student not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        setVisible(true);
    }

    public static void main(String args[]) {
        String inputRoll = JOptionPane.showInputDialog("Enter Roll Number:");
        if (inputRoll != null && !inputRoll.trim().isEmpty()) {
            new ViewStudentProfile(inputRoll);
        } else {
            JOptionPane.showMessageDialog(null, "Roll Number is required.");
        }
    }
}
