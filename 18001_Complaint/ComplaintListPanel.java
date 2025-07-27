import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.*;

public class ComplaintListPanel extends JPanel {

    private JTable complaintTable;
    private DefaultTableModel tableModel;

    public ComplaintListPanel() {
        setLayout(new BorderLayout());
        setBackground(Color.WHITE);

        JLabel heading = new JLabel("All Complaints", SwingConstants.CENTER);
        heading.setFont(new Font("Segoe UI", Font.BOLD, 20));
        heading.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        add(heading, BorderLayout.NORTH);

        // Table setup
        String[] columns = {"ID", "Name", "Roll No", "Complaint"};
        tableModel = new DefaultTableModel(columns, 0);  // 0 rows initially
        complaintTable = new JTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(complaintTable);
        add(scrollPane, BorderLayout.CENTER);

        loadComplaints(); // Load data from database
    }

    private void loadComplaints() {
        try (Connection conn = DBConnection.getConnection()) {
            String query = "SELECT id, name, rollno, complaint_text FROM complaints";
            PreparedStatement ps = conn.prepareStatement(query);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String roll = rs.getString("rollno");
                String complaint = rs.getString("complaint_text");

                tableModel.addRow(new Object[]{id, name, roll, complaint});
            }

        } catch (SQLException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this,
                "Error fetching complaints: " + e.getMessage(),
                "Database Error",
                JOptionPane.ERROR_MESSAGE);
        }
    }
}
