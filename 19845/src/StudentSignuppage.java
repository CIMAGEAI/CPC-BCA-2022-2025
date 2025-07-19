import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class StudentSignuppage extends JFrame {
    JLabel fname, lname,phone,email, password,heading,gender;
    JTextField t1, t2, ph, e1;
    JPasswordField p1;
    JButton b1;
    ImageIcon image;


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

    StudentSignuppage()
    {
        setTitle("SIGNUP PAGE");
        setSize(1920,1080);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        //setResizable(false);

        // Create a custom panel with gradient background
        GradientPanel panel = new GradientPanel();
        panel.setLayout(null); // Set null layout for manual positioning
        add(panel); // Add the panel to the frame

        heading = new JLabel("<html><b><u>Student Signup Page</b></u></html>");
		heading.setBounds(130,60,300,30);
		heading.setHorizontalTextPosition(JLabel.CENTER);
		heading.setFont(new Font("serif",Font.PLAIN,24));
		panel.add(heading);

        // First Name
        fname = new JLabel("Enter Your First Name :");
        t1 = new JTextField();
        fname.setBounds(30, 120, 150, 30);
        t1.setBounds(200, 120, 250, 30);
        panel.add(fname);
        panel.add(t1);

        // Last Name
        lname = new JLabel("Enter Your Last Name :");
        t2 = new JTextField();
        lname.setBounds(30, 170, 150, 30);
        t2.setBounds(200, 170, 250, 30);
        panel.add(lname);
        panel.add(t2);

        //Phone Number
        phone = new JLabel("Phone Number : ");
        ph = new JTextField();
        phone.setBounds(30,220,150,30);
        ph.setBounds(200,220,250,30);
        panel.add(phone);
        panel.add(ph);

        // Email
        email = new JLabel("Email :");
        e1 = new JTextField();
        email.setBounds(30, 270, 150, 30);
        e1.setBounds(200, 270, 250, 30);
        panel.add(email);
        panel.add(e1);

        //password 
        password = new JLabel("Password :");
        p1 = new JPasswordField();
        password.setBounds(30, 320, 150, 30);
        p1.setBounds(200, 320, 250, 30);
        panel.add(password);
        panel.add(p1);


        // Sign Up Button
        b1 = new JButton("Sign Up");
        b1.setBounds(200, 370, 100, 30);
        b1.setCursor(new Cursor(Cursor.HAND_CURSOR));
        b1.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e)
            {
                new StudentLoginpage();
                dispose();
            }
        });

        panel.add(b1);

        //Image Icon 
        image = new ImageIcon("logoimage.jpg"); //created an image icon
		setIconImage(image.getImage()); //change icon of image

        // Set the frame visible after adding all components
        setVisible(true);
    }



    public static void main(String[] args) 
    {
        StudentSignuppage o = new StudentSignuppage();
    }
}