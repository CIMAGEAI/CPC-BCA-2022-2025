/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package college_project;

import java.awt.Color;
import java.awt.Image;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.ResultSet;
import javax.swing.*;

/**
 *
 * @author VISHALKUMAR
 */
public class Signup extends JFrame implements ActionListener{
    
    JTextField textField ;
    JPasswordField pass;

    JButton signup, login;
    
    Signup(){
        
        
        textField = new JTextField();
        textField.setBounds(150, 20,  150,20);
        add(textField);

//



        JLabel  label_name= new JLabel("Uesrname");
        label_name.setBounds(40, 20,100,20);
        label_name.setForeground(Color.WHITE);
        add(label_name);


       JLabel password = new JLabel("password");
        password.setBounds(40,70,100,20);
        password.setForeground(Color.WHITE);
       add(password);

      pass = new JPasswordField();
       pass.setBounds(150,70,150,20);
       add(pass);

       signup = new JButton("Signup");
       signup.setBounds(40,140,120,30);
       signup.setBackground(Color.BLACK);
       signup.setForeground(Color.white);

       signup.addActionListener(this);
       add(signup);

       login = new JButton("Back");
       login.setBounds(175, 140,120,30);
        login.setBackground(Color.BLACK);
        login.setForeground(Color.white);
        login.addActionListener(this);
        add(login);

        ImageIcon l1 =new ImageIcon( ClassLoader.getSystemResource("icons/signup.png"));
        Image l2 =  l1.getImage().getScaledInstance(200,200,Image.SCALE_DEFAULT);
        ImageIcon l3 = new ImageIcon(l2);
        JLabel img = new JLabel(l3);
        img.setBounds(350,20, 200,200);
        add(img);


        // set the background
        ImageIcon l11 =new ImageIcon( ClassLoader.getSystemResource("icons/loginback.jpeg"));
        Image l22 =  l11.getImage().getScaledInstance(600,300,Image.SCALE_DEFAULT);
        ImageIcon l33 = new ImageIcon(l22);
        JLabel backimg = new JLabel(l33);
        backimg.setBounds(0,0,600,300);
        add(backimg);







        setSize(600,300);
        setLocation(500,300);
        setLayout(null);
        setVisible(true);
    
    
    }
    
    public void actionPerformed(ActionEvent e){
        
        
                if(e.getSource()==signup){
                    String username = textField.getText();
                    char[] password = pass.getPassword();

                    try{
                        Connection_Class c = new Connection_Class();
            String q = "INSERT INTO login (username,password) VALUES ('"+ username + "', '" + password + "')";

            c.statement.executeUpdate(q);
            JOptionPane.showMessageDialog(null, "Successfully.");
            setVisible(false);
//check the resulst where data is cominig or not



                    }catch(Exception E){
                        E.printStackTrace();
                    }

        }
                else if (e.getSource()==login){
                    setVisible(false);
                    new Login();
                
                }
    
    
    }
    
    public static void main(String args[]){
        
        
        new Signup();
    
    }
    
}
