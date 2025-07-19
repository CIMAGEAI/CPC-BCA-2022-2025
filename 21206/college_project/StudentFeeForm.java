
//import java.awt.Image;
//import javax.swing.ImageIcon;
//import javax.swing.JFrame;
//import javax.swing.JLabel;

///*
// * To change this license header, choose License Headers in Project Properties.
// * To change this template file, choose Tools | Templates
// * and open the template in the editor.
// */
//
package college_project;
import java.awt.Choice;
import java.awt.Color;
import java.awt.Font;
import java.awt.Image;
import java.awt.event.*;
import java.sql.ResultSet;
import javax.swing.*;
//
///**
// *
// * @author VISHALKUMAR
// */
public class StudentFeeForm  extends JFrame implements ActionListener{
    
    JComboBox Department,qualification,semesterBox;
    Choice CrollNumber;
    JButton pay, update,back;
    
    JLabel totalAmount;
    StudentFeeForm(){
        
        getContentPane().setBackground(new Color(210,252,251));
        
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icons/fee.png"));
        Image i2 = i1.getImage().getScaledInstance(1800,700, Image.SCALE_DEFAULT);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel img = new JLabel(i3);
        img.setBounds(400,20,500,300);
        add(img);
        
        JLabel rollnumber = new JLabel("Select Roll number");
        rollnumber.setBounds(40,60,150,20);
        rollnumber.setFont(new Font("Tahoma", Font.BOLD,12));
        add(rollnumber);
        
        
        
        
        
        CrollNumber = new Choice();
        CrollNumber.setBounds(200, 60, 150, 20);
        add(CrollNumber);
        
              try{
            Connection_Class con = new Connection_Class();
            ResultSet result = con.statement.executeQuery("select *from Student");
            
            while(result.next()){
                
                CrollNumber.add(result.getString("RollNo"));
            
            
            }
        
        
        }
        catch(Exception E){
            E.printStackTrace();
        
        }
        
        
        JLabel name= new JLabel("Name");
        name.setBounds(40,100,150,20);
        add(name);
        
        JLabel textname = new JLabel();
        textname.setBounds(200,100,150,20);
        add(textname);
        
        
        
        JLabel fname= new JLabel("Father Name");
        fname.setBounds(40,140,150,20);
        add(fname);
        
        JLabel ftextname = new JLabel();
        ftextname.setBounds(200,140,150,20);
        add(ftextname);
        
        

        
  
        
        
        try{
            Connection_Class con = new Connection_Class();
            String q = "select  *from Student where RollNo ='"+CrollNumber.getSelectedItem()+"'";
            ResultSet result =con.statement.executeQuery(q);
            while(result.next()){
            textname.setName(result.getString("name"));
            ftextname.setName(result.getString("fathername"));
            
            }
        
        }catch(Exception E){
        
            E.printStackTrace();
        }
        
        
        

        
CrollNumber.addItemListener(new ItemListener() {
    public void itemStateChanged(ItemEvent e) {
        
              try{
            Connection_Class con = new Connection_Class();
            String q = "select  *from student where RollNo ='"+CrollNumber.getSelectedItem()+"'";
            ResultSet result =con.statement.executeQuery(q);
            while(result.next()){
            textname.setText(result.getString("name"));
            ftextname.setText(result.getString("fathername"));
            
            }
        
        }catch(Exception E){
        
            E.printStackTrace();
        }

    }
});


JLabel quali = new JLabel("Course.");
        quali.setBounds(40,180,150, 20);
        quali.setFont(new Font("Tahoma",Font.BOLD,16));
        add(quali);
        
        
        String [] str ={"Btech", "BBA" , "BCA", "BSC", "BA" ,"MSC" , "MBA", "MCA", "MA"};

        qualification= new JComboBox(str);
        qualification.setBounds(200,180,150,20);
        qualification.setFont(new Font("Tahoma", Font.PLAIN, 18));
        add(qualification);

        JLabel department = new JLabel("Branch");
        department.setBounds(40,220,150, 20);
        department.setFont(new Font("arial",Font.BOLD,16));
        add(department);
        
        
       String str1[] = {"Computer Science", "electronics", "Mechnecial", "IT"};
        
       
        Department= new JComboBox(str1);
        Department.setBounds(200,220,150, 20);
        add(Department);
        
        
        
        JLabel textsemester = new JLabel("Semester");
        textsemester.setBounds(40,260,150,20);
        add(textsemester);
        
        
        String semester[]= {"semester1", "semester2", "semester3", "semester4", "semester5", "semester6", "semester7", "semester8"};
        semesterBox= new JComboBox(semester);
        semesterBox.setBounds(200,260,150,20);
        add(semesterBox);
        
        
        JLabel total = new JLabel("total payable");
        total.setBounds(40,300,150,20);
        add(total);
        
        
        totalAmount = new JLabel();
        totalAmount.setBounds(200,300,150,20);
        add(totalAmount);
        
        
        update = new JButton("Update");
        update.setBounds(30,380,100,25);
        update.addActionListener(this);
        add(update);
        
        pay = new JButton("Pay");
        pay.setBounds(150,380,100,25);
        pay.addActionListener(this);
        add(pay);
        
        
        back = new JButton("Back");
        back.setBounds(270,380,100,25);
        back.addActionListener(this);
        add(back);
        
        
        





        
        
        setSize(900,500);
        setLocation(300,100);
        setLayout(null);
        setVisible(true);
        
    
    }
    
    public void actionPerformed(ActionEvent e){
        
        
        
        if(e.getSource()==update){
            String course = (String) qualification.getSelectedItem();
            String semester = (String) semesterBox.getSelectedItem();
        
            
            try{
                Connection_Class con = new Connection_Class();
                ResultSet result = con.statement.executeQuery("select *from fee where course ='"+course+"'");
                while(result.next()){
                    totalAmount.setText(result.getString(semester));
                
                }
            
            }catch(Exception E){
                E.printStackTrace();
            
            }
        }else if(e.getSource()==pay){
            String rollno = CrollNumber.getSelectedItem();
            String course = (String) qualification.getSelectedItem();
            String semester =(String) semesterBox.getSelectedItem();
            String branch = (String) Department.getSelectedItem();
            String total = totalAmount.getText();
            
        try{
            Connection_Class con = new Connection_Class();
            String q = "insert into feecollege values('"+rollno+"','"+course+"','"+semester+"','"+branch+"','"+total+"')";
            con.statement.executeUpdate(q);
            JOptionPane.showConfirmDialog(null, "Fee Submited successfully");
            
            
            
        
        }catch(Exception E){
            E.printStackTrace();
        
        }
        }else{
            setVisible(false);
        
        }
        
    
    }
    
    public static void main(String args[]){
        new StudentFeeForm();
        
    
    }
    
    
}



