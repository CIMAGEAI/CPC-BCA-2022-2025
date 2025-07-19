package bankmanagement;
import com.toedter.calendar.JDateChooser;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Random;

public class Signup extends JFrame implements ActionListener {
    JRadioButton r1,r2,m1,m2,m3;
    JButton next;

    JTextField textName ,textFname, textEmail,textAdd,textcity,textState,textPin;
    JDateChooser dateChooser;
    Random ran = new Random();
    long first4 =(ran.nextLong() % 9000L) +1000L;
    String first = " " + Math.abs(first4);
    Signup(){
        super ("APPLICATION FORM");

        ImageIcon img1 = new ImageIcon(ClassLoader.getSystemResource("icon/signup1.jpg"));
        Image img2 = img1.getImage().getScaledInstance(850, 800, Image.SCALE_DEFAULT);
        ImageIcon img3 = new ImageIcon(img2);
        JLabel img = new JLabel(img3);
        setContentPane(img);
        img.setLayout(null);

        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icon/B.png"));
        Image i2 = i1.getImage().getScaledInstance(50,50,Image.SCALE_DEFAULT);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel image = new JLabel(i3);
        image.setBounds(25,10,100,100);
        img.add(image);

        JLabel l1 = new JLabel("APPLICATION FORM NO."+ first);
        l1.setForeground(Color.WHITE);
        l1.setBounds(160,20,600,40);
        l1.setFont(new Font("Raleway",Font.BOLD,38));
        img.add(l1);

        JLabel l2 = new JLabel("Page 1");
        l2.setForeground(Color.WHITE);
        l2.setFont(new Font("Ralway",Font.BOLD, 22));
        l2.setBounds(330,70,600,30);
        img.add(l2);

        JLabel l3 = new JLabel("Personal Details");
        l3.setForeground(Color.WHITE);
        l3.setFont(new Font("Raleway", Font.BOLD,22));
        l3.setBounds(290,90,600,30);
        img.add(l3);

        JLabel Name = new JLabel("Name :");
        Name.setForeground(Color.WHITE);
        Name.setFont(new Font("Raleway", Font.BOLD, 20));
        Name.setBounds(100,190,100,30);
        img.add(Name);

        textName = new JTextField();
        textName.setFont(new Font("Raleway",Font.BOLD, 18));
        textName.setForeground(Color.WHITE);
        textName.setOpaque(false);
        textName.setBounds(300,190,400,30);
        img.add(textName);

        JLabel labelfName = new JLabel("Father's Name :");
        labelfName.setForeground(Color.WHITE);
        labelfName.setFont(new Font("Raleway", Font.BOLD, 20));
        labelfName.setBounds(100,240,200,30);
        img.add(labelfName);

        textFname = new JTextField();
        textFname.setFont(new Font("Raleway",Font.BOLD, 18));
        textFname.setForeground(Color.WHITE);
        textFname.setOpaque(false);
        textFname.setBounds(300,240,400,30);
        img.add(textFname);

        JLabel DOB= new JLabel("Date of Birth");
        DOB.setForeground(Color.WHITE);
        DOB.setFont(new Font("Raleway", Font.BOLD, 20));
        DOB.setBounds(100,340,200,30);
        img.add(DOB);

        dateChooser = new JDateChooser();
        dateChooser.setForeground(new Color(105,105,105));
        dateChooser.setBounds(300,340,400,30);
        img.add(dateChooser);

        JLabel labelG = new JLabel("Gender");
        labelG.setForeground(Color.WHITE);
        labelG.setFont(new Font("Raleway", Font.BOLD, 20));
        labelG.setBounds(100,290,200,30);
        img.add(labelG);

        r1 = new JRadioButton("Male");
        r1.setFont(new Font("Raleway", Font.BOLD,16));
        r1.setForeground(Color.WHITE);
        r1.setOpaque(false);
        r1.setBounds(300,290,60,30);
        img.add(r1);

        r2 = new JRadioButton("Female");
        r2.setForeground(Color.WHITE);
        r2.setOpaque(false);
        r2.setFont(new Font("Raleway", Font.BOLD,16));
        r2.setBounds(450,290,90,30);
        img.add(r2);

        ButtonGroup buttonGroup = new ButtonGroup();
        buttonGroup.add(r1);
        buttonGroup.add(r2);

        JLabel labelEmail = new JLabel("Email address :");
        labelEmail.setForeground(Color.WHITE);
        labelEmail.setFont(new Font("Raleway", Font.BOLD, 20));
        labelEmail.setBounds(100,390,200,30);
        img.add(labelEmail);

        textEmail = new JTextField();
        textEmail.setFont(new Font("Raleway",Font.BOLD, 18));
        textEmail.setForeground(Color.WHITE);
        textEmail.setOpaque(false);
        textEmail.setBounds(300,390,400,30);
        img.add(textEmail);


        JLabel labelMs = new JLabel("Marital Status :");
        labelMs.setForeground(Color.WHITE);
        labelMs.setFont(new Font("Raleway", Font.BOLD, 20));
        labelMs.setBounds(100,440,200,30);
        img.add(labelMs);

        m1 = new JRadioButton("Married");
        m1.setBounds(300,440,100,30);
        m1.setForeground(Color.WHITE);
        m1.setOpaque(false);
        m1.setFont(new Font("Raleway", Font.BOLD,16));
        img.add(m1);

        m2 = new JRadioButton("Unmarried");
        m2.setForeground(Color.WHITE);
        m2.setOpaque(false);
        m2.setBounds(450,440,150,30);
        m2.setFont(new Font("Raleway", Font.BOLD,16));
        img.add(m2);

        m3 = new JRadioButton("Other");
        m3.setForeground(Color.WHITE);
        m3.setOpaque(false);
        m3.setBounds(635,440,100,30);
        m3.setFont(new Font("Raleway", Font.BOLD,16));
        img.add(m3);

        ButtonGroup buttonGroup1 = new ButtonGroup();
        buttonGroup1.add(m1);
        buttonGroup1.add(m2);
        buttonGroup1.add(m3);

        JLabel labelAdd = new JLabel("Address :");
        labelAdd.setForeground(Color.WHITE);
        labelAdd.setFont(new Font("Raleway", Font.BOLD, 20));
        labelAdd.setBounds(100,490,200,30);
        img.add(labelAdd);

        textAdd = new JTextField();
        textAdd.setFont(new Font("Raleway",Font.BOLD, 18));
        textAdd.setForeground(Color.WHITE);
        textAdd.setOpaque(false);
        textAdd.setBounds(300,490,400,30);
        img.add(textAdd);

        JLabel labelCity = new JLabel("City :");
        labelCity.setForeground(Color.WHITE);
        labelCity.setFont(new Font("Raleway", Font.BOLD, 20));
        labelCity.setBounds(100,540,200,30);
        img.add(labelCity);

        textcity = new JTextField();
        textcity.setFont(new Font("Raleway",Font.BOLD, 18));
        textcity.setForeground(Color.WHITE);
        textcity.setOpaque(false);
        textcity.setBounds(300,540,400,30);
        img.add(textcity);

        JLabel labelPin = new JLabel("Pin Code :");
        labelPin.setForeground(Color.WHITE);
        labelPin.setFont(new Font("Raleway", Font.BOLD, 20));
        labelPin.setBounds(100,590,200,30);
        img.add(labelPin);

        textPin = new JTextField();
        textPin.setFont(new Font("Raleway",Font.BOLD, 18));
        textPin.setForeground(Color.WHITE);
        textPin.setOpaque(false);
        textPin.setBounds(300,590,400,30);
        img.add(textPin);

        JLabel labelstate = new JLabel("State :");
        labelstate.setForeground(Color.WHITE);
        labelstate.setFont(new Font("Raleway", Font.BOLD, 20));
        labelstate.setBounds(100,640,200,30);
        img.add( labelstate);

        textState = new JTextField();
        textState.setFont(new Font("Raleway",Font.BOLD, 18));
        textState.setForeground(Color.WHITE);
        textState.setOpaque(false);
        textState.setBounds(300,640,400,30);
        img.add(textState);

        next = new JButton("Next");
        next.setFont(new Font("Raleway",Font.BOLD, 14));
        next.setBackground(Color.BLACK);
        next.setForeground(Color.WHITE);
        next.setBounds(620,710,80,30);
        next.addActionListener(this);
        img.add(next);

        getContentPane().setBackground(new Color(222,255,228));
        setLayout(null);
        setSize(850,800);
        setLocation(360,40);
        setVisible(true);

    }

    @Override
    public void actionPerformed(ActionEvent e) {

        String formno = first;
        String name = textName.getText();
        String fname = textFname.getText();
        String dob = ((JTextField) dateChooser.getDateEditor().getUiComponent()).getText();
        String gender = null;
        if(r1.isSelected()){
            gender = "Male";
        }else if (r2.isSelected()){
            gender = "Female";
        }
        String email = textEmail.getText();
        String marital =null;
        if (m1.isSelected()){
            marital = "Married";
        } else if (m2.isSelected()) {
            marital = "Unmarried";
        } else if (m3.isSelected()) {
            marital = "Other";
        }

        String address = textAdd.getText();
        String city = textcity.getText();
        String pincode = textPin.getText();
        String state = textState.getText();


        try{
            if (textName.getText().equals("")){
                JOptionPane.showMessageDialog(null, "Fill all the fields");
            }else {
                Connn c = new Connn();
                String q = "insert into signup values('"+formno+"', '"+name+"','"+fname+"','"+ dob +"','"+gender+"','"+email+"','"+marital+"', '"+address+"', '"+city+"','"+pincode+"','"+state+"' )";
                c.statement.executeUpdate(q);
                new Signup2(formno);
                setVisible(false);
            }

        }catch (Exception E){
            E.printStackTrace();
        }

    }

    public static void main(String[] args) {
        new Signup();
    }
}
