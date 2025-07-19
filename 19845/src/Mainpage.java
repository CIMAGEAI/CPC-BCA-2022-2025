import javax.swing.*;
import java.awt.event.*;
import java.awt.*;

public class Mainpage extends JFrame
{
    JLabel imageLabel,heading, h2;
    ImageIcon image,studentimage,facultyimage;
    JButton student, faculty;

    // Custom JPanel to create a gradient background
	class GradientPanel extends JPanel {
        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2d = (Graphics2D) g;

            // Create a gradient from top to bottom
            Color color1 = Color.WHITE;// Start color
            Color color2 = new Color(201, 160, 220); // End color
            GradientPaint gradientPaint = new GradientPaint(0, 0, color1, 0, getHeight(), color2);
            g2d.setPaint(gradientPaint);
            g2d.fillRect(0, 0, getWidth(), getHeight());
        }
    }

    Mainpage()
    {
        setTitle("STUDENT MANAGEMENT SYSTEM");
        setSize(1920,1080);
        setDefaultCloseOperation(EXIT_ON_CLOSE); 
        setLocationRelativeTo(null); 

        // Create a custom panel with gradient background
        GradientPanel panel = new GradientPanel();
        panel.setLayout(null); // Set null layout for manual positioning
        add(panel); // Add the panel to the frame

        heading = new JLabel("<html><b>Welcome to Student Management System</b></html>");
		heading.setBounds(400, 160, 600, 30);
		heading.setFont(new Font("serif",Font.PLAIN,24));
		panel.add(heading);

        h2 = new JLabel("<html><b>Login in as</b></html>");
		h2.setBounds(550,205,300,30);
		h2.setFont(new Font("serif",Font.PLAIN,20));
		panel.add(h2);

        //Load the image
        image = new ImageIcon("logoimage.jpg"); //created an image icon
		setIconImage(image.getImage()); //change icon of image

        // Load and resize student image
        studentimage = new ImageIcon("studentimage.jpg");
        Image studentImg = studentimage.getImage().getScaledInstance(150, 150, Image.SCALE_SMOOTH);
        ImageIcon resizedStudentIcon = new ImageIcon(studentImg);

        JLabel studentImgLabel = new JLabel(resizedStudentIcon);
        studentImgLabel.setBounds(450, 250, 100, 100); // Set position and size
        studentImgLabel.setOpaque(false);  // Make background transparent
        panel.add(studentImgLabel);

        // Load and resize faculty image
        facultyimage = new ImageIcon("facultyimage.jpeg");
        Image facultyImg = facultyimage.getImage().getScaledInstance(100,100, Image.SCALE_SMOOTH);
        ImageIcon resizedFacultyIcon = new ImageIcon(facultyImg);

        JLabel facultyImgLabel = new JLabel(resizedFacultyIcon);
        facultyImgLabel.setBounds(660, 250, 100, 100);
        facultyImgLabel.setOpaque(false);  // Make background transparent
        panel.add(facultyImgLabel);

        // Create the "Login as Student" button
        student = new JButton("Student");   
        student.setBounds(453,370,90,30);
        student.setBackground(new Color(218,177,218));
        student.setForeground(Color.BLACK);
        student.setCursor(new Cursor(Cursor.HAND_CURSOR));
        //action performed
        student.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e)
            {
                new StudentLoginpage();
                dispose();
            }
        });
        panel.add(student);

        //faculty button
        faculty = new JButton("Faculty");
        faculty.setBounds(660, 370, 90, 30);
        faculty.setBackground(new Color(218,177,218));
        faculty.setForeground(Color.BLACK);
        faculty.setCursor(new Cursor(Cursor.HAND_CURSOR));
        faculty.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e)
            {
                new FacultyLoginPage();
                dispose();
            }
        });

        panel.add(faculty);

        setVisible(true);
    }

    public static void main(String[] args)
    {
        Mainpage o = new Mainpage();
    }    
}