package university_managment_system;

import com.toedter.calendar.JDateChooser;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UpdateStudentDetails extends JFrame  implements ActionListener {
    JLabel heading, lablename, lblrollno, lbladdress, lblemail, lbl10percent, lblcourse, lblfathername, lblDOB, lblphone, lbl12percent, lbladhar, lblbranch;
    Choice cRollNo;
    JButton updatebutton, cancelbutton;
    JTextField tfaddress,tfphone,tfemail,tfcourse,tfbranch;


    UpdateStudentDetails(){
        // Frame setup
        setSize(900, 700);
        setLocation(350, 50);
        setBackground(Color.WHITE);
        setLayout(null);

        // Main heading
        heading = new JLabel("Update Student Details");
        heading.setBounds(310, 10, 500, 50);
        heading.setFont(new Font("Tahoma", Font.ITALIC, 30));
        add(heading);

        JLabel lblrollno= new JLabel("Select Roll No");
        lblrollno.setBounds(60,100,120,20);
        lblrollno.setFont(new Font("serif",Font.BOLD,15));
        add(lblrollno);

        cRollNo= new Choice();
        cRollNo.setBounds(180,100,150,20);
        add(cRollNo);

        // Labels and Text Fields
        lablename = new JLabel("Name");
        lablename.setBounds(50, 150, 150, 30);
        lablename.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lablename);
        JLabel labelname = new JLabel();
        labelname.setBounds(220, 150, 150, 30);
        labelname.setFont(new Font("Serif",Font.PLAIN,15));

        add(labelname);

        lblrollno = new JLabel("Roll Number");
        lblrollno.setBounds(450, 150, 150, 30);
        lblrollno.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblrollno);
        JLabel labelrollno = new JLabel();
        labelrollno.setBounds(620, 150, 150, 30);
        labelrollno.setFont(new Font("Serif",Font.PLAIN,15));
        add(labelrollno);

        lblfathername = new JLabel("Father's Name");
        lblfathername.setBounds(50, 200, 150, 30);
        lblfathername.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblfathername);
        JLabel labelfathername = new JLabel();
        labelfathername.setBounds(220, 200, 150, 30);
        labelfathername.setFont(new Font("Serif",Font.PLAIN,15));
        add(labelfathername);

        lblDOB = new JLabel("Date of Birth");
        lblDOB.setBounds(450, 200, 150, 30);
        lblDOB.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblDOB);
        JLabel labelDOB = new JLabel();
        labelDOB.setBounds(620, 200, 150, 30);
        labelDOB.setFont(new Font("Serif",Font.PLAIN,15));
        add(labelDOB);

        lbladdress = new JLabel("Address");
        lbladdress.setBounds(50, 250, 150, 30);
        lbladdress.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lbladdress);
        tfaddress = new JTextField();
        tfaddress.setBounds(220, 250, 150, 30);
        tfaddress.setFont(new Font("Serif",Font.PLAIN,15));
        add(tfaddress);

        lblemail = new JLabel("Email");
        lblemail.setBounds(450, 250, 150, 30);
        lblemail.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblemail);
        tfemail = new JTextField();
        tfemail.setBounds(620, 250, 150, 30);
        tfemail.setFont(new Font("Serif",Font.PLAIN,15));
        add(tfemail);

        lblphone = new JLabel("Phone Number");
        lblphone.setBounds(50, 300, 150, 30);
        lblphone.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblphone);
        tfphone = new JTextField();
        tfphone.setBounds(220, 300, 150, 30);
        tfphone.setFont(new Font("Serif",Font.PLAIN,15));
        add(tfphone);

        lbladhar = new JLabel("Aadhar Number");
        lbladhar.setBounds(450, 300, 150, 30);
        lbladhar.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lbladhar);
        JLabel labeladhar = new JLabel();
        labeladhar.setBounds(620, 300, 150, 30);
        labeladhar.setFont(new Font("Serif",Font.PLAIN,15));
        add(labeladhar);

        lbl10percent = new JLabel("Class X(%)");
        lbl10percent.setBounds(50, 350, 150, 30);
        lbl10percent.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lbl10percent);
        JLabel labell10percent = new JLabel();
        labell10percent.setBounds(220, 350, 150, 30);
        labell10percent.setFont(new Font("Serif",Font.PLAIN,15));

        add(labell10percent);

        lbl12percent = new JLabel("Class XII(%)");
        lbl12percent.setBounds(450, 350, 150, 30);
        lbl12percent.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lbl12percent);
        JLabel labell12percent = new JLabel();
        labell12percent.setBounds(620, 350, 150,30);
        labell12percent.setFont(new Font("Serif",Font.PLAIN,15));
        add(labell12percent);

        lblcourse = new JLabel("Course");
        lblcourse.setBounds(50, 400, 150, 30);
        lblcourse.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblcourse);
        tfcourse = new JTextField();
        tfcourse.setBounds(220, 400, 150, 30);
        tfcourse.setFont(new Font("Serif",Font.PLAIN,15));
        add(tfcourse);

        lblbranch = new JLabel("Branch");
        lblbranch.setBounds(450, 400, 150, 30);
        lblbranch.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblbranch);
        tfbranch = new JTextField();
        tfbranch.setBounds(620, 400, 150, 30);
        tfbranch.setFont(new Font("Serif",Font.PLAIN,15));
        add(tfbranch);

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

        //hitting the database to insert value dynamically by default
        try{
            Conn con=new Conn();
            String query= "select * from student where rollno='"+cRollNo.getSelectedItem()+"'";
            ResultSet rs=con.s.executeQuery(query);
            while (rs.next()){
                labelname.setText(rs.getString("name"));
                labelfathername.setText(rs.getString("fathername"));
                labelrollno.setText(rs.getString("rollno"));
                labelDOB.setText(rs.getString("dob"));
                tfaddress.setText(rs.getString("address"));
                tfphone.setText(rs.getString("phone"));
                tfemail.setText(rs.getString("email"));
                labell10percent.setText(rs.getString("class_X"));
                labell12percent.setText(rs.getString("class_XII"));
                labeladhar.setText(rs.getString("adhar"));
                tfcourse.setText(rs.getString("course"));
                tfbranch.setText(rs.getString("branch"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        //to track the item selected as per value change
        cRollNo.addItemListener(new ItemListener() {
            @Override
            public void itemStateChanged(ItemEvent ie) {
                //hitting the database to insert value dynamically when rollno is selected
                try{
                    Conn con=new Conn();
                    String query= "select * from student where rollno='"+cRollNo.getSelectedItem()+"'";
                    ResultSet rs=con.s.executeQuery(query);
                    while (rs.next()){
                        labelname.setText(rs.getString("name"));
                        labelfathername.setText(rs.getString("fathername"));
                        labelrollno.setText(rs.getString("rollno"));
                        labelDOB.setText(rs.getString("dob"));
                        tfaddress.setText(rs.getString("address"));
                        tfphone.setText(rs.getString("phone"));
                        tfemail.setText(rs.getString("email"));
                        labell10percent.setText(rs.getString("class_X"));
                        labell12percent.setText(rs.getString("class_XII"));
                        labeladhar.setText(rs.getString("adhar"));
                        tfcourse.setText(rs.getString("course"));
                        tfbranch.setText(rs.getString("branch"));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        // Buttons
        updatebutton = new JButton("Update");
        updatebutton.setBounds(250, 500, 150, 30);
        updatebutton.setBackground(Color.black);
        updatebutton.setForeground(Color.black);
        updatebutton.addActionListener(this);
        updatebutton.setFont(new Font("Tahoma",Font.BOLD,15));
        add(updatebutton);

        cancelbutton = new JButton("Cancel");
        cancelbutton.setBounds(500, 500, 150, 30);
        cancelbutton.setBackground(Color.black);
        cancelbutton.setForeground(Color.black);
        cancelbutton.addActionListener(this);
        cancelbutton.setFont(new Font("Tahoma",Font.BOLD,15));
        add(cancelbutton);


        // Frame visibility
        setVisible(true);
    }
    public void actionPerformed(ActionEvent ae){
        if(ae.getSource() == updatebutton){
            String rollno = cRollNo.getSelectedItem();
            String address= tfaddress.getText();
            String phone =tfphone.getText();
            String email =tfemail.getText();
            String course =tfcourse.getText();
            String branch =tfbranch.getText();

            try{
                String query= "update  student set address='"+address+"',phone='"+phone+"',email='"+email+"',course='"+course+"',branch='"+branch+"' where rollno='"+rollno+"'";
                Conn con= new Conn();
                con.s.executeUpdate(query);

                JOptionPane.showMessageDialog(null,"student details updated successfully");
                setVisible(false);

            }catch (SQLException e){
                e.printStackTrace();
            }
        }
        else if(ae.getSource() == cancelbutton){
            setVisible(false);
        }

    }

    public static void main(String[] args) {
        new UpdateStudentDetails();
    }

}
