import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class ReplyToComplaint extends BackgroundPanel {
    private JTable complaintTable;
    private JTextArea replyArea;
    private JComboBox<String> statusBox;
    private JButton sendReplyButton;

    public ReplyToComplaint() {
        super("d2.jpeg");
        setLayout(new BorderLayout());
        setBackground(new Color(240, 240, 240));

        // Heading
        JLabel heading = new JLabel("📬 Reply to Complaint", SwingConstants.CENTER);
        heading.setFont(new Font("Segoe UI", Font.BOLD, 20));
        heading.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        add(heading, BorderLayout.NORTH);

        // Table to display complaints
        complaintTable = new JTable(AdminUtils.getAllComplaints());
        complaintTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        JScrollPane tableScroll = new JScrollPane(complaintTable);
        add(tableScroll, BorderLayout.CENTER);
        complaintTable.setOpaque(false);

        // Bottom panel for reply form
        JPanel bottomPanel = new JPanel(new GridBagLayout());
        bottomPanel.setBorder(BorderFactory.createTitledBorder("Reply to Selected Complaint"));
        bottomPanel.setBackground(new Color(255, 255, 255));
        bottomPanel.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Reply area
        gbc.gridx = 0;
        gbc.gridy = 0;
        bottomPanel.add(new JLabel("Reply Message:"), gbc);

        replyArea = new JTextArea(3, 40);
        JScrollPane scrollPane = new JScrollPane(replyArea);
        gbc.gridx = 1;
        bottomPanel.add(scrollPane, gbc);

        // Status dropdown
        gbc.gridx = 0;
        gbc.gridy++;
        bottomPanel.add(new JLabel("Change Status To:"), gbc);

        statusBox = new JComboBox<>(new String[]{"Pending", "In Progress", "Resolved"});
        gbc.gridx = 1;
        bottomPanel.add(statusBox, gbc);

        // Send button
        sendReplyButton = new JButton("Send Reply & Update Status");
        gbc.gridx = 1;
        gbc.gridy++;
        bottomPanel.add(sendReplyButton, gbc);

        add(bottomPanel, BorderLayout.SOUTH);

        // Action
        sendReplyButton.addActionListener(e -> handleReply());
    }

    private void handleReply() {
        int selectedRow = complaintTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a complaint first.");
            return;
        }

        int complaintId = (int) complaintTable.getValueAt(selectedRow, 0);
        String email = (String) complaintTable.getValueAt(selectedRow, 4);
        String replyMessage = replyArea.getText().trim();
        String status = (String) statusBox.getSelectedItem();

        if (replyMessage.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter a reply message.");
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {
            String updateQuery = "UPDATE complaints SET status = ?, reply_message = ? WHERE id = ?";
            PreparedStatement ps = conn.prepareStatement(updateQuery);
            ps.setString(1, status);
            ps.setString(2, replyMessage);
            ps.setInt(3, complaintId);
            ps.executeUpdate();

            // Optional: Send email notification
            AdminUtils.replyToComplaint(complaintId, replyMessage);

            JOptionPane.showMessageDialog(this, "Reply sent and status updated successfully.");
            replyArea.setText("");

            // Refresh table
            complaintTable.setModel(AdminUtils.getAllComplaints());

        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Database Error: " + ex.getMessage());
        }
    }

    // ✅ MAIN METHOD to run this panel standalone
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Admin - Reply to Complaint");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setSize(900, 600);
            frame.setLocationRelativeTo(null);
            frame.setContentPane(new ReplyToComplaint());
            frame.setVisible(true);
        });
    }
}
