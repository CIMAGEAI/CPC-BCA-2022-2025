package university;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.ResultSet;

public class updateStudent extends JFrame implements ActionListener {
    JTextField textAddress, textPhone, textemail, textAadhar, textCourse, textDepartment;
    JLabel textName, textFather, textDOB, textM10, textM12, empText;
    JButton submit, cancel;
    Choice cEMPID;

    updateStudent() {
        getContentPane().setBackground(new Color(230, 210, 252));
        setLayout(null);

        JLabel heading = new JLabel("Update Student Details");
        heading.setBounds(50, 10, 500, 50);
        heading.setFont(new Font("serif", Font.BOLD, 35));
        add(heading);

        JLabel empID = new JLabel("SELECT ROLL NUMBER ");
        empID.setBounds(50, 100, 200, 20);
        empID.setFont(new Font("serif", Font.PLAIN, 20));
        add(empID);

        cEMPID = new Choice();
        cEMPID.setBounds(250, 100, 200, 20);
        add(cEMPID);

        try {
            Conn c = new Conn();
            ResultSet rs = c.statement.executeQuery("select * from student");
            while (rs.next()) {
                cEMPID.add(rs.getString("rollno"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        int y = 150;
        Font labelFont = new Font("serif", Font.BOLD, 20);

        JLabel name = new JLabel("Name");
        name.setBounds(50, y, 100, 30);
        name.setFont(labelFont);
        add(name);

        textName = new JLabel();
        textName.setBounds(200, y, 150, 30);
        add(textName);

        JLabel fname = new JLabel("Father Name");
        fname.setBounds(400, y, 200, 30);
        fname.setFont(labelFont);
        add(fname);

        textFather = new JLabel();
        textFather.setBounds(600, y, 150, 30);
        add(textFather);

        y += 50;

        JLabel roll = new JLabel("Roll Number");
        roll.setBounds(50, y, 200, 30);
        roll.setFont(labelFont);
        add(roll);

        empText = new JLabel();
        empText.setBounds(200, y, 150, 30);
        empText.setFont(labelFont);
        add(empText);

        JLabel dob = new JLabel("Date of Birth");
        dob.setBounds(400, y, 200, 30);
        dob.setFont(labelFont);
        add(dob);

        textDOB = new JLabel();
        textDOB.setBounds(600, y, 150, 30);
        add(textDOB);

        y += 50;

        JLabel address = new JLabel("Address");
        address.setBounds(50, y, 200, 30);
        address.setFont(labelFont);
        add(address);

        textAddress = new JTextField();
        textAddress.setBounds(200, y, 150, 30);
        add(textAddress);

        JLabel phone = new JLabel("Phone");
        phone.setBounds(400, y, 200, 30);
        phone.setFont(labelFont);
        add(phone);

        textPhone = new JTextField();
        textPhone.setBounds(600, y, 150, 30);
        add(textPhone);

        y += 50;

        JLabel email = new JLabel("Email");
        email.setBounds(50, y, 200, 30);
        email.setFont(labelFont);
        add(email);

        textemail = new JTextField();
        textemail.setBounds(200, y, 150, 30);
        add(textemail);

        JLabel m10 = new JLabel("Class X (%)");
        m10.setBounds(400, y, 200, 30);
        m10.setFont(labelFont);
        add(m10);

        textM10 = new JLabel();
        textM10.setBounds(600, y, 150, 30);
        add(textM10);

        y += 50;

        JLabel m12 = new JLabel("Class XII (%)");
        m12.setBounds(50, y, 200, 30);
        m12.setFont(labelFont);
        add(m12);

        textM12 = new JLabel();
        textM12.setBounds(200, y, 150, 30);
        add(textM12);

        JLabel aadhar = new JLabel("Aadhar Number");
        aadhar.setBounds(400, y, 200, 30);
        aadhar.setFont(labelFont);
        add(aadhar);

        textAadhar = new JTextField();
        textAadhar.setBounds(600, y, 150, 30);
        add(textAadhar);

        y += 50;

        JLabel course = new JLabel("Course");
        course.setBounds(50, y, 200, 30);
        course.setFont(labelFont);
        add(course);

        textCourse = new JTextField();
        textCourse.setBounds(200, y, 150, 30);
        add(textCourse);

        JLabel department = new JLabel("Branch");
        department.setBounds(400, y, 200, 30);
        department.setFont(labelFont);
        add(department);

        textDepartment = new JTextField();
        textDepartment.setBounds(600, y, 150, 30);
        add(textDepartment);

        // Initial population
        populateFields(cEMPID.getSelectedItem());

        cEMPID.addItemListener(e -> populateFields(cEMPID.getSelectedItem()));

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

    private void populateFields(String rollno) {
        try {
            Conn c = new Conn();
            String query = "select * from student where rollno = '" + rollno + "'";
            ResultSet rs = c.statement.executeQuery(query);
            if (rs.next()) {
                textName.setText(rs.getString("name"));
                textFather.setText(rs.getString("fname"));
                empText.setText(rs.getString("rollno"));
                textDOB.setText(rs.getString("dob"));
                textAddress.setText(rs.getString("address"));
                textPhone.setText(rs.getString("phone"));
                textemail.setText(rs.getString("email"));
                textM10.setText(rs.getString("class_x"));
                textM12.setText(rs.getString("class_xii"));
                textAadhar.setText(rs.getString("aadhar"));
                textCourse.setText(rs.getString("course"));
                textDepartment.setText(rs.getString("department"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == submit) {
            String empid = empText.getText();
            String address = textAddress.getText().trim();
            String phone = textPhone.getText().trim();
            String email = textemail.getText().trim();
            String aadhar = textAadhar.getText().trim();
            String course = textCourse.getText().trim();
            String department = textDepartment.getText().trim();


            if (address.isEmpty()) {
                JOptionPane.showMessageDialog(null, "Address cannot be empty.");
                return;
            }


            if (!phone.matches("\\d{10}")) {
                JOptionPane.showMessageDialog(null, "Phone must be 10 digits.");
                return;
            }

            if (!email.matches("^[\\w.-]+@[\\w.-]+\\.\\w{2,}$")) {
                JOptionPane.showMessageDialog(null, "Invalid email format.");
                return;
            }


            if (!aadhar.matches("\\d{12}")) {
                JOptionPane.showMessageDialog(null, "Aadhar number must be 12 digits.");
                return;
            }

            try {
                String query = "update student set address = '" + address + "', phone = '" + phone + "', email = '" + email + "', aadhar = '" + aadhar + "', course = '" + course + "', department = '" + department + "' where rollno = '" + empid + "'";
                Conn c = new Conn();
                c.statement.executeUpdate(query);
                JOptionPane.showMessageDialog(null, "Details Updated Successfully");
                setVisible(false);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        } else {
            setVisible(false);
        }
    }

    public static void main(String[] args) {
        new updateStudent();
    }
}
