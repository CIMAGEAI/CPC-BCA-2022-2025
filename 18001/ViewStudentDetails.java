import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.*;

public class ViewStudentDetails extends BackgroundPanel {

    private JTable studentTable;
    private JTextField searchField;
    private JButton searchButton;

    public ViewStudentDetails() {
        super("d6.jpeg");
        setLayout(new BorderLayout());
        setBackground(Color.WHITE);

        // Top Search Panel
        JPanel topPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        topPanel.setBackground(new Color(230, 230, 250));
        topPanel.setOpaque(false);

        JLabel searchLabel = new JLabel("Search Student:");
        searchField = new JTextField(20);
        searchButton = new JButton("Search");
        searchLabel.setOpaque(false);

        topPanel.add(searchLabel);
        topPanel.add(searchField);
        topPanel.add(searchButton);

        add(topPanel, BorderLayout.NORTH);

        // Table
        studentTable = new JTable();
        JScrollPane scrollPane = new JScrollPane(studentTable);
        add(scrollPane, BorderLayout.CENTER);

        // Load All Students Initially
        loadStudentTable("");

        // Search Button Action
        searchButton.addActionListener(e -> {
            String keyword = searchField.getText().trim();
            loadStudentTable(keyword);
        });
    }

    private void loadStudentTable(String keyword) {
        String[] columns = {"ID", "Name", "Roll No", "Department", "Email"};
        DefaultTableModel model = new DefaultTableModel(columns, 0);

        String query = "SELECT id, name, rollno, department, email FROM student_users";
        if (!keyword.isEmpty()) {
            query += " WHERE name LIKE ? OR rollno LIKE ? OR department LIKE ? OR email LIKE ?";
        }

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {

            if (!keyword.isEmpty()) {
                for (int i = 1; i <= 4; i++) {
                    ps.setString(i, "%" + keyword + "%");
                }
            }

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Object[] row = new Object[] {
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("rollno"),
                        rs.getString("department"),
                        rs.getString("email")
                };
                model.addRow(row);
            }

            studentTable.setModel(model);

        } catch (SQLException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error loading student data.");
        }
    }
}
