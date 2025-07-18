import javax.swing.*;
import java.awt.*;

public class AboutPanel extends BackgroundPanel {
    public AboutPanel() {
        super("d2.jpeg"); // ✅ Background image path
        setLayout(new BorderLayout());

        JTextArea aboutText = new JTextArea(
            "🎓 College Complaint Management System (CCMS)\n\n" +
            "🛠 Version: 1.0\n" +
            "📅 Academic Year: 2022-2025\n" +
            "👩‍💻 Developed by: Tulika Kumari\n" +
            "💡 Project Type: Final Year Project\n\n" +
            "📌 Description:\n" +
            "This project allows students to file complaints online,\n" +
            "track status, and receive notifications.\n\n" +
            "© 2025 Department of Computer Science, Cimage Professional College."
        );

        aboutText.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        aboutText.setForeground(Color.WHITE); // ✅ Better visibility on dark background
        aboutText.setEditable(false);
        aboutText.setLineWrap(true);
        aboutText.setWrapStyleWord(true);
        aboutText.setOpaque(false);

        JScrollPane scrollPane = new JScrollPane(aboutText);
        scrollPane.setOpaque(false);                          // ✅ Transparent scroll pane
        scrollPane.getViewport().setOpaque(false);            // ✅ Transparent viewport
        scrollPane.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20)); // Padding

        add(scrollPane, BorderLayout.CENTER);
    }
}
