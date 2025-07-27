/*import javax.swing.*;
import java.awt.*;
import java.sql.*;

public class DashboardFrame extends JFrame {
    private JPanel sidebar;
    private JPanel contentPanel;
    private String email;
    private String role;
    private JLabel headerLabel;

    public DashboardFrame(String email, String role) {
        this.email = email;
        this.role = role;

        setTitle("College Complaint Management System - Dashboard");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1100, 700);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // Sidebar setup
        sidebar = new JPanel();
        sidebar.setPreferredSize(new Dimension(220, getHeight()));
        sidebar.setBackground(new Color(25, 25, 25));
        sidebar.setLayout(new GridLayout(10, 1, 0, 5));

        String[] menuItems = {
            "Dashboard", "Submit Complaint", "View Complaints", "Notifications",
            "Help", "Profile", "About", "Settings", "Logout"
        };

        for (String item : menuItems) {
            JButton btn = new JButton(item);
            btn.setFocusPainted(false);
            btn.setBackground(new Color(45, 45, 45));
            btn.setForeground(Color.WHITE);
            btn.setFont(new Font("Segoe UI", Font.BOLD, 15));
            btn.setBorder(BorderFactory.createEmptyBorder(10, 20, 10, 20));
            btn.setHorizontalAlignment(SwingConstants.LEFT);
            btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
            btn.setActionCommand(item);
            btn.addActionListener(e -> loadContent(e.getActionCommand()));
            sidebar.add(btn);
        }

        // Header with dynamic welcome name
        headerLabel = new JLabel("College Complaint Management System", JLabel.CENTER);
        headerLabel.setFont(new Font("Segoe UI", Font.BOLD, 24));
        headerLabel.setForeground(new Color(30, 30, 30));
        headerLabel.setBorder(BorderFactory.createEmptyBorder(15, 10, 15, 10));
        add(headerLabel, BorderLayout.NORTH);

        add(sidebar, BorderLayout.WEST);

        contentPanel = new JPanel(new BorderLayout());
        contentPanel.setBackground(Color.WHITE);
        add(contentPanel, BorderLayout.CENTER);

        setWelcomeHeader(); // Load name from DB and update header

        loadContent("Dashboard");
        setVisible(true);
    }

    private void setWelcomeHeader() {
        try (Connection conn = DBConnection.getConnection()) {
            String table = role.equalsIgnoreCase("Admin") ? "admin_users" : "student_users";
            String query = "SELECT name FROM " + table + " WHERE email = ?";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                String name = rs.getString("name");
                headerLabel.setText("Welcome, " + name + " (" + role + ")");
            } else {
                headerLabel.setText("Welcome (" + role + ")");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            headerLabel.setText("Welcome (" + role + ")");
        }
    }

    private void switchPanel(JPanel panel) {
        contentPanel.removeAll();
        contentPanel.add(panel, BorderLayout.CENTER);
        contentPanel.revalidate();
        contentPanel.repaint();
    }
public String getEmail() {
    return this.email;
}

    public void loadContent(String menuName) {
        contentPanel.removeAll();

        switch (menuName) {
            case "Dashboard":
                contentPanel.add(new WelcomePanel());
                break;
            case "Submit Complaint":
                contentPanel.add(new SubmitComplaintPanel(this));
                break;
            case "View Complaints":
                contentPanel.add(new ComplaintListPanel());
                break;
            case "Notifications":
                contentPanel.add(new NotificationsPanel());
                break;
            case "Help":
                contentPanel.add(new HelpPanel());
                break;
            case "Profile":
                contentPanel.add(new ProfilePanel(email));
                break;
            case "About":
                contentPanel.add(new AboutPanel());
                break;
            case "Settings":
                contentPanel.add(new SettingsPanel());
                break;
            case "Logout":
                int choice = JOptionPane.showConfirmDialog(this, "Do you want to logout?", "Confirm", JOptionPane.YES_NO_OPTION);
                if (choice == JOptionPane.YES_OPTION) {
                    dispose();
                    new LoginFrame(); // Go back to login
                }
                break;
            default:
                contentPanel.add(new JLabel("Unknown Page"));
                break;
        }

        contentPanel.revalidate();
        contentPanel.repaint();
    }

    // Optional main for testing only
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new DashboardFrame("tulikakumari002@gmail.com", "Student"));
    }
}
*/