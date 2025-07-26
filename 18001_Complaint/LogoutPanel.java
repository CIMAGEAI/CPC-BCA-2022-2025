import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class LogoutPanel extends JPanel {

    public LogoutPanel(JFrame parentFrame) {
        setLayout(new BorderLayout());
        setBackground(new Color(245, 245, 245));

        JLabel messageLabel = new JLabel("Are you sure you want to logout?", SwingConstants.CENTER);
        messageLabel.setFont(new Font("Segoe UI", Font.BOLD, 18));
        messageLabel.setForeground(new Color(50, 50, 50));
        add(messageLabel, BorderLayout.CENTER);

        JButton logoutButton = new JButton("Logout");
        logoutButton.setPreferredSize(new Dimension(120, 40));
        logoutButton.setBackground(new Color(220, 53, 69)); // Bootstrap red
        logoutButton.setForeground(Color.WHITE);
        logoutButton.setFocusPainted(false);
        logoutButton.setFont(new Font("Segoe UI", Font.BOLD, 14));

        JPanel buttonPanel = new JPanel();
        buttonPanel.setBackground(new Color(245, 245, 245));
        buttonPanel.add(logoutButton);
        add(buttonPanel, BorderLayout.SOUTH);

        // Action Listener
        logoutButton.addActionListener(e -> {
            int confirm = JOptionPane.showConfirmDialog(this, "Do you really want to logout?", "Confirm Logout", JOptionPane.YES_NO_OPTION);
            if (confirm == JOptionPane.YES_OPTION) {
                parentFrame.dispose(); // Close the dashboard frame
                new LoginFrame();     // Return to login
            }
        });
    }
}
