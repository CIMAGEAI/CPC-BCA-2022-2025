package university;

import com.toedter.calendar.JDateChooser;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.ResultSet;

public class StudentLeave extends JFrame implements ActionListener {

    Choice choiceRollNo, choTime;
    JDateChooser selDate;
    JButton submit, cancel;

    StudentLeave() {
        setTitle("Student Leave Application");
        setLayout(null);
        setSize(500, 500);
        setLocationRelativeTo(null);
        getContentPane().setBackground(new Color(232, 245, 252));

        JLabel heading = new JLabel("Apply Leave (Student)");
        heading.setBounds(120, 30, 300, 30);
        heading.setFont(new Font("Tahoma", Font.BOLD, 22));
        heading.setForeground(new Color(33, 56, 117));
        add(heading);

        addLabel("Search by Roll Number", 60, 90);
        choiceRollNo = new Choice();
        choiceRollNo.setBounds(60, 120, 350, 25);
        add(choiceRollNo);

        // Load roll numbers from student table
        try {
            Conn c = new Conn();
            ResultSet resultSet = c.statement.executeQuery("select * from student");
            while (resultSet.next()) {
                choiceRollNo.add(resultSet.getString("rollno"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        addLabel("Leave Date", 60, 170);
        selDate = new JDateChooser();
        selDate.setBounds(60, 200, 350, 25);
        selDate.setFont(new Font("Tahoma", Font.PLAIN, 14));
        add(selDate);

        addLabel("Time Duration", 60, 250);
        choTime = new Choice();
        choTime.setBounds(60, 280, 350, 25);
        choTime.add("Full Day");
        choTime.add("Half Day");
        add(choTime);

        submit = new JButton("Submit");
        submit.setBounds(100, 350, 120, 35);
        styleButton(submit);
        submit.addActionListener(this);
        add(submit);

        cancel = new JButton("Cancel");
        cancel.setBounds(260, 350, 120, 35);
        styleButton(cancel);
        cancel.addActionListener(this);
        add(cancel);

        setVisible(true);
    }

    private void addLabel(String text, int x, int y) {
        JLabel label = new JLabel(text);
        label.setBounds(x, y, 300, 25);
        label.setFont(new Font("Tahoma", Font.BOLD, 16));
        label.setForeground(new Color(50, 50, 50));
        add(label);
    }

    private void styleButton(JButton btn) {
        btn.setFont(new Font("Tahoma", Font.BOLD, 15));
        btn.setBackground(new Color(33, 56, 117));
        btn.setForeground(Color.WHITE);
        btn.setFocusPainted(false);
        btn.setBorder(BorderFactory.createEmptyBorder());
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == submit) {
            String rollno = choiceRollNo.getSelectedItem();
            String date = ((JTextField) selDate.getDateEditor().getUiComponent()).getText();
            String time = choTime.getSelectedItem();

            if (date.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Please select a date.");
                return;
            }

            String q = "INSERT INTO studentLeave VALUES('" + rollno + "', '" + date + "', '" + time + "')";
            try {
                Conn c = new Conn();
                c.statement.executeUpdate(q);
                JOptionPane.showMessageDialog(this, "Leave Confirmed for Roll No: " + rollno);
                setVisible(false);
            } catch (Exception ex) {
                ex.printStackTrace();
                JOptionPane.showMessageDialog(this, "Error saving leave details.");
            }
        } else {
            setVisible(false);
        }
    }

    public static void main(String[] args) {
        new StudentLeave();
    }
}
