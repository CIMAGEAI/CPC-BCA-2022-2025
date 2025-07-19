/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package college_project;
import java.awt.event.ActionEvent;
import java.awt.event.AWTEventListener;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionListener;
import java.sql.ResultSet;
import net.proteanit.sql.DbUtils;
/**
 *
 * @author VISHALKUMAR
 */
public class Teachers_Details extends JFrame implements ActionListener{
    
    
    Choice choice;
    JTable table;
    JButton search, print, update,add, cancle;
    Teachers_Details(){
        
        
        
         getContentPane().setBackground(new Color(120,252,218));
        
        
        JLabel heading = new JLabel("search by roll number :");
        heading.setBounds(20,20,150,20);
        add(heading);
        choice = new Choice();
        choice.setBounds(200,20,150,20);
        add(choice);
        
        
        try{
            Connection_Class conn = new Connection_Class();
            ResultSet result = conn.statement.executeQuery("select *from student");
            while(result.next()){
                choice.add(result.getString("Rollno"));
            }
        }catch(Exception e){
            e.printStackTrace();
            
        }
        table = new JTable();
        try{
            Connection_Class conn = new Connection_Class();
            ResultSet result = conn.statement.executeQuery("select *from Teacher");
            table.setModel(DbUtils.resultSetToTableModel(result));
            
        }catch(Exception e){
            e.printStackTrace();
        }
        JScrollPane js = new JScrollPane(table);
        js.setBounds(0,100,900,600);
        add(js);
        
        
//        button
        search = new JButton("Search");
        search.setBounds(20,70,80,20);
        search.addActionListener(this);
        add(search);
        
        //        button
        print = new JButton("Print");
        print.setBounds(120,70,80,20);
        print.addActionListener(this);
        add(print);
        
        
        //        button
        update = new JButton("Update");
        update.setBounds(220,70,80,20);
        update.addActionListener(this);
        add(update);
        
        //        button
        add = new JButton("Add");
        add.setBounds(320,70,80,20);
        add.addActionListener(this);
        add(add);
        
        cancle = new JButton("Cancle");
        cancle.setBounds(420,70,80,20);
        cancle.addActionListener(this);
        add(cancle);
        
        
        
        
        
        
        
        setLayout(null);
        setSize(900,700);
        setLocation(300,100);
        setVisible(true);
        
    }
    
    public void actionPerformed(ActionEvent e){
        
        
        if(e.getSource()==search){
            String q = "select *from teacher where emp_id ='"+choice.getSelectedItem()+"'";
            
            try{
                Connection_Class conn = new Connection_Class();
                ResultSet result = conn.statement.executeQuery(q);
                table.setModel(DbUtils.resultSetToTableModel(result));
                
                
            }
            catch(Exception E){
                E.printStackTrace();
                
            }
        }//catch
            else if(e.getSource() == print){
                    try{
                    table.print();
                    
                    }catch(Exception E){
                    E.printStackTrace();
                    
                    }
                    
                    }
            else if(e.getSource()== add){
                    setVisible(false);
                    new Addfaculty();
                    
                    }
            else if(e.getSource()== update){
                    
                    
                    }
                    else{
                    setVisible(false);
                    }
    
    }
    public static void main(String args[]){
        new Teachers_Details();
        
    
    }
    
    
}
