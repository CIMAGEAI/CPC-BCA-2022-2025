import javax.swing.*;
import java.awt.event.*;
import java.util.regex.Pattern;
import java.awt.*;
import java.sql.*;

public class FacultyLoginPage extends JFrame {

    JLabel emailLabel, passwordLabel, heading;
    JTextField emailField;
    JPasswordField pwdField;
    JButton loginButton, backButton;
    JCheckBox rememberMe;
    ImageIcon image;

    // Custom gradient panel
    class GradientPanel extends JPanel {
        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2d = (Graphics2D) g;

            Color color1 = Color.WHITE;
            Color color2 = new Color(201, 160, 220);
            GradientPaint gp = new GradientPaint(0, 0, color1, 0, getHeight(), color2);
            g2d.setPaint(gp);
            g2d.fillRect(0, 0, getWidth(), getHeight());
        }
    }

    // Transparent checkbox
    class TransparentCheckBox extends JCheckBox {
        public TransparentCheckBox(String text) {
            super(text);
            setContentAreaFilled(false);
            setFocusPainted(false);
            setBorderPainted(false);
            setOpaque(false);
        }
    }

    public FacultyLoginPage() {
        setTitle("STUDENT MANAGEMENT SYSTEM");
        setSize(1920, 1080);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        GradientPanel panel = new GradientPanel();
        panel.setLayout(null);
        add(panel);

        heading = new JLabel("<html><b><u>Faculty Login Page</b></u></html>");
        heading.setBounds(500, 140, 300, 30);
        heading.setFont(new Font("Serif", Font.PLAIN, 24));
        panel.add(heading);

        emailLabel = new JLabel("Email : ");
        emailLabel.setBounds(380, 200, 150, 30);
        panel.add(emailLabel);

        emailField = new JTextField(10);
        emailField.setBounds(580, 200, 250, 30);
        panel.add(emailField);

        passwordLabel = new JLabel("Password : ");
        passwordLabel.setBounds(380, 250, 150, 30);
        panel.add(passwordLabel);

        pwdField = new JPasswordField(10);
        pwdField.setBounds(580, 250, 250, 30);
        panel.add(pwdField);

        image = new ImageIcon("logoimage.jpg");
        setIconImage(image.getImage());

        rememberMe = new TransparentCheckBox("Remember me");
        rememberMe.setBounds(370, 300, 120, 20);
        panel.add(rememberMe);

        loginButton = new JButton("Login");
        loginButton.setBounds(580, 300, 100, 30);
        loginButton.setBackground(new Color(218, 177, 218));
        loginButton.setForeground(Color.BLACK);
        panel.add(loginButton);

        backButton = new JButton("Back");
        backButton.setBounds(730, 300, 100, 30);
        backButton.setBackground(new Color(218, 177, 218));
        backButton.setForeground(Color.BLACK);
        backButton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        backButton.addActionListener(e -> {
            new Mainpage();
            dispose();
        });
        panel.add(backButton);

        JLabel signupLabel = new JLabel("<html>Don't have an account? <u>Signup</u></html>");
        signupLabel.setBounds(580, 350, 200, 30);
        signupLabel.setForeground(Color.BLACK);
        signupLabel.setCursor(new Cursor(Cursor.HAND_CURSOR));
        signupLabel.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                new FacultySignUppage();
                dispose();
            }
        });
        panel.add(signupLabel);

        // Login Action
        loginButton.addActionListener(e -> loginFaculty());

        setVisible(true);
    }

    private void loginFaculty() {
        String emailInput = emailField.getText().trim();
        String passwordInput = new String(pwdField.getPassword()).trim();

        if (emailInput.isEmpty() || passwordInput.isEmpty()) {
            JOptionPane.showMessageDialog(this, "All fields are required!", "Validation Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (!isValidEmail(emailInput)) return;

        if (!isValidPassword(passwordInput)) {
            JOptionPane.showMessageDialog(this,
                    "Password must contain:\n" +
                            "• At least one uppercase letter (A-Z)\n" +
                            "• At least one lowercase letter (a-z)\n" +
                            "• At least one number (0-9)\n" +
                            "• At least one special character (!@#$%^&*)\n" +
                            "• Minimum 8 characters",
                    "Password Validation Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        try {
            Connection conn = CBConnection.getConnection();

            String query = "SELECT * FROM faculty WHERE email = ? AND password = ?";
            PreparedStatement pst = conn.prepareStatement(query);
            pst.setString(1, emailInput);
            pst.setString(2, passwordInput);

            ResultSet rs = pst.executeQuery();

            if (rs.next()) {
                JOptionPane.showMessageDialog(this, "Login Successful!", "Success", JOptionPane.INFORMATION_MESSAGE);
                new Homepage();
                dispose();
            } else {
                JOptionPane.showMessageDialog(this, "Invalid email or password!", "Login Failed", JOptionPane.ERROR_MESSAGE);
            }

            rs.close();
            pst.close();
            conn.close();

        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Database Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            ex.printStackTrace();
        }
    }

    private boolean isValidEmail(String email) {
        String pattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        if (!Pattern.matches(pattern, email)) {
            JOptionPane.showMessageDialog(this, "Please enter a valid email address!\nExample: faculty@university.edu",
                    "Email Validation Error", JOptionPane.ERROR_MESSAGE);
            return false;
        }
        return true;
    }

    private boolean isValidPassword(String password) {
        if (password.length() < 8) return false;

        boolean hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;
        String specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if (specialChars.indexOf(c) != -1) hasSpecial = true;
        }

        return hasUpper && hasLower && hasDigit && hasSpecial;
    }

    public static void main(String[] args) {
        new FacultyLoginPage();
    }
}
