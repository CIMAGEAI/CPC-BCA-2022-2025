package university_managment_system;

import java.awt.*;
import javax.swing.*;

public class Splash extends JFrame implements Runnable {
    Thread t;

    Splash() {
        ImageIcon icon = new ImageIcon(ClassLoader.getSystemResource("icons/first.jpeg"));
        Image icon2 = icon.getImage().getScaledInstance(1000, 700, Image.SCALE_DEFAULT);
        ImageIcon icon3 = new ImageIcon(icon2);
        JLabel image = new JLabel(icon3);
        add(image);

        t = new Thread(this);
        t.start();

        setUndecorated(true); // Ensure the frame is undecorated
        setOpacity(0f); // Start with full transparency
        setVisible(true);

        // Fade-in effect
        for (float i = 0; i <= 1.0; i += 0.01) {
            setOpacity(i);
            try {
                Thread.sleep(10);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // Slide-in animation
        int x = 1;
        for (int i = 0; i <= 600; i += 4, x += 1) {
            setLocation(600 - ((i + x) / 2), 350 - (i / 2));
            setSize(i + 3 * x, i + (x / 2));
            try {
                Thread.sleep(10);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void run() {
        try {
            Thread.sleep(7000);
            // Fade-out effect
            for (float i = 1.0f; i >= 0; i -= 0.01f) {
                setOpacity(i);
                Thread.sleep(10);
            }
            setVisible(false);
            new Login(); // Ensure this line calls the Login class
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        new Splash();
    }
}
