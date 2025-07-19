package bankmanagement;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class Login extends JFrame implements ActionListener {

    JLabel l1, l2, l3;
    JTextField tb;
    JPasswordField pw;
    JButton b1, b2, b3;

    Login() {
        super("Bank System");

        // Background image first
        ImageIcon img1 = new ImageIcon(ClassLoader.getSystemResource("icon/background.jpg"));
        Image img2 = img1.getImage().getScaledInstance(1550, 1080, Image.SCALE_DEFAULT);
        ImageIcon img3 = new ImageIcon(img2);
        JLabel img = new JLabel(img3);
        setContentPane(img);
        img.setLayout(null);  // allow absolute positioning

        // Welcome Label
        l1 = new JLabel("Welcome to ATM");
        l1.setForeground(Color.white);
        l1.setFont(new Font("AvantGarde", Font.BOLD, 50));
        l1.setBounds(400, 150, 450, 50);
        img.add(l1);

        // Card No Label and TextField
        l2 = new JLabel("Card No: ");
        l2.setForeground(Color.white);
        l2.setFont(new Font("Raleway", Font.BOLD, 40));
        l2.setBounds(200, 350, 450, 50);
        img.add(l2);

        tb = new JTextField(15);
        tb.setBounds(400, 350, 350, 40);
        img.add(tb);

        // Password Label and Field
        l3 = new JLabel("Password:");
        l3.setForeground(Color.white);
        l3.setFont(new Font("Raleway", Font.BOLD, 40));
        l3.setBounds(200, 500, 450, 50);
        img.add(l3);

        pw = new JPasswordField(10);
        pw.setBounds(450, 500, 300, 40);
        img.add(pw);

        // Sign In Button
        b1 = new JButton("SIGN IN");
        b1.setFont(new Font("Ralway",Font.BOLD,20));
        b1.setForeground(Color.WHITE);
        b1.setBackground(Color.BLUE);
        b1.setFocusPainted(false);
        b1.setBounds(200, 650, 200, 40);
        b1.addActionListener(this);
        img.add(b1);

        // Clear Button
        b2 = new JButton("CLEAR");
        b2.setFont(new Font("Ralway",Font.BOLD,20));
        b2.setForeground(Color.WHITE);
        b2.setBackground(Color.BLACK);
        b2.setBounds(500, 650, 200, 40);
        b2.addActionListener(this);
        img.add(b2);

        // Sign Up Button (corrected label)
        b3 = new JButton("SIGN UP");
        b3.setFont(new Font("Ralway",Font.BOLD,20));
        b3.setForeground(Color.WHITE);
        b3.setBackground(Color.RED);
        b3.setBounds(800, 650, 200, 40);
        b3.addActionListener(this);
        img.add(b3);

        // Frame settings
        setSize(1550, 1080);
        setLocation(0, 0);
        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource() == b1) {
                String cardno = tb.getText();
                String pin = new String(pw.getPassword());  // secure way to get password

                Connn c = new Connn();
                String q = "SELECT * FROM login WHERE card_number = '" + cardno + "' AND pin = '" + pin + "'";
                ResultSet resultSet = c.statement.executeQuery(q);

                if (resultSet.next()) {
                    setVisible(false);
                    new Main_page(pin);
                } else {
                    JOptionPane.showMessageDialog(null, "Incorrect Card Number or PIN");
                }

            } else if (e.getSource() == b2) {
                tb.setText("");
                pw.setText("");

            } else if (e.getSource() == b3) {
                new Signup();
                setVisible(false);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public static void main(String[] args) {

        new Login();
    }
}
