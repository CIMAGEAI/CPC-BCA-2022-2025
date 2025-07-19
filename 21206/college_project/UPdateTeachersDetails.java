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
 
import javax.swing.*; import java.awt.*; import java.awt.event.*; 
import java.sql.ResultSet; 
 
public class UPdateTeachersDetails extends JFrame implements ActionListener {    
    JTextField textAddress,textPhone, textEmail,textAadhar, textCourse,textBranch; 
    JComboBox<String> courseBox; 
    JComboBox<String> departmentBox; 
    JLabel empText; 
    JButton update,cancel; 
    Choice cEmpId; 
    UPdateTeachersDetails() 
    { 
        setSize(850,650);        
        
        setLocation(225,50);    
        setLayout(null); 
 
        //background set 
        getContentPane().setBackground(new Color(230,210,252)); 
 
        JLabel heading=new JLabel("Update Teacher Details");    
        heading.setBounds(50,10,500,50); 
        heading.setFont(new Font("serif",Font.BOLD,35));       
        add((heading)); 
 
        JLabel empId=new JLabel("Select Employee ID");         
        empId.setBounds(50,100,200,20); 
        empId.setFont(new Font("serif",Font.PLAIN,20));       
        add(empId); 
 
        //choice 
 
        cEmpId=new Choice();    
        cEmpId.setBounds(250,100,200,20); 
        add(cEmpId); 
 
        try { 
            Connection_Class c=new Connection_Class(); 
            ResultSet resultSet=c.statement.executeQuery("select * from teacher");   
            while (resultSet.next()) 
            { 
                cEmpId.add(resultSet.getString("emp_id")); 
            } 
        } 
        catch (Exception e) 
        { 
            e.printStackTrace(); 
        } 
 
 
 
        //form name 
 
        JLabel name=new JLabel("Name");       
        name.setBounds(50,150,100,30);       
        name.setFont(new Font("serif",Font.BOLD,20)); 
        add(name); 
 
        JLabel textName=new JLabel();      
        textName.setBounds(200,150,150,30); 
        add(textName); 
 
        //fathers name 
 
        JLabel fname=new JLabel("Father's Name");   
        fname.setBounds(400,150,150,30);      
        fname.setFont(new Font("serif",Font.BOLD,20)); 
        add(fname); 
        
 
       JLabel textFather=new JLabel();   
       textFather.setBounds(600,150,150,30); 
        add(textFather); 
 
        // emp id 
 
        JLabel EMPIDD=new JLabel("Employee ID"); 
        EMPIDD.setBounds(50,200,120,30);      
        EMPIDD.setFont(new Font("serif",Font.BOLD,20)); 
        add(EMPIDD); 
 
        empText=new JLabel();         empText.setBounds(200,200,150,30);    
        empText.setFont(new Font("serif",Font.BOLD,20)); 
        add(empText); 
        // textFieldId.setEditable(false); 
 
        //Dob 
        JLabel dob=new JLabel("Date of Birth");      
        dob.setBounds(400,200,150,30);       
        dob.setFont(new Font("serif",Font.BOLD,20)); 
        add(dob); 
 
       JLabel dobD=new JLabel();      
       dobD.setBounds(600,200,150,30); 
        add(dobD); 
 
 
        //address 
 
JLabel address=new JLabel("Address");
address.setBounds(50,250,120,30);
address.setFont(new Font("serif",Font.BOLD,20)); 
add(address); 
 
        textAddress=new JTextField();     
        textAddress.setBounds(200,250,150,30); 
        add(textAddress); 
 
 
        //phone 
 
        JLabel phone=new JLabel("Phone");     
        
        phone.setBounds(400,250,150,30); 
        phone.setFont(new Font("serif",Font.BOLD,20));   
        add(phone); 
 
        textPhone =new JTextField();  
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
 
        //email 
 
        JLabel email=new JLabel("Email");      
        email.setBounds(50,300,120,30); 
        email.setFont(new Font("serif",Font.BOLD,20));
        add(email); 
 
        textEmail=new JTextField();     
        textEmail.setBounds(200,300,150,30); 
        add(textEmail); 
        
 
        textEmail.addFocusListener(new java.awt.event.FocusAdapter() { 
            public void focusLost(java.awt.event.FocusEvent evt) {       
                String email = textEmail.getText(); 
                if (!email.matches("^(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._%+-]+(?<![_.-])@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$")) { 
                    JOptionPane.showMessageDialog(null, 
                            "Invalid email address format.\nPlease enter a valid email like: user.name123@gmail.com", 
                            "Email Error", 
                            JOptionPane.ERROR_MESSAGE 
                    ); 
 
                } 
            } 
        }); 
 
        //10th percentage 
 
        JLabel m10=new JLabel("Class X (%)");   
        m10.setBounds(400,300,150,30); 
        m10.setFont(new Font("serif",Font.BOLD,20)); 
        add(m10); 
 
       JLabel textm10 =new JLabel();        
       textm10.setBounds(600,300,150,30); 
        add(textm10); 
 
        //12th percentage 
 
        JLabel m12=new JLabel("Class XII (%)");      
        m12.setBounds(50,350,130,30); 
        m12.setFont(new Font("serif",Font.BOLD,20));  
        add(m12); 
 
       JLabel textm12=new JLabel();     
       textm12.setBounds(200,350,150,30); 
        add(textm12); 
 
        //aadhar number 
 
        JLabel aadhar=new JLabel("Aadhar Number");        
        aadhar.setBounds(400,350,150,30); 
        aadhar.setFont(new Font("serif",Font.BOLD,20));     
        add(aadhar); 
 
        JLabel textAadhar =new JLabel();        
        textAadhar.setBounds(600,350,150,30);   
        add(textAadhar); 
 
        //Qualification 
 
        JLabel qualification=new JLabel("Qualification");  
        qualification.setBounds(50,400,130,30);     
        qualification.setFont(new Font("serif",Font.BOLD,20));   
        add(qualification); 
 
 
 
        /*textCourse=new JTextField();         textCourse.setBounds(200,400,150,30);         add(textCourse);*/ 
 
        String[] courseOptions = {"B.Tech","M.Tech","BCA","BBA","B.Sc(IT)","BBM","MBA","PGDM","MCA","B.Com","BMS"}; courseBox = new JComboBox<>(courseOptions); courseBox.setBounds(200,400,150,30); 
courseBox.setBackground(Color.white); add(courseBox); 
 
 
 
        //departement 
 
        JLabel department=new JLabel("Department");    
        
        department.setBounds(400,400,150,30); 
        department.setFont(new Font("serif",Font.BOLD,20)); 
        add(department); 
 
 
 
      /*  textBranch=new JTextField();         textBranch.setBounds(600,400,150,30);         add(textBranch);*/ 
 
        String[] departmentOptions = {"Computer Science", "Business Administration", "Commerce", "Management"};   
        departmentBox = new JComboBox<>(departmentOptions); 
        departmentBox.setBounds(600,400,150,30);  
        departmentBox.setBackground(Color.white);    
        add(departmentBox); 
 
 
        try { 
            Connection_Class c=new Connection_Class(); 
            String query="select * from teacher where emp_id = '"+cEmpId.getSelectedItem()+"'"; 
            ResultSet  resultSet=c.statement.executeQuery(query);   
            while (resultSet.next()) 
            { 
                textName.setText(resultSet.getString("name"));      
                textFather.setText(resultSet.getString("fathername"));        
                dobD.setText(resultSet.getString("dob"));               
                textAddress.setText(resultSet.getString("address"));       
                textPhone.setText(resultSet.getString("phone"));          
                textEmail.setText(resultSet.getString("email"));         
                
                textm10.setText(resultSet.getString("class_X"));        
                textm12.setText(resultSet.getString("Class_XII"));      
                
                textAadhar.setText(resultSet.getString("adharno"));     
                empText.setText(resultSet.getString("emp_id"));         
//                textCourse.setText(resultSet.getString("Education"));   
                courseBox.setSelectedItem(resultSet.getString("Education")); 
 
                
                //textBranch.setText(resultSet.getString("department")); 
                departmentBox.setSelectedItem(resultSet.getString("department")); 
 
            } 
 
        } 
        catch (Exception e) 
        { 
            e.printStackTrace(); 
} 
 
        cEmpId.addItemListener(new ItemListener() { 
            @Override 
            public void itemStateChanged(ItemEvent e) {                
                try { 
                    Connection_Class c=new Connection_Class(); 
                    String query="select * from teacher where emp_id = '"+cEmpId.getSelectedItem()+"'"; 
                    ResultSet  resultSet=c.statement.executeQuery(query);                
                    while (resultSet.next()) 
                    { 
                        textName.setText(resultSet.getString("name"));         
                        textFather.setText(resultSet.getString("fathername"));      
                        dobD.setText(resultSet.getString("dob"));             
                        textAddress.setText(resultSet.getString("address"));  
                        textPhone.setText(resultSet.getString("phone"));      
                        textEmail.setText(resultSet.getString("email"));        
                        textm10.setText(resultSet.getString("class_X"));       
                        textm12.setText(resultSet.getString("Class_XII"));    
                        textAadhar.setText(resultSet.getString("adharno"));    
                        empText.setText(resultSet.getString("emp_d"));        
                        textCourse.setText(resultSet.getString("Education"));  
                        //courseBox.setSelectedItem(resultSet.getString("education")); 
                        courseBox.setSelectedItem(resultSet.getString("education")); 
 
                        
 
                        //textBranch.setText(resultSet.getString("department")); 
                        departmentBox.setSelectedItem(resultSet.getString("department")); 
 
                    } 
 
                } 
                catch (Exception E) 
                { 
                    E.printStackTrace(); 
                } 
            } 
        }); 
 
        //Update button 
 
        update=new JButton("Update");     
        update.setBounds(270,500,120,30);  
        update.setForeground(Color.white);  
        update.setBackground(Color.BLACK);   
        update.addActionListener(this); 
        add(update); 
 
        //Cancel button 
 
        cancel=new JButton("Cancel");
        cancel.setBounds(420,500,120,30);
        cancel.setForeground(Color.white);
        cancel.setBackground(Color.BLACK);
        cancel.addActionListener(this); 
        add(cancel); 
 
 
        setVisible(true); 
 
    } 
 
    @Override 
    public void actionPerformed(ActionEvent e) { 
 
        if(e.getSource() ==update) 
        { 
            String empId=empText.getText(); 
            String address=textAddress.getText(); 
            String phone=textPhone.getText(); 
            String email=textEmail.getText(); 
           // String course=textCourse.getText(); 
            String course = (String) courseBox.getSelectedItem(); 
 
           // String branch=textBranch.getText(); 
            String branch = (String) departmentBox.getSelectedItem(); 
 
 
            if (address.isEmpty() || 
                    phone.isEmpty() || email.isEmpty()){ 
            JOptionPane.showMessageDialog(this, "All fields must be filled.");           
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
 
 
 
            try { 
                String q = "update teacher set address = '"+address+"', phone = '"+phone+"', email = '"+email+"', education = '"+course+"', course = '"+branch+"' where emp_Id = '"+empId+"'";
                Connection_Class c=new Connection_Class();               
                c.statement.executeUpdate(q); 
 
                JOptionPane.showMessageDialog(null,"Details Updated");          
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
        new UPdateTeachersDetails(); 
    } 
} 
