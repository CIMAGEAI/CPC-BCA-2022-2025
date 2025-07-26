package electricity.billing.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class ForgotPassword extends JFrame implements ActionListener {

    JTextField tfusername, tfanswer, tfquestion;
    Choice accountType;
    JButton retrieve, back;
    JLabel lblusername;

    ForgotPassword() {
        super("Forgot Password");
        setBounds(450, 150, 700, 350);
        setLayout(null);
        getContentPane().setBackground(Color.WHITE);

        // Panel for form
        JPanel panel = new JPanel();
        panel.setBounds(250, 30, 400, 250);
        panel.setLayout(null);
        add(panel);

        lblusername = new JLabel("Username");
        lblusername.setBounds(30, 20, 120, 25);
        lblusername.setFont(new Font("Tahoma", Font.PLAIN, 14));
        panel.add(lblusername);

        tfusername = new JTextField();
        tfusername.setBounds(150, 20, 200, 25);
        panel.add(tfusername);

        JLabel lblaccount = new JLabel("Account Type");
        lblaccount.setBounds(30, 60, 100, 25);
        lblaccount.setFont(new Font("Tahoma", Font.PLAIN, 14));
        panel.add(lblaccount);

        accountType = new Choice();
        accountType.setBounds(150, 60, 200, 25);
        accountType.add("Admin");
        accountType.add("Customer");
        panel.add(accountType);

        JLabel lblquestion = new JLabel("Security Question");
        lblquestion.setBounds(30, 100, 120, 25);
        lblquestion.setFont(new Font("Tahoma", Font.PLAIN, 14));
        panel.add(lblquestion);

        tfquestion = new JTextField();
        tfquestion.setBounds(150, 100, 200, 25);
        tfquestion.setEditable(false);
        panel.add(tfquestion);

        JLabel lblanswer = new JLabel("Answer");
        lblanswer.setBounds(30, 140, 100, 25);
        lblanswer.setFont(new Font("Tahoma", Font.PLAIN, 14));
        panel.add(lblanswer);

        tfanswer = new JTextField();
        tfanswer.setBounds(150, 140, 200, 25);
        panel.add(tfanswer);

        retrieve = new JButton("Retrieve Password");
        retrieve.setBounds(50, 190, 150, 25);
        retrieve.setBackground(Color.BLACK);
        retrieve.setForeground(Color.WHITE);
        retrieve.addActionListener(this);
        panel.add(retrieve);

        back = new JButton("Back");
        back.setBounds(220, 190, 100, 25);
        back.setBackground(Color.BLACK);
        back.setForeground(Color.WHITE);
        back.addActionListener(this);
        panel.add(back);

        // Left image
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icon/fgpassword.jpg"));
        Image i2 = i1.getImage().getScaledInstance(200, 200, Image.SCALE_DEFAULT);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel image = new JLabel(i3);
        image.setBounds(20, 50, 200, 200);
        add(image);

        // Update label when account type changes
        accountType.addItemListener(new ItemListener() {
            @Override
            public void itemStateChanged(ItemEvent e) {
                if (accountType.getSelectedItem().equals("Customer")) {
                    lblusername.setText("Meter Number");
                } else {
                    lblusername.setText("Username");
                }
            }
        });

        // Fetch security question when username/meter is entered
        tfusername.addFocusListener(new FocusAdapter() {
            @Override
            public void focusLost(FocusEvent fe) {
                String input = tfusername.getText().trim();
                String usertype = accountType.getSelectedItem();

                try {
                    Conn c = new Conn();
                    String query;
                    if (usertype.equals("Admin")) {
                        query = "select question from login where username = '" + input + "' and user = 'Admin'";
                    } else {
                        query = "select question from login where meter_no = '" + input + "' and user = 'Customer'";
                    }

                    ResultSet rs = c.s.executeQuery(query);
                    if (rs.next()) {
                        tfquestion.setText(rs.getString("question"));
                    } else {
                        tfquestion.setText("");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == retrieve) {
            String input = tfusername.getText().trim();
            String usertype = accountType.getSelectedItem();
            String ans = tfanswer.getText().trim();

            if (input.equals("") || ans.equals("")) {
                JOptionPane.showMessageDialog(null, "Please fill all fields");
                return;
            }

            try {
                Conn c = new Conn();
                String query;
                if (usertype.equals("Admin")) {
                    query = "select password from login where username = '" + input + "' and answer = '" + ans + "' and user = 'Admin'";
                } else {
                    query = "select password from login where meter_no = '" + input + "' and answer = '" + ans + "' and user = 'Customer'";
                }

                ResultSet rs = c.s.executeQuery(query);
                if (rs.next()) {
                    String pass = rs.getString("password");
                    JOptionPane.showMessageDialog(null, "Your Password is: " + pass);
                    setVisible(false);
                    new Login();
                } else {
                    JOptionPane.showMessageDialog(null, "Incorrect Answer or Input");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        } else if (ae.getSource() == back) {
            setVisible(false);
            new Login();
        }
    }

    public static void main(String[] args) {
        new ForgotPassword();
    }
}
