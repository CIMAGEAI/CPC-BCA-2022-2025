package travel.and.tourism;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Paytm extends JFrame implements ActionListener {

    JButton back;

    Paytm() {
        super("Pay via Paytm");
        setBounds(500, 200, 800, 600);
        setLayout(null);
        getContentPane().setBackground(Color.WHITE);

        JLabel heading = new JLabel("Scan QR to Pay");
        heading.setFont(new Font("Tahoma", Font.BOLD, 20));
        heading.setBounds(300, 20, 200, 30);
        add(heading);

        ImageIcon icon = new ImageIcon(ClassLoader.getSystemResource("icons/qr.jpg"));
        Image img = icon.getImage().getScaledInstance(300, 300, Image.SCALE_SMOOTH);
        ImageIcon qrIcon = new ImageIcon(img);

        JLabel qrLabel = new JLabel(qrIcon);
        qrLabel.setBounds(250, 80, 300, 300);
        add(qrLabel);

        back = new JButton("Back");
        back.setBounds(350, 420, 100, 30);
        back.addActionListener(this);
        add(back);

        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        setVisible(false);
        new Payment();
    }

    public static void main(String[] args) {
        new Paytm();
    }
}