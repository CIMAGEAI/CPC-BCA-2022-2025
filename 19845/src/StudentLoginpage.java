import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import java.util.regex.Pattern;

public class StudentLoginpage extends JFrame {
    JLabel username, password, heading;
    JTextField textfield;
    JPasswordField pwd;
    JButton login, backButton;
    JCheckBox checkbox;
    ImageIcon image;

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

    public StudentLoginpage() {
        setTitle("STUDENT MANAGEMENT SYSTEM");
        setSize(1920, 1080);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        GradientPanel panel = new GradientPanel();
        panel.setLayout(null);
        add(panel);

        image = new ImageIcon("logoimage.jpg");
        setIconImage(image.getImage());

        heading = new JLabel("<html><b><u>Student Login Page</b></u></html>");
        heading.setBounds(500, 140, 300, 30);
        heading.setFont(new Font("serif", Font.PLAIN, 24));
        panel.add(heading);

        username = new JLabel("Email : ");
        textfield = new JTextField(10);
        username.setBounds(380, 200, 150, 30);
        textfield.setBounds(580, 200, 250, 30);
        panel.add(username);
        panel.add(textfield);

        password = new JLabel("Password : ");
        pwd = new JPasswordField(10);
        password.setBounds(380, 250, 150, 30);
        pwd.setBounds(580, 250, 250, 30);
        panel.add(password);
        panel.add(pwd);

        checkbox = new JCheckBox("Remember me");
        checkbox.setBounds(370, 300, 120, 20);
        checkbox.setOpaque(false);
        panel.add(checkbox);

        login = new JButton("Login");
        login.setBounds(580, 300, 100, 30);
        login.setBackground(new Color(218, 177, 218));
        login.setForeground(Color.BLACK);
        panel.add(login);

        backButton = new JButton("Back");
        backButton.setBounds(730, 300, 100, 30);
        backButton.setBackground(new Color(218, 177, 218));
        backButton.setForeground(Color.BLACK);
        panel.add(backButton);

        backButton.addActionListener(e -> {
            new Mainpage(); // Go back to Mainpage
            dispose();
        });

        login.addActionListener(e -> handleLogin());

        setVisible(true);
    }

    private void handleLogin() {
        String emailInput = textfield.getText().trim();
        String passwordInput = new String(pwd.getPassword()).trim();

        if (emailInput.isEmpty() || passwordInput.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Email and Password cannot be empty!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (!isValidEmail(emailInput)) {
            JOptionPane.showMessageDialog(this, "Invalid email format!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Database validation using student_login table
        try {
            Connection con = CBConnection.getConnection(); // Your DB Connection Class
            String sql = "SELECT * FROM student_login WHERE email = ? AND password = ?";
            PreparedStatement pst = con.prepareStatement(sql);
            pst.setString(1, emailInput);
            pst.setString(2, passwordInput);

            ResultSet rs = pst.executeQuery();

            if (rs.next()) {
                JOptionPane.showMessageDialog(this, "Login Successful!");

                // Pass email to StudentHomePage
                new StudentHomePage(emailInput);
                dispose();
            } else {
                JOptionPane.showMessageDialog(this, "Invalid Email or Password!", "Login Failed", JOptionPane.ERROR_MESSAGE);
            }

            rs.close();
            pst.close();
            con.close();

        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Database Error: " + ex.getMessage());
        }
    }

    // Email validation method
    private boolean isValidEmail(String email) {
        String emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return Pattern.matches(emailPattern, email);
    }

    public static void main(String[] args) {
        new StudentLoginpage();
    }
}
