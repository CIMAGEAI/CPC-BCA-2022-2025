package Hotel.Management.System;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.Statement;
import com.toedter.calendar.JDateChooser;
import java.text.SimpleDateFormat;

public class AddCustomer extends JFrame implements ActionListener {
    JLabel l1, l2, l3, l4, l5, l6, l7, l8;
    JTextField f1, f2, f3, f4, f6;
    JComboBox<String> jb;
    JButton submit, exit, cancel;
    JDateChooser jd;
    con c;
    ImageIcon backgroundImage;
    JLabel backgroundLabel;

    public AddCustomer() {
        setLayout(null);
        setSize(600, 700);
        setLocationRelativeTo(null);
        setTitle("Add Customer");

        // Set background image
        backgroundImage = new ImageIcon("src/Hotel2img.jpg");
        Image bg = backgroundImage.getImage().getScaledInstance(600, 700, Image.SCALE_SMOOTH);
        backgroundLabel = new JLabel(new ImageIcon(bg));
        backgroundLabel.setBounds(0, 0, 600, 700);
        setContentPane(backgroundLabel);
        backgroundLabel.setLayout(null);

        // Heading
        l1 = new JLabel("Fill The Basic Details of Customer");
        l1.setFont(new Font("Serif", Font.BOLD, 22));
        l1.setForeground(Color.WHITE);
        l1.setBounds(120, 30, 400, 30);
        backgroundLabel.add(l1);

        // Name
        l2 = new JLabel("Customer Name:");
        l2.setBounds(30, 90, 150, 30);
        styleLabel(l2);
        f1 = new JTextField();
        styleTextField(f1, 200, 90);

        // Phone
        l3 = new JLabel("Phone Number:");
        l3.setBounds(30, 160, 150, 30);
        styleLabel(l3);
        f2 = new JTextField();
        styleTextField(f2, 200, 160);

        // Room
        l4 = new JLabel("Preferred Room:");
        l4.setBounds(30, 230, 150, 30);
        styleLabel(l4);
        String[] rooms = {"Single", "Double", "Suite"};
        jb = new JComboBox<>(rooms);
        jb.setFont(new Font("Serif", Font.PLAIN, 18));
        jb.setBounds(200, 230, 200, 30);
        backgroundLabel.add(jb);

        // Check-in
        l5 = new JLabel("Check-In Time:");
        l5.setBounds(30, 300, 150, 30);
        styleLabel(l5);
        f3 = new JTextField();
        styleTextField(f3, 200, 300);

        // Check-out
        l6 = new JLabel("Check-Out Time:");
        l6.setBounds(30, 370, 180, 30);
        styleLabel(l6);
        f4 = new JTextField();
        styleTextField(f4, 200, 370);

        // Date
        l7 = new JLabel("Booking Date:");
        l7.setBounds(30, 440, 150, 30);
        styleLabel(l7);
        jd = new JDateChooser();
        jd.setBounds(200, 440, 200, 30);
        backgroundLabel.add(jd);

        // Aadhaar
        l8 = new JLabel("Aadhaar Number:");
        l8.setBounds(30, 510, 180, 30);
        styleLabel(l8);
        f6 = new JTextField();
        styleTextField(f6, 200, 510);

        // Buttons
        submit = createButton("Submit", 30, 580);
        exit = createButton("Exit", 160, 580);
        cancel = createButton("Cancel", 290, 580);

        // Add listeners
        submit.addActionListener(this);
        exit.addActionListener(this);
        cancel.addActionListener(this);

        c = new con();
        setVisible(true);
    }

    private void styleLabel(JLabel label) {
        label.setFont(new Font("Serif", Font.BOLD, 18));
        label.setForeground(Color.WHITE);
        backgroundLabel.add(label);
    }

    private void styleTextField(JTextField field, int x, int y) {
        field.setBounds(x, y, 200, 30);
        field.setFont(new Font("Serif", Font.PLAIN, 18));
        backgroundLabel.add(field);
    }

    private JButton createButton(String text, int x, int y) {
        JButton btn = new JButton(text);
        btn.setBounds(x, y, 100, 30);
        btn.setBackground(Color.BLACK);
        btn.setForeground(Color.WHITE);
        btn.setFont(new Font("Serif", Font.BOLD, 16));
        backgroundLabel.add(btn);
        return btn;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource() == submit) {
                String name = f1.getText().trim();
                String numberStr = f2.getText().trim();
                String room = (String) jb.getSelectedItem();
                String ctime = f3.getText().trim();
                String cout = f4.getText().trim();
                String aadhaarStr = f6.getText().trim();
                java.util.Date date = jd.getDate();

                // Validation
                if (name.isEmpty() || numberStr.isEmpty() || ctime.isEmpty() || cout.isEmpty() || aadhaarStr.isEmpty() || date == null) {
                    JOptionPane.showMessageDialog(null, "All fields must be filled.");
                    return;
                }

                if (!name.matches("[a-zA-Z\\s]+")) {
                    JOptionPane.showMessageDialog(null, "Name must contain only letters.");
                    return;
                }

                if (!numberStr.matches("\\d+")) {
                    JOptionPane.showMessageDialog(null, "Phone number must be numeric.");
                    return;
                }

                if (!aadhaarStr.matches("\\d{12}")) {
                    JOptionPane.showMessageDialog(null, "Aadhaar must be exactly 12 digits.");
                    return;
                }

                long number = Long.parseLong(numberStr);
                long aadhaar = Long.parseLong(aadhaarStr);
                String formattedDate = new SimpleDateFormat("yyyy-MM-dd").format(date);

                String query = "INSERT INTO customer (name, number, room, ctime, cout, date, aadhaar) " +
                        "VALUES ('" + name + "', " + number + ", '" + room + "', '" + ctime + "', '" + cout + "', '" + formattedDate + "', " + aadhaar + ")";
                Statement stmt = c.getStatement();
                stmt.executeUpdate(query);

                JOptionPane.showMessageDialog(null, "Customer Added Successfully");
            } else if (e.getSource() == exit) {
                System.exit(0);
            } else if (e.getSource() == cancel) {
                setVisible(false);
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, "Error: " + ex.getMessage());
        }
    }

    public static void main(String[] args) {
        new AddCustomer();
    }
}
