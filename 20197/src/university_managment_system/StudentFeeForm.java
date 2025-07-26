package university_managment_system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.sql.ResultSet;

public class StudentFeeForm  extends JFrame implements ActionListener {
    JButton updatebutton,paybutton,backbutton;
    Choice cRollno;
    JLabel labeltotalpay;
    JComboBox courseDropdown, branchDropdown , semesterDropdown;


    StudentFeeForm(){
        setSize(700,400);
        setLocation(400,150);
        setLayout(null);

        getContentPane().setBackground(Color.white);

        //adding image to the login screen
        ImageIcon icon = new ImageIcon(ClassLoader.getSystemResource("icons/fee.jpg"));
        Image icon2 = icon.getImage().getScaledInstance(330, 230, Image.SCALE_DEFAULT);
        ImageIcon icon3=new ImageIcon(icon2);//converting the image into an imageicon to display on the label
        JLabel image=new JLabel(icon3);// pasting that image into label and displaying
        image.setBounds(320,20,350,250);
        add(image);

        JLabel lblselectrollno= new JLabel("Select Roll No.");
        lblselectrollno.setBounds(20,20,150,20);
        lblselectrollno.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblselectrollno);
        cRollno= new Choice();
        cRollno.setBounds(170,20,150,20);
        add(cRollno);

        JLabel lblname= new JLabel("Name");
        lblname.setBounds(20,55,150,20);
        lblname.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblname);
        JLabel labelname= new JLabel();
        labelname.setBounds(170,55,150,20);
        labelname.setFont(new Font("Tahoma",Font.BOLD,15));
        add(labelname);

        JLabel lblfather= new JLabel("Father's Name");
        lblfather.setBounds(20,90,150,20);
        lblfather.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblfather);
        JLabel labelfather= new JLabel("Name");
        labelfather.setBounds(170,90,150,20);
        labelfather.setFont(new Font("Tahoma",Font.BOLD,15));
        add(labelfather);

        JLabel lblcourse= new JLabel("Course");
        lblcourse.setBounds(20,125,150,20);
        lblcourse.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblcourse);
        String[] courses = {"BTech", "BSc", "BCom","BCA", "BA", "MTech", "MSc", "MBA","MCA"};
        courseDropdown = new JComboBox(courses);
        courseDropdown.setBounds(170, 125, 150, 20);
        add(courseDropdown);

        JLabel lblbranch= new JLabel("Branch");
        lblbranch.setBounds(20,160,150,20);
        lblbranch.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblbranch);
        String[] branches = {"Computer Science", "Mechanical", "Electrical", "Civil", "Electronics","IT","Other"};
        branchDropdown = new JComboBox(branches);
        branchDropdown.setBounds(170, 160, 150, 20);
        add(branchDropdown);

        JLabel lblsemester= new JLabel("Semester");
        lblsemester.setBounds(20,195,150,20);
        lblsemester.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblsemester);
        String[] semester = {"semester1", "semester2","semester3", "semester4", "semester5","semester6","semester7","semester8"};
        semesterDropdown = new JComboBox(semester);
        semesterDropdown.setBounds(170, 195, 150, 20);
        add(semesterDropdown);

        JLabel lbltotalpay= new JLabel("Total Payable");
        lbltotalpay.setBounds(20,230,150,20);
        lbltotalpay.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lbltotalpay);
        labeltotalpay= new JLabel();
        labeltotalpay.setBounds(170,230,150,20);
        labeltotalpay.setFont(new Font("Tahoma",Font.BOLD,15));
        add(labeltotalpay);

        // Buttons
        updatebutton = new JButton("Update");
        updatebutton.setBounds(20, 290, 80, 20);
        updatebutton.setBackground(Color.black);
        updatebutton.setForeground(Color.black);
        updatebutton.addActionListener(this);
        add(updatebutton);

        paybutton = new JButton("Pay Fee");
        paybutton.setBounds(130, 290, 80, 20);
        paybutton.setBackground(Color.black);
        paybutton.setForeground(Color.black);
        paybutton.addActionListener(this);
        add(paybutton);

        backbutton = new JButton("Back");
        backbutton.setBounds(240, 290, 80, 20);
        backbutton.setBackground(Color.black);
        backbutton.setForeground(Color.black);
        backbutton.addActionListener(this);
        add(backbutton);

        try{
            Conn con=new Conn();
            ResultSet rs =con.s.executeQuery("select * from student ");
            //fetch while data is empty
            while (rs.next()){
                cRollno.add(rs.getString("rollno"));//fetch the data from column name
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        try{
            Conn con=new Conn();
            String query= "select * from student where rollno='"+cRollno.getSelectedItem()+"'";
            ResultSet rs=con.s.executeQuery(query);
            while (rs.next()){
                labelname.setText(rs.getString("name"));
                labelfather.setText(rs.getString("fathername"));

            }
        } catch (Exception e) {
            e.printStackTrace();
        }
//to track the item selected as per value change
        cRollno.addItemListener(new ItemListener() {
            @Override
            public void itemStateChanged(ItemEvent ie) {
                //hitting the database to insert value dynamically when rollno is selected
                try{
                    Conn con=new Conn();
                    String query= "select * from student where rollno='"+cRollno.getSelectedItem()+"'";
                    ResultSet rs=con.s.executeQuery(query);
                    while (rs.next()){
                        labelname.setText(rs.getString("name"));
                        labelfather.setText(rs.getString("fathername"));

                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        setVisible(true);
    }
    public void actionPerformed(ActionEvent ae){
        if (ae.getSource()==updatebutton){
            String course= (String)courseDropdown.getSelectedItem();
            String semester= (String)semesterDropdown.getSelectedItem();
            try{
                Conn con=new Conn();
                ResultSet rs= con.s.executeQuery("select * from fee where course='"+course+"'");
                while (rs.next()){
                    labeltotalpay.setText(rs.getString(semester));
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        } else if (ae.getSource()==paybutton) {
            String rollno=cRollno.getSelectedItem();
            String course= (String)courseDropdown.getSelectedItem();
            String semester= (String)semesterDropdown.getSelectedItem();
            String branch =(String)branchDropdown.getSelectedItem();
            String total=labeltotalpay.getText();
            try{
                Conn con=new Conn();
                String query= "insert into collegefee values ('"+rollno+"','"+course+"','"+branch+"','"+semester+"','"+total+"')";
                con.s.executeUpdate(query);
                JOptionPane.showMessageDialog(null," College Fee paid Successfully!");

            }catch (Exception e){
                e.printStackTrace();
            }
        } else if (ae.getSource()==backbutton) {
            setVisible(false);
        }
    }

    public static void main(String[] args) {
        new StudentFeeForm();
    }
}
