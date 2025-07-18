package university.management.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class MainLoginSelection extends JFrame implements ActionListener {

    JButton btnAdmin, btnTeacher1, btnTeacher2;

    MainLoginSelection() {
        setTitle("College Management System - Select Login");
        setSize(400, 300);
        setLayout(null);
        getContentPane().setBackground(Color.WHITE);

        JLabel heading = new JLabel("Select Login Type");
        heading.setFont(new Font("Tahoma", Font.BOLD, 20));
        heading.setBounds(100, 30, 250, 30);
        add(heading);

        btnAdmin = new JButton("Admin Login");
        btnAdmin.setBounds(120, 80, 150, 30);
        btnAdmin.addActionListener(this);
        add(btnAdmin);

        btnTeacher1 = new JButton("Teacher1 Login");
        btnTeacher1.setBounds(120, 120, 150, 30);
        btnTeacher1.addActionListener(this);
        add(btnTeacher1);

        btnTeacher2 = new JButton("Teacher2 Login");
        btnTeacher2.setBounds(120, 160, 150, 30);
        btnTeacher2.addActionListener(this);
        add(btnTeacher2);

        setLocationRelativeTo(null);
        setVisible(true);
    }

    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == btnAdmin) {
            new RoleBasedLogin("admin", "admin");
        } else if (ae.getSource() == btnTeacher1) {
            new RoleBasedLogin("teacher1", "teacher1");
        } else if (ae.getSource() == btnTeacher2) {
            new RoleBasedLogin("teacher2", "teacher2");
        }
        setVisible(false);
    }

    public static void main(String[] args) {
        new MainLoginSelection();
    }
}
