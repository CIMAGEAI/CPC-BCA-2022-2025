import javax.swing.*;
import java.awt.*;

public class FeedbackPanel extends BackgroundPanel {
    public FeedbackPanel() {
        super("d2.jpeg");
        setLayout(new BorderLayout());

        JLabel label = new JLabel("Feedback", SwingConstants.CENTER);
        label.setFont(new Font("Segoe UI", Font.BOLD, 22));
        add(label, BorderLayout.NORTH);

        JTextArea feedbackArea = new JTextArea("Write your feedback here...");
        feedbackArea.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        add(new JScrollPane(feedbackArea), BorderLayout.CENTER);

        JButton submitFeedbackBtn = new JButton("Submit Feedback");
        submitFeedbackBtn.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        submitFeedbackBtn.addActionListener(e -> {
            String feedback = feedbackArea.getText().trim();
            if (!feedback.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Thank you for your feedback!", "Submitted", JOptionPane.INFORMATION_MESSAGE);
                feedbackArea.setText("");
            } else {
                JOptionPane.showMessageDialog(this, "Please enter feedback before submitting.", "Warning", JOptionPane.WARNING_MESSAGE);
            }
        });

        JPanel bottomPanel = new JPanel();
        bottomPanel.add(submitFeedbackBtn);
        add(bottomPanel, BorderLayout.SOUTH);
    }
}
