import javax.swing.*;
import java.awt.*;

public class HelpPanel extends JPanel {
    public HelpPanel() {
        setLayout(new BorderLayout());
        setBackground(Color.WHITE);

        JTextArea helpText = new JTextArea(
            "📧 Contact Support:\n\n" +
            "Email: support@college.com\n" +
            "Phone: 1800-000-111\n\n" +
            "For any queries, please reach out during working hours.\n\n" +
            "Thank you!"
        );
        helpText.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        helpText.setEditable(false);
        helpText.setLineWrap(true);
        helpText.setWrapStyleWord(true);
        add(new JScrollPane(helpText), BorderLayout.CENTER);
    }
}
