import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class StudentRegister extends JFrame {
    private JTextField nameField, rollField, deptField, emailField;
    private JPasswordField passwordField, confirmPasswordField;

    public StudentRegister() {
        setTitle("Student Registration - CCMS");
        setSize(450, 450);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(new BorderLayout());

        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBackground(new Color(40, 40, 40));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JLabel title = new JLabel("Register Student", SwingConstants.CENTER);
        title.setFont(new Font("Segoe UI", Font.BOLD, 20));
        title.setForeground(Color.WHITE);
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        panel.add(title, gbc);

        gbc.gridwidth = 1;
        gbc.gridy++;
        panel.add(createLabel("Full Name:"), gbc);
        gbc.gridx = 1;
        nameField = new JTextField(15);
        panel.add(nameField, gbc);

        gbc.gridx = 0;
        gbc.gridy++;
        panel.add(createLabel("Roll Number:"), gbc);
        gbc.gridx = 1;
        rollField = new JTextField(15);
        panel.add(rollField, gbc);

        gbc.gridx = 0;
        gbc.gridy++;
        panel.add(createLabel("Department:"), gbc);
        gbc.gridx = 1;
        deptField = new JTextField(15);
        panel.add(deptField, gbc);

        gbc.gridx = 0;
        gbc.gridy++;
        panel.add(createLabel("Email:"), gbc);
        gbc.gridx = 1;
        emailField = new JTextField(15);
        panel.add(emailField, gbc);

        gbc.gridx = 0;
        gbc.gridy++;
        panel.add(createLabel("Password:"), gbc);
        gbc.gridx = 1;
        passwordField = new JPasswordField(15);
        panel.add(passwordField, gbc);

        gbc.gridx = 0;
        gbc.gridy++;
        panel.add(createLabel("Confirm Password:"), gbc);
        gbc.gridx = 1;
        confirmPasswordField = new JPasswordField(15);
        panel.add(confirmPasswordField, gbc);

        gbc.gridx = 0;
        gbc.gridy++;
        gbc.gridwidth = 2;
        JButton registerBtn = new JButton("Register");
        registerBtn.setBackground(new Color(70, 70, 70));
        registerBtn.setForeground(Color.WHITE);
        registerBtn.setFocusPainted(false);
        registerBtn.addActionListener(e -> registerStudent());
        panel.add(registerBtn, gbc);

        add(panel, BorderLayout.CENTER);
        setVisible(true);
    }

    private JLabel createLabel(String text) {
        JLabel label = new JLabel(text);
        label.setForeground(Color.WHITE);
        return label;
    }

    private void registerStudent() {
        String name = nameField.getText().trim();
        String roll = rollField.getText().trim();
        String dept = deptField.getText().trim();
        String email = emailField.getText().trim();
        String pass = new String(passwordField.getPassword());
        String confirmPass = new String(confirmPasswordField.getPassword());

        if (name.isEmpty() || roll.isEmpty() || dept.isEmpty() || email.isEmpty() || pass.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please fill all fields.", "Warning", JOptionPane.WARNING_MESSAGE);
            return;
        }

        if (!pass.equals(confirmPass)) {
            JOptionPane.showMessageDialog(this, "Passwords do not match.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {
            String query = "INSERT INTO student_users (fullname, rollno, department, email, password) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, name);
            stmt.setString(2, roll);
            stmt.setString(3, dept);
            stmt.setString(4, email);
            stmt.setString(5, pass); // In real projects, hash this

            stmt.executeUpdate();
            JOptionPane.showMessageDialog(this, "Student registered successfully!");
            dispose();
        } catch (SQLIntegrityConstraintViolationException ex) {
            JOptionPane.showMessageDialog(this, "Roll Number already exists.", "Error", JOptionPane.ERROR_MESSAGE);
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Registration failed.", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(StudentRegister::new);
    }
}
