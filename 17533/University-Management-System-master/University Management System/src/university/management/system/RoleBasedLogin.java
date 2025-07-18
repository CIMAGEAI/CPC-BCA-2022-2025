package university.management.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class RoleBasedLogin extends JFrame implements ActionListener {

    JButton login, cancel;
    JTextField tfusername;
    JPasswordField tfpassword;
    String role, username;

    public RoleBasedLogin(String role, String username) {
        this.role = role;
        this.username = username;

        setTitle(role.toUpperCase() + " Login");
        getContentPane().setBackground(Color.WHITE);
        setLayout(null);

        JLabel lblusername = new JLabel("Username:");
        lblusername.setBounds(40, 30, 100, 20);
        add(lblusername);

        tfusername = new JTextField(username);
        tfusername.setBounds(150, 30, 150, 20);
        tfusername.setEditable(false);
        add(tfusername);

        JLabel lblpassword = new JLabel("Password:");
        lblpassword.setBounds(40, 80, 100, 20);
        add(lblpassword);

        tfpassword = new JPasswordField();
        tfpassword.setBounds(150, 80, 150, 20);
        add(tfpassword);

        login = new JButton("Login");
        login.setBounds(40, 140, 120, 30);
        login.setBackground(Color.BLACK);
        login.setForeground(Color.WHITE);
        login.addActionListener(this);
        add(login);

        cancel = new JButton("Cancel");
        cancel.setBounds(180, 140, 120, 30);
        cancel.setBackground(Color.BLACK);
        cancel.setForeground(Color.WHITE);
        cancel.addActionListener(this);
        add(cancel);

        setSize(400, 250);
        setLocationRelativeTo(null);
        setVisible(true);
    }

    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == login) {
            String password = new String(tfpassword.getPassword());

            String query = "SELECT * FROM login WHERE username='" + username + "' AND password='" + password + "' AND role='" + role + "'";

            try {
                Conn c = new Conn();
                ResultSet rs = c.s.executeQuery(query);

                if (rs.next()) {
                    setVisible(false);
                    new Project(role); // 🔴 Passing role to Project class
                } else {
                    JOptionPane.showMessageDialog(null, "Invalid password for " + role);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }

        } else if (ae.getSource() == cancel) {
            setVisible(false);
            new MainLoginSelection();
        }
    }
}
