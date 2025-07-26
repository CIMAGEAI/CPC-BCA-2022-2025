package university_managment_system;

import com.toedter.calendar.JDateChooser;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UpdateTeacherDetails extends JFrame  implements ActionListener {
    JLabel heading, lablename, lblempid, lbladdress, lblemail, lbl10percent, lbldepartment, lblfathername, lblDOB, lblphone, lbl12percent, lbladhar, lblqualification;
    Choice cEmpId;
    JButton updatebutton, cancelbutton;
    JTextField tfaddress,tfphone,tfemail,tfdepartment,tfqualification;


    UpdateTeacherDetails(){
        // Frame setup
        setSize(900, 700);
        setLocation(350, 50);
        setBackground(Color.WHITE);
        setLayout(null);

        // Main heading
        heading = new JLabel("Update Faculty Details");
        heading.setBounds(310, 10, 500, 50);
        heading.setFont(new Font("Tahoma", Font.ITALIC, 30));
        add(heading);

        JLabel heading= new JLabel("Select Employee ID");
        heading.setBounds(60,100,120,20);
        heading.setFont(new Font("serif",Font.BOLD,15));
        add(heading);

        cEmpId= new Choice();
        cEmpId.setBounds(180,100,150,20);
        add(cEmpId);

        // Labels and Text Fields
        lablename = new JLabel("Name");
        lablename.setBounds(50, 150, 150, 30);
        lablename.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lablename);
        JLabel labelname = new JLabel();
        labelname.setBounds(220, 150, 150, 30);
        labelname.setFont(new Font("Serif",Font.PLAIN,15));

        add(labelname);

        lblempid = new JLabel("Employee ID");
        lblempid.setBounds(450, 150, 150, 30);
        lblempid.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblempid);
        JLabel labelempid = new JLabel();
        labelempid.setBounds(620, 150, 150, 30);
        labelempid.setFont(new Font("Serif",Font.PLAIN,15));
        add(labelempid);

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

        lbldepartment = new JLabel("Department");
        lbldepartment.setBounds(50, 400, 150, 30);
        lbldepartment.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lbldepartment);
        tfdepartment = new JTextField();
        tfdepartment.setBounds(220, 400, 150, 30);
        tfdepartment.setFont(new Font("Serif",Font.PLAIN,15));
        add(tfdepartment);

        lblqualification = new JLabel("Qualification");
        lblqualification.setBounds(450, 400, 150, 30);
        lblqualification.setFont(new Font("Tahoma",Font.BOLD,15));
        add(lblqualification);
        tfqualification = new JTextField();
        tfqualification.setBounds(620, 400, 150, 30);
        tfqualification.setFont(new Font("Serif",Font.PLAIN,15));
        add(tfqualification);

        try{
            Conn con=new Conn();
            ResultSet rs =con.s.executeQuery("select * from teachers ");
            //fetch while data is empty
            while (rs.next()){
                cEmpId.add(rs.getString("empID"));//fetch the data from coloumn name
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        //hitting the database to insert value dynamically by default
        try{
            Conn con=new Conn();
            String query= "select * from teachers where empID='"+cEmpId.getSelectedItem()+"'";
            ResultSet rs=con.s.executeQuery(query);
            while (rs.next()){
                labelname.setText(rs.getString("name"));
                labelfathername.setText(rs.getString("fathername"));
                labelempid.setText(rs.getString("empID"));
                labelDOB.setText(rs.getString("dob"));
                tfaddress.setText(rs.getString("address"));
                tfphone.setText(rs.getString("phone"));
                tfemail.setText(rs.getString("email"));
                labell10percent.setText(rs.getString("class_X"));
                labell12percent.setText(rs.getString("class_XII"));
                labeladhar.setText(rs.getString("adhar"));
                tfdepartment.setText(rs.getString("department"));
                tfqualification.setText(rs.getString("qualification"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        //to track the item selected as per value change
        cEmpId.addItemListener(new ItemListener() {
            @Override
            public void itemStateChanged(ItemEvent ie) {
                //hitting the database to insert value dynamically when empid is selected
                try{
                    Conn con=new Conn();
                    String query= "select * from teachers where empID='"+cEmpId.getSelectedItem()+"'";
                    ResultSet rs=con.s.executeQuery(query);
                    while (rs.next()){
                        labelname.setText(rs.getString("name"));
                        labelfathername.setText(rs.getString("fathername"));
                        labelempid.setText(rs.getString("empID"));
                        labelDOB.setText(rs.getString("dob"));
                        tfaddress.setText(rs.getString("address"));
                        tfphone.setText(rs.getString("phone"));
                        tfemail.setText(rs.getString("email"));
                        labell10percent.setText(rs.getString("class_X"));
                        labell12percent.setText(rs.getString("class_XII"));
                        labeladhar.setText(rs.getString("adhar"));
                        tfdepartment.setText(rs.getString("department"));
                        tfqualification.setText(rs.getString("qualification"));
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
            String empid = cEmpId.getSelectedItem();
            String address= tfaddress.getText();
            String phone =tfphone.getText();
            String email =tfemail.getText();
            String department =tfdepartment.getText();
            String qualification =tfqualification.getText();

            try{
                String query= "update  teachers set address='"+address+"',phone='"+phone+"',email='"+email+"',department='"+department+"',qualification='"+qualification+"' where empid='"+empid+"'";
                Conn con= new Conn();
                con.s.executeUpdate(query);

                JOptionPane.showMessageDialog(null,"Faculty details updated successfully");
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
        new UpdateTeacherDetails();
    }

}
