package Hotel.Management.System;

import javax.swing.*;
import javax.swing.border.BevelBorder;
import javax.swing.border.Border;
import javax.swing.text.html.FormSubmitEvent;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.Statement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.DriverManager;

public class RemoveCustomer extends JFrame implements ActionListener {
      JLabel l1,l2,l3,l4;
      JTextField f1,f2;
      JButton b1,b2;
      JPanel p;
      con c;
    Border border = BorderFactory.createLineBorder(Color.red,3);
     public  RemoveCustomer()
      {
          setLayout(new FlowLayout());
          p = new JPanel();
          p.setSize(500,50);
          p.setBorder(border);
          p.setBackground(Color.cyan);
          l1 = new JLabel("Please Fill The Below Details");
          //l1.setBounds(50,20,300,40);
          l1.setFont(new Font("Arial",Font.BOLD,20));
          p.add(l1);
          add(p);
          setLayout(null);

          l2 = new JLabel("Enter Your Name:");
          l2.setBounds(20,60,200,30);
          l2.setFont(new Font("Arial",Font.ITALIC,20));
          add(l2);
          f1 = new JTextField(30);
          f1.setBounds(250,60,200,30);
          f1.setFont(new Font("Arial",Font.ITALIC,20));
          add(f1);

          l3 = new JLabel("Enter your Aadhaar No.");
          l3.setBounds(20,120,240,30);
          l3.setFont(new Font("Arial",Font.ITALIC,20));
          add(l3);

          f2 = new JTextField(30);
          f2.setBounds(250,120,200,30);
          f2.setFont(new Font("Arial",Font.ITALIC,20));
          add(f2);

          l4 = new JLabel();
          l4.setBounds(30,230,440,220);
          l4.setIcon(new ImageIcon("src/thank.jpg"));
          add(l4);

          b1 = new JButton("Submit");
          b1.setBounds(50,180,130,40);
          b1.setForeground(Color.WHITE);
          b1.setBackground(Color.BLACK);
          b1.setFont(new Font("Serif",Font.BOLD,20));
          add(b1);
          b1.addActionListener(this);
          setVisible(true);
          setSize(500,500);
          setDefaultCloseOperation(EXIT_ON_CLOSE);
          getContentPane().setBackground(Color.yellow);
          setLocationRelativeTo(null);

          //rootPane.setBorder(border); set border color of frame
          c = new con();

      }

    public void actionPerformed(ActionEvent event) {
        if (event.getSource() == b1) {
            String name = f1.getText();
            String aadhaarStr = f2.getText();

            if (aadhaarStr.isEmpty() || name.isEmpty()) {
                JOptionPane.showMessageDialog(null, "Please fill in all fields.");
                return;
            }

            try {
                Long aadhaar = Long.parseLong(aadhaarStr);

                PreparedStatement ps = c.getConnection().prepareStatement("DELETE FROM customer WHERE aadhaar = ?");
                ps.setLong(1, aadhaar);  // Fix: use setLong instead of setString
                int rowsAffected = ps.executeUpdate();

                if (rowsAffected > 0) {
                    JOptionPane.showMessageDialog(null, "Customer removed successfully.");
                } else {
                    JOptionPane.showMessageDialog(null, "No customer found with this Aadhaar number.");
                }
            } catch (NumberFormatException e) {
                JOptionPane.showMessageDialog(null, "Aadhaar number must be numeric.");
            } catch (Exception e) {
                JOptionPane.showMessageDialog(null, "Error: " + e.getMessage());
            }
        }
    }




    public static void main(String[] agrs)
      {

          RemoveCustomer obj = new RemoveCustomer();
      }

}
