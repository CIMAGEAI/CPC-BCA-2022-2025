package Employee.Management.system;

import com.toedter.calendar.JDateChooser;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Random;

public class AddEmployee extends JFrame implements ActionListener {

    Random ran = new Random();

    int number = ran.nextInt(999999);

    JTextField tname, tfname, taddress, tphone, taadhar, temail,tsalary,tdesignation;

     JDateChooser tdob;

     JLabel tempid;

     JComboBox Boxeducation;

     JButton add, back;

    AddEmployee(){

        getContentPane().setBackground(new Color(163,255,188));

        JLabel heading = new JLabel("Add Employee Detail");
        heading.setBounds(320,30,500,50);
        heading.setFont(new Font("serif",Font.BOLD,25));
        add(heading);

        JLabel name = new JLabel("Name");
        name.setBounds(50,150,150,30);
        name.setFont(new Font("SAN_SERIF",Font.BOLD,25));
        add(name);

        tname = new JTextField();
        tname.setBounds(200,150,150,30);
        tname.setBackground(new Color(177,252,197));
        add(tname);

        JLabel fname = new JLabel(" Father's Name");
        fname.setBounds(400,150,200,30);
        fname.setFont(new Font("SAN_SERIF",Font.BOLD,25));
        add(fname);

        tfname = new JTextField();
        tfname.setBounds(650,150,150,30);
        tfname.setBackground(new Color(177,252,197));
        add(tfname);

        JLabel dob = new JLabel("Date of Birth");
        dob.setBounds(50,200,150,30);
        dob.setFont(new Font("SAN_SERIF",Font.BOLD,25));
        add(dob);

        tdob = new JDateChooser();
        tdob.setBounds(200,200,150,30);
        tdob.setBackground(new Color(177,252,197));
        add(tdob);

        JLabel salary = new JLabel("Salary");
        salary.setBounds(400,200,150,30);
        salary.setFont(new Font("SAN_SERIF",Font.BOLD,25));
        add(salary);

        tsalary = new JTextField();
        tsalary.setBounds(650,200,150,30);
        tsalary.setBackground(new Color(177,252,197));
        add(tsalary);

        JLabel address = new JLabel("Address");
        address.setBounds(50,250,150,30);
        address.setFont(new Font("SAN_SERIF",Font.BOLD,25));
        add(address);

        taddress = new JTextField();
        taddress.setBounds(200,250,150,30);
        taddress.setBackground(new Color(177,252,197));
        add(taddress);

        JLabel aadhar = new JLabel("Adhar Number");
        aadhar.setBounds(400,250,200,30);
        aadhar.setFont(new Font("SAN_SERIF",Font.BOLD,25));
        add(aadhar);

        taadhar = new JTextField();
        taadhar.setBounds(650,250,150,30);
        taadhar.setBackground(new Color(177,252,197));
        add(taadhar);

        JLabel phone = new JLabel("Phone No.");
        phone.setBounds(50,300,150,30);
        phone.setFont(new Font("SAN_SERIF",Font.BOLD,25));
        add(phone);

        tphone = new JTextField();
        tphone.setBounds(200,300,150,30);
        tphone.setBackground(new Color(177,252,197));
        add(tphone);

        JLabel email = new JLabel("Email Id");
        email.setBounds(400,300,150,30);
        email.setFont(new Font("SAN_SERIF",Font.BOLD,25));
        add(email);

        temail = new JTextField();
        temail.setBounds(650,300,150,30);
        temail.setBackground(new Color(177,252,197));
        add(temail);

        JLabel designation = new JLabel("Designation");
        designation.setBounds(50,350,150,30);
        designation.setFont(new Font("SAN_SERIF",Font.BOLD,25));
        add(designation);

        tdesignation = new JTextField();
        tdesignation.setBounds(200,350,150,30);
        tdesignation.setBackground(new Color(177,252,197));
        add(tdesignation);

        JLabel education = new JLabel("Higest Education");
        education.setBounds(400,350,250,30);
        education.setFont(new Font("SAN_SERIF",Font.BOLD,25));
        add(education);

        String items[] = {"BBA", "BCA", "B.Tech", "BA", "BSC", "B.COM", "MBA", "MCA", "MA", "M.Tech", "MSC", "PHD"};
        Boxeducation = new JComboBox(items);
        Boxeducation.setBounds(650,350,150,30);
        Boxeducation.setBackground(new Color(177,252,197));
        add(Boxeducation);

        JLabel empid = new JLabel("Employee ID");
        empid.setBounds(50,400,150,30);
        empid.setFont(new Font("SAN_SERIF",Font.BOLD,22));
        add(empid);

        tempid = new JLabel(""+number);
        tempid.setBounds(200,400,150,30);
        tempid.setFont(new Font("SAN_SARIF",Font.BOLD,20));
        tempid.setForeground(Color.RED);
        add(tempid);

        add = new JButton("Add");
        add.setBounds(450,550,150,30);
        add.setForeground(Color.WHITE);
        add.setBackground(Color.BLACK);
        add.addActionListener(this);
        add(add);

        back = new JButton("Back");
        back.setBounds(250,550,150,30);
        back.setForeground(Color.WHITE);
        back.setBackground(Color.BLACK);
        back.addActionListener(this);
        add(back);




        setSize(900,700);
        setLayout(null);
        setLocation(300,50);
        setVisible(true);

    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if(e.getSource() == add){
            String name = tname.getText();
            String fname = tfname.getText();
            String dob = ((JTextField) tdob.getDateEditor().getUiComponent()).getText();
            String salary = tsalary.getText();
            String address = taddress.getText();
            String aadhar = taadhar.getText();
            String phone = tphone.getText();
            String email = temail.getText();
            String education = (String) Boxeducation.getSelectedItem();
            String designation = tdesignation.getText();
            String empid = tempid.getText();

            try{
                conn c = new conn();
                String query = "insert into employee values('"+name+"', '"+fname+"', '"+dob+"', '"+salary+"', '"+address+"', '"+aadhar+"', '"+phone+"', '"+email+"', '"+education+"', '"+designation+"', '"+empid+"')";
                c.statement.executeUpdate(query);
                JOptionPane.showMessageDialog(null,"Details added successfuly");
                setVisible(false);
                new Main_class();

            }catch (Exception E){
                E.printStackTrace();
            }
        }else {
            setVisible(false);
            new Main_class();
        }
    }

    public static void main(String[] args) {
        new AddEmployee();
    }
}
