package university;

import javax.swing.*;
import java.awt.*;

public class Splash extends JFrame implements Runnable {
    Thread t;
    JProgressBar progressBar;

    Splash() {

        setUndecorated(true);
        setLayout(null);

        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icon/splash1.png"));
        Image i2 = i1.getImage().getScaledInstance(1000, 700, Image.SCALE_SMOOTH);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel background = new JLabel(i3);
        background.setBounds(0, 0, 1000, 700);
        add(background);

        JLabel title = new JLabel("JAMES UNIVERSITY");
        title.setBounds(300, 50, 500, 60);
        title.setFont(new Font("Serif", Font.BOLD, 40));
        title.setForeground(Color.YELLOW);
        background.add(title);


        progressBar = new JProgressBar();
        progressBar.setBounds(200, 587, 600, 25);
        progressBar.setForeground(Color.ORANGE);
        progressBar.setStringPainted(true);
        background.add(progressBar);

        setSize(1000, 700);
        setLocationRelativeTo(null);
        setVisible(true);


        t = new Thread(this);
        t.start();
    }

    @Override
    public void run() {
        try {
            for (int i = 0; i <= 100; i++) {
                progressBar.setValue(i);
                Thread.sleep(50);
            }

            setVisible(false);
            new Login();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        new Splash();
    }
}
