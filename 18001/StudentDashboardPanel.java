import javax.swing.*;
import java.awt.*;

public class StudentDashboardPanel extends JPanel {
    private CardLayout cardLayout;
    private JPanel contentPanel;
    private String studentEmail;

    public StudentDashboardPanel(String email) {
        
        this.studentEmail = email;
        setLayout(new BorderLayout());
        
        // Sidebar
        JPanel sidebar = new JPanel(new GridLayout(8, 1, 5, 5));
        sidebar.setBackground(new Color(30, 30, 30));
        sidebar.setPreferredSize(new Dimension(180, getHeight()));
        

        String[] buttons = {
            "Submit Complaint", "Complaint History", "Track Status",
            "Download PDF", "My Profile", "Feedback", "About","Logout"
        };

        for (String label : buttons) {
            JButton btn = new JButton(label);
            btn.setFocusPainted(false);
            btn.setBackground(new Color(60, 63, 65));
            btn.setForeground(Color.WHITE);
            btn.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
            sidebar.add(btn);

            btn.addActionListener(e -> {
                if (label.equals("Logout")) {
                    int confirm = JOptionPane.showConfirmDialog(this, "Do you want to logout?", "Logout", JOptionPane.YES_NO_OPTION);
                    if (confirm == JOptionPane.YES_OPTION) {
                        SwingUtilities.getWindowAncestor(this).dispose();
                        new LoginFrame(); // Back to login
                    }
                } else {
                    cardLayout.show(contentPanel, label);
                }
            });
        }

        // Main content area with CardLayout
        cardLayout = new CardLayout();
        contentPanel = new JPanel(cardLayout);

        contentPanel.add(new SubmitComplaintPanel(studentEmail), "Submit Complaint");
        contentPanel.add(new ComplaintHistoryPanel(studentEmail), "Complaint History");
        contentPanel.add(new ComplaintStatusTrackerPanel(studentEmail), "Track Status");
        contentPanel.add(new DownloadComplaintPanel(studentEmail), "Download PDF");
        contentPanel.add(new MyProfilePanel(studentEmail), "My Profile");
        contentPanel.add(new FeedbackPanel(), "Feedback");
        contentPanel.add(new AboutPanel(), "About");
        
        // contentPanel.add(new ChangePasswordPanel(studentEmail), "Change Password");

        add(sidebar, BorderLayout.WEST);
        add(contentPanel, BorderLayout.CENTER);

        // Show default panel
        cardLayout.show(contentPanel, "Submit Complaint");
    }

    // 🟢 MAIN method to test standalone
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Student Dashboard");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setSize(1000, 650);
            frame.setLocationRelativeTo(null);
            frame.setContentPane(new StudentDashboardPanel("tulikakumari002@gmail.com")); // Replace with valid student email
            frame.setVisible(true);
            
        });
    }
}
