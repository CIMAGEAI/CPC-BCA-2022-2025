import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.*;

public class ComplaintHistoryPanel extends BackgroundPanel {
    private JTable complaintTable;
    private DefaultTableModel tableModel;
    private String studentEmail;

    public ComplaintHistoryPanel(String email) {
        super("d5.jpeg");
        this.studentEmail = email;
        setLayout(new BorderLayout());
        setBackground(new Color(245, 245, 245));

        JLabel title = new JLabel("Complaint History");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Table Model
        tableModel = new DefaultTableModel(new String[]{
                "Complaint ID", "Complaint Text", "Status", "Date"
        }, 0) {
            public boolean isCellEditable(int row, int column) {
                return false; // make table read-only
            }
        };

        // Table
        complaintTable = new JTable(tableModel);
        complaintTable.setRowHeight(25);
        complaintTable.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 14));
        complaintTable.setFont(new Font("Segoe UI", Font.PLAIN, 13));

        JScrollPane scrollPane = new JScrollPane(complaintTable);

        add(title, BorderLayout.NORTH);
        add(scrollPane, BorderLayout.CENTER);

        // Load complaints from database
        loadComplaintHistory();
    }

    private void loadComplaintHistory() {
        try (Connection conn = DBConnection.getConnection()) {
            String query = "SELECT id, complaint_text, status, created_at FROM complaints WHERE email = ? ORDER BY created_at DESC";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, studentEmail);
            ResultSet rs = ps.executeQuery();

            tableModel.setRowCount(0); // clear old rows

            while (rs.next()) {
                int id = rs.getInt("id");
                String complaintText = rs.getString("complaint_text");
                String status = rs.getString("status");
                String date = rs.getTimestamp("created_at").toString();

                tableModel.addRow(new Object[]{id, complaintText, status, date});
            }

        } catch (SQLException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error loading complaint history: " + e.getMessage());
        }
    }
}
