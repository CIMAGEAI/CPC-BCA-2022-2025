import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import java.util.regex.*;

public class FacultySignUppage extends JFrame {
    JLabel username, phone, email, password, heading;
    JTextField t1, ph, e1;
    JPasswordField p1;
    JButton b1, backButton;
    ImageIcon image;

    // Custom JPanel for gradient background
    class GradientPanel extends JPanel {
        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2d = (Graphics2D) g;
            Color color1 = Color.WHITE;
            Color color2 = new Color(201, 160, 220);
            GradientPaint gradientPaint = new GradientPaint(0, 0, color1, 0, getHeight(), color2);
            g2d.setPaint(gradientPaint);
            g2d.fillRect(0, 0, getWidth(), getHeight());
        }
    }

    FacultySignUppage() {
        setTitle("Faculty Signup Page");
        setSize(1920, 1080);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        GradientPanel panel = new GradientPanel();
        panel.setLayout(null);
        add(panel);

        heading = new JLabel("<html><b><u>Faculty Signup Page</u></b></html>");
        heading.setBounds(500, 120, 300, 30);
        heading.setFont(new Font("serif", Font.BOLD, 22));
        panel.add(heading);

        int x = 400;
        int y = 190;
        int gap = 50;

        // Username
        username = new JLabel("Enter Username:");
        username.setBounds(x, y, 150, 30);
        t1 = new JTextField();
        t1.setBounds(x + 160, y, 250, 30);
        panel.add(username);
        panel.add(t1);

        y += gap;

        // Phone Number
        phone = new JLabel("Phone Number:");
        phone.setBounds(x, y, 150, 30);
        ph = new JTextField();
        ph.setBounds(x + 160, y, 250, 30);
        panel.add(phone);
        panel.add(ph);

        y += gap;

        // Email
        email = new JLabel("Email:");
        email.setBounds(x, y, 150, 30);
        e1 = new JTextField();
        e1.setBounds(x + 160, y, 250, 30);
        panel.add(email);
        panel.add(e1);

        y += gap;

        // Password
        password = new JLabel("Password:");
        password.setBounds(x, y, 150, 30);
        p1 = new JPasswordField();
        p1.setBounds(x + 160, y, 250, 30);
        panel.add(password);
        panel.add(p1);

        y += gap;

        // Sign Up Button
        b1 = new JButton("Sign Up");
        b1.setBounds(x + 160, y, 100, 30);
        b1.setBackground(new Color(218, 177, 218));
        b1.setCursor(new Cursor(Cursor.HAND_CURSOR));
        panel.add(b1);

        // Back Button
        backButton = new JButton("Back");
        backButton.setBounds(x + 310, y, 100, 30);
        backButton.setBackground(new Color(218, 177, 218));
        backButton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        panel.add(backButton);

        // Image Icon
        image = new ImageIcon("logoimage.jpg");
        setIconImage(image.getImage());

        // Sign Up Action
        b1.addActionListener(e -> handleSignup());

        // Back Action
        backButton.addActionListener(e -> {
            new Mainpage();
            dispose();
        });

        setVisible(true);
    }

    private void handleSignup() {
        String uname = t1.getText().trim();
        String phoneNo = ph.getText().trim();
        String emailId = e1.getText().trim();
        String pass = new String(p1.getPassword()).trim();

        // Input validation
        if (uname.isEmpty() || phoneNo.isEmpty() || emailId.isEmpty() || pass.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please fill all fields.");
            return;
        }

        if (!phoneNo.matches("\\d{10}")) {
            JOptionPane.showMessageDialog(this, "Phone number must be 10 digits.");
            return;
        }

        if (!isValidEmail(emailId)) {
            JOptionPane.showMessageDialog(this, "Please enter a valid email address!\nExample: faculty@university.edu");
            return;
        }

        if (!isValidPassword(pass)) {
            JOptionPane.showMessageDialog(this,
                    "Password must contain:\n" +
                            "• At least one uppercase letter (A-Z)\n" +
                            "• At least one lowercase letter (a-z)\n" +
                            "• At least one number (0-9)\n" +
                            "• At least one special character (!@#$%^&*)\n" +
                            "• Minimum 8 characters",
                    "Password Validation Error",
                    JOptionPane.ERROR_MESSAGE
            );
            return;
        }

        // Save to database
        try {
            Connection conn = CBConnection.getConnection();

            if (conn == null) {
                JOptionPane.showMessageDialog(this, "Database connection failed.", "DB Error", JOptionPane.ERROR_MESSAGE);
                return;
            }

            String sql = "INSERT INTO faculty (username, phone_number, email, password) VALUES (?, ?, ?, ?)";
            PreparedStatement pst = conn.prepareStatement(sql);
            pst.setString(1, uname);
            pst.setString(2, phoneNo);
            pst.setString(3, emailId);
            pst.setString(4, pass);
            pst.executeUpdate();

            JOptionPane.showMessageDialog(this, "Faculty Registered Successfully!");
            new FacultyLoginPage();
            dispose();

        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Database Error: " + ex.getMessage());
        }
    }

    private boolean isValidEmail(String email) {
        String regex = "^[\\w.-]+@[\\w.-]+\\.\\w+$";
        Pattern pattern = Pattern.compile(regex);
        return pattern.matcher(email).matches();
    }

    private boolean isValidPassword(String pass) {
        if (pass.length() < 8) {
            return false;
        }

        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;

        String specialChars = "!@#$%^&*";

        for (char c : pass.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if (specialChars.indexOf(c) != -1) hasSpecial = true;
        }

        return hasUpper && hasLower && hasDigit && hasSpecial;
    }

    public static void main(String[] args) {
        new FacultySignUppage();
    }
}
