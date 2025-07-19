/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package college_project;

/**
 *
 * @author VISHALKUMAR
 */
import com.toedter.calendar.JDateChooser;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.Random;
import javax.swing.*;

public class AddStudent extends JFrame implements ActionListener {
    JTextField textName,textfather,textAddress,textPhone,textemail,textM10,textM12,textAadhar;
    JLabel empText;
    JDateChooser cdob;
    JComboBox courseBox, departmentBox;
    JButton submit, cancel;

    Random ran = new Random();
    long f4 = Math.abs((ran.nextLong() % 9000L) + 1000L);

    AddStudent(){
        getContentPane().setBackground(new Color(128,176,255));

        JLabel heading = new JLabel(" Add New Students Details");
        heading.setBounds(310,30,500,50);
        heading.setFont(new Font("serif",Font.BOLD,30));
        add(heading);

        JLabel name = new JLabel("Name");
        name.setBounds(50,150,100,30);
        name.setFont(new Font("serif",Font.BOLD,20));
        add(name);

        textName = new JTextField();
        textName.setBounds(200,150,150,30);
        add(textName);
        
        
            textName.addKeyListener(new KeyAdapter() { 
            public void keyTyped(KeyEvent e) { 
                char c = e.getKeyChar();                 
                if (Character.isDigit(c)) {               
                    e.consume(); 
                    JOptionPane.showMessageDialog(null, "Numbers are not allowed in Name"); 
                } 
            } 
        });

        JLabel fname = new JLabel("Father Name");
        fname.setBounds(400,150,200,30);
        fname.setFont(new Font("serif",Font.BOLD,20));
        add(fname);

        textfather = new JTextField();
        textfather.setBounds(600,150,150,30);
        add(textfather);
        
        textfather.addKeyListener(new KeyAdapter() { 
            public void keyTyped(KeyEvent e) { 
                char c = e.getKeyChar();              
                if (Character.isDigit(c)) {              
                    e.consume(); 
                    JOptionPane.showMessageDialog(null, "Father's name cannot contain numbers"); 
                } 
            } 
        }); 

        JLabel empID = new JLabel("Roll Number");
        empID.setBounds(50,200,200,30);
        empID.setFont(new Font("serif",Font.BOLD,20));
        add(empID);

        empText = new JLabel("1409"+f4);
        empText.setBounds(200,200,150,30);
        empText.setFont(new Font("serif",Font.BOLD,20));
        add(empText);

        JLabel dob = new JLabel("Date of Birth");
        dob.setBounds(400,200,200,30);
        dob.setFont(new Font("serif",Font.BOLD,20));
        add(dob);

        cdob = new JDateChooser();
        cdob.setBounds(600,200,150,30);
        add(cdob);

        JLabel address = new JLabel("Address");
        address.setBounds(50,250,200,30);
        address.setFont(new Font("serif",Font.BOLD,20));
        add(address);

        textAddress = new JTextField();
        textAddress.setBounds(200,250,150,30);
        add(textAddress);

        JLabel phone = new JLabel("Phone");
        phone.setBounds(400,250,200,30);
        phone.setFont(new Font("serif",Font.BOLD,20));
        add(phone);

        textPhone = new JTextField();
        textPhone.setBounds(600,250,150,30);
        add(textPhone);
        textPhone.addKeyListener(new KeyAdapter() {   
            public void keyTyped(KeyEvent e) {           
                char c = e.getKeyChar(); 
                if (!Character.isDigit(c)) {          
                    e.consume(); 
                } else if (textPhone.getText().length() >= 10) {    
                    e.consume(); 
                    JOptionPane.showMessageDialog(null, "Phone number must be exactly 10 digits"); 
                } 
            } 
        });

        JLabel email = new JLabel("Email");
        email.setBounds(50,300,200,30);
        email.setFont(new Font("serif",Font.BOLD,20));
        add(email);

        textemail = new JTextField();
        textemail.setBounds(200,300,150,30);
        add(textemail);
        
        textemail.addFocusListener(new java.awt.event.FocusAdapter() { 
            public void focusLost(java.awt.event.FocusEvent evt) {           
                String email = textemail.getText(); 
                if (!email.matches("^(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._%+-]+(?<![_.-])@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$")) { 
                    JOptionPane.showMessageDialog(null, 
                            "Invalid email address format.\nPlease enter a valid email like: user.name123@gmail.com", 
                            "Email Error", 
                            JOptionPane.ERROR_MESSAGE 
                    ); 
 
                } 
            } 
        });

        JLabel M10 = new JLabel("Class X (%)");
        M10.setBounds(400,300,200,30);
        M10.setFont(new Font("serif",Font.BOLD,20));
        add(M10);

        textM10 = new JTextField();
        textM10.setBounds(600,300,150,30);
        add(textM10);

        JLabel M12 = new JLabel("Class XII (%)");
        M12.setBounds(50,350,200,30);
        M12.setFont(new Font("serif",Font.BOLD,20));
        add(M12);

        textM12 = new JTextField();
        textM12.setBounds(200,350,150,30);
        add(textM12);
        
        textM12.addKeyListener(new KeyAdapter() {      
            public void keyTyped(KeyEvent e) {          
                char c = e.getKeyChar();             
                String text = textM12.getText();      
                if (!Character.isDigit(c) && c != '.') {     
                    e.consume(); 
                    JOptionPane.showMessageDialog(null, "Only numbers are allowed in Class XII %"); 
                } else if (c == '.' && text.contains(".")) {       
                    e.consume(); 
                    JOptionPane.showMessageDialog(null, "Only one decimal point is allowed"); 
                } 
            } 
        }); 
 

        JLabel AadharNo = new JLabel("Aadhar Number");
        AadharNo.setBounds(400,350,200,30);
        AadharNo.setFont(new Font("serif",Font.BOLD,20));
        add(AadharNo);

        textAadhar = new JTextField();
        textAadhar.setBounds(600,350,150,30);
        add(textAadhar);

        JLabel Qualification = new JLabel("Course");
        Qualification.setBounds(50,400,200,30);
        Qualification.setFont(new Font("serif",Font.BOLD,20));
        add(Qualification);

        String course[] = {"B.Tech","BBA","BCA","BSC","MSC","MBA","MCA","MCom","MA","BA"};
        courseBox = new JComboBox(course);
        courseBox.setBounds(200,400,150,30);
        courseBox.setBackground(Color.WHITE);
        add(courseBox);

        JLabel Department = new JLabel("Branch");
        Department.setBounds(400,400,200,30);
        Department.setFont(new Font("serif",Font.BOLD,20));
        add(Department);

        String department[] = {"Computer Science","Electronics","Mechanical","Civil","IT"};
        departmentBox = new JComboBox(department);
        departmentBox.setBounds(600,400,150,30);
        departmentBox.setBackground(Color.WHITE);
        add(departmentBox);

        submit = new JButton("Submit");
        submit.setBounds(250,550,120,30);
        submit.setBackground(Color.black);
        submit.setForeground(Color.white);
        submit.addActionListener(this);
        add(submit);

        cancel = new JButton("Cancel");
        cancel.setBounds(450,550,120,30);
        cancel.setBackground(Color.black);
        cancel.setForeground(Color.white);
        cancel.addActionListener(this);
        add(cancel);

        setSize(900,700);
        setLocation(350,50);
        setLayout(null);
        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == submit){
            String name = textName.getText();
            String fname = textfather.getText();
            String empid = empText.getText();
            String dob = ((JTextField) cdob.getDateEditor().getUiComponent()).getText();
            String address = textAddress.getText();
            String phone = textPhone.getText();
            String email = textemail.getText();
            String x = textM10.getText();
            String xii = textM12.getText();
            String aadhar = textAadhar.getText();
            String course = (String) courseBox.getSelectedItem();
            String department = (String) departmentBox.getSelectedItem();
            
            
            
            if (name.isEmpty() || fname.isEmpty() || dob.isEmpty() || address.isEmpty() ||          
                    phone.isEmpty() || email.isEmpty() || x.isEmpty() || xii.isEmpty() ||       
                    aadhar.isEmpty()) { 
                JOptionPane.showMessageDialog(this, "All fields must be filled.");      
                return; 
            } 
 
            if (!name.matches("[a-zA-Z\\s]+")) { 
                JOptionPane.showMessageDialog(this, "Name must contain only letters.");            
                return; 
            } 
            
 
            if (!fname.matches("[a-zA-Z\\s]+")) { 
                JOptionPane.showMessageDialog(this, "Father's name must contain only letters.");     
                return; 
            } 
 
            if (!phone.matches("\\d{10}")) { 
                JOptionPane.showMessageDialog(this, "Phone number must be exactly 10 digits.");    
                return; 
            } 
 
            if (!email.matches("^(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._%+-]+(?<![_.-])@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$")) { 
                JOptionPane.showMessageDialog(this, "Invalid email format.");            
                return; 
            } 
 
            if (!x.matches("\\d+(\\.\\d+)?")) { 
                JOptionPane.showMessageDialog(this, "Class X % must be numeric.");     
                return; 
            } 
 
            if (!xii.matches("\\d+(\\.\\d+)?")) { 
        JOptionPane.showMessageDialog(this, "Class XII % must be numeric."); 
                return; 
            } 
 
            if (!aadhar.matches("\\d{12}")) { 
                JOptionPane.showMessageDialog(this, "Aadhar number must be exactly 12 digits.");      
                return; 
            }
            
            
            
            
            try { 
                String[] nameParts = name.trim().split(" "); 
                String firstName = nameParts[0].toLowerCase(); 
 
                // Extract only the year from dob 
 
                String year = new java.text.SimpleDateFormat("yyyy").format(dob); 
 
                // Generate username and password 
                String username = firstName + empid; 
                String password = firstName + "@" + year; 
                Connection_Class c=new Connection_Class(); 
                String q1="insert into Student values('"+name+"','"+fname+"','"+empid+"','"+dob+"','"+address+"','"+phone+"','"+email+"','"+x+"','"+xii+"','"+aadhar+"','"+course+"','"+department+"')"; 
                String q2 = "INSERT INTO student_login VALUES('" + username + "','" + password + "','" + empid + "')"; 
 
                c.statement.executeUpdate(q1); 
                c.statement.executeUpdate(q2); 
                JOptionPane.showMessageDialog(this, "Student added.\nUsername: " + username + "\nPassword: " + password); 
                setVisible(false); 
            } 
            catch (Exception E) 
            { 
                E.printStackTrace(); 
            } 
 
        }         else {
            setVisible(false);
        }
    }

    public static void main(String[] args) {
        new AddStudent();
    }
}

