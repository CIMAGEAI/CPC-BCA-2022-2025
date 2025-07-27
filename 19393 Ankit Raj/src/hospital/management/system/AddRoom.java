package hospital.management.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class AddRoom extends JFrame implements ActionListener {

    JTextField tfRoomNo, tfPrice, tfBedType;
    JComboBox<String> cbAvailability;
    JButton add, back;

    AddRoom() {
        getContentPane().setBackground(Color.WHITE);
        setLayout(null);

        JLabel heading = new JLabel("Add Room");
        heading.setFont(new Font("Tahoma", Font.BOLD, 24));
        heading.setBounds(150, 20, 200, 30);
        add(heading);

        JLabel lblRoomNo = new JLabel("Room Number:");
        lblRoomNo.setBounds(50, 80, 120, 30);
        add(lblRoomNo);

        tfRoomNo = new JTextField();
        tfRoomNo.setBounds(180, 80, 150, 30);
        add(tfRoomNo);

        JLabel lblAvailability = new JLabel("Availability:");
        lblAvailability.setBounds(50, 130, 120, 30);
        add(lblAvailability);

        String options[] = {"Available", "Occupied"};
        cbAvailability = new JComboBox<>(options);
        cbAvailability.setBounds(180, 130, 150, 30);
        add(cbAvailability);

        JLabel lblPrice = new JLabel("Price:");
        lblPrice.setBounds(50, 180, 120, 30);
        add(lblPrice);

        tfPrice = new JTextField();
        tfPrice.setBounds(180, 180, 150, 30);
        add(tfPrice);

        JLabel lblBedType = new JLabel("Bed Type:");
        lblBedType.setBounds(50, 230, 120, 30);
        add(lblBedType);

        tfBedType = new JTextField();
        tfBedType.setBounds(180, 230, 150, 30);
        add(tfBedType);

        add = new JButton("Add");
        add.setBounds(50, 300, 120, 30);
        add.setBackground(Color.BLACK);
        add.setForeground(Color.WHITE);
        add.addActionListener(this);
        add(add);

        back = new JButton("Back");
        back.setBounds(210, 300, 120, 30);
        back.setBackground(Color.BLACK);
        back.setForeground(Color.WHITE);
        back.addActionListener(this);
        add(back);

        setBounds(500, 200, 400, 400);
        setVisible(true);
    }

    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == add) {
            String room = tfRoomNo.getText();
            String availability = (String) cbAvailability.getSelectedItem();
            String price = tfPrice.getText();
            String bed = tfBedType.getText();

            try {
                conn connection = new conn();
                String query = "INSERT INTO Room VALUES('" + room + "', '" + availability + "', '" + price + "', '" + bed + "')";
                connection.statement.executeUpdate(query);

                JOptionPane.showMessageDialog(
                        null, "Room added successfully");
                setVisible(false);
                new Room();
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            setVisible(false);
        }
    }

    public static void main(String[] args) {
        new AddRoom();
    }
}