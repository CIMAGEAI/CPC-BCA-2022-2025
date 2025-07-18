import javax.swing.*;
import java.awt.*;

public class SplashScreen extends JFrame {

    private JProgressBar progressBar;
    private Timer timer;
    private int progress = 0;

    public SplashScreen() {
        setUndecorated(true);
        setSize(700, 400);
        setLocationRelativeTo(null);
        setLayout(null);

        // Custom panel with gradient background
        JPanel content = new JPanel() {
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                Color color1 = new Color(44, 62, 80);  // dark blue
                Color color2 = new Color(52, 152, 219); // sky blue
                GradientPaint gp = new GradientPaint(0, 0, color1, getWidth(), getHeight(), color2);
                g2d.setPaint(gp);
                g2d.fillRect(0, 0, getWidth(), getHeight());
            }
        };
        content.setBounds(0, 0, 700, 400);
        content.setLayout(null);
        add(content);

        // Logo (optional)
        ImageIcon icon = new ImageIcon("resources/logo.png"); // optional logo
        Image scaledImage = icon.getImage().getScaledInstance(100, 100, Image.SCALE_SMOOTH);
        JLabel logo = new JLabel(new ImageIcon(scaledImage));
        logo.setBounds(300, 30, 100, 100);
        content.add(logo);

        // Project Title
        JLabel title = new JLabel("College Complaint Management System", SwingConstants.CENTER);
        title.setFont(new Font("Segoe UI", Font.BOLD, 20));
        title.setForeground(Color.WHITE);
        title.setBounds(100, 140, 500, 30);
        content.add(title);

        // Subtitle
        JLabel subtitle = new JLabel("Final Year Project • BCA CS", SwingConstants.CENTER);
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        subtitle.setForeground(Color.WHITE);
        subtitle.setBounds(100, 175, 500, 25);
        content.add(subtitle);

        // Progress bar
        progressBar = new JProgressBar();
        progressBar.setBounds(150, 250, 400, 20);
        progressBar.setForeground(new Color(255, 255, 255));
        progressBar.setBackground(new Color(0, 0, 0, 50));
        progressBar.setBorderPainted(false);
        content.add(progressBar);

        // Footer
        JLabel footer = new JLabel("Developed by: Tulika Kumari | Dept. of Computer Science", SwingConstants.CENTER);
        footer.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        footer.setForeground(Color.LIGHT_GRAY);
        footer.setBounds(150, 330, 400, 20);
        content.add(footer);

        // Animate progress bar
        timer = new Timer(40, e -> {
            progress++;
            progressBar.setValue(progress);
            if (progress >= 100) {
                timer.stop();
                dispose();
                new LoginFrame(); // Redirect to Login
            }
        });
        timer.start();

        setVisible(true);
    }

    public static void main(String[] args) {
        new SplashScreen();
    }
}
