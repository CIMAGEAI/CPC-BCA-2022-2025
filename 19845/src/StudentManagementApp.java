import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class StudentManagementApp extends JFrame {

    JTextField nameField, rollField, courseField;
    JTable studentTable;
    DefaultTableModel tableModel;

    // JDBC details
    String url = "jdbc:mysql://localhost:3307/student_db?useSSL=false&serverTimezone=UTC";
    final String USER = "root";
    final String PASS = "";

    public StudentManagementApp() {
        setTitle("Student Management System");
        setSize(600, 400);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // Top input panel
        JPanel inputPanel = new JPanel(new GridLayout(2, 4, 5, 5));
        nameField = new JTextField();
        rollField = new JTextField();
        courseField = new JTextField();
        JButton addButton = new JButton("Add Student");

        inputPanel.add(new JLabel("Name:"));
        inputPanel.add(nameField);
        inputPanel.add(new JLabel("Roll No:"));
        inputPanel.add(rollField);
        inputPanel.add(new JLabel("Course:"));
        inputPanel.add(courseField);
        inputPanel.add(new JLabel());
        inputPanel.add(addButton);

        add(inputPanel, BorderLayout.NORTH);

        // Table
        tableModel = new DefaultTableModel(new String[]{"ID", "Name", "Roll No", "Course"}, 0);
        studentTable = new JTable(tableModel);
        add(new JScrollPane(studentTable), BorderLayout.CENTER);

        // Add Button Action
        addButton.addActionListener(e -> insertStudent());

        // Load students on startup
        fetchStudents();
    }

    // Helper method to get database connection with driver load
    Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.mysql.cj.jdbc.Driver"); // ✅ Load JDBC driver here
        return DriverManager.getConnection(url, USER, PASS);
    }

    void insertStudent() {
        String name = nameField.getText();
        String roll = rollField.getText();
        String course = courseField.getText();

        if (name.isEmpty() || roll.isEmpty() || course.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please fill all fields.");
            return;
        }

        try (Connection conn = getConnection()) {  // ✅ Use helper method
            String sql = "INSERT INTO students(name, roll_no, course) VALUES (?, ?, ?)";
            PreparedStatement pst = conn.prepareStatement(sql);
            pst.setString(1, name);
            pst.setString(2, roll);
            pst.setString(3, course);
            pst.executeUpdate();

            JOptionPane.showMessageDialog(this, "Student Added!");
            nameField.setText("");
            rollField.setText("");
            courseField.setText("");
            fetchStudents();

        } catch (SQLException | ClassNotFoundException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Database Error: " + ex.getMessage());
        }
    }

    void fetchStudents() {
        tableModel.setRowCount(0); // Clear existing rows
        try (Connection conn = getConnection()) {  // ✅ Use helper method
            String sql = "SELECT * FROM students";
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                Object[] row = {
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("roll_no"),
                    rs.getString("course")
                };
                tableModel.addRow(row);
            }
        } catch (SQLException | ClassNotFoundException ex) {
            ex.printStackTrace();
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new StudentManagementApp().setVisible(true));
    }
}
