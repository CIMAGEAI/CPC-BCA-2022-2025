import javax.swing.*;
import java.awt.*;
import java.sql.*;

public class ComplaintStatusTrackerPanel extends BackgroundPanel {
    private String studentEmail;
    private JPanel contentPanel;

    public ComplaintStatusTrackerPanel(String email) {
        super("d5.jpeg");
        this.studentEmail = email;
        setLayout(new BorderLayout());
        setBackground(Color.WHITE);

        JLabel titleLabel = new JLabel("Complaint Status Tracker");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 18));
        titleLabel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        contentPanel = new JPanel();
        contentPanel.setLayout(new BoxLayout(contentPanel, BoxLayout.Y_AXIS));
        contentPanel.setBackground(Color.WHITE);
        JScrollPane scrollPane = new JScrollPane(contentPanel);

        add(titleLabel, BorderLayout.NORTH);
        add(scrollPane, BorderLayout.CENTER);

        loadComplaintStatuses();
    }

    private void loadComplaintStatuses() {
        contentPanel.removeAll();

        try (Connection conn = DBConnection.getConnection()) {
            String query = "SELECT id, complaint_text, status, created_at FROM complaints WHERE email = ? ORDER BY created_at DESC";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, studentEmail);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                int id = rs.getInt("id");
                String complaintText = rs.getString("complaint_text");
                String status = rs.getString("status");
                String date = rs.getTimestamp("created_at").toString();

                JPanel complaintPanel = new JPanel(new BorderLayout());
                complaintPanel.setBackground(new Color(245, 245, 245));
                complaintPanel.setBorder(BorderFactory.createLineBorder(Color.GRAY, 1));
                complaintPanel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 100));
                complaintPanel.setPreferredSize(new Dimension(500, 100));

                JLabel idLabel = new JLabel("Complaint ID: " + id);
                JLabel statusLabel = new JLabel("Status: " + status);
                statusLabel.setFont(new Font("Arial", Font.BOLD, 14));

                // Color coding
                switch (status.toLowerCase()) {
                    case "pending":
                        statusLabel.setForeground(Color.ORANGE);
                        break;
                    case "in progress":
                        statusLabel.setForeground(Color.BLUE);
                        break;
                    case "resolved":
                        statusLabel.setForeground(new Color(0, 128, 0)); // dark green
                        break;
                    default:
                        statusLabel.setForeground(Color.BLACK);
                }

                JTextArea complaintTextArea = new JTextArea(complaintText);
                complaintTextArea.setLineWrap(true);
                complaintTextArea.setWrapStyleWord(true);
                complaintTextArea.setEditable(false);
                complaintTextArea.setBackground(new Color(245, 245, 245));
                complaintTextArea.setFont(new Font("Segoe UI", Font.PLAIN, 13));

                JLabel dateLabel = new JLabel("Submitted On: " + date);
                dateLabel.setFont(new Font("Segoe UI", Font.ITALIC, 12));

                JPanel top = new JPanel(new FlowLayout(FlowLayout.LEFT));
                top.setBackground(new Color(245, 245, 245));
                top.add(idLabel);
                top.add(Box.createHorizontalStrut(20));
                top.add(statusLabel);

                JPanel bottom = new JPanel(new FlowLayout(FlowLayout.LEFT));
                bottom.setBackground(new Color(245, 245, 245));
                bottom.add(dateLabel);

                complaintPanel.add(top, BorderLayout.NORTH);
                complaintPanel.add(new JScrollPane(complaintTextArea), BorderLayout.CENTER);
                complaintPanel.add(bottom, BorderLayout.SOUTH);

                contentPanel.add(complaintPanel);
                contentPanel.add(Box.createVerticalStrut(10));
            }

            revalidate();
            repaint();

        } catch (SQLException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error loading status tracker: " + e.getMessage());
        }
    }
}
