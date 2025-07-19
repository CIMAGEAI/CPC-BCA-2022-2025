/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package college_project;
import java.awt.*;
import java.awt.event.*;
import java.sql.ResultSet;
import javax.swing.*;
import net.proteanit.sql.DbUtils;
/**
 *
 * @author VISHALKUMAR
 */
public class FeeStructure extends JFrame implements ActionListener{
    
    FeeStructure(){
        
        
        JLabel heading = new JLabel("Fee Structure");
        heading.setBounds(400,10,400,30);
        heading .setFont(new Font("Tahoma",Font.BOLD,30));
        add(heading);
        
        JTable table = new JTable();
        
        try{
        Connection_Class con = new Connection_Class();
        ResultSet result = con.statement.executeQuery("select *from fee");
                table.setModel(DbUtils.resultSetToTableModel(result));
        }
        catch(Exception E){
            E.printStackTrace();
        
        }
        
        JScrollPane js = new JScrollPane(table);
        js.setBounds(0,60, 1000, 700);
        add(js);
        
        
        
        setSize(1000,700);
        setLocation(250,50);
        setLayout(null);
        setVisible(true);
    
    }
    
    public void actionPerformed(ActionEvent e){
    
    
    }
    
    public static void main(String args[]){
        
        new FeeStructure();
    }
    
}
