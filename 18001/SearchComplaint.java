import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
public class SearchComplaint extends BackgroundPanel {
    private JTextField searchField;
    private JComboBox<String> searchByBox;
    private DefaultTableModel tableModel;
    private JTable resultTable;

    public SearchComplaint() {
        super("d2.jpeg");
        setLayout(new BorderLayout());

        // Heading
        JLabel heading = new JLabel("🔍 Search Complaints", SwingConstants.CENTER);
        heading.setFont(new Font("Segoe UI", Font.BOLD, 20));
        heading.setForeground(Color.WHITE);
        heading.setBorder(BorderFactory.createEmptyBorder(20, 10, 10, 10));
        add(heading, BorderLayout.NORTH);

        // Main Content Panel
        JPanel mainContent = new JPanel(new BorderLayout());
        mainContent.setOpaque(false); // for background image

        // Top Search Panel
        JPanel topPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        topPanel.setOpaque(false);
        searchByBox = new JComboBox<>(new String[]{"Student ID", "Name", "Roll No", "Department", "Email"});
        searchField = new JTextField(18);
        JButton searchBtn = new JButton("Search");

        topPanel.add(new JLabel("Search by:"));
        topPanel.add(searchByBox);
        topPanel.add(searchField);
        topPanel.add(searchBtn);

        mainContent.add(topPanel, BorderLayout.NORTH);

        // Result Table
        String[] columns = {"Complaint ID", "Student ID", "Name", "Roll No", "Email", "Department", "Complaint", "Status", "Date"};
        tableModel = new DefaultTableModel(columns, 0);
        resultTable = new JTable(tableModel);
        resultTable.setRowHeight(28);
        resultTable.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        JScrollPane scrollPane = new JScrollPane(resultTable);
        scrollPane.setBorder(BorderFactory.createTitledBorder("Search Results"));

        mainContent.add(scrollPane, BorderLayout.CENTER);

        add(mainContent, BorderLayout.CENTER);

        // Search Button Action
        searchBtn.addActionListener(e -> performSearch());
    }

    private void performSearch() {
        String searchBy = (String) searchByBox.getSelectedItem();
        String keyword = searchField.getText().trim();

        if (keyword.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter a search value.");
            return;
        }

        String column = switch (searchBy) {
            case "Student ID" -> "student_id";
            case "Name" -> "name";
            case "Roll No" -> "rollno";
            case "Department" -> "department";
            case "Email" -> "email";
            default -> "";
        };

        try (Connection conn = DBConnection.getConnection()) {
            String query = "SELECT * FROM complaints WHERE " + column + " LIKE ?";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, "%" + keyword + "%");
            ResultSet rs = ps.executeQuery();

            tableModel.setRowCount(0); // Clear previous results

            while (rs.next()) {
                tableModel.addRow(new Object[]{
                        rs.getInt("id"),
                        rs.getInt("student_id"),
                        rs.getString("name"),
                        rs.getString("rollno"),
                        rs.getString("email"),
                        rs.getString("department"),
                        rs.getString("complaint_text"),
                        rs.getString("status"),
                        rs.getTimestamp("created_at")
                });
            }

            if (tableModel.getRowCount() == 0) {
                JOptionPane.showMessageDialog(this, "No complaints found for the given criteria.");
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Search error: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
