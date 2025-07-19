package travel.and.tourism;

import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class Login extends JFrame implements ActionListener{
    JButton login, password, signup;
    JTextField tfusername;
    JPasswordField tfpassword;
    
    Login(){
        super("Login");
        setSize(900,400);
        setLocation(350,200);
        setLayout(null);
        getContentPane().setBackground(Color.WHITE);
        
        JPanel p1 = new JPanel();
        p1.setBackground(new Color(131,191,233));
        p1.setBounds(0, 0, 400, 400);
        p1.setLayout(null);
        add(p1);
        
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icons/login.png"));
        Image i2 = i1.getImage().getScaledInstance(200, 200, Image.SCALE_DEFAULT);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel image = new JLabel(i3);
        image.setBounds(100,120,200,200);
        p1.add(image);
        
        JPanel p2 = new JPanel();
        p2.setBounds(400, 30, 450, 300);
        p2.setLayout(null);
        add(p2);
        
        JLabel lblusername = new JLabel("Username");
        lblusername.setBounds(60,20,100,25);
        lblusername.setFont(new Font("SAN SERIF", Font.PLAIN, 20));
        p2.add(lblusername);
        
        tfusername = new JTextField();
        tfusername.setBounds(60,60,300,30);
        tfusername.setBorder(BorderFactory.createEmptyBorder());
        p2.add(tfusername);
        
        JLabel lblpassword = new JLabel("Password");
        lblpassword.setBounds(60,110,100,25);
        lblpassword.setFont(new Font("SAN SERIF", Font.PLAIN, 20));
        p2.add(lblpassword);
        
        // Create a panel to hold password field and eye icon
        JPanel passwordPanel = new JPanel(null);
        passwordPanel.setBounds(60, 150, 300, 30);
        passwordPanel.setBackground(Color.WHITE); // match background
        p2.add(passwordPanel);

        // Use JPasswordField instead of JTextField
        tfpassword = new JPasswordField();
        tfpassword.setBounds(0, 0, 260, 30);
        tfpassword.setBorder(BorderFactory.createEmptyBorder());
        passwordPanel.add(tfpassword);

        // Eye icon button
        JButton eyeButton = new JButton();
        eyeButton.setBounds(265, 5, 20, 20);
        ImageIcon eyeIcon = new ImageIcon(ClassLoader.getSystemResource("icons/hidden.png")); 
        Image eyeImg = eyeIcon.getImage().getScaledInstance(16, 16, Image.SCALE_SMOOTH);
        eyeButton.setIcon(new ImageIcon(eyeImg));
        eyeButton.setFocusPainted(false);
        eyeButton.setContentAreaFilled(false);
        eyeButton.setBorderPainted(false);
        eyeButton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        passwordPanel.add(eyeButton);

        // Toggle password visibility
        eyeButton.addActionListener(new ActionListener() {
            private boolean visible = false;
            public void actionPerformed(ActionEvent e) {
                if (visible) {
                    tfpassword.setEchoChar('•');
                } else {
                    tfpassword.setEchoChar((char) 0);
                }
                visible = !visible;
            }
        });
        
        login = new JButton("Login");
        login.setBounds(60,200,130,30);
        login.setBackground(new Color(133,193,233));
        login.setForeground(Color.WHITE);
        login.setBorder(new LineBorder(new Color(133,193,233)));
        login.addActionListener(this);
        p2.add(login);
        
        signup = new JButton("Signup");
        signup.setBounds(230,200,130,30);
        signup.setBackground(new Color(133,193,233));
        signup.setForeground(Color.WHITE);
        signup.setBorder(new LineBorder(new Color(133,193,233)));
        signup.addActionListener(this);
        p2.add(signup);
        
        password = new JButton("ForgetPassword");
        password.setBounds(130,250,130,30);
        password.setBackground(new Color(133,193,233));
        password.setForeground(Color.WHITE);
        password.setBorder(new LineBorder(new Color(133,193,233)));
        password.addActionListener(this);
        p2.add(password);
        
        JLabel text = new JLabel("Trouble in login...");
        text.setBounds(275,255,190,20);
        text.setForeground(Color.red);
        p2.add(text);
                
        setVisible(true);
    }
    
    @Override
    public void actionPerformed(ActionEvent ae){
        if(ae.getSource()== login){
            try{
                String username = tfusername.getText();
                String pass = new String(tfpassword.getPassword());
                
                if (username.equals("") || pass.equals("")) {
                    JOptionPane.showMessageDialog(null, "Username and Password must not be empty!");
                    return;
                }
                
                String query = "select * from account where username = '"+username+"' AND password = '"+pass+"'";
                
                Conn c = new Conn();
                ResultSet rs = c.s.executeQuery(query);
                if(rs.next()){
                    setVisible(false);
                    new Loading(username);
                }else{
                    JOptionPane.showMessageDialog(null, "Incorrect Username or Password");
                }
            }catch(Exception e){
                System.out.println(e);
            }
        }else if(ae.getSource()== signup){
            setVisible(false);
            new Signup();
        }else{
            setVisible(false);
            new ForgetPassword();
        }
    }
    public static void main(String[] args){
        new Login();
    }
}
