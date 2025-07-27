import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import java.util.regex.*;


public class LoginFrame extends JFrame {

    private JComboBox<String> roleBox;
    private JTextField usernameField;
    private JPasswordField passwordField;
    private JButton loginButton, registerButton;
    private JLabel emailErrorLabel, passErrorLabel;

    public LoginFrame() {
        setTitle("College Complaint Management - Login");
        setSize(400, 330);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        //JPanel panel = new JPanel(new GridBagLayout());
        //panel.setBackground(new Color(30, 30, 30));

        BackgroundPanel panel = new BackgroundPanel("d5.jpeg");
        panel.setLayout(new GridBagLayout());


        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 10, 5, 10);

        JLabel title = new JLabel("Login to CCMS");
        title.setForeground(Color.WHITE);
        title.setFont(new Font("Arial", Font.BOLD, 20));
        gbc.gridwidth = 2;
        gbc.gridx = 0;
        gbc.gridy = 0;
        panel.add(title, gbc);

        // Role
        gbc.gridy++;
        gbc.gridwidth = 1;
        gbc.gridx = 0;
        JLabel roleLabel = new JLabel("Role:");
        roleLabel.setForeground(Color.WHITE);
        panel.add(roleLabel, gbc);

        gbc.gridx = 1;
        roleBox = new JComboBox<>(new String[]{"Student", "Admin"});
        panel.add(roleBox, gbc);

        // Email
        gbc.gridx = 0;
        gbc.gridy++;
        JLabel userLabel = new JLabel("Email:");
        userLabel.setForeground(Color.WHITE);
        panel.add(userLabel, gbc);

        gbc.gridx = 1;
        usernameField = new JTextField(15);
        panel.add(usernameField, gbc);

        // Email Error Label
        gbc.gridx = 1;
        gbc.gridy++;
        emailErrorLabel = new JLabel(" ");
        emailErrorLabel.setForeground(Color.RED);
        emailErrorLabel.setFont(new Font("Arial", Font.PLAIN, 11));
        panel.add(emailErrorLabel, gbc);

        // Password
        gbc.gridx = 0;
        gbc.gridy++;
        JLabel passLabel = new JLabel("Password:");
        passLabel.setForeground(Color.WHITE);
        panel.add(passLabel, gbc);

        gbc.gridx = 1;
        passwordField = new JPasswordField(15);
        panel.add(passwordField, gbc);

        // Password Error Label
        gbc.gridx = 1;
        gbc.gridy++;
        passErrorLabel = new JLabel(" ");
        passErrorLabel.setForeground(Color.RED);
        passErrorLabel.setFont(new Font("Arial", Font.PLAIN, 11));
        panel.add(passErrorLabel, gbc);

        // Buttons
        gbc.gridx = 0;
        gbc.gridy++;
        loginButton = new JButton("Login");
        panel.add(loginButton, gbc);

        gbc.gridx = 1;
        registerButton = new JButton("Register");
        panel.add(registerButton, gbc);

        add(panel, BorderLayout.CENTER);

        // Button Actions
        loginButton.addActionListener(e -> performLogin());
        registerButton.addActionListener(e -> new RegisterPanel());

        setVisible(true);
    }

    private void performLogin() {
        String role = (String) roleBox.getSelectedItem();
        String email = usernameField.getText().trim();
        String password = new String(passwordField.getPassword());

        // Reset error labels
        emailErrorLabel.setText(" ");
        passErrorLabel.setText(" ");

        boolean isValid = true;

        // Email validation
        if (!Pattern.matches("^[\\w.-]+@[\\w.-]+\\.\\w{2,}$", email)) {
            emailErrorLabel.setText("❌ Enter a valid email (e.g. name@gmail.com)");
            isValid = false;
        }

        // Password validation
        if (password.length() < 6) {
            passErrorLabel.setText("❌ Password must be at least 6 characters");
            isValid = false;
        }

        if (!isValid) return;

        try (Connection conn = DBConnection.getConnection()) {
            String table = role.equalsIgnoreCase("Admin") ? "admin_users" : "student_users";
            String query = "SELECT * FROM " + table + " WHERE email = ? AND password = ?";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, email);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
    JOptionPane.showMessageDialog(this, role + " login successful!");

    SwingUtilities.invokeLater(() -> {
        JFrame dashboardFrame = new JFrame(role + " Dashboard");
        dashboardFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        dashboardFrame.setSize(1000, 700);
        dashboardFrame.setLocationRelativeTo(null);

        if (role.equalsIgnoreCase("Admin")) {
            dashboardFrame.setContentPane(new AdminDashboardPanel(email));
        } else {
            dashboardFrame.setContentPane(new StudentDashboardPanel(email));
        }

        dashboardFrame.setVisible(true);
    });

    dispose();
}
 else {
                JOptionPane.showMessageDialog(this, "Invalid credentials.", "Login Failed", JOptionPane.ERROR_MESSAGE);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Database error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(LoginFrame::new);
    }
}
