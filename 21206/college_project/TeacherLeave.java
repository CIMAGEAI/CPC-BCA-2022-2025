/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package college_project;

import com.toedter.calendar.JDateChooser;
import java.awt.Choice;
import java.awt.Color;
import java.awt.Font;
import javax.swing.JFrame;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.ResultSet;
import javax.swing.*;

/**
 *
 * @author VISHALKUMAR
 */
public class TeacherLeave extends JFrame implements ActionListener{
    
        
    Choice choice , choiceTime;
    JDateChooser seldate;
    JButton submit ,cancle;
    TeacherLeave(){
        
       getContentPane().setBackground(new Color(210,232,252));
        
        JLabel heading = new JLabel("Apply Leave (Teacher)");
        heading.setBounds(20,50,300,30);
        heading.setFont(new Font("Tahoma ", Font.BOLD,20));
        add(heading);

        
        
        
       
       JLabel ROllNose = new JLabel("Search by empId");
        ROllNose.setBounds(60,100,200,30);
        ROllNose.setFont(new Font("Tahoma ", Font.PLAIN,18));
        add(ROllNose);
       
        
        choice = new Choice();
        choice.setBounds(60,130,200,20);
        add(choice);
        
        
        try{
            Connection_Class conn = new Connection_Class();
            ResultSet result = conn.statement.executeQuery("select * from teacher");
            while(result.next()){
                choice.add(result.getString("emp_id"));
            
            }
            
        
        }catch(Exception E){
            E.printStackTrace();
        }
        
        JLabel lbldate = new JLabel("Date");
        lbldate.setBounds(60,180,200,20);
        lbldate.setFont(new Font("Tahoma",Font.PLAIN, 20));
        add(lbldate);
        
        
        seldate =  new JDateChooser();
        seldate.setBounds(60,210,200,25);
        add(seldate);
        
//        "How many days of leave do you need?"
        
        
        JLabel time = new JLabel("Date Duration ");
        time.setBounds(60,260,200,20);
        time.setFont(new Font("Tahoma",Font.PLAIN, 20));
        add(time); 
        
        
        choiceTime = new Choice();
        choiceTime.setBounds(60,290,200,20);
        choiceTime.add("FullDay");
        choiceTime.add("HalfDay");
        add(choiceTime);
        
        
        submit =new JButton("Submit");
        submit.setBounds(60,350,100,25);
        submit.setBackground(Color.BLACK);
        submit.setForeground(Color.white);
        submit.addActionListener(this);
        add(submit);
        
        cancle =new JButton("Submit");
        cancle.setBounds(200,350,100,25);
        cancle.setBackground(Color.BLACK);
        cancle.setForeground(Color.white);
        cancle.addActionListener(this);
        add(cancle);
        
        
        
        
        
        
        
        
        
        
        setSize(500,550);
        setLocation(550,100);
        setLayout(null);
        setVisible(true);
        
    
    }
    public void actionPerformed(ActionEvent e){
        
        if(e.getSource()==submit){
        String rollno =choice.getSelectedItem();//get the selected items 
        String date =((JTextField) seldate.getDateEditor().getUiComponent()).getText();
        String time= choiceTime.getSelectedItem();
        
        
        String q = "insert into TeacherLeave values('"+rollno+"','"+date+"','"+time+"')";
        try{
            Connection_Class conn = new Connection_Class();
            conn.statement.executeUpdate(q);
            JOptionPane.showMessageDialog(null, "leave Confirmed");
            setVisible(false);
            
        }catch(Exception E){
            E.printStackTrace();
            
        
        }
        }
        
        else{
        
        }
        
    
    }
    
    public static void main(String args[]){
        new TeacherLeave();
    
    }
    
}
