import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class DownloadComplaintPanel extends BackgroundPanel {
    private JTextField emailField;
    private JButton downloadBtn;

    public DownloadComplaintPanel(String studentEmail) {
        super("d3.jpeg");
        setLayout(new GridBagLayout());
        setBackground(new Color(240, 240, 240));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(15, 15, 15, 15);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JLabel label = new JLabel("Download Your Complaint Report");
        label.setFont(new Font("Arial", Font.BOLD, 18));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        add(label, gbc);

        // Email (readonly)
        gbc.gridy++;
        gbc.gridwidth = 1;
        add(new JLabel("Your Email:"), gbc);

        gbc.gridx = 1;
        emailField = new JTextField(studentEmail);
        emailField.setEditable(false);
        add(emailField, gbc);

        // Download Button
        gbc.gridx = 0;
        gbc.gridy++;
        gbc.gridwidth = 2;
        downloadBtn = new JButton("Download Complaint PDF");
        add(downloadBtn, gbc);

        // Button Action
        downloadBtn.addActionListener(e -> downloadComplaintReport());
    }

    private void downloadComplaintReport() {
        String email = emailField.getText().trim();
        if (email.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Email is empty.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {
            // Get student ID from email
            String query = "SELECT id FROM student_users WHERE email = ?";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                int studentId = rs.getInt("id");

                // Generate PDF
                ComplaintPDFGenerator.generateComplaintPDFForStudent(studentId);
                JOptionPane.showMessageDialog(this, "Complaint report downloaded successfully!");

            } else {
                JOptionPane.showMessageDialog(this, "No student found with this email.", "Error", JOptionPane.ERROR_MESSAGE);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
