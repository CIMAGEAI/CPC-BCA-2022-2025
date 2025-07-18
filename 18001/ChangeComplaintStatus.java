import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class ChangeComplaintStatus extends JPanel {
    private JTextField complaintIdField, studentNameField;
    private JTextArea replyArea;
    private JComboBox<String> statusBox;
    private JButton searchBtn, updateBtn;

    private int currentComplaintId = -1;
    private String studentEmail = "";

    public ChangeComplaintStatus() {
        setLayout(new BorderLayout());
        setBackground(new Color(45, 45, 45));

        JLabel heading = new JLabel("📬 Change Complaint Status", SwingConstants.CENTER);
        heading.setFont(new Font("Segoe UI", Font.BOLD, 20));
        heading.setForeground(Color.WHITE);
        heading.setBorder(BorderFactory.createEmptyBorder(20, 10, 10, 10));
        add(heading, BorderLayout.NORTH);

        // Main Form
        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBackground(new Color(45, 45, 45));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JLabel complaintIdLabel = createLabel("Complaint ID:");
        complaintIdField = new JTextField(10);

        JLabel studentLabel = createLabel("Student Name:");
        studentNameField = new JTextField(20);
        studentNameField.setEditable(false);

        JLabel statusLabel = createLabel("Change Status To:");
        statusBox = new JComboBox<>(new String[]{"Pending", "In Progress", "Resolved"});

        JLabel replyLabel = createLabel("Reply / Resolution Message:");
        replyArea = new JTextArea(4, 20);
        JScrollPane scrollPane = new JScrollPane(replyArea);

        searchBtn = new JButton("Search");
        updateBtn = new JButton("Update Status");

        // Layout
        gbc.gridx = 0; gbc.gridy = 0;
        formPanel.add(complaintIdLabel, gbc);
        gbc.gridx = 1;
        formPanel.add(complaintIdField, gbc);
        gbc.gridx = 2;
        formPanel.add(searchBtn, gbc);

        gbc.gridx = 0; gbc.gridy++;
        formPanel.add(studentLabel, gbc);
        gbc.gridx = 1; gbc.gridwidth = 2;
        formPanel.add(studentNameField, gbc);

        gbc.gridx = 0; gbc.gridy++; gbc.gridwidth = 1;
        formPanel.add(statusLabel, gbc);
        gbc.gridx = 1; gbc.gridwidth = 2;
        formPanel.add(statusBox, gbc);

        gbc.gridx = 0; gbc.gridy++; gbc.gridwidth = 1;
        formPanel.add(replyLabel, gbc);
        gbc.gridx = 1; gbc.gridwidth = 2;
        formPanel.add(scrollPane, gbc);

        gbc.gridy++;
        formPanel.add(updateBtn, gbc);

        add(formPanel, BorderLayout.CENTER);

        // Actions
        searchBtn.addActionListener(e -> loadComplaintDetails());
        updateBtn.addActionListener(e -> updateStatus());
    }

    private JLabel createLabel(String text) {
        JLabel label = new JLabel(text);
        label.setForeground(Color.WHITE);
        return label;
    }

    private void loadComplaintDetails() {
        String idText = complaintIdField.getText().trim();
        if (idText.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter Complaint ID.");
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {
            String query = "SELECT name, email, status FROM complaints WHERE id = ?";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setInt(1, Integer.parseInt(idText));
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                currentComplaintId = Integer.parseInt(idText);
                studentNameField.setText(rs.getString("name"));
                studentEmail = rs.getString("email");
                statusBox.setSelectedItem(rs.getString("status"));
            } else {
                JOptionPane.showMessageDialog(this, "Complaint not found.");
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error loading complaint.");
        }
    }

    private void updateStatus() {
        if (currentComplaintId == -1) {
            JOptionPane.showMessageDialog(this, "Please load a valid complaint first.");
            return;
        }

        String status = (String) statusBox.getSelectedItem();
        String reply = replyArea.getText().trim();

        try (Connection conn = DBConnection.getConnection()) {
            String updateQuery = "UPDATE complaints SET status = ?, resolution = ? WHERE id = ?";
            PreparedStatement ps = conn.prepareStatement(updateQuery);
            ps.setString(1, status);
            ps.setString(2, reply);
            ps.setInt(3, currentComplaintId);

            ps.executeUpdate();
            JOptionPane.showMessageDialog(this, "Status updated successfully.");

            // Send email
            if (!studentEmail.isEmpty()) {
                EmailUtil1.sendComplaintStatusUpdate(studentEmail, status, reply);
            }

            // Reset
            studentNameField.setText("");
            replyArea.setText("");
            complaintIdField.setText("");
            currentComplaintId = -1;
            studentEmail = "";

        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Update failed: " + ex.getMessage());
        }
    }
}
