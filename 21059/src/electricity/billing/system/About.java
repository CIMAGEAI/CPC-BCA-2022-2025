package electricity.billing.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class About extends JFrame implements ActionListener{
    About(){
        super("About the Project");
        setBounds(600, 200, 500, 550);
	setLayout(null);
        getContentPane().setBackground(Color.WHITE);
        
        JLabel i1 = new JLabel("ABOUT");
	i1.setBounds(200, 10, 100, 40);
	i1.setForeground(Color.RED);
	i1.setFont(new Font("Tahoma", Font.PLAIN, 20));
	add(i1);
        
        String s = "\t\t\tAbout Project         \n\n"+
                "=> This project is developed using Java and MySQL. \n"+
                "=> It helps in managing customer records and monthly billing details. \n" +
                "=> It minimizes the documentation related work. \n"+
                "=> Ensures fast and reliable data storage and retrieval. \n"+
                "=> User-friendly interface designed for smooth interaction.\n"+
                "=> Reduces the dependency on paperwork and manual processes. \n"+
                "=> Improves efficiency of electricity billing operations. \n"+
                "=> Supports real-time data access and updates.";
        
        TextArea area = new TextArea(s,10, 40, Scrollbar.VERTICAL);
	area.setEditable(false);
	area.setBounds(20, 100, 450, 300);  
        area.setFont(new Font("Arial", Font.PLAIN, 18));
	add(area);
        
        JButton back = new JButton("Back");
	back.setBounds(200, 420, 100, 25);
	back.addActionListener(this);
	add(back);
		
	setVisible(true);
    }
    
    @Override
    public void actionPerformed(ActionEvent ae){
	setVisible(false);
    }
    
    public static void main(String[] args){
        new About();
    }
}
