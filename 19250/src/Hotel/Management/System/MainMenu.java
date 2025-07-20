package Hotel.Management.System;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
//import java.awt.event.*;

public class MainMenu extends JFrame implements ActionListener{
    JButton jb1;
    //public AddCustomer s1;
   public MainMenu()
    {
        setLayout(null);
        JLabel jl1 = new JLabel();
        jl1.setBounds(740,0,960,960);
        jl1.setIcon(new ImageIcon("src/Gif1.gif"));
        add(jl1);

        JLabel jl2 = new JLabel("Welcome To Swaraj Hotel");
        jl2.setBounds(200,40,500,50);
        jl2.setFont(new Font("Calibre",Font.BOLD,25));
        jl2.setForeground(Color.red);
        add(jl2);

        add(jl2);

        JLabel jl3 = new JLabel();
        jl3.setBounds(30,330,680,430);
        jl3.setIcon(new ImageIcon("src/reception.jpg"));
        add(jl3);
        
         jb1= new JButton();
        jb1.setText("BOOKING ROOM");
        jb1.setFont(new Font("Serif",Font.BOLD,20));
        jb1.setBackground(Color.BLACK);
        jb1.setForeground(Color.WHITE);
        jb1.setBounds(250,130,250,60);
        add(jb1);
        jb1.addActionListener(this);
       // jb1.addActionListener(new ActionListener() {
           // @Override


        JButton jb2 = new JButton();
        jb2.setText("CHECK OUT");
        jb2.setFont(new Font("Serif",Font.BOLD,20));
        jb2.setBackground(Color.BLACK);
        jb2.setForeground(Color.WHITE);
        jb2.setBounds(250,240,250,60);
        add(jb2);
        jb2.addActionListener(this);
       /* jb2.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

            }
        });*/

        Cursor c = new Cursor(Cursor.HAND_CURSOR);
        jb1.setCursor(c);
        jb2.setCursor(c);


        getContentPane().setBackground(new Color(218, 190, 109));
        setSize(1700,960);
        setVisible(true);
        setLocation(0,0);
    }
    public void actionPerformed(ActionEvent e) {
        try {
          //  String s = e.getActionCommand();
            if (e.getSource()==jb1) {
                AddCustomer a =new AddCustomer();
                //s1.showForm();
            }
            else {
                RemoveCustomer rv = new RemoveCustomer();
            }
        }

        catch (Exception E)
        {
            E.printStackTrace();
        }
    }

    public static void main(String[] args)
    {

        new MainMenu();
    }


}
