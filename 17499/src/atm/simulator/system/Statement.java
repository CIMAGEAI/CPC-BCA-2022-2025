package bank.management.system;

import javax.swing.*;
import java.awt.*;
import java.sql.*;

public class Statement extends JFrame {

    Statement(String pin) {
        setTitle("Last Withdrawal & Balance");
        setLayout(null);
        getContentPane().setBackground(Color.WHITE);

        JLabel heading = new JLabel("Account Statement");
        heading.setFont(new Font("Tahoma", Font.BOLD, 20));
        heading.setBounds(120, 20, 300, 30);
        add(heading);

        JLabel lastWithdraw = new JLabel("Last Withdrawal:");
        lastWithdraw.setFont(new Font("Tahoma", Font.PLAIN, 16));
        lastWithdraw.setBounds(50, 80, 500, 30);
        add(lastWithdraw);

        JLabel balanceLabel = new JLabel("Net Balance:");
        balanceLabel.setFont(new Font("Tahoma", Font.PLAIN, 16));
        balanceLabel.setBounds(50, 120, 400, 30);
        add(balanceLabel);

        try {
            Conn c = new Conn();
            // Get last withdrawal
            ResultSet rs = c.s.executeQuery("SELECT * FROM bank WHERE pin = '" + pin + "' AND type = 'Withdraw' ORDER BY date DESC LIMIT 1");
            if (rs.next()) {
                String date = rs.getString("date");
                String amount = rs.getString("amount");
                lastWithdraw.setText("Last Withdrawal: ₹ " + amount + " on " + date);
            } else {
                lastWithdraw.setText("Last Withdrawal: No withdrawal found");
            }

            // Get Net Balance
            rs = c.s.executeQuery("SELECT * FROM bank WHERE pin = '" + pin + "'");
            int balance = 0;
            while (rs.next()) {
                if (rs.getString("type").equals("Deposit")) {
                    balance += Integer.parseInt(rs.getString("amount"));
                } else {
                    balance -= Integer.parseInt(rs.getString("amount"));
                }
            }
            balanceLabel.setText("Net Balance: ₹ " + balance);

        } catch (Exception e) {
            e.printStackTrace();
        }

         setSize(600, 300);
        setLocation(500, 300);
        setVisible(true);
    }
}

