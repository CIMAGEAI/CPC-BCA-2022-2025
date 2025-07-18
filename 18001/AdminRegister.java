import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import java.util.regex.*;

public class AdminRegister extends JFrame {
    private JTextField nameField, usernameField, emailField;
    private JPasswordField passwordField, confirmPasswordField;
    private JLabel nameError, usernameError, emailError, passError, confirmError;

    public AdminRegister() {
        setTitle("Admin Registration - CCMS");
        setSize(500, 550);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBackground(new Color(34, 34, 34));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 10, 5, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JLabel title = new JLabel("Register New Admin", SwingConstants.CENTER);
        title.setFont(new Font("Segoe UI", Font.BOLD, 20));
        title.setForeground(Color.WHITE);
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        panel.add(title, gbc);

        // Reset width
        gbc.gridwidth = 1;

        int y = 1;
        // Name
        addLabeledField(panel, gbc, y++, "Full Name:", nameField = new JTextField(), nameError = createErrorLabel());

        // Username
        addLabeledField(panel, gbc, y++, "Username:", usernameField = new JTextField(), usernameError = createErrorLabel());

        // Email
        addLabeledField(panel, gbc, y++, "Email:", emailField = new JTextField(), emailError = createErrorLabel());

        // Password
        addLabeledField(panel, gbc, y++, "Password:", passwordField = new JPasswordField(), passError = createErrorLabel());

        // Confirm Password
        addLabeledField(panel, gbc, y++, "Confirm Password:", confirmPasswordField = new JPasswordField(), confirmError = createErrorLabel());

        // Register Button
        gbc.gridx = 0;
        gbc.gridy = y++;
        gbc.gridwidth = 2;
        JButton registerBtn = new JButton("Register");
        registerBtn.setBackground(new Color(60, 60, 60));
        registerBtn.setForeground(Color.WHITE);
        registerBtn.setFocusPainted(false);
        registerBtn.addActionListener(e -> registerAdmin());
        panel.add(registerBtn, gbc);

        add(panel, BorderLayout.CENTER);
        setVisible(true);
    }

    private void addLabeledField(JPanel panel, GridBagConstraints gbc, int y, String labelText, JTextField field, JLabel errorLabel) {
        gbc.gridx = 0;
        gbc.gridy = y;
        JLabel label = new JLabel(labelText);
        label.setForeground(Color.WHITE);
        panel.add(label, gbc);

        gbc.gridx = 1;
        panel.add(field, gbc);

        gbc.gridy = ++y;
        gbc.gridx = 1;
        panel.add(errorLabel, gbc);
    }

    private JLabel createErrorLabel() {
        JLabel label = new JLabel(" ");
        label.setForeground(Color.RED);
        label.setFont(new Font("Arial", Font.PLAIN, 11));
        return label;
    }

    private void registerAdmin() {
        String name = nameField.getText().trim();
        String username = usernameField.getText().trim();
        String email = emailField.getText().trim();
        String pass = new String(passwordField.getPassword());
        String confirmPass = new String(confirmPasswordField.getPassword());

        // Reset all errors
        nameError.setText(" ");
        usernameError.setText(" ");
        emailError.setText(" ");
        passError.setText(" ");
        confirmError.setText(" ");

        boolean isValid = true;

        if (!Pattern.matches("^[A-Za-z ]{2,}$", name)) {
            nameError.setText("❌ Only alphabets allowed");
            isValid = false;
        }

        if (!Pattern.matches("^[a-zA-Z0-9_]{4,}$", username)) {
            usernameError.setText("❌ At least 4 characters (letters/numbers/underscores)");
            isValid = false;
        }

        if (!Pattern.matches("^[\\w.-]+@[\\w.-]+\\.\\w{2,}$", email)) {
            emailError.setText("❌ Invalid email format");
            isValid = false;
        }

        if (pass.length() < 6) {
            passError.setText("❌ Minimum 6 characters");
            isValid = false;
        }

        if (!pass.equals(confirmPass)) {
            confirmError.setText("❌ Passwords do not match");
            isValid = false;
        }

        if (!isValid) return;

        // Insert into database
        try (Connection conn = DBConnection.getConnection()) {
            String query = "INSERT INTO admin_users (name, username, email, password) VALUES (?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, name);
            stmt.setString(2, username);
            stmt.setString(3, email);
            stmt.setString(4, pass); // In real apps: hash the password

            stmt.executeUpdate();
            JOptionPane.showMessageDialog(this, "✅ Admin registered successfully!");
            dispose();
        } catch (SQLIntegrityConstraintViolationException ex) {
            JOptionPane.showMessageDialog(this, "⚠️ Username or Email already exists!", "Duplicate Entry", JOptionPane.ERROR_MESSAGE);
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "❌ Error during registration.", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(AdminRegister::new);
    }
}
