package electricity.billing.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class Login extends JFrame implements ActionListener{
    JButton login, cancel, signup, forgot;
    JTextField username;
    JPasswordField password;
    Choice logginin;
    
    Login() {
        super("Login Page");
        getContentPane().setBackground(Color.WHITE);
        setLayout(null);
        
        JLabel lblusername = new JLabel("Username");
        lblusername.setBounds(300, 20, 100, 20);
        add(lblusername);
        
        username = new JTextField();
        username.setBounds(400, 20, 150, 20);
        add(username);
        
        JLabel lblpassword = new JLabel("Password");
        lblpassword.setBounds(300, 60, 100, 20);
        add(lblpassword);
        
        // Panel to hold password field and eye button
        JPanel passwordPanel = new JPanel(null);
        passwordPanel.setBounds(400, 60, 150, 20);
        add(passwordPanel);

        // Password field
        password = new JPasswordField();
        password.setBounds(0, 0, 120, 20);
        passwordPanel.add(password);
        
        JButton eyeButton = new JButton();
        eyeButton.setBounds(125, 0, 20, 20);
        ImageIcon eyeIcon = new ImageIcon(ClassLoader.getSystemResource("icon/hidden.png"));
        Image eyeImg = eyeIcon.getImage().getScaledInstance(17, 17, Image.SCALE_DEFAULT);
        eyeButton.setIcon(new ImageIcon(eyeImg));
        eyeButton.setFocusPainted(false);
        eyeButton.setContentAreaFilled(false);
        eyeButton.setBorderPainted(false);
        eyeButton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        passwordPanel.add(eyeButton);
        
        // Toggle password visibility
        eyeButton.addActionListener(new ActionListener() {
            private boolean visible = false;
            @Override
            public void actionPerformed(ActionEvent e) {
                if (visible) {
                    password.setEchoChar('•');
                } else {
                    password.setEchoChar((char) 0);
                }
                visible = !visible;
            }
        });
        
        JLabel loggininas = new JLabel("Loggin in as");
        loggininas.setBounds(300, 100, 100, 20);
        add(loggininas);
        
        logginin = new Choice();
        logginin.add("Admin");
        logginin.add("Customer");
        logginin.setBounds(400, 100, 150, 20);
        add(logginin);
        
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icon/login.png"));
        Image i2 = i1.getImage().getScaledInstance(16, 16, Image.SCALE_DEFAULT);
        login = new JButton("Login", new ImageIcon(i2));
        login.setBounds(330, 160, 100, 20);
        login.addActionListener(this);
        add(login);
        
        ImageIcon i3 = new ImageIcon(ClassLoader.getSystemResource("icon/cancel.jpg"));
        Image i4 = i3.getImage().getScaledInstance(16, 16, Image.SCALE_DEFAULT);
        cancel = new JButton("Cancel", new ImageIcon(i4));
        cancel.setBounds(450, 160, 100, 20);
        cancel.addActionListener(this);
        add(cancel);
        
        ImageIcon i5 = new ImageIcon(ClassLoader.getSystemResource("icon/signup.png"));
        Image i6 = i5.getImage().getScaledInstance(16, 16, Image.SCALE_DEFAULT);
        signup = new JButton("Signup", new ImageIcon(i6));
        signup.setBounds(380, 200, 100, 20);
        signup.addActionListener(this);
        add(signup);
        
        ImageIcon i10 = new ImageIcon(ClassLoader.getSystemResource("icon/lock.png"));
        Image i11 = i10.getImage().getScaledInstance(16, 16, Image.SCALE_DEFAULT);
        forgot = new JButton("Forgot Password?", new ImageIcon(i11));
        forgot.setBounds(360, 240, 170, 20);
        forgot.addActionListener(this);
        add(forgot);
        
        ImageIcon i7 = new ImageIcon(ClassLoader.getSystemResource("icon/second.jpg"));
        Image i8 = i7.getImage().getScaledInstance(250, 250, Image.SCALE_DEFAULT);
        ImageIcon i9 = new ImageIcon(i8);
        JLabel image = new JLabel(i9);
        image.setBounds(0, 0, 250, 250);
        add(image);
        
        setSize(640, 330);
        setLocation(400, 200);
        setVisible(true);
    }
    
    @Override
    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == login) {
            String susername = username.getText();
            String spassword = new String(password.getPassword());
            String user = logginin.getSelectedItem();
            
            //Validation for empty fields
            if (susername.equals("") || spassword.equals("")) {
                JOptionPane.showMessageDialog(null, "Username and Password must not be empty!");
                return;
            }
            
            try {
                Conn c = new Conn();
                String query = "select * from login where username = '"+susername+"' and password = '"+spassword+"' and user = '"+user+"'";
                
                ResultSet rs = c.s.executeQuery(query);
                
                if (rs.next()) {
                    String meter = rs.getString("meter_no");
                    setVisible(false);
                    new Project(user, meter);
                } else {
                    JOptionPane.showMessageDialog(null, "Invalid Login");
                    username.setText("");
                    password.setText("");
                }
                
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (ae.getSource() == cancel) {
            setVisible(false);
        } else if (ae.getSource() == signup) {
            setVisible(false);
            new Signup();
        }else if (ae.getSource() == forgot) {
            setVisible(false);
            new ForgotPassword();
        }
    }
    
    public static void main(String[] args) {
        new Login();
    }
}
