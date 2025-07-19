package travel.and.tourism;

import java.awt.Color;
import java.awt.Font;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.*;

public class Payment extends JFrame implements ActionListener{
    JButton pay, back;
    
    public Payment(){
        super("Payment");
        getContentPane().setBackground(Color.WHITE);
        setLayout(null);
        setBounds(600, 220, 800, 600);
        
        JLabel label=new JLabel("Pay using Paytm");
        label.setFont(new Font("Raleway", Font.BOLD, 40));
        label.setBounds(50, 20, 350, 45);
        add(label);
        
        ImageIcon i7 = new ImageIcon(ClassLoader.getSystemResource("icons/paytm.jpeg"));
        Image i8 = i7.getImage().getScaledInstance(800, 600, Image.SCALE_DEFAULT);
        ImageIcon i9 = new ImageIcon(i8);
        JLabel l4 = new JLabel(i9);
        l4.setBounds(0, 150, 800, 600);
        add(l4);
        
        pay = new JButton("Pay");
        pay.setBounds(420, 20, 80, 40);
        pay.addActionListener(this);
        add(pay);
        
        back = new JButton("Back");
        back.setBounds(510, 20, 80, 40);
        back.addActionListener(this);
        add(back);
        
        setVisible(true);

    }
    
    @Override
    public void actionPerformed(ActionEvent ae){
        if(ae.getSource()==pay){
            setVisible(false);
            new Paytm();
        }else{
            setVisible(false);
        }
    }

    public static void main(String[] args){
        new Payment();
    }
}
