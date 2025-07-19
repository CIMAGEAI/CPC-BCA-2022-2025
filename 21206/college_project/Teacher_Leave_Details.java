/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package college_project;

import java.awt.*;
import java.awt.Choice;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.ResultSet;
import javax.swing.*;
import javax.swing.JFrame;
import net.proteanit.sql.DbUtils;

/**
 *
 * @author VISHALKUMAR
 */
public class Teacher_Leave_Details extends JFrame implements ActionListener{
    JTable table;
    Choice choiceEmpid;
    JButton search , cancle ,print;
    
    Teacher_Leave_Details(){
        
        getContentPane().setBackground(new Color(250,172,206));
        
        JLabel heading = new JLabel("Search By Emplyoee ID");
        heading.setBounds(20,20,150,20);
        add(heading);
        

        
        choiceEmpid = new Choice();
        choiceEmpid.setBounds(180,20,150,20);
        add(choiceEmpid);
        
        
        try{
            Connection_Class con = new Connection_Class();
            ResultSet result = con.statement.executeQuery("select *from teacher");
            while(result.next()){
                choiceEmpid.add(result.getString("emp_id"));
            
            }
            
            
        
        }catch(Exception e){
            e.printStackTrace();
            
        
        }
        
        table = new JTable();
        try{
            Connection_Class con = new Connection_Class();
            ResultSet result = con.statement.executeQuery("select *from TeacherLeave");
            table.setModel(DbUtils.resultSetToTableModel(result));
            
            
            
        
        }catch(Exception e){
        e.printStackTrace();
        }
        JScrollPane scrollpane = new JScrollPane(table);
        
        scrollpane.setBounds(0,100,900,600);
        add(scrollpane);
        
        
        search = new JButton("Search");
        search.setBounds(20,70,80,30);
        search.addActionListener(this);
        add(search);
        
        
        print = new JButton("print");
        print.setBounds(120,70,80,30);
        print.addActionListener(this);
        add(print);
        
        
        cancle = new JButton("cancle");
        cancle.setBounds(220,70,80,30);
        cancle.addActionListener(this);
        add(cancle);
        
        
        setSize(900,700);
        setLocation(300,100);
        setLayout(null);
        setVisible(true);
        
        
    
    }
    
    public void actionPerformed(ActionEvent e){
        
        if(e.getSource()==search){
            String s ="select *from TeacherLeave where empid ='"+choiceEmpid.getSelectedItem()+"'";
             
            try{
                Connection_Class con = new Connection_Class();
                ResultSet result= con.statement.executeQuery(s);
                table.setModel(DbUtils.resultSetToTableModel(result));
            
            }catch(Exception E){
            E.printStackTrace();
            }
            
        
        }else if(e.getSource()== print){
            
            try{
                table.print();
            
            }catch(Exception E){
            
            E.printStackTrace();
            }
            
        
        } else{
        setVisible(false);
        }
    
    }
    
    
    public static void main (String args[]){
    
        new Teacher_Leave_Details();
    }
    
}
