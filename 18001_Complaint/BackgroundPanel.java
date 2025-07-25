import javax.swing.*;
import java.awt.*;

public class BackgroundPanel extends JPanel {
    private Image backgroundImage;

    public BackgroundPanel(String imagePath) {
        // Load the background image
        backgroundImage = new ImageIcon(imagePath).getImage();
        setOpaque(false);
        setLayout(new BorderLayout()); // Default layout (can be changed later)
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.drawImage(backgroundImage, 0, 0, getWidth(), getHeight(), this);
    }
}
