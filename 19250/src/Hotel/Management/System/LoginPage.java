package Hotel.Management.System;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

class LoginPage extends JFrame {
    JTextField usernameField;
    JPasswordField passwordField;
    JButton loginBtn, toSignupBtn;

    LoginPage() {
        setTitle("Login Page");
        setSize(400, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(null);

        // Set background color
        getContentPane().setBackground(new Color(245, 245, 255));

        JLabel heading = new JLabel("User Login");
        heading.setBounds(130, 20, 200, 30);
        heading.setFont(new Font("Serif", Font.BOLD, 24));
        heading.setForeground(new Color(50, 50, 120));
        add(heading);

        JLabel userLabel = new JLabel("Username:");
        userLabel.setBounds(50, 80, 100, 25);
        userLabel.setFont(new Font("Arial", Font.PLAIN, 16));
        add(userLabel);

        usernameField = new JTextField();
        usernameField.setBounds(160, 80, 160, 25);
        usernameField.setFont(new Font("Arial", Font.PLAIN, 16));
        add(usernameField);

        JLabel passLabel = new JLabel("Password:");
        passLabel.setBounds(50, 120, 100, 25);
        passLabel.setFont(new Font("Arial", Font.PLAIN, 16));
        add(passLabel);

        passwordField = new JPasswordField();
        passwordField.setBounds(160, 120, 160, 25);
        passwordField.setFont(new Font("Arial", Font.PLAIN, 16));
        add(passwordField);

        loginBtn = new JButton("Login");
        loginBtn.setBounds(60, 180, 120, 35);
        loginBtn.setBackground(new Color(34, 139, 34));
        loginBtn.setForeground(Color.WHITE);
        loginBtn.setFont(new Font("Arial", Font.BOLD, 16));
        add(loginBtn);

        toSignupBtn = new JButton("Sign Up");
        toSignupBtn.setBounds(200, 180, 120, 35);
        toSignupBtn.setBackground(new Color(70, 130, 180));
        toSignupBtn.setForeground(Color.WHITE);
        toSignupBtn.setFont(new Font("Arial", Font.BOLD, 16));
        add(toSignupBtn);

        loginBtn.addActionListener(e -> loginUser());
        toSignupBtn.addActionListener(e -> {
            dispose();
            new SignUp();
        });

        setVisible(true);
    }

    void loginUser() {
        String username = usernameField.getText();
        String password = new String(passwordField.getPassword());

        con c = new con();
        try (Connection conn = c.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE username = ? AND password = ?");
            ps.setString(1, username);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                JOptionPane.showMessageDialog(this, "Login successful!");
                new MainMenu();
            } else {
                JOptionPane.showMessageDialog(this, "Invalid credentials.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Login failed!");
        }
    }


    public static void main(String[] args) {
        new LoginPage();

    }
}
