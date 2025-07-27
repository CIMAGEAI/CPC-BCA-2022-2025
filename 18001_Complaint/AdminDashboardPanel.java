import javax.swing.*;
import java.awt.*;

public class AdminDashboardPanel extends BackgroundPanel {

    public AdminDashboardPanel(String adminEmail) {
        super("d2.jpeg");
        setLayout(new BorderLayout());
        //setBackground(new Color(40, 40, 40));
       
        // Header
        JLabel title = new JLabel("Admin Dashboard - Complaint Management", SwingConstants.CENTER);
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        title.setForeground(Color.WHITE);
        title.setBorder(BorderFactory.createEmptyBorder(20, 0, 20, 0));
        add(title, BorderLayout.NORTH);

        

        // Button Panel
        JPanel buttonPanel = new JPanel(new GridLayout(5, 2, 15, 15));
        buttonPanel.setBackground(new Color(40, 40, 40));
        buttonPanel.setBorder(BorderFactory.createEmptyBorder(30, 80, 30, 80));
        buttonPanel.setOpaque(false);

        String[] buttonNames = {
            "📋 View All Complaints",
            "🔍 Search Complaint by Student",
            "📬 Change Complaint Status",
            "📤 Reply to Complaint",
            "👨‍🎓 View Student Details",
            "🧑‍💼 Add / Manage Admins",
            "📈 Dashboard Analytics",
            "🚪 Logout"
        };

        for (String name : buttonNames) {
            JButton btn = new JButton(name);
            btn.setFocusPainted(false);
            btn.setFont(new Font("Segoe UI", Font.PLAIN, 16));
            btn.setBackground(new Color(60, 63, 65));
            btn.setForeground(Color.WHITE);
            buttonPanel.add(btn);

            // Action Listeners for navigation
            btn.addActionListener(e -> handleAction(name, adminEmail));
        }

        add(buttonPanel, BorderLayout.CENTER);
    }

    private void handleAction(String action, String email) {
        switch (action) {
            case "📋 View All Complaints":
                showPanel(new ViewAllComplaints());
                break;
            case "🔍 Search Complaint by Student":
                showPanel(new SearchComplaint());
                break;
            case "📬 Change Complaint Status":
                showPanel(new ChangeComplaintStatus());
                break;
            case "📤 Reply to Complaint":
                showPanel(new ReplyToComplaint());
                break;
            case "👨‍🎓 View Student Details":
                showPanel(new ViewStudentDetails());
                break;
            case "🧑‍💼 Add / Manage Admins":
                showPanel(new ManageAdmins());
                break;
            case "📈 Dashboard Analytics":
                showPanel(new AdminAnalytics());
                break;
            case "🚪 Logout":
                int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to logout?", "Logout", JOptionPane.YES_NO_OPTION);
                if (confirm == JOptionPane.YES_OPTION) {
                    SwingUtilities.getWindowAncestor(this).dispose();
                    new LoginFrame(); // return to login
                }
                break;
        }
    }

    private void showPanel(JPanel panel) {
        JFrame frame = new JFrame("Admin Panel");
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        frame.setSize(900, 600);
        frame.setLocationRelativeTo(null);
        frame.setContentPane(panel);
        frame.setVisible(true);
        
    }

    // 🟢 MAIN method to run this panel directly for testing
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Admin Dashboard");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setSize(1000, 700);
            frame.setLocationRelativeTo(null);
            frame.setContentPane(new AdminDashboardPanel("admin@example.com")); // Dummy email
            frame.setVisible(true);
            
            
        });
    }
}
