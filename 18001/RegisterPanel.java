import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import java.util.regex.Pattern;

public class RegisterPanel extends JFrame {
    private JComboBox<String> roleBox, deptBox;
    private JTextField nameField, rollField, emailField;
    private JPasswordField passwordField;
    private JLabel nameError, rollError, deptError, emailError, passError;
    private Image backgroundImage;

    public RegisterPanel() {
        // Load background image
        backgroundImage = new ImageIcon("d5.jpeg").getImage();  // Replace with your image path

        setTitle("Register - College Complaint Management");
        setSize(500, 600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        JPanel bgPanel = new JPanel(new GridBagLayout()) {
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                g.drawImage(backgroundImage, 0, 0, getWidth(), getHeight(), this);
            }
        };
        bgPanel.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 10, 5, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        Font labelFont = new Font("Arial", Font.PLAIN, 14);

        // Title
        JLabel title = new JLabel("User Registration");
        title.setFont(new Font("Arial", Font.BOLD, 20));
        title.setForeground(Color.WHITE);
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        bgPanel.add(title, gbc);

        gbc.gridwidth = 1;

        // Role
        gbc.gridy++;
        addLabel(bgPanel, gbc, "Role:", labelFont);
        gbc.gridx = 1;
        roleBox = new JComboBox<>(new String[]{"Student", "Admin"});
        roleBox.setOpaque(false);
        bgPanel.add(roleBox, gbc);
        gbc.gridx = 0;

        // Name
        gbc.gridy++;
        addLabel(bgPanel, gbc, "Full Name:", labelFont);
        gbc.gridx = 1;
        nameField = new JTextField();
        bgPanel.add(nameField, gbc);
        gbc.gridy++;
        gbc.gridx = 1;
        nameError = createErrorLabel();
        bgPanel.add(nameError, gbc);
        gbc.gridx = 0;

        // Roll No
        gbc.gridy++;
        addLabel(bgPanel, gbc, "Roll No:", labelFont);
        gbc.gridx = 1;
        rollField = new JTextField();
        bgPanel.add(rollField, gbc);
        gbc.gridy++;
        gbc.gridx = 1;
        rollError = createErrorLabel();
        bgPanel.add(rollError, gbc);
        gbc.gridx = 0;

        // Department
        gbc.gridy++;
        addLabel(bgPanel, gbc, "Department:", labelFont);
        gbc.gridx = 1;
        deptBox = new JComboBox<>(new String[]{"Select", "Computer Science", "IT", "Mechanical", "Electrical", "Electronics", "Civil"});
        bgPanel.add(deptBox, gbc);
        gbc.gridy++;
        gbc.gridx = 1;
        deptError = createErrorLabel();
        bgPanel.add(deptError, gbc);
        gbc.gridx = 0;

        // Email
        gbc.gridy++;
        addLabel(bgPanel, gbc, "Email:", labelFont);
        gbc.gridx = 1;
        emailField = new JTextField();
        bgPanel.add(emailField, gbc);
        gbc.gridy++;
        gbc.gridx = 1;
        emailError = createErrorLabel();
        bgPanel.add(emailError, gbc);
        gbc.gridx = 0;

        // Password
        gbc.gridy++;
        addLabel(bgPanel, gbc, "Password:", labelFont);
        gbc.gridx = 1;
        passwordField = new JPasswordField();
        bgPanel.add(passwordField, gbc);
        gbc.gridy++;
        gbc.gridx = 1;
        passError = createErrorLabel();
        bgPanel.add(passError, gbc);
        gbc.gridx = 0;

        // Register Button
        gbc.gridy++;
        gbc.gridx = 0;
        gbc.gridwidth = 2;
        JButton registerButton = new JButton("Register");
        registerButton.setBackground(new Color(0, 120, 215));
        registerButton.setForeground(Color.WHITE);
        bgPanel.add(registerButton, gbc);

        // Add bgPanel
        setContentPane(bgPanel);

        registerButton.addActionListener(e -> registerUser());

        setVisible(true);
    }

    private void addLabel(JPanel panel, GridBagConstraints gbc, String text, Font font) {
        JLabel label = new JLabel(text);
        label.setForeground(Color.WHITE);
        label.setFont(font);
        panel.add(label, gbc);
    }

    private JLabel createErrorLabel() {
        JLabel errorLabel = new JLabel(" ");
        errorLabel.setForeground(Color.RED);
        errorLabel.setFont(new Font("Arial", Font.PLAIN, 11));
        return errorLabel;
    }

    private void registerUser() {
        String role = (String) roleBox.getSelectedItem();
        String name = nameField.getText().trim();
        String roll = rollField.getText().trim();
        String dept = (String) deptBox.getSelectedItem();
        String email = emailField.getText().trim();
        String password = new String(passwordField.getPassword());

        nameError.setText(" ");
        rollError.setText(" ");
        deptError.setText(" ");
        emailError.setText(" ");
        passError.setText(" ");

        boolean isValid = true;

        if (!Pattern.matches("^[A-Za-z ]{2,}$", name)) {
            nameError.setText("❌ Only alphabets allowed");
            isValid = false;
        }

        if (!role.equals("Admin") && !Pattern.matches("^[A-Za-z0-9]+$", roll)) {
            rollError.setText("❌ Invalid roll number");
            isValid = false;
        }

        if (!role.equals("Admin") && (dept.equals("Select") || dept.isEmpty())) {
            deptError.setText("❌ Please select a department");
            isValid = false;
        }

        if (!Pattern.matches("^[\\w.-]+@[\\w.-]+\\.\\w{2,}$", email)) {
            emailError.setText("❌ Invalid email format");
            isValid = false;
        }

        if (password.length() < 6) {
            passError.setText("❌ Minimum 6 characters");
            isValid = false;
        }

        if (!isValid) return;

        try (Connection conn = DBConnection.getConnection()) {
            if (role.equalsIgnoreCase("Admin")) {
                String query = "INSERT INTO admin_users (name, email, password) VALUES (?, ?, ?)";
                PreparedStatement ps = conn.prepareStatement(query);
                ps.setString(1, name);
                ps.setString(2, email);
                ps.setString(3, password);
                ps.executeUpdate();
            } else {
                String query = "INSERT INTO student_users (name, rollno, department, email, password) VALUES (?, ?, ?, ?, ?)";
                PreparedStatement ps = conn.prepareStatement(query);
                ps.setString(1, name);
                ps.setString(2, roll);
                ps.setString(3, dept);
                ps.setString(4, email);
                ps.setString(5, password);
                ps.executeUpdate();
            }

            JOptionPane.showMessageDialog(this, "✅ Registration successful!");

SwingUtilities.invokeLater(() -> {
    JFrame dashboard = new JFrame(role + " Dashboard");
    dashboard.setSize(1000, 700);
    dashboard.setLocationRelativeTo(null);
    dashboard.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

    if (role.equalsIgnoreCase("Admin")) {
        dashboard.setContentPane(new AdminDashboardPanel(email));
    } else {
        dashboard.setContentPane(new StudentDashboardPanel(email));
    }

    dashboard.setVisible(true);
});

dispose(); // close registration form


        } catch (SQLIntegrityConstraintViolationException ex) {
            JOptionPane.showMessageDialog(this, "⚠️ Email or Roll No already exists!", "Duplicate Entry", JOptionPane.ERROR_MESSAGE);
        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "❌ Database error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void main(String[] args) {
        new RegisterPanel();
    }
}
