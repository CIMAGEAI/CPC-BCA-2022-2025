/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package college_project;

import java.awt.*;
import java.awt.Color;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.sql.ResultSet;
import javax.swing.*;
import javax.swing.JFrame;
import net.proteanit.sql.DbUtils;

/**
 *
 * @author VISHALKUMAR
 */
public class ExaminationDetails extends JFrame implements ActionListener {
    
    
    JTextField search;
    JButton result , back;
    JTable table;
    ExaminationDetails(){
        getContentPane().setBackground(new Color(241,252,210));
        JLabel heading= new JLabel("check Result");
        heading.setBounds(350,15,400,50);
        heading.setFont(new Font("Tahoma",Font.BOLD,25));
        add(heading);
        
        
        search = new JTextField();
        search.setBounds(80,90,200,30);
        search.setFont(new Font("Tahoma", Font.PLAIN, 20));
        add(search);
        
        
        result = new JButton("Result");
        result.setBounds(300,90,120,30);
        result.setBackground(Color.BLACK);
        result.setForeground(Color.white);
        result.addActionListener(this);
        add(result);
        
        
        back = new JButton("Back");
        back.setBounds(440,90,120,30);
        back.setBackground(Color.BLACK);
        back.setForeground(Color.white);
        back.addActionListener(this);
        add(back);
        
        table = new JTable();
        JScrollPane scrollpane= new JScrollPane(table);
        scrollpane.setBounds(0,130,1000,310);
        add(scrollpane);
        
        try{
            Connection_Class con = new Connection_Class();
            ResultSet rs =con.statement.executeQuery("select * from Student");
            table.setModel(DbUtils.resultSetToTableModel(rs));
            
        
        }catch(Exception E){
            E.printStackTrace();
        
        }
        
        table.addMouseListener(new MouseAdapter(){
        
            public void mouseClicked(MouseEvent e){
                int row = table.getSelectedRow();
                search.setText(table.getModel().getValueAt(row, 2).toString());
                
            
            }
        });

       
        
        
        setSize(1000,475);
        setLocation(300,100);
        setLayout(null);
        setVisible(true);
    
    }
    
    public void actionPerformed(ActionEvent e){
        if(e.getSource()==result){
            setVisible(false);
            new Marks(search.getText());
        
        }
    
    
    }
    public static void main(String args[]){
    
    new ExaminationDetails();
    }
    
}
