import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import java.util.regex.Pattern;

public class RegisterFrame extends JFrame {
    private JTextField nameField, emailField, rollField;
    private JPasswordField passwordField;
    private JComboBox<String> deptBox;
    private JButton registerButton, loginLink;

    private JLabel nameError, emailError, rollError, passError, deptError;

    public RegisterFrame() {
        setTitle("Student Registration - CCMS");
        setSize(420, 500);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(null);
        getContentPane().setBackground(new Color(35, 35, 35));

        JLabel title = new JLabel("Register");
        title.setFont(new Font("Arial", Font.BOLD, 24));
        title.setForeground(Color.WHITE);
        title.setBounds(150, 20, 200, 30);
        add(title);

        // Name
        JLabel nameLabel = new JLabel("Name:");
        nameLabel.setBounds(50, 70, 100, 25);
        nameLabel.setForeground(Color.WHITE);
        add(nameLabel);
        nameField = new JTextField();
        nameField.setBounds(150, 70, 180, 25);
        add(nameField);
        nameError = new JLabel(" ");
        nameError.setBounds(150, 95, 200, 15);
        nameError.setForeground(Color.RED);
        nameError.setFont(new Font("Arial", Font.PLAIN, 11));
        add(nameError);

        // Email
        JLabel emailLabel = new JLabel("Email:");
        emailLabel.setBounds(50, 110, 100, 25);
        emailLabel.setForeground(Color.WHITE);
        add(emailLabel);
        emailField = new JTextField();
        emailField.setBounds(150, 110, 180, 25);
        add(emailField);
        emailError = new JLabel(" ");
        emailError.setBounds(150, 135, 200, 15);
        emailError.setForeground(Color.RED);
        emailError.setFont(new Font("Arial", Font.PLAIN, 11));
        add(emailError);

        // Roll No
        JLabel rollLabel = new JLabel("Roll No:");
        rollLabel.setBounds(50, 150, 100, 25);
        rollLabel.setForeground(Color.WHITE);
        add(rollLabel);
        rollField = new JTextField();
        rollField.setBounds(150, 150, 180, 25);
        add(rollField);
        rollError = new JLabel(" ");
        rollError.setBounds(150, 175, 200, 15);
        rollError.setForeground(Color.RED);
        rollError.setFont(new Font("Arial", Font.PLAIN, 11));
        add(rollError);

        // Department Dropdown
        JLabel deptLabel = new JLabel("Department:");
        deptLabel.setBounds(50, 190, 100, 25);
        deptLabel.setForeground(Color.WHITE);
        add(deptLabel);

        String[] departments = {"Select", "Computer Science", "Information Technology", "Mechanical", "Civil", "Electrical", "Electronics"};
        deptBox = new JComboBox<>(departments);
        deptBox.setBounds(150, 190, 180, 25);
        add(deptBox);

        deptError = new JLabel(" ");
        deptError.setBounds(150, 215, 200, 15);
        deptError.setForeground(Color.RED);
        deptError.setFont(new Font("Arial", Font.PLAIN, 11));
        add(deptError);

        // Password
        JLabel passLabel = new JLabel("Password:");
        passLabel.setBounds(50, 230, 100, 25);
        passLabel.setForeground(Color.WHITE);
        add(passLabel);
        passwordField = new JPasswordField();
        passwordField.setBounds(150, 230, 180, 25);
        add(passwordField);
        passError = new JLabel(" ");
        passError.setBounds(150, 255, 200, 15);
        passError.setForeground(Color.RED);
        passError.setFont(new Font("Arial", Font.PLAIN, 11));
        add(passError);

        // Register Button
        registerButton = new JButton("Register");
        registerButton.setBounds(130, 290, 120, 30);
        registerButton.setBackground(new Color(25, 118, 211));
        registerButton.setForeground(Color.WHITE);
        add(registerButton);

        // Back to Login
        loginLink = new JButton("Back to Login");
        loginLink.setBounds(130, 330, 120, 25);
        loginLink.setForeground(Color.LIGHT_GRAY);
        loginLink.setBackground(new Color(35, 35, 35));
        loginLink.setBorder(null);
        add(loginLink);

        // Action Listeners
        registerButton.addActionListener(e -> registerStudent());
        loginLink.addActionListener(e -> {
            dispose();
            new LoginFrame();
        });

        setVisible(true);
    }

    private void registerStudent() {
        String name = nameField.getText().trim();
        String email = emailField.getText().trim();
        String roll = rollField.getText().trim();
        String password = new String(passwordField.getPassword());
        String department = (String) deptBox.getSelectedItem();

        boolean valid = true;

        nameError.setText(" ");
        emailError.setText(" ");
        rollError.setText(" ");
        passError.setText(" ");
        deptError.setText(" ");

        if (!Pattern.matches("^[A-Za-z ]{2,}$", name)) {
            nameError.setText("❌ Enter a valid name (only letters)");
            valid = false;
        }
        if (!Pattern.matches("^[\\w.-]+@[\\w.-]+\\.\\w{2,}$", email)) {
            emailError.setText("❌ Enter a valid email");
            valid = false;
        }
        if (!Pattern.matches("^[A-Za-z0-9]+$", roll)) {
            rollError.setText("❌ Alphanumeric roll number only");
            valid = false;
        }
        if (password.length() < 6) {
            passError.setText("❌ Password must be at least 6 characters");
            valid = false;
        }
        if (department.equals("Select")) {
            deptError.setText("❌ Please select your department");
            valid = false;
        }

        if (!valid) return;

        try (Connection conn = DBConnection.getConnection()) {
            String query = "INSERT INTO student_users(name, email, rollno, password, department) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement pst = conn.prepareStatement(query);
            pst.setString(1, name);
            pst.setString(2, email);
            pst.setString(3, roll);
            pst.setString(4, password);
            pst.setString(5, department);

            pst.executeUpdate();
            JOptionPane.showMessageDialog(this, "🎉 Registered Successfully!");
            dispose();
            new LoginFrame();

        } catch (SQLIntegrityConstraintViolationException ex) {
            JOptionPane.showMessageDialog(this, "⚠️ Email or Roll No already registered!", "Error", JOptionPane.ERROR_MESSAGE);
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "❌ Registration Failed!", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void main(String[] args) {
        new RegisterFrame();
    }
}
