import javax.swing.*;
import java.awt.*;
import java.sql.*;
import java.util.Date;

public class StudentHomePage extends JFrame {

    ImageIcon image;
    JTabbedPane tab1;
    String studentEmailLogin; 
    
    

    // Student form components
    JTextField studentIdField, studentNameField, emailField, phoneField;
    JTextField fatherNameField, motherNameField, addressField;
    JSpinner DobSpinner;
    JLabel imageLabel;

    // Course form components
    JTextField courseId1Field, courseId2Field, courseId3Field, courseId4Field, courseId5Field, courseStudentIdField;
    JTextField searchCourseField;

    // Score Form components
    JTextField scoreIdField, scoreSemesterIdField, scoreStudentIdField, score1Field, score2Field, score3Field, score4Field, score5Field;
    JTextField courseStudentId1Field, courseStudentId2Field, courseStudentId3Field, courseStudentId4Field, courseStudentId5Field;
    JLabel semesterscoreLabel, coursescore1Label, coursescore2Label, coursescore3Label, coursescore4Label, coursescore5Label;
    JTextField searchScoreField;

    // Logged-in student's email
    

    // Custom JPanel to create a gradient background
    class GradientPanel extends JPanel {
        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2d = (Graphics2D) g;

            Color color1 = Color.WHITE;
            Color color2 = new Color(201, 160, 220);
            GradientPaint gp = new GradientPaint(0, 0, color1, 0, getHeight(), color2);
            g2d.setPaint(gp);
            g2d.fillRect(0, 0, getWidth(), getHeight());
        }
    }

    // Constructor accepting student email
    public StudentHomePage(String email) {
        this.studentEmailLogin = email;

        setTitle("STUDENT MANAGEMENT SYSTEM");
        setSize(1920, 1080);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        GradientPanel panel = new GradientPanel();
        panel.setLayout(null);
        add(panel);

        image = new ImageIcon("logoimage.jpg");
        setIconImage(image.getImage());

        tab1 = new JTabbedPane(JTabbedPane.TOP);
        tab1.setBounds(0, 0, 1920, 1075);
        tab1.setBackground(new Color(218, 177, 218));

        tab1.addTab("STUDENTS", createStudentPanel());
        tab1.addTab("COURSE", createCoursePanel());
        tab1.addTab("SCORE", createScorePanel());
        tab1.addTab("NOTICE", createNoticePanel());
        tab1.addTab("ATTENDANCE", createAttendancePanel());

        panel.add(tab1);
        setVisible(true);
        
    }

    // Create Student Panel
    private JPanel createStudentPanel() {
        JPanel studentPanel = new GradientPanel();
        studentPanel.setLayout(null);
        createStudentForm(studentPanel);
        return studentPanel;
    }

    private void createStudentForm(JPanel parent) {
        JPanel formPanel = new JPanel();
        formPanel.setBounds(420, 40, 600, 2000);
        formPanel.setLayout(null);
        formPanel.setOpaque(false);
        formPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(),
                "<html><b>STUDENT INFORMATION</b></html>"));

        int y = 50;
        int gap = 50;

        // Student ID
        JLabel idLabel = new JLabel("Student ID : ");
        idLabel.setBounds(10, y, 100, 25);
        idLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(idLabel);

        studentIdField = new JTextField();
        studentIdField.setBounds(150, y, 200, 25);
        studentIdField.setEditable(false);
        formPanel.add(studentIdField);

        y += gap;

        // Student Name
        JLabel nameLabel = new JLabel("Enter Student's Name : ");
        nameLabel.setBounds(10, y, 200, 25);
        nameLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(nameLabel);

        studentNameField = new JTextField();
        studentNameField.setBounds(150, y, 200, 25);
        studentNameField.setEditable(false);
        formPanel.add(studentNameField);

        y += gap;

        // Course
        JLabel courseLabel = new JLabel("Course : ");
        courseLabel.setBounds(10, y, 100, 25);
        courseLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(courseLabel);

        JTextField courseField = new JTextField();
        courseField.setBounds(150, y, 200, 25);
        courseField.setEditable(false);
        formPanel.add(courseField);

        y += gap;

        // Date of Birth
        JLabel dobLabel = new JLabel("Date Of Birth : ");
        dobLabel.setBounds(10, y, 100, 25);
        dobLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(dobLabel);

        DobSpinner = new JSpinner(new SpinnerDateModel());
        JSpinner.DateEditor dateEditor = new JSpinner.DateEditor(DobSpinner, "dd-MM-yyyy");
        DobSpinner.setEditor(dateEditor);
        ((JSpinner.DefaultEditor) DobSpinner.getEditor()).getTextField().setEditable(false);
        DobSpinner.setEnabled(false);
        DobSpinner.setBounds(150, y, 200, 25);
        formPanel.add(DobSpinner);

        y += gap;

        // Gender
        JLabel genderLabel = new JLabel("Gender : ");
        genderLabel.setBounds(10, y, 100, 25);
        genderLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(genderLabel);

        JTextField genderField = new JTextField();
        genderField.setBounds(150, y, 200, 25);
        genderField.setEditable(false);
        formPanel.add(genderField);

        y += gap;

        // Email
        JLabel emailLabel = new JLabel("Email : ");
        emailLabel.setBounds(10, y, 100, 25);
        emailLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(emailLabel);

        emailField = new JTextField();
        emailField.setBounds(150, y, 200, 25);
        emailField.setEditable(false);
        formPanel.add(emailField);

        y += gap;

        // Phone Number
        JLabel phoneLabel = new JLabel("Phone Number : ");
        phoneLabel.setBounds(10, y, 100, 25);
        phoneLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(phoneLabel);

        phoneField = new JTextField();
        phoneField.setBounds(150, y, 200, 25);
        phoneField.setEditable(false);
        formPanel.add(phoneField);

        y += gap;

        // Father's Name
        JLabel fatherLabel = new JLabel("Father's Name : ");
        fatherLabel.setBounds(10, y, 100, 25);
        fatherLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(fatherLabel);

        fatherNameField = new JTextField();
        fatherNameField.setBounds(150, y, 200, 25);
        fatherNameField.setEditable(false);
        formPanel.add(fatherNameField);

        y += gap;

        // Mother's Name
        JLabel motherLabel = new JLabel("Mother's Name : ");
        motherLabel.setBounds(10, y, 100, 25);
        motherLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(motherLabel);

        motherNameField = new JTextField();
        motherNameField.setBounds(150, y, 200, 25);
        motherNameField.setEditable(false);
        formPanel.add(motherNameField);

        y += gap;

        // Address
        JLabel addressLabel = new JLabel("Address : ");
        addressLabel.setBounds(10, y, 100, 25);
        addressLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(addressLabel);

        addressField = new JTextField();
        addressField.setBounds(150, y, 200, 25);
        addressField.setEditable(false);
        formPanel.add(addressField);

        y += gap;

        // Image display area
        imageLabel = new JLabel();
        imageLabel.setBounds(400, 30, 100, 100);
        imageLabel.setBackground(Color.WHITE);
        imageLabel.setOpaque(true);
        imageLabel.setBorder(BorderFactory.createLineBorder(Color.BLACK));
        formPanel.add(imageLabel);

        // Fetch student data from DB
        try {
            Connection con = CBConnection.getConnection();
            String sql = "SELECT * FROM student WHERE email = ?";
            PreparedStatement pst = con.prepareStatement(sql);
            pst.setString(1, studentEmailLogin);

            ResultSet rs = pst.executeQuery();
            if (rs.next()) {
                studentIdField.setText(rs.getString("student_id"));
                studentNameField.setText(rs.getString("name"));
                courseField.setText(rs.getString("course"));
                DobSpinner.setValue(rs.getDate("dob"));
                genderField.setText(rs.getString("gender"));
                emailField.setText(rs.getString("email"));
                phoneField.setText(rs.getString("phone"));
                fatherNameField.setText(rs.getString("father_name"));
                motherNameField.setText(rs.getString("mother_name"));
                addressField.setText(rs.getString("address"));

                String imagePath = rs.getString("image");
                if (imagePath != null && !imagePath.isEmpty()) {
                    ImageIcon icon = new ImageIcon(imagePath);
                    Image img = icon.getImage().getScaledInstance(100, 100, Image.SCALE_SMOOTH);
                    imageLabel.setIcon(new ImageIcon(img));
                }
            } else {
                JOptionPane.showMessageDialog(null, "No student data found for email: " + studentEmailLogin);
            }

            rs.close();
            pst.close();
            con.close();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(null, "Error loading student data: " + e.getMessage());
        }

        parent.add(formPanel);
    }

  



    /*--------------------------------------- COURSE TAB -------------------------------------------*/

    private JPanel createCoursePanel() {
        JPanel coursePanel = new GradientPanel();
        coursePanel.setLayout(null);
        
        // Left side - Course form
        createCourseForm(coursePanel);

        return coursePanel;
    }

    private void createCourseForm(JPanel parent) {
        // Form background panel
        JPanel formPanel = new JPanel();
        formPanel.setBounds(400, 110, 500, 600);
        formPanel.setLayout(null);
        formPanel.setOpaque(false);
        formPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(), 
            "<html><b>STUDENT COURSE INFORMATION</b></html>"));

        // Course form fields
        int yPos = 40;
        int gap = 45;

        // Student's ID
        JLabel studentIdLabel = new JLabel("Student's ID :");
        studentIdLabel.setBounds(10, yPos, 90, 25);
        studentIdLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(studentIdLabel);
        
        courseStudentIdField = new JTextField();
        courseStudentIdField.setBounds(150, yPos, 290, 30);
        courseStudentIdField.setBackground(Color.WHITE);
        formPanel.add(courseStudentIdField);

        yPos += gap;

        // Semester
        JLabel semesterLabel = new JLabel("Semester : ");
        semesterLabel.setBounds(10, yPos, 100, 25);
        semesterLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(semesterLabel);

        JTextField semesterCourseField = new JTextField();
        semesterCourseField.setBounds(150, yPos, 290, 30);
        semesterCourseField.setBackground(Color.WHITE);
        formPanel.add(semesterCourseField);

        yPos += gap;

        // Course 1
        JLabel course1Label = new JLabel("Course 1 : ");
        course1Label.setBounds(10, yPos, 90, 25);
        course1Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(course1Label);
        
        courseId1Field = new JTextField();
        courseId1Field.setBounds(150, yPos, 290, 30);
        courseId1Field.setBackground(Color.WHITE);
        formPanel.add(courseId1Field);

        yPos += gap;

        // Course 2
        JLabel course2Label = new JLabel("Course 2 : ");
        course2Label.setBounds(10, yPos, 90, 25);
        course2Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(course2Label);
        
        courseId2Field = new JTextField();
        courseId2Field.setBounds(150, yPos, 290, 30);
        courseId2Field.setBackground(Color.WHITE);
        formPanel.add(courseId2Field);

        yPos += gap;

        // Course 3
        JLabel course3Label = new JLabel("Course 3 : ");
        course3Label.setBounds(10, yPos, 90, 25);
        course3Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(course3Label);
        
        courseId3Field = new JTextField();
        courseId3Field.setBounds(150, yPos, 290, 30);
        courseId3Field.setBackground(Color.WHITE);
        formPanel.add(courseId3Field);

        yPos += gap;

        // Course 4
        JLabel course4Label = new JLabel("Course 4 : ");
        course4Label.setBounds(10, yPos, 90, 25);
        course4Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(course4Label);
        
        courseId4Field = new JTextField();
        courseId4Field.setBounds(150, yPos, 290, 30);
        courseId4Field.setBackground(Color.WHITE);
        formPanel.add(courseId4Field);

        yPos += gap;

        // Course 5
        JLabel course5Label = new JLabel("Course 5 : ");
        course5Label.setBounds(10, yPos, 90, 25);
        course5Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(course5Label);
        
        courseId5Field = new JTextField();
        courseId5Field.setBounds(150, yPos, 290, 30);
        courseId5Field.setBackground(Color.WHITE);
        formPanel.add(courseId5Field);

        yPos += gap;

        parent.add(formPanel);
    }

    /*---------------------------------------------- SCORE ----------------------------------------------- */

    private JPanel createScorePanel() {
        JPanel ResultPanel = new GradientPanel();
        ResultPanel.setLayout(null);
        
        // Left side - Score form
        createScoreForm(ResultPanel);
        
        return ResultPanel;
    }

    private void createScoreForm(JPanel parent) {
        // Form background panel
        JPanel formPanel = new JPanel();
        formPanel.setBounds(400, 110, 500, 600);
        formPanel.setLayout(null);
        formPanel.setOpaque(false);
        formPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(), 
            "<html><b>STUDENT SCORE INFORMATION</b></html>"));

        int yPos = 40;
        int fieldHeight = 30;
        int labelWidth = 120;
        int textFieldWidth = 200;
        int marksFieldWidth = 80;
        int gap = 45;

        // Student's ID
        JLabel studentIdLabel = new JLabel("Student's ID :");
        studentIdLabel.setBounds(10, yPos, labelWidth, 25);
        studentIdLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(studentIdLabel);

        scoreStudentIdField = new JTextField();
        scoreStudentIdField.setBounds(150, yPos, textFieldWidth, fieldHeight);
        scoreStudentIdField.setBackground(Color.WHITE);
        formPanel.add(scoreStudentIdField);

        yPos += gap;

        // Semester
        JLabel semesterLabel = new JLabel("Semester :");
        semesterLabel.setBounds(10, yPos, labelWidth, 25);
        semesterLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(semesterLabel);

        scoreSemesterIdField = new JTextField();
        scoreSemesterIdField.setBounds(150, yPos, textFieldWidth,fieldHeight);
        scoreSemesterIdField.setBackground(Color.WHITE);
        formPanel.add(scoreSemesterIdField);

        yPos += gap;

        // Course 1 and Score 1
        JLabel course1Label = new JLabel("Course 1 :");
        course1Label.setBounds(10, yPos, labelWidth, 25);
        course1Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(course1Label);

        courseStudentId1Field = new JTextField();
        courseStudentId1Field.setBounds(150, yPos, 200, 30);
        courseStudentId1Field.setBackground(Color.WHITE);
        formPanel.add(courseStudentId1Field);

        JLabel score1Label = new JLabel("Score:");
        score1Label.setBounds(360, yPos, 40, 25);
        score1Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(score1Label);

        score1Field = new JTextField();
        score1Field.setBounds(410, yPos, marksFieldWidth, fieldHeight);
        score1Field.setBackground(Color.WHITE);
        formPanel.add(score1Field);

        yPos += gap;

        // Course 2 and Score 2
        JLabel course2Label = new JLabel("Course 2 :");
        course2Label.setBounds(10, yPos, labelWidth, 25);
        course2Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(course2Label);

        courseStudentId2Field = new JTextField();
        courseStudentId2Field.setBounds(150, yPos, 200, 30);
        courseStudentId2Field.setBackground(Color.WHITE);
        formPanel.add(courseStudentId2Field);

        JLabel score2Label = new JLabel("Score:");
        score2Label.setBounds(360, yPos, 40, 25);
        score2Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(score2Label);

        score2Field = new JTextField();
        score2Field.setBounds(410, yPos, marksFieldWidth, fieldHeight);
        score2Field.setBackground(Color.WHITE);
        formPanel.add(score2Field);

        yPos += gap;

        // Course 3 and Score 3
        JLabel course3Label = new JLabel("Course 3 :");
        course3Label.setBounds(10, yPos, labelWidth, 25);
        course3Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(course3Label);

        courseStudentId3Field = new JTextField();
        courseStudentId3Field.setBounds(150, yPos, 200, 30);
        courseStudentId3Field.setBackground(Color.WHITE);
        formPanel.add(courseStudentId3Field);

        JLabel score3Label = new JLabel("Score:");
        score3Label.setBounds(360, yPos, 40, 25);
        score3Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(score3Label);

        score3Field = new JTextField();
        score3Field.setBounds(410, yPos, marksFieldWidth, fieldHeight);
        score3Field.setBackground(Color.WHITE);
        formPanel.add(score3Field);

        yPos += gap;

        // Course 4 and Score 4
        JLabel course4Label = new JLabel("Course 4 :");
        course4Label.setBounds(10, yPos, labelWidth, 25);
        course4Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(course4Label);

        courseStudentId4Field = new JTextField();
        courseStudentId4Field.setBounds(150, yPos, 200, 30);
        courseStudentId4Field.setBackground(Color.WHITE);
        formPanel.add(courseStudentId4Field);

        JLabel score4Label = new JLabel("Score:");
        score4Label.setBounds(360, yPos, 40, 25);
        score4Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(score4Label);

        score4Field = new JTextField();
        score4Field.setBounds(410, yPos, marksFieldWidth, fieldHeight);
        score4Field.setBackground(Color.WHITE);
        formPanel.add(score4Field);

        yPos += gap;

        // Course 5 and Score 5
        JLabel course5Label = new JLabel("Course 5 :");
        course5Label.setBounds(10, yPos, labelWidth, 25);
        course5Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(course5Label);

        courseStudentId5Field = new JTextField();
        courseStudentId5Field.setBounds(150, yPos, 200, 30);
        courseStudentId5Field.setBackground(Color.WHITE);
        formPanel.add(courseStudentId5Field);

        JLabel score5Label = new JLabel("Score:");
        score5Label.setBounds(360, yPos, 40, 25);
        score5Label.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(score5Label);

        score5Field = new JTextField();
        score5Field.setBounds(410, yPos, marksFieldWidth, fieldHeight);
        score5Field.setBackground(Color.WHITE);
        formPanel.add(score5Field);

        parent.add(formPanel);
    }

    /*------------------------------------------- NOTICE ---------------------------------------------------- */

    private JPanel displayPanel; // Make this a class field so it can be accessed

    private JPanel createNoticePanel() {
        JPanel noticePanel = new GradientPanel();
        noticePanel.setLayout(null);
        noticePanel.setOpaque(false);

        int x = 350;
        int y = 80;
        int gap = 40;

        JLabel postLabel = new JLabel();
        postLabel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(), 
            "<html><b>NOTICE</b></html>"));
        postLabel.setBounds(550, y, 200, 25);
        postLabel.setForeground(Color.BLACK);
        noticePanel.add(postLabel);

        y += gap;
        
        // Title 
        JLabel titleLabel = new JLabel("Title :");
        titleLabel.setBounds(x, y, 80, 25);
        titleLabel.setFont(new Font("Arial", Font.BOLD, 16));
        noticePanel.add(titleLabel);
        
        JTextField titleField = new JTextField();
        titleField.setBounds(x+100, y, 400, 25);
        titleField.setBorder(BorderFactory.createLineBorder(Color.GRAY));
        noticePanel.add(titleField);

        y += gap;
        
        // Content
        JLabel contentLabel = new JLabel("Content :");
        contentLabel.setBounds(x, y, 80, 25);
        contentLabel.setFont(new Font("Arial", Font.BOLD, 16));
        noticePanel.add(contentLabel);
        
        JTextArea contentArea = new JTextArea();
        contentArea.setLineWrap(true);
        contentArea.setWrapStyleWord(true);
        contentArea.setBorder(BorderFactory.createLineBorder(Color.WHITE));
    
        JScrollPane contentScroll = new JScrollPane(contentArea);
        contentScroll.setBounds(x+100, y, 400, 80);
        noticePanel.add(contentScroll);

        y += gap;
   
        // Notice display section (for all users)
        JLabel viewLabel = new JLabel("All Notice");
        viewLabel.setBounds(x, 250, 200, 25);
        viewLabel.setFont(new Font("Serif", Font.BOLD, 16));
        viewLabel.setForeground(Color.BLACK);
        noticePanel.add(viewLabel);
        
        // Create display panel for notices
        displayPanel = new JPanel();
        displayPanel.setLayout(new BoxLayout(displayPanel, BoxLayout.Y_AXIS));
        displayPanel.setBackground(Color.WHITE);
        
        JScrollPane scrollPane = new JScrollPane(displayPanel);
        scrollPane.setBounds(x+100, 260, 480, 200);
        scrollPane.setBorder(BorderFactory.createLineBorder(Color.GRAY));
        scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);
        noticePanel.add(scrollPane);
        
        return noticePanel;
    }

        private JPanel createNoticeDisplay(String title, String content, String author, String date) {
        JPanel notice = new JPanel();
        notice.setLayout(null);
        notice.setBackground(Color.WHITE);
        
        return notice;
    }

    /*---------------------------------------------ATTENDANCE--------------------------------------------------- */

   public JPanel createAttendancePanel() {
    JPanel mainPanel = new GradientPanel();
    mainPanel.setLayout(null);
    mainPanel.setOpaque(false);
    mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

    // --- LEFT SIDE: Attendance Info Panel ---
    JPanel infoPanel = new JPanel();
    infoPanel.setLayout(null);
    infoPanel.setOpaque(false);
    infoPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(), 
        "<html><b>ATTENDANCE</b></html>"));
    infoPanel.setBounds(30, 30, 350, 250);
    mainPanel.add(infoPanel);

    int y = 30;
    int gap = 40;

    // Course (Read-Only)
    JLabel courseLabel = new JLabel("Course :");
    courseLabel.setBounds(10, y, 100, 25);
    courseLabel.setFont(new Font("Arial", Font.BOLD, 12));
    infoPanel.add(courseLabel);

    JTextField courseField = new JTextField("BCA-AKU-6THSEM-B1");
    courseField.setBounds(120, y, 200, 25);
    courseField.setEditable(false);
    infoPanel.add(courseField);

    y += gap;

    // Subject (Read-Only)
    JLabel subjectLabel = new JLabel("Subject :");
    subjectLabel.setBounds(10, y, 100, 25);
    subjectLabel.setFont(new Font("Arial", Font.BOLD, 12));
    infoPanel.add(subjectLabel);

    JTextField subjectField = new JTextField("All Subjects");
    subjectField.setBounds(120, y, 200, 25);
    subjectField.setEditable(false);
    infoPanel.add(subjectField);

    y += gap;

    // Date (Read-Only)
    JLabel dateLabel = new JLabel("Date :");
    dateLabel.setBounds(10, y, 100, 25);
    dateLabel.setFont(new Font("Arial", Font.BOLD, 12));
    infoPanel.add(dateLabel);

    JSpinner dateSpinner = new JSpinner(new SpinnerDateModel());
    JSpinner.DateEditor dateEditor = new JSpinner.DateEditor(dateSpinner, "dd-MM-yyyy");
    dateSpinner.setEditor(dateEditor);
    dateSpinner.setValue(new Date());
    dateSpinner.setBounds(120, y, 200, 25);
    dateSpinner.setEnabled(false);
    infoPanel.add(dateSpinner);

    // --- RIGHT SIDE: Attendance Table ---
    JPanel tablePanel = new JPanel();
    tablePanel.setLayout(new BorderLayout());
    tablePanel.setBounds(400, 30, 500, 300);
    tablePanel.setOpaque(false);
    tablePanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(), 
        "<html><b>ATTENDANCE RECORD</b></html>"));
    mainPanel.add(tablePanel);

    // Table Data (Dummy or Empty for now)
    String[] columns = {"Subject", "Date", "Status"};

    // Initially no attendance is marked, so show a placeholder row
    String[][] data = {
        {"-", "-", "-"}
    };

    //JTable (Read-Only)
    JTable attendanceTable = new JTable(data, columns);
    attendanceTable.setEnabled(false); 
    attendanceTable.getTableHeader().setReorderingAllowed(false);

    JScrollPane scrollPane = new JScrollPane(attendanceTable);
    tablePanel.add(scrollPane, BorderLayout.CENTER);

    // --- SUMMARY PANEL ---
    JPanel summaryPanel = new JPanel();
    summaryPanel.setLayout(null);
    summaryPanel.setOpaque(false);
    mainPanel.add(summaryPanel);

    int sy = 30;

    int totalClasses = 0;
    int totalPresent = 0;
    int totalAbsent = 0;

    // Loop with safety check
    for (String[] row : data) {
        if (row.length >= 3) {
            totalClasses++;
            if (row[2].equalsIgnoreCase("Present")) {
                totalPresent++;
            } else if (row[2].equalsIgnoreCase("Absent")) {
                totalAbsent++;
            }
        }
    }

    JLabel totalClassesLabel = new JLabel("Total Classes : " + totalClasses);
    totalClassesLabel.setBounds(10, sy, 200, 25);
    totalClassesLabel.setFont(new Font("Arial", Font.BOLD, 16));
    summaryPanel.add(totalClassesLabel);

    sy += 30;

    JLabel presentLabel = new JLabel("Total Present : " + totalPresent);
    presentLabel.setBounds(10, sy, 200, 25);
    presentLabel.setFont(new Font("Arial", Font.BOLD, 16));
    summaryPanel.add(presentLabel);

    sy += 30;

    JLabel absentLabel = new JLabel("Total Absent : " + totalAbsent);
    absentLabel.setBounds(10, sy, 200, 25);
    absentLabel.setFont(new Font("Arial", Font.BOLD, 16));
    summaryPanel.add(absentLabel);

    return mainPanel;
}

    public static void main(String args[])
     {
        String email = "nikhilraj@cimage.in";
        StudentHomePage o = new StudentHomePage( email);

    
    }
}