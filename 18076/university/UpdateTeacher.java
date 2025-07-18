package university;

import com.toedter.calendar.JDateChooser;
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class UpdateTeacher extends JFrame implements ActionListener {

    JTextField textAddress, textPhone, textemail, textAadhar, textcourse, textbranch;
    JLabel empText;
    JButton submit, cancel;
    Choice cEMPID;
    JLabel textName, textfather, dobdob, textM10, textM12;

    UpdateTeacher() {
        getContentPane().setBackground(new Color(230, 210, 252));
        setLayout(null);

        JLabel heading = new JLabel("Update Teacher Details");
        heading.setBounds(50, 10, 500, 50);
        heading.setFont(new Font("serif", Font.BOLD, 35));
        add(heading);

        JLabel empID = new JLabel("Select Employee ID");
        empID.setBounds(50, 100, 200, 20);
        empID.setFont(new Font("serif", Font.PLAIN, 20));
        add(empID);

        cEMPID = new Choice();
        cEMPID.setBounds(250, 100, 200, 20);
        add(cEMPID);

        try {
            Conn c = new Conn();
            ResultSet rs = c.statement.executeQuery("select * from teacher");
            while (rs.next()) {
                cEMPID.add(rs.getString("empId"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        JLabel name = new JLabel("Name");
        name.setBounds(50, 150, 100, 30);
        name.setFont(new Font("serif", Font.BOLD, 20));
        add(name);

        textName = new JLabel();
        textName.setBounds(200, 150, 150, 30);
        add(textName);

        JLabel fname = new JLabel("Father Name");
        fname.setBounds(400, 150, 200, 30);
        fname.setFont(new Font("serif", Font.BOLD, 20));
        add(fname);

        textfather = new JLabel();
        textfather.setBounds(600, 150, 150, 30);
        add(textfather);

        JLabel EMPIDD = new JLabel("Employee ID");
        EMPIDD.setBounds(50, 200, 200, 30);
        EMPIDD.setFont(new Font("serif", Font.BOLD, 20));
        add(EMPIDD);

        empText = new JLabel();
        empText.setBounds(200, 200, 150, 30);
        empText.setFont(new Font("serif", Font.BOLD, 20));
        add(empText);

        JLabel dob = new JLabel("Date of Birth");
        dob.setBounds(400, 200, 200, 30);
        dob.setFont(new Font("serif", Font.BOLD, 20));
        add(dob);

        dobdob = new JLabel();
        dobdob.setBounds(600, 200, 150, 30);
        add(dobdob);

        JLabel address = new JLabel("Address");
        address.setBounds(50, 250, 200, 30);
        address.setFont(new Font("serif", Font.BOLD, 20));
        add(address);

        textAddress = new JTextField();
        textAddress.setBounds(200, 250, 150, 30);
        add(textAddress);

        JLabel phone = new JLabel("Phone");
        phone.setBounds(400, 250, 200, 30);
        phone.setFont(new Font("serif", Font.BOLD, 20));
        add(phone);

        textPhone = new JTextField();
        textPhone.setBounds(600, 250, 150, 30);
        add(textPhone);

        JLabel email = new JLabel("Email");
        email.setBounds(50, 300, 200, 30);
        email.setFont(new Font("serif", Font.BOLD, 20));
        add(email);

        textemail = new JTextField();
        textemail.setBounds(200, 300, 150, 30);
        add(textemail);

        JLabel M10 = new JLabel("Class X (%)");
        M10.setBounds(400, 300, 200, 30);
        M10.setFont(new Font("serif", Font.BOLD, 20));
        add(M10);

        textM10 = new JLabel();
        textM10.setBounds(600, 300, 150, 30);
        add(textM10);

        JLabel M12 = new JLabel("Class XII (%)");
        M12.setBounds(50, 350, 200, 30);
        M12.setFont(new Font("serif", Font.BOLD, 20));
        add(M12);

        textM12 = new JLabel();
        textM12.setBounds(200, 350, 150, 30);
        add(textM12);

        JLabel AadharNo = new JLabel("Aadhar Number");
        AadharNo.setBounds(400, 350, 200, 30);
        AadharNo.setFont(new Font("serif", Font.BOLD, 20));
        add(AadharNo);

        textAadhar = new JTextField();
        textAadhar.setBounds(600, 350, 150, 30);
        add(textAadhar);

        JLabel Qualification = new JLabel("Qualification");
        Qualification.setBounds(50, 400, 200, 30);
        Qualification.setFont(new Font("serif", Font.BOLD, 20));
        add(Qualification);

        textcourse = new JTextField();
        textcourse.setBounds(200, 400, 150, 30);
        add(textcourse);

        JLabel Department = new JLabel("Department");
        Department.setBounds(400, 400, 200, 30);
        Department.setFont(new Font("serif", Font.BOLD, 20));
        add(Department);

        textbranch = new JTextField();
        textbranch.setBounds(600, 400, 150, 30);
        add(textbranch);

        loadTeacherDetails();

        cEMPID.addItemListener(new ItemListener() {
            public void itemStateChanged(ItemEvent e) {
                loadTeacherDetails();
            }
        });

        submit = new JButton("Update");
        submit.setBounds(250, 550, 120, 30);
        submit.setBackground(Color.BLACK);
        submit.setForeground(Color.WHITE);
        submit.addActionListener(this);
        add(submit);

        cancel = new JButton("Cancel");
        cancel.setBounds(450, 550, 120, 30);
        cancel.setBackground(Color.BLACK);
        cancel.setForeground(Color.WHITE);
        cancel.addActionListener(this);
        add(cancel);

        setSize(900, 700);
        setLocation(350, 50);
        setVisible(true);
    }

    private void loadTeacherDetails() {
        try {
            Conn c = new Conn();
            String query = "select * from teacher where empId = '" + cEMPID.getSelectedItem() + "'";
            ResultSet rs = c.statement.executeQuery(query);
            while (rs.next()) {
                textName.setText(rs.getString("name"));
                textfather.setText(rs.getString("fname"));
                dobdob.setText(rs.getString("dob"));
                textAddress.setText(rs.getString("address"));
                textPhone.setText(rs.getString("phone"));
                textemail.setText(rs.getString("email"));
                textM10.setText(rs.getString("class_x"));
                textM12.setText(rs.getString("class_xii"));
                textAadhar.setText(rs.getString("aadhar"));
                empText.setText(rs.getString("empId"));
                textcourse.setText(rs.getString("education"));
                textbranch.setText(rs.getString("department"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == submit) {
            String empid = empText.getText().trim();
            String address = textAddress.getText().trim();
            String phone = textPhone.getText().trim();
            String email = textemail.getText().trim();
            String aadhar = textAadhar.getText().trim();
            String course = textcourse.getText().trim();
            String branch = textbranch.getText().trim();

            // Validations
            if (!phone.matches("\\d{10}")) {
                JOptionPane.showMessageDialog(this, "Phone number must be exactly 10 digits");
                return;
            }

            if (!aadhar.matches("\\d{12}")) {
                JOptionPane.showMessageDialog(this, "Aadhar number must be exactly 12 digits");
                return;
            }
            if (!address.matches("^[^\\d]+$")) {
                JOptionPane.showMessageDialog(this, "Address must not contain digits");
                return;
            }

            if (!email.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
                JOptionPane.showMessageDialog(this, "Invalid email format");
                return;
            }

            try {
                Conn c = new Conn();
                String query = "update teacher set address='" + address + "', phone='" + phone + "', email='" + email + "', aadhar='" + aadhar + "', education='" + course + "', department='" + branch + "' where empId='" + empid + "'";
                c.statement.executeUpdate(query);
                JOptionPane.showMessageDialog(null, "Details Updated");
                setVisible(false);
            } catch (Exception E) {
                E.printStackTrace();
            }
        } else {
            setVisible(false);
        }
    }

    public static void main(String[] args) {
        new UpdateTeacher();
    }
}
