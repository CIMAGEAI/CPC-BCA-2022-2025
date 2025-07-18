package university.management.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class TeacherDashboard extends JFrame implements ActionListener {

    String teacherName;

    TeacherDashboard(String role) {
        this.teacherName = role;

        setSize(800, 600);
        setTitle("Teacher Panel - " + role.toUpperCase());

        JMenuBar mb = new JMenuBar();

        JMenu info = new JMenu("Student");
        info.setForeground(Color.BLUE);

        JMenuItem viewStudent = new JMenuItem("View Student Details");
        viewStudent.addActionListener(this);
        info.add(viewStudent);

        JMenuItem enterMarks = new JMenuItem("Enter Marks");
        enterMarks.addActionListener(this);
        info.add(enterMarks);

        JMenu utility = new JMenu("Utility");
        utility.setForeground(Color.RED);

        JMenuItem notepad = new JMenuItem("Notepad");
        notepad.addActionListener(this);
        utility.add(notepad);

        JMenuItem calc = new JMenuItem("Calculator");
        calc.addActionListener(this);
        utility.add(calc);

        JMenu exit = new JMenu("Exit");
        exit.setForeground(Color.BLACK);

        JMenuItem ex = new JMenuItem("Logout");
        ex.addActionListener(this);
        exit.add(ex);

        mb.add(info);
        mb.add(utility);
        mb.add(exit);

        setJMenuBar(mb);

        JLabel welcome = new JLabel("Welcome, " + role.toUpperCase());
        welcome.setFont(new Font("Tahoma", Font.BOLD, 30));
        welcome.setHorizontalAlignment(SwingConstants.CENTER);
        add(welcome);

        setLayout(new BorderLayout());
        setLocation(400, 200);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
    }

    public void actionPerformed(ActionEvent ae) {
        String msg = ae.getActionCommand();

        if (msg.equals("Logout")) {
            setVisible(false);
           // new Login();
        } else if (msg.equals("Notepad")) {
            try {
                Runtime.getRuntime().exec("notepad.exe");
            } catch (Exception e) {}
        } else if (msg.equals("Calculator")) {
            try {
                Runtime.getRuntime().exec("calc.exe");
            } catch (Exception e) {}
        } else if (msg.equals("View Student Details")) {
            new StudentDetails();
        } else if (msg.equals("Enter Marks")) {
            new EnterMarks();
        }
    }
}
