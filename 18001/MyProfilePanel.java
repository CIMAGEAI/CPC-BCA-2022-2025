import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class MyProfilePanel extends BackgroundPanel {
    private JTextField nameField, rollField, deptField, emailField;
    private JButton editButton, saveButton;
    private String studentEmail;

    public MyProfilePanel(String email) {
        super("d3.jpeg");
        this.studentEmail = email;

        setLayout(new GridBagLayout());
        setBackground(new Color(245, 245, 245));
        
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Fields
        nameField = new JTextField(20);
        rollField = new JTextField(20);
        deptField = new JTextField(20);
        emailField = new JTextField(20);
        emailField.setEditable(false); // Email shouldn't be editable

        // Labels & Fields
        gbc.gridx = 0; gbc.gridy = 0;
        add(new JLabel("Name:"), gbc);
        gbc.gridx = 1;
        add(nameField, gbc);

        gbc.gridx = 0; gbc.gridy++;
        add(new JLabel("Roll Number:"), gbc);
        gbc.gridx = 1;
        add(rollField, gbc);

        gbc.gridx = 0; gbc.gridy++;
        add(new JLabel("Department:"), gbc);
        gbc.gridx = 1;
        add(deptField, gbc);

        gbc.gridx = 0; gbc.gridy++;
        add(new JLabel("Email:"), gbc);
        gbc.gridx = 1;
        add(emailField, gbc);

        // Buttons
        gbc.gridx = 0; gbc.gridy++;
        editButton = new JButton("Edit");
        add(editButton, gbc);

        gbc.gridx = 1;
        saveButton = new JButton("Save");
        saveButton.setEnabled(false); // Disabled until 'Edit' is clicked
        add(saveButton, gbc);

        loadProfile();

        // Edit action
        editButton.addActionListener(e -> {
            nameField.setEditable(true);
            rollField.setEditable(true);
            deptField.setEditable(true);
            saveButton.setEnabled(true);
        });

        // Save action
        saveButton.addActionListener(e -> updateProfile());
    }

    private void loadProfile() {
        try (Connection conn = DBConnection.getConnection()) {
            String query = "SELECT name, rollno, department, email FROM student_users WHERE email = ?";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, studentEmail);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                nameField.setText(rs.getString("name"));
                rollField.setText(rs.getString("rollno"));
                deptField.setText(rs.getString("department"));
                emailField.setText(rs.getString("email"));

                nameField.setEditable(false);
                rollField.setEditable(false);
                deptField.setEditable(false);
            } else {
                JOptionPane.showMessageDialog(this, "Student data not found.", "Error", JOptionPane.ERROR_MESSAGE);
            }

        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error loading profile: " + e.getMessage());
        }
    }

    private void updateProfile() {
        String name = nameField.getText().trim();
        String roll = rollField.getText().trim();
        String dept = deptField.getText().trim();

        if (name.isEmpty() || roll.isEmpty() || dept.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please fill all fields.");
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {
            String updateQuery = "UPDATE student_users SET name = ?, rollno = ?, department = ? WHERE email = ?";
            PreparedStatement ps = conn.prepareStatement(updateQuery);
            ps.setString(1, name);
            ps.setString(2, roll);
            ps.setString(3, dept);
            ps.setString(4, studentEmail);
            ps.executeUpdate();

            JOptionPane.showMessageDialog(this, "Profile updated successfully.");

            nameField.setEditable(false);
            rollField.setEditable(false);
            deptField.setEditable(false);
            saveButton.setEnabled(false);

        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Update failed: " + ex.getMessage());
        }
    }
}
