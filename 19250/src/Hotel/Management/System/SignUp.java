package Hotel.Management.System;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class SignUp extends JFrame {
    JTextField usernameField;
    JPasswordField passwordField;

    public SignUp() {
        setTitle("Sign Up");
        setSize(400, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(null);

        // Set custom background color
        getContentPane().setBackground(new Color(255, 250, 240));

        JLabel heading = new JLabel("Create Account");
        heading.setBounds(110, 20, 200, 30);
        heading.setFont(new Font("Serif", Font.BOLD, 24));
        heading.setForeground(new Color(50, 80, 120));
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

        JButton signupBtn = new JButton("Sign Up");
        signupBtn.setBounds(60, 180, 120, 35);
        signupBtn.setBackground(new Color(70, 130, 180));
        signupBtn.setForeground(Color.WHITE);
        signupBtn.setFont(new Font("Arial", Font.BOLD, 16));
        add(signupBtn);

        JButton toLoginBtn = new JButton("Go to Login");
        toLoginBtn.setBounds(200, 180, 130, 35);
        toLoginBtn.setBackground(new Color(34, 139, 34));
        toLoginBtn.setForeground(Color.WHITE);
        toLoginBtn.setFont(new Font("Arial", Font.BOLD, 16));
        add(toLoginBtn);

        signupBtn.addActionListener(e -> registerUser());
        toLoginBtn.addActionListener(e -> {
            dispose();
            new LoginPage(); // Re-enabled if LoginPage exists
        });

        setVisible(true);
    }

    void registerUser() {
        String username = usernameField.getText();
        String password = new String(passwordField.getPassword());

        if (username.isEmpty() || password.isEmpty()) {
            JOptionPane.showMessageDialog(this, "All fields are required!");
            return;
        }

        con c = new con();

        try (Connection conn = c.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("INSERT INTO users (username, password) VALUES (?, ?)");
            ps.setString(1, username);
            ps.setString(2, password);
            ps.executeUpdate();

            JOptionPane.showMessageDialog(this, "Signup successful!");
            usernameField.setText("");
            passwordField.setText("");

        } catch (SQLIntegrityConstraintViolationException e) {
            JOptionPane.showMessageDialog(this, "Username already exists!");
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Signup failed!");
        }
    }

    public static void main(String[] args) {
        SignUp obj = new SignUp();
    }
}