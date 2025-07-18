package university;

import com.toedter.calendar.JDateChooser;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.ResultSet;

public class AddFaculty extends JFrame implements ActionListener {

    JTextField textName, textfather, textAddress, textPhone, textemail, textM10, textM12, textAadhar;
    JLabel empText;
    JDateChooser cdob;
    JComboBox<String> courseBox, departmentBox;
    JButton submit, cancel;

    String empID;

    AddFaculty() {
        setTitle("Add New Faculty");
        getContentPane().setBackground(new Color(245, 245, 255));
        setLayout(null);
        setSize(900, 700);
        setLocationRelativeTo(null);

        JLabel heading = new JLabel("New Faculty Registration");
        heading.setBounds(250, 20, 500, 40);
        heading.setFont(new Font("Tahoma", Font.BOLD, 30));
        heading.setForeground(new Color(33, 56, 117));
        add(heading);

        addLabel("Name", 50, 100);
        textName = addField(200, 100);

        addLabel("Father Name", 400, 100);
        textfather = addField(600, 100);

        addLabel("Employee ID", 50, 150);
        empID = generateEmployeeID();
        empText = new JLabel(empID);
        empText.setBounds(200, 150, 200, 30);
        empText.setFont(new Font("Tahoma", Font.PLAIN, 16));
        add(empText);

        addLabel("Date of Birth", 400, 150);
        cdob = new JDateChooser();
        cdob.setBounds(600, 150, 150, 30);
        add(cdob);

        addLabel("Address", 50, 200);
        textAddress = addField(200, 200);

        addLabel("Phone", 400, 200);
        textPhone = addField(600, 200);

        addLabel("Email", 50, 250);
        textemail = addField(200, 250);

        addLabel("Class X (%)", 400, 250);
        textM10 = addField(600, 250);

        addLabel("Class XII (%)", 50, 300);
        textM12 = addField(200, 300);

        addLabel("Aadhar Number", 400, 300);
        textAadhar = addField(600, 300);

        addLabel("Qualification", 50, 350);
        courseBox = new JComboBox<>();
        courseBox.setBounds(200, 350, 150, 30);
        courseBox.setBackground(Color.WHITE);
        add(courseBox);

        try {
            Conn c = new Conn();
            ResultSet rs = c.statement.executeQuery("SELECT course FROM course");
            while (rs.next()) {
                courseBox.addItem(rs.getString("course"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        addLabel("Department", 400, 350);
        String[] department = {"Computer Science", "Electronics", "Mechanical", "Civil", "IT"};
        departmentBox = new JComboBox<>(department);
        departmentBox.setBounds(600, 350, 150, 30);
        departmentBox.setBackground(Color.WHITE);
        add(departmentBox);

        submit = new JButton("Submit");
        submit.setBounds(250, 500, 150, 35);
        styleButton(submit);
        submit.addActionListener(this);
        add(submit);

        cancel = new JButton("Cancel");
        cancel.setBounds(450, 500, 150, 35);
        styleButton(cancel);
        cancel.addActionListener(this);
        add(cancel);

        setVisible(true);
    }

    private void addLabel(String text, int x, int y) {
        JLabel label = new JLabel(text);
        label.setBounds(x, y, 150, 30);
        label.setFont(new Font("Tahoma", Font.BOLD, 16));
        label.setForeground(new Color(50, 50, 50));
        add(label);
    }

    private JTextField addField(int x, int y) {
        JTextField field = new JTextField();
        field.setBounds(x, y, 150, 30);
        field.setFont(new Font("Tahoma", Font.PLAIN, 14));
        add(field);
        return field;
    }

    private void styleButton(JButton btn) {
        btn.setFont(new Font("Tahoma", Font.BOLD, 15));
        btn.setBackground(new Color(33, 56, 117));
        btn.setForeground(Color.WHITE);
        btn.setFocusPainted(false);
        btn.setBorder(BorderFactory.createEmptyBorder());
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
    }

    private String generateEmployeeID() {
        String prefix = "EMP-350-";
        int nextId = 1;

        try {
            Conn c = new Conn();
            ResultSet rs = c.statement.executeQuery("SELECT empid FROM teacher ORDER BY empid DESC LIMIT 1");

            if (rs.next()) {
                String lastId = rs.getString("empid"); // e.g., EMP-350-007
                String[] parts = lastId.split("-");
                if (parts.length == 3) {
                    nextId = Integer.parseInt(parts[2]) + 1;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return prefix + String.format("%03d", nextId); // EMP-350-001
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == submit) {
            String name = textName.getText().trim();
            String fname = textfather.getText().trim();
            String empid = empID;
            String dob = ((JTextField) cdob.getDateEditor().getUiComponent()).getText().trim();
            String address = textAddress.getText().trim();
            String phone = textPhone.getText().trim();
            String email = textemail.getText().trim();
            String x = textM10.getText().trim();
            String xii = textM12.getText().trim();
            String aadhar = textAadhar.getText().trim();
            String course = (String) courseBox.getSelectedItem();
            String department = (String) departmentBox.getSelectedItem();

            String emailRegex = "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$";
            String nonDigitRegex = "^[^\\d]+$";

            if (!name.matches(nonDigitRegex)) {
                JOptionPane.showMessageDialog(this, "Name must not contain digits");
                return;
            }

            if (!fname.matches(nonDigitRegex)) {
                JOptionPane.showMessageDialog(this, "Father's Name must not contain digits");
                return;
            }

            if (!address.matches(nonDigitRegex)) {
                JOptionPane.showMessageDialog(this, "Address must not contain digits");
                return;
            }

            if (!phone.matches("\\d{10}")) {
                JOptionPane.showMessageDialog(this, "Phone number must be exactly 10 digits");
                return;
            }

            if (!aadhar.matches("\\d{12}")) {
                JOptionPane.showMessageDialog(this, "Aadhar number must be exactly 12 digits");
                return;
            }

            if (!x.matches("\\d+(\\.\\d+)?") || Double.parseDouble(x) > 100) {
                JOptionPane.showMessageDialog(this, "Class X marks must be a valid number between 0–100");
                return;
            }

            if (!xii.matches("\\d+(\\.\\d+)?") || Double.parseDouble(xii) > 100) {
                JOptionPane.showMessageDialog(this, "Class XII marks must be a valid number between 0–100");
                return;
            }

            if (!email.matches(emailRegex)) {
                JOptionPane.showMessageDialog(this, "Invalid email address");
                return;
            }

            try {
                String q = "INSERT INTO teacher VALUES('" + name + "', '" + fname + "','" + empid + "','" + dob + "','" + address + "','" + phone + "','" + email + "','" + x + "','" + xii + "','" + aadhar + "','" + course + "','" + department + "')";
                Conn c = new Conn();
                c.statement.executeUpdate(q);
                JOptionPane.showMessageDialog(this, "Faculty Details Inserted Successfully");
                setVisible(false);
            } catch (Exception ex) {
                ex.printStackTrace();
                JOptionPane.showMessageDialog(this, "Error inserting data. Please try again.");
            }
        } else {
            setVisible(false);
        }
    }

    public static void main(String[] args) {
        new AddFaculty();
    }
}
