import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.File;
import java.sql.*;
import java.time.LocalDateTime;

public class SubmitComplaintPanel extends BackgroundPanel {
    private JTextField nameField, rollField, deptField, emailField;
    private JTextArea complaintArea;
    private String studentEmail;

    public SubmitComplaintPanel(String email) {
        super("d3.jpeg");
        this.studentEmail = email;

        setLayout(new GridBagLayout());
        //setBackground(new Color(245, 245, 245));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        nameField = new JTextField(20);
        rollField = new JTextField(20);
        deptField = new JTextField(20);
        emailField = new JTextField(20);
        complaintArea = new JTextArea(4, 20);
        JScrollPane scrollPane = new JScrollPane(complaintArea);

        nameField.setEditable(false);
        rollField.setEditable(false);
        deptField.setEditable(false);
        emailField.setEditable(false);

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

        gbc.gridx = 0; gbc.gridy++;
        add(new JLabel("Complaint:"), gbc);
        gbc.gridx = 1;
        add(scrollPane, gbc);

        gbc.gridx = 1; gbc.gridy++;
        JButton submitBtn = new JButton("Submit Complaint");
        add(submitBtn, gbc);

        loadStudentDetails();
        submitBtn.addActionListener(e -> submitComplaint());
    }

    private void loadStudentDetails() {
        try (Connection conn = DBConnection.getConnection()) {
            String query = "SELECT id, name, rollno, department, email FROM student_users WHERE email = ?";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, studentEmail);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                nameField.setText(rs.getString("name"));
                rollField.setText(rs.getString("rollno"));
                deptField.setText(rs.getString("department"));
                emailField.setText(rs.getString("email"));
            } else {
                JOptionPane.showMessageDialog(this, "Student data not found.", "Error", JOptionPane.ERROR_MESSAGE);
            }

        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Database Error: " + e.getMessage());
        }
    }

    private void submitComplaint() {
        String name = nameField.getText().trim();
        String roll = rollField.getText().trim();
        String dept = deptField.getText().trim();
        String email = emailField.getText().trim();
        String complaint = complaintArea.getText().trim();

        if (complaint.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter your complaint.");
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {
            int studentId = -1;
            PreparedStatement ps1 = conn.prepareStatement("SELECT id FROM student_users WHERE email = ?");
            ps1.setString(1, email);
            ResultSet rs = ps1.executeQuery();
            if (rs.next()) {
                studentId = rs.getInt("id");
            }

            if (studentId == -1) {
                JOptionPane.showMessageDialog(this, "Student ID not found.");
                return;
            }

            String insertQuery = "INSERT INTO complaints (student_id, name, rollno, email, department, complaint_text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement ps2 = conn.prepareStatement(insertQuery);
            ps2.setInt(1, studentId);
            ps2.setString(2, name);
            ps2.setString(3, roll);
            ps2.setString(4, email);
            ps2.setString(5, dept);
            ps2.setString(6, complaint);
            ps2.setTimestamp(7, Timestamp.valueOf(LocalDateTime.now()));
            ps2.executeUpdate();

            // ✅ Unified email logic using EmailUtil
            EmailUtil.sendComplaintEmailsAfterSubmission(email, name, studentId);

            JOptionPane.showMessageDialog(this, "Complaint submitted and emails sent successfully!");
            complaintArea.setText("");

        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error submitting complaint: " + ex.getMessage());
        }
    }
}
