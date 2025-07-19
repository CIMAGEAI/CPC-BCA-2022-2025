package college_project;



import com.toedter.calendar.JDateChooser;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.*;
import javax.swing.*;
import javax.swing.*;
import java.awt.*;
//import java.awt.Event;

public class Splash_1 extends JFrame implements ActionListener {
    
    long random;
    JTextField textName ,textFname , emailTextField ,addressTextField , 
            cityTextField , stateTextField ,pinTextField;
    JRadioButton male,female,married,unmarried,other;
    JDateChooser datechooser;
    
    //long f3 =Math.abs((ran.nextLong() % 9000L) +1000L);
    //String str = " " + f3;
    
    
    Splash_1() {
        
        
        //setTitle("APPLICATION FORM NO.");
        setLayout(null);
        
        Random ran = new Random();
    random = Math.abs(ran.nextLong() % 9000L + 1000L);
        
//        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icons/fifth.jpg"));
//        Image i2 = i1.getImage().getScaledInstance(100, 100,Image.SCALE_DEFAULT);
//        ImageIcon i3 = new ImageIcon(i2);
//        JLabel image = new JLabel(i3);
    
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icons/aryabhata.jpg"));
        Image i2 = i1.getImage().getScaledInstance(1000,700 ,Image.SCALE_DEFAULT);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel image = new JLabel(i3);
        add(image);
        image.setBounds(25,10,100,100);
        add(image);
        
        JLabel formno = new JLabel("APPLICTIOON FORM NO."+ random);
        formno.setBounds(160,20,600,40);
        formno.setFont(new Font("Raleway",Font.BOLD,38));
        add(formno);
        
        /*JLabel label2 = new JLabel("Page 1");
        label2.setFont(new Font("Ralway",Font.BOLD,22));
        label2.setBounds(330,60,600,30);
        add(label2);*/
        
        JLabel label3 = new JLabel(" Page 1: Personal Details");
        label3.setFont(new Font("Ralway",Font.BOLD,30));
        label3.setBounds(290,80,500,40);
        add(label3);
        
        JLabel labelName = new JLabel("Name :");
        labelName.setFont(new Font("Ralway",Font.BOLD,20));
        labelName.setBounds(100,140,100,30);
        add(labelName);
        
        textName = new JTextField();
        textName.setFont(new Font("Ralway",Font.BOLD,14));
        textName.setBounds(300,140,400,30);
        add(textName);
        
        JLabel labelFname = new JLabel("Father's Name :");
        labelFname.setFont(new Font("Ralway",Font.BOLD,20));
        labelFname.setBounds(100,190,200,30);
        add(labelFname);
        
        textFname = new JTextField();
        textFname.setFont(new Font("Ralway",Font.BOLD,14));
        textFname.setBounds(300,190,400,30);
        add(textFname);
        
        JLabel DOB = new JLabel("Date of Birth :");
        DOB.setFont(new Font("Ralway",Font.BOLD,20));
        DOB.setBounds(100,240,200,30);
        add(DOB);
        
        datechooser = new JDateChooser();
        datechooser.setBounds(300,240,400,30);
        datechooser.setForeground(new Color(105,105,105));
        add(datechooser);
        
        
        JLabel gender = new JLabel("Gender :");
        gender.setFont(new Font("Ralway",Font.BOLD,20));
        gender.setBounds(100,290,200,30);
        add(gender);
        
        male = new JRadioButton("Male");
        male.setBackground(new Color(222,255,228));
        male.setBounds(300,290,60,30);
        add(male);
        
        female = new JRadioButton("FeMale");
        female.setBackground(new Color(222,255,228));
        female.setBounds(450,290,120,30);
        add(female);
        
        ButtonGroup gendergroup =new  ButtonGroup();
        gendergroup.add(male);
        gendergroup.add(female);
        
        JLabel email = new JLabel("Email Address:");
        email.setFont(new Font("Ralway",Font.BOLD,20));
        email.setBounds(100,340,200,30);
        add(email);
        
        emailTextField = new JTextField();
        emailTextField.setFont(new Font("Ralway",Font.BOLD,14));
        emailTextField.setBounds(300,340,400,30);
        add(emailTextField);
        
        JLabel marital = new JLabel("Marital Status:");
        marital.setFont(new Font("Ralway",Font.BOLD,20));
        marital.setBounds(100,390,200,30);
        add(marital);
        
        married = new JRadioButton("Married");
        married.setBackground(new Color(222,255,228));
        married.setBounds(300,390,100,30);
        add(married);
        
        unmarried = new JRadioButton("Unmarried");
        unmarried.setBackground(new Color(222,255,228));
        unmarried.setBounds(450,390,100,30);
        add(unmarried);
        
        other = new JRadioButton("Other");
        other.setBackground(new Color(222,255,228));
        other.setBounds(630,390,100,30);
        add(other);
        
        ButtonGroup maritalgroup =new  ButtonGroup();
        maritalgroup.add(married);
        maritalgroup.add(unmarried);
        maritalgroup.add(other);
        
        
        JLabel address = new JLabel("Address:");
        address.setFont(new Font("Ralway",Font.BOLD,20));
        address.setBounds(100,440,200,30);
        add(address);
        
        addressTextField  = new JTextField();
        addressTextField .setFont(new Font("Ralway",Font.BOLD,14));
        addressTextField .setBounds(300,440,400,30);
        add(addressTextField );
        
        JLabel city= new JLabel("City:");
        city.setFont(new Font("Ralway",Font.BOLD,20));
        city.setBounds(100,490,200,30);
        add(city);
        
        cityTextField = new JTextField();
        cityTextField.setFont(new Font("Ralway",Font.BOLD,14));
        cityTextField.setBounds(300,490,400,30);
        add(cityTextField);
        
        
        JLabel state= new JLabel("State:");
        state.setFont(new Font("Ralway",Font.BOLD,20));
        state.setBounds(100,540,200,30);
        add(state);
        
        stateTextField = new JTextField();
        stateTextField.setFont(new Font("Ralway",Font.BOLD,14));
        stateTextField.setBounds(300,540,400,30);
        add(stateTextField);
        
        JLabel pincode= new JLabel("Pincode:");
        pincode.setFont(new Font("Ralway",Font.BOLD,20));
        pincode.setBounds(100,590,200,30);
        add(pincode);
        
        pinTextField = new JTextField();
        pinTextField.setFont(new Font("Ralway",Font.BOLD,14));
        pinTextField.setBounds(300,590,400,30);
        add(pinTextField);
        
        
        JButton next = new JButton("Next");
        next.setBackground(Color.BLACK);
        next.setForeground(new Color(222,255,228));
        next.setFont(new Font("Raleway",Font.BOLD,14));
        next.setBounds(620,660,80,30);
        next.addActionListener(this);
        add(next);
              
        
        
        getContentPane().setBackground(new Color(222,255,228));
        setLayout(null);
        setSize(850,800);
        setLocation(360,40);
        setVisible(true);
    }
    public static void main(String [] args){
        new Splash_1();
    }
    
    public void actionPerformed(ActionEvent ae){
        //if(e.getSource())==next()
        
        //String formno = "" +random; //long
        String formno = String.valueOf(random);
        String Name = textName.getText();
        String fname = textFname.getText();
        String dob =((JTextField) datechooser.getDateEditor().getUiComponent()).getText();
        String gender = null;
        if(male.isSelected()){
            gender = "Male";
        }else if (female.isSelected()){
            gender = "Female";
            
        }
        
        String email = emailTextField.getText();
        String marital = null;
        if(married.isSelected()){
            marital = "Married";
        } else if (unmarried.isSelected()){
            marital = "Unmarried";
        } else if (other.isSelected()){
            marital = "Other";
        }
        
        String address = addressTextField.getText();
        String city = cityTextField.getText();
        String state = stateTextField.getText();
        String pin = pinTextField.getText();
        
        
        try {
            if (textName.getText().trim().equals("")){
                JOptionPane.showMessageDialog(null, "Name is Required");
            }
            else {
                System.out.println("Form Submitted Sucessfully");
            }
            
        }catch (Exception e){
            System.out.println(e);
        }
    }

    
}
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.