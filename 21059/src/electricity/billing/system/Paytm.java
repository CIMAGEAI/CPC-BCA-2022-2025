package electricity.billing.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Paytm extends JFrame implements ActionListener {

    String meter;
    JButton back;

    Paytm(String meter) {
        super("Pay Bill - QR Code");
        this.meter = meter;

        setLayout(null);
        getContentPane().setBackground(Color.WHITE);

        // Title Label
        JLabel heading = new JLabel("Scan QR to Pay");
        heading.setBounds(300, 20, 200, 30);
        heading.setFont(new Font("Tahoma", Font.BOLD, 20));
        add(heading);

        ImageIcon icon = new ImageIcon(ClassLoader.getSystemResource("icon/qr.jpg"));
        Image scaledImage = icon.getImage().getScaledInstance(300, 300, Image.SCALE_SMOOTH);
        ImageIcon qrIcon = new ImageIcon(scaledImage);

        JLabel qrLabel = new JLabel(qrIcon);
        qrLabel.setBounds(250, 80, 300, 300);
        add(qrLabel);

        // Back Button
        back = new JButton("Back");
        back.setBounds(350, 400, 100, 30);
        back.addActionListener(this);
        add(back);

        setSize(800, 600);
        setLocation(400, 150);
        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        setVisible(false);
        new PayBill(meter);
    }

    public static void main(String[] args) {
        new Paytm(""); 
    }
}

