package university;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class CourseAddition extends JFrame implements ActionListener {

    JTextField courseField;
    JButton addButton, cancelButton;

    CourseAddition() {
        setTitle("Add New Course");
        setLayout(null);
        getContentPane().setBackground(new Color(204, 255, 229));

        JLabel label = new JLabel("Enter New Course:");
        label.setFont(new Font("Tahoma", Font.BOLD, 18));
        label.setBounds(50, 30, 200, 30);
        add(label);

        courseField = new JTextField();
        courseField.setFont(new Font("Tahoma", Font.PLAIN, 16));
        courseField.setBounds(50, 70, 250, 30);
        add(courseField);

        addButton = new JButton("Add Course");
        addButton.setBounds(50, 120, 120, 30);
        addButton.setBackground(Color.BLACK);
        addButton.setForeground(Color.WHITE);
        addButton.addActionListener(this);
        add(addButton);

        cancelButton = new JButton("Cancel");
        cancelButton.setBounds(180, 120, 120, 30);
        cancelButton.setBackground(Color.DARK_GRAY);
        cancelButton.setForeground(Color.WHITE);
        cancelButton.addActionListener(this);
        add(cancelButton);

        setSize(380, 230);
        setLocation(600, 300);
        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == addButton) {
            String courseName = courseField.getText().trim();

            if (courseName.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Course name cannot be empty");
                return;
            }

            try {
                Conn c = new Conn();
                String query = "INSERT INTO course VALUES('" + courseName + "')";
                c.statement.executeUpdate(query);
                JOptionPane.showMessageDialog(this, "Course added successfully!");
                courseField.setText(""); // Clear field
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage());
                ex.printStackTrace();
            }
        } else {
            setVisible(false); // Cancel
        }
    }

    public static void main(String[] args) {
        new CourseAddition();
    }
}
