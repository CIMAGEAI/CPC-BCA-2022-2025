import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class ComplaintListPanel1 extends JPanel {
    private JTable complaintTable;
    private DefaultTableModel tableModel;
    private JButton deleteButton, resolveButton;

    public ComplaintListPanel1() {
        setLayout(new BorderLayout());
        setBackground(Color.decode("#f5f5f5"));

        JLabel titleLabel = new JLabel("Complaint List", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 24));
        titleLabel.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));

        String[] columnNames = {"ID", "Name", "Roll No", "Department", "Complaint", "Status"};
        tableModel = new DefaultTableModel(columnNames, 0);
        complaintTable = new JTable(tableModel);
        complaintTable.setRowHeight(28);
        complaintTable.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        complaintTable.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 15));
        JScrollPane scrollPane = new JScrollPane(complaintTable);

        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 20, 10));
        deleteButton = new JButton("Delete Complaint");
        resolveButton = new JButton("Mark as Resolved");

        deleteButton.setBackground(new Color(200, 50, 50));
        deleteButton.setForeground(Color.WHITE);
        resolveButton.setBackground(new Color(50, 150, 100));
        resolveButton.setForeground(Color.WHITE);

        buttonPanel.add(resolveButton);
        buttonPanel.add(deleteButton);

        // Button Actions
        resolveButton.addActionListener(e -> markAsResolved());
        deleteButton.addActionListener(e -> deleteComplaint());

        add(titleLabel, BorderLayout.NORTH);
        add(scrollPane, BorderLayout.CENTER);
        add(buttonPanel, BorderLayout.SOUTH);

        loadComplaintData();
    }

    private void loadComplaintData() {
        tableModel.setRowCount(0); // Clear table
        String query = "SELECT id, name, rollno, department, complaint_text, status FROM complaints";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String rollno = rs.getString("rollno");
                String dept = rs.getString("department");
                String complaint = rs.getString("complaint_text");
                String status = rs.getString("status");

                tableModel.addRow(new Object[]{id, name, rollno, dept, complaint, status});
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void markAsResolved() {
        int selectedRow = complaintTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a complaint to mark as resolved.");
            return;
        }

        int id = (int) tableModel.getValueAt(selectedRow, 0);
        String query = "UPDATE complaints SET status = 'Resolved' WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
            JOptionPane.showMessageDialog(this, "Complaint marked as resolved.");
            loadComplaintData();

        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void deleteComplaint() {
        int selectedRow = complaintTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a complaint to delete.");
            return;
        }

        int id = (int) tableModel.getValueAt(selectedRow, 0);
        int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to delete this complaint?", "Confirm Delete", JOptionPane.YES_NO_OPTION);

        if (confirm == JOptionPane.YES_OPTION) {
            String query = "DELETE FROM complaints WHERE id = ?";

            try (Connection conn = DBConnection.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {

                stmt.setInt(1, id);
                stmt.executeUpdate();
                JOptionPane.showMessageDialog(this, "Complaint deleted.");
                loadComplaintData();

            } catch (SQLException e) {
                JOptionPane.showMessageDialog(this, "Error: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}

