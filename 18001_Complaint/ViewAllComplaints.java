import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.*;

public class ViewAllComplaints extends BackgroundPanel {
    private JTable complaintTable;
    private DefaultTableModel tableModel;

    public ViewAllComplaints() {
        super("d2.jpeg");
        setLayout(new BorderLayout());
        setBackground(new Color(40, 40, 40));

        JLabel heading = new JLabel("📋 All Complaints", SwingConstants.CENTER);
        heading.setFont(new Font("Segoe UI", Font.BOLD, 20));
        heading.setForeground(Color.WHITE);
        heading.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        add(heading, BorderLayout.NORTH);

        // Table Setup
        String[] columns = {"Complaint ID", "Student ID", "Name", "Roll No", "Email", "Department", "Complaint", "Status", "Date"};
        tableModel = new DefaultTableModel(columns, 0);
        complaintTable = new JTable(tableModel);
        complaintTable.setRowHeight(30);
        complaintTable.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        complaintTable.setGridColor(Color.LIGHT_GRAY);
        complaintTable.setForeground(Color.BLACK);
        JScrollPane scrollPane = new JScrollPane(complaintTable);
        add(scrollPane, BorderLayout.CENTER);

        // Load data from DB
        loadComplaints();
    }

    private void loadComplaints() {
        try (Connection conn = DBConnection.getConnection()) {
            String query = "SELECT * FROM complaints ORDER BY created_at DESC";
            PreparedStatement ps = conn.prepareStatement(query);
            ResultSet rs = ps.executeQuery();

            tableModel.setRowCount(0); // clear existing

            while (rs.next()) {
                int id = rs.getInt("id");
                int studentId = rs.getInt("student_id");
                String name = rs.getString("name");
                String roll = rs.getString("rollno");
                String email = rs.getString("email");
                String dept = rs.getString("department");
                String complaint = rs.getString("complaint_text");
                String status = rs.getString("status");
                String date = rs.getString("created_at");

                tableModel.addRow(new Object[]{id, studentId, name, roll, email, dept, complaint, status, date});
            }

        } catch (SQLException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error loading complaints: " + e.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
