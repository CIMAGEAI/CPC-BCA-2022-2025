package university_managment_system;

import net.proteanit.sql.DbUtils;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.ResultSet;

public class StudentLeaveDetails extends JFrame  implements ActionListener {
     Choice cRollNo;
    JButton searchbutton,cancelbutton,addbutton,printbutton;
    JTable table;


    StudentLeaveDetails(){
        setSize(900,700);
        setLocation(300,100);
        getContentPane().setBackground(Color.WHITE);
        setLayout(null);
        setTitle("STUDENTS LEAVE DETAIL");
        setVisible(true);

        JLabel heading= new JLabel("Search By Roll Number");
        heading.setBounds(20,20,150,20);
        add(heading);

        cRollNo= new Choice();
        cRollNo.setBounds(180,20,150,20);
        add(cRollNo);

        //adding the buttons
        searchbutton=new JButton("Search");
        cancelbutton= new JButton("Cancel");
        addbutton= new JButton("Add");
        printbutton = new JButton("Print");

        searchbutton.setBounds(40,70,80,20);
        printbutton.setBounds(140,70,80,20);
        addbutton.setBounds(240,70,80,20);
        cancelbutton.setBounds(340,70,80,20);

        searchbutton.addActionListener(this);
        cancelbutton.addActionListener(this);
        addbutton.addActionListener(this);
        printbutton.addActionListener(this);

        add(searchbutton);
        add(addbutton);
        add(printbutton);
        add(cancelbutton);

        //fetching the roll no data from students table
        try{
            Conn con=new Conn();
            ResultSet rs =con.s.executeQuery("select * from student ");
            //fetch while data is empty
            while (rs.next()){
                cRollNo.add(rs.getString("rollno"));//fetch the data from coloumn name
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        //creating the table to get the information
        table =new JTable();
        //fetching the student detail data from students table
        try {
            Conn con = new Conn();
            ResultSet rs = con.s.executeQuery("select * from studentleave ");

            table.setModel(DbUtils.resultSetToTableModel(rs));

        }catch (Exception e){
            e.printStackTrace();
        }
        JScrollPane scroll=new JScrollPane(table);
        scroll.setBounds(0,100,900,600);
        add(scroll);


    }
    public void actionPerformed(ActionEvent ae){
        if (ae.getSource()==searchbutton){
            String query = "select * from studentleave where rollno ='"+cRollNo.getSelectedItem()+"'";
            try{
                Conn con =new Conn();
                ResultSet rs =con.s.executeQuery(query);
                table.setModel(DbUtils.resultSetToTableModel(rs));
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (ae.getSource()==cancelbutton) {
            setVisible(false);
        } else if (ae.getSource()==printbutton) {
            try {
                table.print();//method to open the command of printer
            }catch (Exception e){
                e.printStackTrace();
            }

        } else if (ae.getSource()==addbutton) {
            setVisible(false);
            new StudentLeave();
        }

    }


    public static void main(String[] args) {
        new StudentLeaveDetails();
    }

}
