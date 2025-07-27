import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class ManageAdmins extends BackgroundPanel {

    private JTable adminTable;
    private DefaultTableModel model;
    private JTextField nameField, emailField, passwordField;

    public ManageAdmins() {
        super("d6.jpeg");
        setLayout(new BorderLayout());
        setBackground(Color.WHITE);
        

        // --- Top Form Panel ---
        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBorder(BorderFactory.createTitledBorder("Register New Admin"));
        formPanel.setBackground(new Color(240, 248, 255));
        formPanel.setOpaque(false);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.anchor = GridBagConstraints.WEST;
        
        // Name
        gbc.gridx = 0; gbc.gridy = 0;
        formPanel.add(new JLabel("Full Name:"), gbc);
        gbc.gridx = 1;
        nameField = new JTextField(20);
        formPanel.add(nameField, gbc);

        // Email
        gbc.gridx = 0; gbc.gridy++;
        formPanel.add(new JLabel("Email:"), gbc);
        gbc.gridx = 1;
        emailField = new JTextField(20);
        formPanel.add(emailField, gbc);

        // Password
        gbc.gridx = 0; gbc.gridy++;
        formPanel.add(new JLabel("Password:"), gbc);
        gbc.gridx = 1;
        passwordField = new JTextField(20);
        formPanel.add(passwordField, gbc);

        // Register Button
        gbc.gridx = 1; gbc.gridy++;
        JButton addButton = new JButton("Add Admin");
        formPanel.add(addButton, gbc);

        add(formPanel, BorderLayout.NORTH);

        // --- Admin Table ---
        adminTable = new JTable();
        model = new DefaultTableModel(new String[]{"ID", "Name", "Email"}, 0);
        adminTable.setModel(model);
        JScrollPane scrollPane = new JScrollPane(adminTable);
        add(scrollPane, BorderLayout.CENTER);

        // --- Delete Button ---
        JButton deleteButton = new JButton("Delete Selected Admin");
        deleteButton.setForeground(Color.RED);
        JPanel bottomPanel = new JPanel();
        bottomPanel.add(deleteButton);
        bottomPanel.setOpaque(false);
        add(bottomPanel, BorderLayout.SOUTH);

        // Load existing admins
        loadAdmins();

        // Add Admin Button Action
        addButton.addActionListener(e -> addAdmin());

        // Delete Admin Action
        deleteButton.addActionListener(e -> deleteSelectedAdmin());
    }

    private void loadAdmins() {
        model.setRowCount(0); // Clear existing

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT id, name, email FROM admin_users")) {

            while (rs.next()) {
                model.addRow(new Object[]{
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("email")
                });
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error loading admins.");
        }
    }

    private void addAdmin() {
        String name = nameField.getText().trim();
        String email = emailField.getText().trim();
        String password = passwordField.getText().trim();

        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            JOptionPane.showMessageDialog(this, "All fields are required.");
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {
            String query = "INSERT INTO admin_users (name, email, password) VALUES (?, ?, ?)";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, password);
            ps.executeUpdate();

            JOptionPane.showMessageDialog(this, "Admin added successfully!");
            nameField.setText("");
            emailField.setText("");
            passwordField.setText("");
            loadAdmins();

        } catch (SQLIntegrityConstraintViolationException ex) {
            JOptionPane.showMessageDialog(this, "Email already exists.");
        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error adding admin.");
        }
    }

    private void deleteSelectedAdmin() {
        int selectedRow = adminTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Select an admin to delete.");
            return;
        }

        int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to delete this admin?", "Confirm", JOptionPane.YES_NO_OPTION);
        if (confirm != JOptionPane.YES_OPTION) return;

        int adminId = (int) model.getValueAt(selectedRow, 0);

        try (Connection conn = DBConnection.getConnection()) {
            String query = "DELETE FROM admin_users WHERE id = ?";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setInt(1, adminId);
            ps.executeUpdate();

            JOptionPane.showMessageDialog(this, "Admin deleted.");
            loadAdmins();

        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error deleting admin.");
        }
    }
}
