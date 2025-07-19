/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package college_project;
import java.awt.*;
import java.awt.Color;
import javax.swing.JTextField;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.ResultSet;
import javax.swing.*;

/**
 *
 * @author VISHALKUMAR
 */
public class Enter_marks extends JFrame implements ActionListener{
     Choice choicerollno;
     JComboBox comboBox;
     JTextField sub1 , sub2, sub3,sub4,sub5, mrk1,mrk2,mrk3,mrk4,mrk5;
     JButton submit , cancle;
    
     
    
    Enter_marks(){
        
        
        getContentPane().setBackground(new Color(252,245,210));
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icons/exam2.png"));
        Image i2 = i1.getImage().getScaledInstance(400, 300,Image.SCALE_DEFAULT);
        ImageIcon I3 = new ImageIcon(i2);
        JLabel img = new JLabel(I3);
        img.setBounds(500,40,400,300);
        add(img);
        
        JLabel heading = new JLabel("Enter marks of student");
        heading.setBounds(50,0,500,50);
        heading.setFont(new Font("Arial",Font.BOLD, 20));
        add(heading);
        
        JLabel rollno = new JLabel("Select Roll no");
        rollno.setBounds(50,70,150,20);
//        rollno.setFont(new Font("Arial",Font.BOLD, 20));
        add(rollno);
        
        choicerollno =new Choice();
         choicerollno .setBounds(200,70,150,20);
         add(choicerollno);
         
         try{
             Connection_Class con = new Connection_Class();
             ResultSet result = con.statement.executeQuery("select *from Student");
              while(result.next()){
                  choicerollno.add(result.getString("RollNo"));
                  
                  
              
              }
         
         }catch(Exception E){
             E.printStackTrace();
         
         }
         
        JLabel sem = new JLabel("Select semester");
        sem.setBounds(50,110,150,20);
//        rollno.setFont(new Font("Arial",Font.BOLD, 20));
        add(sem);
        
        String semester[]={"1st semester,", "2nd semester", "3rd semester", "4th semester", "5th semester", "6th semester", "7th semester","8th semester"};
        
        
        comboBox = new JComboBox(semester);
        comboBox.setBounds(200,110,150,20);
        comboBox.setBackground(Color.WHITE);
        add(comboBox);
        
        JLabel entersub = new JLabel("Enter subject");
        entersub.setBounds(100,150,200,40);
        add(entersub);
        
        JLabel entermarks = new JLabel("Enter marks ");
        entermarks.setBounds(320,150,200,40);
        add(entermarks);
        
        sub1 = new JTextField();
        sub1.setBounds(50,200,200,20);
        add(sub1);
        
        sub2 = new JTextField();
        sub2.setBounds(50,230,200,20);
        add(sub2);
        
        sub3 = new JTextField();
        sub3.setBounds(50,260,200,20);
        add(sub3);
        
        sub4 = new JTextField();
        sub4.setBounds(50,290,200,20);
        add(sub4);
        sub5 = new JTextField();
        sub5.setBounds(50,320,200,20);
        add(sub5);
        
        
        mrk1 = new JTextField();
        mrk1.setBounds(250,200,200,20);
        add(mrk1);
        
        mrk2 = new JTextField();
        mrk2.setBounds(250,230,200,20);
        add(mrk2);
        
        
        mrk3 = new JTextField();
        mrk3.setBounds(250,260,200,20);
        add(mrk3);
        
        mrk4 = new JTextField();
        mrk4.setBounds(250,290,200,20);
        add(mrk4);
        
        mrk5 = new JTextField();
        mrk5.setBounds(250,320,200,20);
        add(mrk5);
        
        
        submit = new JButton("Submit");
        submit.setBackground(Color.BLACK);
        submit.setForeground(Color.WHITE);
        submit.setBounds(70,360,150,25);
        submit.addActionListener(this);
        add(submit);
        
        
        cancle = new JButton("Cancle");
        cancle.setBackground(Color.BLACK);
        cancle.setForeground(Color.WHITE);
        cancle.setBounds(280,360,150,25);
        cancle.addActionListener(this);
        add(cancle);
        
        
        
        
     
        
        
        
        
        
        
        setSize(1000,500);
        setLayout(null);
        setLocation(300,150);
        setVisible(true);
    
    }
    public void actionPerformed(ActionEvent e){
        if(e.getSource()==submit){
        
        try{
            Connection_Class con = new Connection_Class();
           // String q1 = "insert into Subject values ('"choicerollno.getSelectedItem()+"','"comboBox.getSelectedItem()+"','"sub1.getText()+"', '"sub2.getText()+"','"sub3.getText()+"','"sub4.getText()+"','"sub5.getText()+"')";
            
            
            String q1 = "insert into Subject values ('" + choicerollno.getSelectedItem() + "','" 
            + comboBox.getSelectedItem() + "','" 
            + sub1.getText() + "','" 
            + sub2.getText() + "','" 
            + sub3.getText() + "','" 
            + sub4.getText() + "','" 
            + sub5.getText() + "')";
            
            
            
            String q2 = "insert into Marks values ('" + choicerollno.getSelectedItem() + "','" 
            + comboBox.getSelectedItem() + "','" 
            + mrk1.getText() + "','" 
            + mrk2.getText() + "','" 
            + mrk3.getText() + "','" 
            + mrk4.getText() + "','" 
            + mrk5.getText() + "')";
            
            con.statement.executeUpdate(q1);
            con.statement.executeUpdate(q2);
            JOptionPane.showMessageDialog(null,"marks inserted sucessfully");
            setVisible(false);



        
        }
        catch(Exception E){
            E.printStackTrace();
        
        }
        }
    
    }
    public static void main (String args[]){
        new Enter_marks();
    
    }
    
}
