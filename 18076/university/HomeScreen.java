package university;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class HomeScreen extends JFrame implements ActionListener {

    Font menuFont = new Font("Segoe UI", Font.BOLD, 16);
    Color menuBackground = new Color(0, 102, 204);
    Color menuForeground = Color.WHITE;
    Color itemBackground = new Color(230, 242, 255);
    Color itemForeground = Color.BLACK;

    public HomeScreen() {

        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icon/5.png"));
        Image i2 = i1.getImage().getScaledInstance(1540, 750, Image.SCALE_DEFAULT);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel img = new JLabel(i3);
        add(img);

        // Menu Bar
        JMenuBar mb = new JMenuBar();
        mb.setBackground(menuBackground);
        mb.setBorder(BorderFactory.createLineBorder(Color.DARK_GRAY));

        // New Info
        JMenu newInfo = createStyledMenu("New Information");
        newInfo.add(createStyledMenuItem("New Faculty Information"));
        newInfo.add(createStyledMenuItem("New Student Information"));
        newInfo.add(createStyledMenuItem("New Course Addition"));
        mb.add(newInfo);


        JMenu details = createStyledMenu("View Details");
        details.add(createStyledMenuItem("View Faculty Details"));
        details.add(createStyledMenuItem("View Student Details"));
        mb.add(details);


        JMenu leave = createStyledMenu("Apply Leave");
        leave.add(createStyledMenuItem("Faculty Leave"));
        leave.add(createStyledMenuItem("Student Leave"));
        mb.add(leave);


        JMenu leaveDetails = createStyledMenu("Leave Details");
        leaveDetails.add(createStyledMenuItem("Faculty Leave Details"));
        leaveDetails.add(createStyledMenuItem("Student Leave Details"));
        mb.add(leaveDetails);


        JMenu exam = createStyledMenu("Examination");
        exam.add(createStyledMenuItem("Examination Results"));
        exam.add(createStyledMenuItem("Enter Marks"));
        mb.add(exam);


        JMenu updateInfo = createStyledMenu("Update Details");
        updateInfo.add(createStyledMenuItem("Update Faculty Details"));
        updateInfo.add(createStyledMenuItem("Update Student Details"));
        mb.add(updateInfo);

        JMenu fee = createStyledMenu("Fee Details");
        fee.add(createStyledMenuItem("Fee Structure"));
        fee.add(createStyledMenuItem("Student Fee Form"));
        mb.add(fee);


        JMenu utility = createStyledMenu("Utility");
        utility.add(createStyledMenuItem("Calculator"));
        utility.add(createStyledMenuItem("Notepad"));
        mb.add(utility);

        JMenu exit = createStyledMenu("Exit");
        exit.add(createStyledMenuItem("Exit"));
        mb.add(exit);

        setJMenuBar(mb);

        setSize(1540, 850);
        setVisible(true);
    }

    private JMenu createStyledMenu(String title) {
        JMenu menu = new JMenu(title);
        menu.setFont(menuFont);
        menu.setForeground(menuForeground);
        return menu;
    }

    private JMenuItem createStyledMenuItem(String title) {
        JMenuItem item = new JMenuItem(title);
        item.setBackground(itemBackground);
        item.setForeground(itemForeground);
        item.setFont(new Font("Segoe UI", Font.PLAIN, 15));
        item.addActionListener(this);


        item.addMouseListener(new java.awt.event.MouseAdapter() {
            Color originalBg = itemBackground;
            Color hoverBg = new Color(204, 229, 255); // Slightly darker blue

            @Override
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                item.setBackground(hoverBg);
            }

            @Override
            public void mouseExited(java.awt.event.MouseEvent evt) {
                item.setBackground(originalBg);
            }
        });

        return item;
    }


    @Override
    public void actionPerformed(ActionEvent e) {
        String sm = e.getActionCommand();

        switch (sm) {
            case "Exit":
                System.exit(0);
                break;
            case "Calculator":
                try {
                    Runtime.getRuntime().exec("calc.exe");
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
                break;
            case "Notepad":
                try {
                    Runtime.getRuntime().exec("notepad.exe");
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
                break;
            case "New Faculty Information":
                new AddFaculty();
                break;
            case "New Student Information":
                new AddStudent();
                break;
            case "New Course Addition":
                new CourseAddition();
                break;
            case "View Faculty Details":
                new TeacherDetails();
                break;
            case "View Student Details":
                new StudentDetails();
                break;
            case "Faculty Leave":
                new TeacherLeave();
                break;
            case "Student Leave":
                new StudentLeave();
                break;
            case "Faculty Leave Details":
                new TeacherLeaveDetails();
                break;
            case "Student Leave Details":
                new StudentLeaveDetails();
                break;
            case "Update Faculty Details":
                new UpdateTeacher();
                break;
            case "Update Student Details":
                new updateStudent();
                break;
            case "Enter Marks":
                new EnterMarks();
                break;
            case "Examination Results":
                new ExaminationDetails();
                break;
            case "Fee Structure":
                new FeeStructure();
                break;
            case "Student Fee Form":
                new StudentFeeForm();
                break;
        }
    }

    public static void main(String[] args) {
        new HomeScreen();
    }
}
