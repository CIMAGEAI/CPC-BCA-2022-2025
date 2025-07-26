package university_managment_system;

import javax.swing.*;
import java.awt.*;

public class About extends JFrame {
    About(){
        setSize(700,500);
        setLocation(400,150);
        setLayout(null);
        getContentPane().setBackground(Color.WHITE);


        //adding image to the login screen
        ImageIcon icon = new ImageIcon(ClassLoader.getSystemResource("icons/about.heic"));
        Image icon2 = icon.getImage().getScaledInstance(300, 200, Image.SCALE_DEFAULT);
        ImageIcon icon3=new ImageIcon(icon2);//converting the image into an imageicon to display on the label
        JLabel image=new JLabel(icon3);// pasting that image into label and displaying
        image.setBounds(350,10,300,200);
        add(image);

        JLabel heading= new JLabel("<html>Cimage<br/>Managment System");
        heading.setBounds(70,20,300,130);
        heading.setFont(new Font("Tahoma",Font.BOLD,30));
        add(heading);

        JLabel name= new JLabel("Developed By:GAURAV BHATIA");
        name.setBounds(20,150,450,40);
        name.setFont(new Font("Tahoma",Font.BOLD,20));
        add(name);
        JLabel studentId= new JLabel("Student ID:20197");
        studentId.setBounds(20,190,450,40);
        studentId.setFont(new Font("Tahoma",Font.BOLD,20));
        add(studentId);
        JLabel contact= new JLabel("Contact: gaurav754282@gmail.com");
        contact.setBounds(20,410,450,40);
        contact.setFont(new Font("Tahoma",Font.PLAIN,18));
        contact.setForeground(Color.red);
        add(contact);


        setVisible(true);
    }

    public static void main(String[] args) {
        new About();
    }
}
