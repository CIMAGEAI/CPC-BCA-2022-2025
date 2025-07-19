import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Random;
import java.awt.print.*;
import java.io.File;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

public class Homepage extends JFrame {
private String selectedImagePath = null;

    ImageIcon image;
    JTabbedPane tab1;
    
    // Student form components
    JTextField studentIdField, studentNameField, dobField, emailField, phoneField;
    JTextField fatherNameField, motherNameField, addressField;
    JSpinner DobSpinner;
    JComboBox<String> genderCombo , courseCombo;
    JButton browseButton;
    JLabel imageLabel;
    
    // Search and table components
    JTextField searchField;
    JButton searchButton, refreshButton, addNewButton, updateButton, deleteButton, printButton, clearButton, logoutButton;
    JTable studentTable;
    DefaultTableModel tableModel;

    // Course form components
    JTextField courseId1Field , courseId2Field ,courseId3Field,courseId4Field,courseId5Field,courseStudentIdField;
    JComboBox<String> semesterCombo, course1Combo, course2Combo, course3Combo, course4Combo, course5Combo;
    JTextField searchCourseField;
    JButton searchCourseButton;
    JTable courseTable;
    DefaultTableModel courseTableModel;
    JButton addCourseButton, updateCourseButton, deleteCourseButton, clearCourseButton;

    //Score Form components
    JTextField scoreIdField ,scoreStudentIdField , score1Field, score2Field, score3Field, score4Field, score5Field;
    JComboBox<String> semesterscoreCombo, coursescore1Combo, coursescore2Combo, coursescore3Combo, coursescore4Combo, coursescore5Combo;
    JTextField searchScoreField;
    JButton searchScoreButton;
    JTable scoreTable;
    DefaultTableModel scoreTableModel;
    JButton editScoreButton, updateScoreButton, deleteScoreButton, clearScoreButton;

    // Custom JPanel to create a gradient background
    class GradientPanel extends JPanel {
        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2d = (Graphics2D) g;
            
            // Gradient background 
            Color color1 = Color.WHITE;// Start color
            Color color2 = new Color(201, 160, 220); // End color
            GradientPaint gradientPaint = new GradientPaint(0, 0, color1, 0, getHeight(), color2);
            g2d.setPaint(gradientPaint);
            g2d.fillRect(0, 0, getWidth(), getHeight());
        }
    }

    Homepage() {
        setTitle("STUDENT MANAGEMENT SYSTEM");
        setSize(1920,1080);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        // Create a custom panel with gradient background
        GradientPanel panel = new GradientPanel();
        panel.setLayout(null);
        add(panel);

        image = new ImageIcon("logoimage.jpg");
        setIconImage(image.getImage());

        // Create tabbed pane
        tab1 = new JTabbedPane(JTabbedPane.TOP);
        tab1.setBounds(0, 0,1920,1075);
        tab1.setBackground(new Color(218,177,218));
    
        
        // Add tabs
       // tab1.addTab("HOME", createHomePanel());
        tab1.addTab("STUDENTS", createStudentPanel());
        tab1.addTab("COURSE", createCoursePanel());
        tab1.addTab("SCORE", createScorePanel());
        tab1.addTab("NOTICE", createNoticePanel());
        tab1.addTab("ATTENDANCE", createAttendancePanel());
       // tab1.addTab("EXAM", createExamPanel());

        panel.add(tab1);
        setVisible(true);
    }
    
/*--------------------------------------  STUDENT TAB---------------------------------------------- */

    
    private JPanel createStudentPanel() {
        JPanel studentPanel = new GradientPanel();
        studentPanel.setLayout(null);
        
        // Left side - Student form
        createStudentForm(studentPanel);
        
        // Right side - Search and table
        createSearchAndTable(studentPanel);
        
        // Bottom buttons
        createBottomButtons(studentPanel);
        
        return studentPanel;
    }
    
    private void createStudentForm(JPanel parent) {

        // Form background panel - changed from JPanel to GradientPanel
        JPanel formPanel = new JPanel();
        formPanel.setBounds(0, 10, 420, 2000);
        formPanel.setLayout(null);
        formPanel.setOpaque(false);
        formPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(), "<html><b>STUDENT INFORMATION</b></html>")); //displays title without border line

        int y = 30;
        int gap = 50;

        // Student ID
        JLabel idLabel = new JLabel("Student ID : ");
        idLabel.setBounds(10, y, 100, 25);
        idLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(idLabel);

        studentIdField = new JTextField();
        studentIdField.setBounds(150, y, 200, 25);
        formPanel.add(studentIdField);

        y += gap;

        // Student Name
        JLabel nameLabel = new JLabel("Enter Student's Name : ");
        nameLabel.setBounds(10,y, 200, 25);
        nameLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(nameLabel);
        
        studentNameField = new JTextField();
        studentNameField.setBounds(150, y, 200, 25);
        formPanel.add(studentNameField);

        y+=gap;

        // Course
        JLabel courseLabel = new JLabel("Course : ");
        courseLabel.setBounds(10,y, 100, 25);
        courseLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(courseLabel);
        
        courseCombo = new JComboBox<>(new String[]{"Select Course","BCA-AKU-6THSEM-B1", "BCA-AKU-6THSEM-B2","BCA-AKU-6THSEM-B3"});
        courseCombo.setBounds(150, y, 200, 25);
        formPanel.add(courseCombo);

        y+=gap;
        
        // Date of Birth
        JLabel dobLabel = new JLabel("Date Of Birth : ");
        dobLabel.setBounds(10, y, 100, 25);
        dobLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(dobLabel);

        DobSpinner = new JSpinner(new SpinnerDateModel());
        JSpinner.DateEditor dateEditor = new JSpinner.DateEditor(DobSpinner, "yyyy-MM-dd");
        DobSpinner.setEditor(dateEditor);
        DobSpinner.setValue(new Date()); // Set initial date to today
        DobSpinner.setBounds(150, y, 200, 25);
        formPanel.add(DobSpinner);

        y+=gap;
        
        // Gender
        JLabel genderLabel = new JLabel("Gender : ");
        genderLabel.setBounds(10, y, 100, 25);
        genderLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(genderLabel);
        
        genderCombo = new JComboBox<>(new String[]{"Select Gender","Male", "Female"});
        genderCombo.setBounds(150,y, 200, 25);
        formPanel.add(genderCombo);
        
        y+=gap;

        // Email
        JLabel emailLabel = new JLabel("Email : ");
        emailLabel.setBounds(10, y, 100, 25);
        emailLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(emailLabel);
        
        emailField = new JTextField();
        emailField.setBounds(150,y, 200, 25);
        formPanel.add(emailField);

        y+=gap;
        
        // Phone Number
        JLabel phoneLabel = new JLabel("Phone Number : ");
        phoneLabel.setBounds(10, y, 100, 25);
        phoneLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(phoneLabel);
        
        phoneField = new JTextField();
        phoneField.setBounds(150,y, 200, 25);
        formPanel.add(phoneField);

        y+=gap;
        
        // Father's Name
        JLabel fatherLabel = new JLabel("Father's Name : ");
        fatherLabel.setBounds(10, y, 100, 25);
        fatherLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(fatherLabel);
        
        fatherNameField = new JTextField();
        fatherNameField.setBounds(150,y, 200, 25);
        formPanel.add(fatherNameField);

        y+=gap;

        // Mother's Name
        JLabel motherLabel = new JLabel("Mother's Name : ");
        motherLabel.setBounds(10, y, 100, 25);
        motherLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(motherLabel);
        
        motherNameField = new JTextField();
        motherNameField.setBounds(150,y, 200, 25);
        formPanel.add(motherNameField);

        y+=gap;
   
        // Address
        JLabel addressLabel = new JLabel("Address : ");
        addressLabel.setBounds(10, y, 100, 25);
        addressLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(addressLabel);
        
        addressField = new JTextField();
        addressField.setBounds(150, y, 200, 25);
        formPanel.add(addressField);

        y+=gap;
    
        // Image section
        JLabel imageTextLabel = new JLabel("Upload Student Img : ");
        imageTextLabel.setBounds(10, y, 130, 25);
        imageTextLabel.setFont(new Font("Arial", Font.BOLD, 12));
        formPanel.add(imageTextLabel);
        
        browseButton = new JButton("Browse");
        browseButton.setBounds(150, y, 100, 30);
        browseButton.setBackground(new Color(218,177,218));
        browseButton.setForeground(Color.BLACK);
        browseButton.setFont(new Font("Arial", Font.BOLD, 12));
        browseButton.setContentAreaFilled(false);
        browseButton.setOpaque(true);
        formPanel.add(browseButton);
        
        // Image display area
        imageLabel = new JLabel();
        imageLabel.setBounds(260,y, 70, 70);
        imageLabel.setBackground(Color.WHITE);
        imageLabel.setOpaque(true);
        imageLabel.setBorder(BorderFactory.createLineBorder(Color.BLACK));
        formPanel.add(imageLabel);
        
        y+=gap;

        parent.add(formPanel);
    }
    
    private void createSearchAndTable(JPanel parent) {
    // Search panel
    JPanel searchPanel = new JPanel();
    searchPanel.setBounds(420, 10, 700, 80);
    searchPanel.setLayout(null);
    searchPanel.setOpaque(false);
    searchPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(), "<html><b>Search Student ID : </b</html>"));

    searchField = new JTextField();
    searchField.setBounds(125, 0, 100, 20);
    searchPanel.add(searchField);

    searchButton = new JButton("Search");
    searchButton.setBounds(240, 0, 80, 20);
    searchButton.setBackground(new Color(218,177,218));
    searchButton.setForeground(Color.BLACK);
    searchButton.setFont(new Font("Arial", Font.BOLD, 12));
    searchButton.setContentAreaFilled(false);
    searchButton.setOpaque(true);
    searchPanel.add(searchButton);

    refreshButton = new JButton("Refresh");
    refreshButton.setBounds(330, 0, 80, 20);
    refreshButton.setBackground(new Color(218,177,218));
    refreshButton.setForeground(Color.BLACK);
    refreshButton.setFont(new Font("Arial", Font.BOLD, 12));
    refreshButton.setContentAreaFilled(false);
    refreshButton.setOpaque(true);
    searchPanel.add(refreshButton);

    parent.add(searchPanel);

    // Table
    String[] columnNames = {"Stu. ID", "Stu. Name","Course", "DOB", "Gender", "Email", 
                           "Phone No", "F.Name", "M.Name", "Address", "Image Path"};

    Object[][] data = {}; // Empty data initially

    tableModel = new DefaultTableModel(data, columnNames);
    studentTable = new JTable(tableModel);
    studentTable.setFillsViewportHeight(true);
    studentTable.setBackground(Color.WHITE);
    studentTable.setRowHeight(25);

    JScrollPane scrollPane = new JScrollPane(studentTable);
    scrollPane.setBounds(420, 50, 800, 470);
    scrollPane.setOpaque(false);
    scrollPane.setBackground(Color.WHITE);
    parent.add(scrollPane);

    // Load data from database
    loadStudentData();
}

private void loadStudentData() {
    tableModel.setRowCount(0); // Clear existing rows in table

    try (Connection conn = CBConnection.getConnection()) {
        String sql = "SELECT * FROM student";
        PreparedStatement pst = conn.prepareStatement(sql);
        ResultSet rs = pst.executeQuery();

        while (rs.next()) {
            Object[] row = new Object[11];
            row[0] = rs.getString("student_id");
            row[1] = rs.getString("name");
            row[2] = rs.getString("course");
            row[3] = rs.getString("dob");
            row[4] = rs.getString("gender");
            row[5] = rs.getString("email");
            row[6] = rs.getString("phone");
            row[7] = rs.getString("father_name");
            row[8] = rs.getString("mother_name");
            row[9] = rs.getString("address");
            row[10] = rs.getString("image");

            tableModel.addRow(row);
        }

    } catch (SQLException ex) {
        JOptionPane.showMessageDialog(this, "Database Error: " + ex.getMessage());
        ex.printStackTrace();
    }
}
   
    private void createBottomButtons(JPanel parent) {
        int buttonWidth = 100;
        int buttonHeight = 35;
        int startX = 490;
        int y = 550;
        int gap = 110;
        
        // Add New button
        addNewButton = new JButton("Add New");
        addNewButton.setBounds(startX, y, buttonWidth, buttonHeight);
        addNewButton.setBackground(new Color(218,177,218));
        addNewButton.setForeground(Color.BLACK);
        addNewButton.setFont(new Font("Arial", Font.BOLD, 12));
        addNewButton.setContentAreaFilled(false);
        addNewButton.setOpaque(true);
        parent.add(addNewButton);
        
        // Update button
        updateButton = new JButton("Update");
        updateButton.setBounds(startX + gap, y, buttonWidth, buttonHeight);
        updateButton.setBackground(new Color(218,177,218));
        updateButton.setForeground(Color.BLACK);
        updateButton.setFont(new Font("Arial", Font.BOLD, 12));
        updateButton.setContentAreaFilled(false);
        updateButton.setOpaque(true);
        parent.add(updateButton);
        
        // Delete button
        deleteButton = new JButton("Delete");
        deleteButton.setBounds(startX + gap * 2, y, buttonWidth, buttonHeight);
        deleteButton.setBackground(new Color(218,177,218));
        deleteButton.setForeground(Color.BLACK);
        deleteButton.setFont(new Font("Arial", Font.BOLD, 12));
        deleteButton.setContentAreaFilled(false);
        deleteButton.setOpaque(true);
        parent.add(deleteButton);
        
        // Print button
        printButton = new JButton("Print");
        printButton.setBounds(startX + gap * 3, y, buttonWidth, buttonHeight);
        printButton.setBackground(new Color(218,177,218));
        printButton.setForeground(Color.BLACK);
        printButton.setFont(new Font("Arial", Font.BOLD, 12));
        printButton.setContentAreaFilled(false);
        printButton.setOpaque(true);
        parent.add(printButton);
        
        // Clear button
        clearButton = new JButton("Clear");
        clearButton.setBounds(startX + gap * 4, y, buttonWidth, buttonHeight);
        clearButton.setBackground(new Color(218,177,218));
        clearButton.setForeground(Color.BLACK);
        clearButton.setFont(new Font("Arial", Font.BOLD, 12));
        clearButton.setContentAreaFilled(false);
        clearButton.setOpaque(true);
        parent.add(clearButton);
        
        //Logout button
        logoutButton = new JButton("Logout");
        logoutButton.setBounds(startX + gap * 5, y, buttonWidth, buttonHeight);
        logoutButton.setBackground(new Color(218,177,218));
        logoutButton.setForeground(Color.BLACK);
        logoutButton.setFont(new Font("Arial", Font.BOLD, 12));
        logoutButton.setContentAreaFilled(false);
        logoutButton.setOpaque(true);
        parent.add(logoutButton);
    
        
        // Add action listeners
        addActionListeners();
    }
    
    private void addActionListeners() {
        // Clear button action
        clearButton.addActionListener(e -> clearForm());
        
        // Add New button action
        addNewButton.addActionListener(e -> addNewStudent());
        
        // Delete button action
        deleteButton.addActionListener(e -> deleteStudent());
        
        // Update button action
        updateButton.addActionListener(e -> updateStudent());

        // logout button action
        logoutButton.addActionListener(e -> logoutStudent());

        printButton.addActionListener(e -> printStudentDetails());

        // Table row selection
        studentTable.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                loadSelectedStudent();
            }
        });
        
        // Search functionality
        searchButton.addActionListener(e -> searchStudent());
        
        // Refresh table
        refreshButton.addActionListener(e -> refreshTable());
        
        // Browse button for image
        browseButton.addActionListener(e -> browseImage());
    }
    
    private void clearForm() {
        studentIdField.setText("");
        studentNameField.setText("");
        courseCombo.setSelectedIndex(0);
        DobSpinner.setValue(new Date()); // Reset DOB to today's date
        emailField.setText("");
        phoneField.setText("");
        fatherNameField.setText("");
        motherNameField.setText("");
        addressField.setText("");
        genderCombo.setSelectedIndex(0);
        imageLabel.setText("");
        imageLabel.setIcon(null);
    }
    
    private void addNewStudent() {
    if (!validateForm(true)) {
        return;
    }

    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    String dob = sdf.format(DobSpinner.getValue());

    String studentId = studentIdField.getText().trim();
    String studentName = studentNameField.getText().trim();
    String course = courseCombo.getSelectedItem().toString();
    String gender = genderCombo.getSelectedItem().toString();
    String email = emailField.getText().trim();
    String phone = phoneField.getText().trim();
    String fatherName = fatherNameField.getText().trim();
    String motherName = motherNameField.getText().trim();
    String address = addressField.getText().trim();
    String imagePath = selectedImagePath; // Use selectedImagePath, not imageLabel text

    // Always open new connection
    try (Connection conn = CBConnection.getConnection()) {
        String sql = "INSERT INTO student (student_id, name, course, dob, gender, email, phone, father_name, mother_name, address, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        PreparedStatement pst = conn.prepareStatement(sql);

        pst.setString(1, studentId);
        pst.setString(2, studentName);
        pst.setString(3, course);
        pst.setString(4, dob);
        pst.setString(5, gender);
        pst.setString(6, email);
        pst.setString(7, phone);
        pst.setString(8, fatherName);
        pst.setString(9, motherName);
        pst.setString(10, address);
        pst.setString(11, imagePath);

        int rows = pst.executeUpdate();

        if (rows > 0) {
            Object[] newRow = {studentId, studentName, course, dob, gender, email, phone, fatherName, motherName, address, imagePath};
            tableModel.addRow(newRow);
            clearForm();
            JOptionPane.showMessageDialog(this, "Student added successfully!");
        } else {
            JOptionPane.showMessageDialog(this, "Failed to add student.");
        }

    } catch (SQLException ex) {
        JOptionPane.showMessageDialog(this, "Database Error: " + ex.getMessage());
        ex.printStackTrace();
    }
}

    private void deleteStudent() {
    int selectedRow = studentTable.getSelectedRow();
    if (selectedRow >= 0) {
        String studentId = tableModel.getValueAt(selectedRow, 0).toString();

        int confirm = JOptionPane.showConfirmDialog(this, 
            "Are you sure you want to delete this student?", 
            "Confirm Delete", 
            JOptionPane.YES_NO_OPTION);
        
        if (confirm == JOptionPane.YES_OPTION) {
            try (Connection conn = CBConnection.getConnection()) {
                String sql = "DELETE FROM student WHERE student_id=?";
                PreparedStatement pst = conn.prepareStatement(sql);
                pst.setString(1, studentId);

                int rows = pst.executeUpdate();

                if (rows > 0) {
                    tableModel.removeRow(selectedRow);
                    clearForm();
                    JOptionPane.showMessageDialog(this, "Student deleted successfully!");
                } else {
                    JOptionPane.showMessageDialog(this, "Failed to delete student from database.");
                }
            } catch (SQLException ex) {
                JOptionPane.showMessageDialog(this, "Database Error: " + ex.getMessage());
                ex.printStackTrace();
            }
        }
    } else {
        JOptionPane.showMessageDialog(this, "Please select a student to delete.");
    }
}

    private void updateStudent() {
    int selectedRow = studentTable.getSelectedRow();
    if (selectedRow >= 0 && validateForm(false)) {
        String studentId = studentIdField.getText().trim();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dob = sdf.format(DobSpinner.getValue());

        try (Connection conn = CBConnection.getConnection()) {
            String sql = "UPDATE student SET name=?, course=?, dob=?, gender=?, email=?, phone=?, father_name=?, mother_name=?, address=?, image=? WHERE student_id=?";
            PreparedStatement pst = conn.prepareStatement(sql);

            pst.setString(1, studentNameField.getText().trim());
            pst.setString(2, courseCombo.getSelectedItem().toString());
            pst.setString(3, dob);
            pst.setString(4, genderCombo.getSelectedItem().toString());
            pst.setString(5, emailField.getText().trim());
            pst.setString(6, phoneField.getText().trim());
            pst.setString(7, fatherNameField.getText().trim());
            pst.setString(8, motherNameField.getText().trim());
            pst.setString(9, addressField.getText().trim());
            pst.setString(10, selectedImagePath);
            pst.setString(11, studentId);

            int rows = pst.executeUpdate();

            if (rows > 0) {
                // Update in table model
                tableModel.setValueAt(studentNameField.getText(), selectedRow, 1);
                tableModel.setValueAt(courseCombo.getSelectedItem().toString(), selectedRow, 2);
                tableModel.setValueAt(dob, selectedRow, 3);
                tableModel.setValueAt(genderCombo.getSelectedItem().toString(), selectedRow, 4);
                tableModel.setValueAt(emailField.getText(), selectedRow, 5);
                tableModel.setValueAt(phoneField.getText(), selectedRow, 6);
                tableModel.setValueAt(fatherNameField.getText(), selectedRow, 7);
                tableModel.setValueAt(motherNameField.getText(), selectedRow, 8);
                tableModel.setValueAt(addressField.getText(), selectedRow, 9);
                tableModel.setValueAt(selectedImagePath, selectedRow, 10);

                JOptionPane.showMessageDialog(this, "Student updated successfully!");
            } else {
                JOptionPane.showMessageDialog(this, "Failed to update student.");
            }

        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Database Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    } else {
        JOptionPane.showMessageDialog(this, "Please select a student to update.");
    }
}

    private void logoutStudent() {
    // Show confirmation dialog
    int confirm = JOptionPane.showConfirmDialog(this, 
        "Are you sure you want to logout?", 
        "Confirm Logout", 
        JOptionPane.YES_NO_OPTION);
    
    if (confirm == JOptionPane.YES_OPTION) {
        // Close current window
        this.dispose();
        
        // Open main page
        try {
            new Mainpage().setVisible(true);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, 
                "Error opening main page: " + e.getMessage(), 
                "Error", 
                JOptionPane.ERROR_MESSAGE);
        }
    }
}  

    // Simple print method
private void printStudentDetails() {
    PrinterJob job = PrinterJob.getPrinterJob();
    job.setPrintable(new SimpleStudentPrintable(studentIdField, studentNameField, courseCombo, tableModel));

    if (job.printDialog()) {
        try {
            job.print();
            JOptionPane.showMessageDialog(this, "Printed successfully!");
        } catch (PrinterException e) {
            JOptionPane.showMessageDialog(this, "Print error: " + e.getMessage());
        }
    }
}

// Simplified printable class
private class SimpleStudentPrintable implements Printable {

    private JTextField studentIdField;
    private JTextField studentNameField;
    private JComboBox<String> courseCombo;
    private DefaultTableModel tableModel;

    public SimpleStudentPrintable(JTextField studentIdField, JTextField studentNameField,
                                  JComboBox<String> courseCombo, DefaultTableModel tableModel) {
        this.studentIdField = studentIdField;
        this.studentNameField = studentNameField;
        this.courseCombo = courseCombo;
        this.tableModel = tableModel;
    }

    @Override
    public int print(Graphics g, PageFormat pf, int pageIndex) throws PrinterException {
        if (pageIndex > 0) return NO_SUCH_PAGE;

        Graphics2D g2d = (Graphics2D) g;
        g2d.translate(pf.getImageableX(), pf.getImageableY());

        int y = 30;
        int x = 20;

        g2d.setFont(new Font("Arial", Font.BOLD, 14));
        g2d.drawString("Student ID: " + studentIdField.getText(), x, y);
        y += 15;
        g2d.drawString("Name: " + studentNameField.getText(), x, y);
        y += 15;
        g2d.drawString("Course: " + courseCombo.getSelectedItem(), x, y);
        y += 30;

        g2d.drawString("All Students:", x, y);
        y += 15;

        for (int i = 0; i < tableModel.getRowCount(); i++) {
            String id = tableModel.getValueAt(i, 0).toString();
            String name = tableModel.getValueAt(i, 1).toString();
            String course = tableModel.getValueAt(i, 2).toString();
            g2d.drawString(id + " | " + name + " | " + course, x, y);
            y += 12;
        }

        return PAGE_EXISTS;
    }
}

    private void loadSelectedStudent() {
    int selectedRow = studentTable.getSelectedRow();
    if (selectedRow >= 0) {
        studentIdField.setText(tableModel.getValueAt(selectedRow, 0).toString());
        studentNameField.setText(tableModel.getValueAt(selectedRow, 1).toString());
        courseCombo.setSelectedItem(tableModel.getValueAt(selectedRow, 2).toString());

        // Set dobSpinner value from String to Date
        String dobString = tableModel.getValueAt(selectedRow, 3).toString();
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date dobDate = sdf.parse(dobString);
            DobSpinner.setValue(dobDate);
        } catch (ParseException e) {
            JOptionPane.showMessageDialog(this, "Invalid DOB format in table. Please check.");
        }

        genderCombo.setSelectedItem(tableModel.getValueAt(selectedRow, 4).toString());
        emailField.setText(tableModel.getValueAt(selectedRow, 5).toString());
        phoneField.setText(tableModel.getValueAt(selectedRow, 6).toString());
        fatherNameField.setText(tableModel.getValueAt(selectedRow, 7).toString());
        motherNameField.setText(tableModel.getValueAt(selectedRow, 8).toString());
        addressField.setText(tableModel.getValueAt(selectedRow, 9).toString());

        // Load image path and display image
        selectedImagePath = tableModel.getValueAt(selectedRow, 10).toString();

        if (selectedImagePath != null && !selectedImagePath.isEmpty()) {
            try {
                ImageIcon icon = new ImageIcon(selectedImagePath);
                Image img = icon.getImage().getScaledInstance(70, 70, Image.SCALE_SMOOTH);
                imageLabel.setIcon(new ImageIcon(img));
                imageLabel.setText("");
            } catch (Exception e) {
                imageLabel.setIcon(null);
                imageLabel.setText("Image Load Error");
            }
        } else {
            imageLabel.setIcon(null);
            imageLabel.setText("No Image");
        }
    }
}

    private void searchStudent() {
        String searchText = searchField.getText().toLowerCase();
        if (searchText.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter Student ID .");
            return;
        }
        
        for (int i = 0; i < tableModel.getRowCount(); i++) {
            String studentName = tableModel.getValueAt(i, 1).toString().toLowerCase();
            String studentId = tableModel.getValueAt(i, 0).toString().toLowerCase();
            
            if (studentName.contains(searchText) || studentId.contains(searchText)) {
                studentTable.setRowSelectionInterval(i, i);
                studentTable.scrollRectToVisible(studentTable.getCellRect(i, 0, true));
                return;
            }
        }
        
        JOptionPane.showMessageDialog(this, "Student not found.");
    }
    
    private void refreshTable() {
        studentTable.clearSelection();
        clearForm();
        searchField.setText("");
    }
    
    private void browseImage() {
    JFileChooser fileChooser = new JFileChooser();
    fileChooser.setFileFilter(new javax.swing.filechooser.FileNameExtensionFilter(
        "Image files", "jpg", "jpeg", "png", "gif", "bmp"));
    
    int result = fileChooser.showOpenDialog(this);
    if (result == JFileChooser.APPROVE_OPTION) {
        selectedImagePath = fileChooser.getSelectedFile().getAbsolutePath();
        
        // Display the image in imageLabel
        try {
            ImageIcon icon = new ImageIcon(selectedImagePath);
            Image img = icon.getImage().getScaledInstance(70, 70, Image.SCALE_SMOOTH);
            imageLabel.setIcon(new ImageIcon(img));
            imageLabel.setText(""); // Don't store path in label text
        } catch (Exception ex) {
            imageLabel.setText("Image: " + fileChooser.getSelectedFile().getName());
        }
    }
}

    private boolean validateForm(boolean checkDuplicateId) {
    if (studentIdField.getText().trim().isEmpty()) {
        JOptionPane.showMessageDialog(this, "Please enter Student ID.");
        return false;
    }

    String studentId = studentIdField.getText().trim();
    // Check if Student ID contains only digits
    if (!studentId.matches("\\d+")) {
    JOptionPane.showMessageDialog(this,
    "Student ID must contain digits only (e.g., 1234).","Invalid Input",
    JOptionPane.ERROR_MESSAGE);
    return false;
    }
    //check for duplicate id
    if (checkDuplicateId) {
    for (int i = 0; i < tableModel.getRowCount(); i++) {
        if (tableModel.getValueAt(i, 0).toString().equals(studentId)) {
            JOptionPane.showMessageDialog(this, "Student ID already exists!");
            return false;
        }
    }
}

    if (studentNameField.getText().trim().isEmpty()) {
        JOptionPane.showMessageDialog(this, "Please enter Student Name.");
        return false;
    }

    String studentName = studentNameField.getText().trim();
    if (!studentName.matches("[a-zA-Z\\s]+")) {
    JOptionPane.showMessageDialog(this,
    "Student Name must contain letters only.","Invalid Input",
    JOptionPane.ERROR_MESSAGE);
    return false;
    }

    if (courseCombo.getSelectedIndex() == 0) {
        JOptionPane.showMessageDialog(this, "Please select Course.");
        return false;
    }

    if (genderCombo.getSelectedIndex() == 0) {
        JOptionPane.showMessageDialog(this, "Please select Gender.");
        return false;
    }

    if (emailField.getText().trim().isEmpty()) {
        JOptionPane.showMessageDialog(this, "Please enter Email.");
        return false;
    }

    String email = emailField.getText().trim();
    if (!email.contains("@") || !email.contains(".")) {
        JOptionPane.showMessageDialog(this,
        "Please enter a valid Email. Example: name@gmail.com","Invalid Input",
        JOptionPane.ERROR_MESSAGE);
        return false;
    }

    if (phoneField.getText().trim().isEmpty()) {
        JOptionPane.showMessageDialog(this, "Please enter Phone.");
        return false;
    }

    String cleanPhone = phoneField.getText().trim().replaceAll("[\\s\\-\\(\\)\\+]", "");
    if (!cleanPhone.matches("\\d{10}")) {
        JOptionPane.showMessageDialog(this,
        "Please enter a valid 10-digit Phone Number. Example: 1234XXXXXX","Invalid Input",
        JOptionPane.ERROR_MESSAGE);
        return false;
    }

    if (fatherNameField.getText().trim().isEmpty()) {
        JOptionPane.showMessageDialog(this, "Please enter Father's Name.");
        return false;
    }

    String fatherName = fatherNameField.getText().trim();
    if (!fatherName.matches("[a-zA-Z\\s]+")) {
    JOptionPane.showMessageDialog(this,
    "Father Name must contain letters only.","Invalid Input",
    JOptionPane.ERROR_MESSAGE);
    return false;
    }

    if (motherNameField.getText().trim().isEmpty()) {
        JOptionPane.showMessageDialog(this, "Please enter Mother's Name.");
        return false;
    }

    String motherName = motherNameField.getText().trim();
    if (!motherName.matches("[a-zA-Z\\s]+")) {
    JOptionPane.showMessageDialog(this,
    "mother Name must contain letters only.","Invalid Input",
    JOptionPane.ERROR_MESSAGE);
    return false;
    }

    if (addressField.getText().trim().isEmpty()) {
        JOptionPane.showMessageDialog(this, "Please enter Address.");
        return false;
    }

    return true;
}

/*--------------------------------------- COURSE TAB  -------------------------------------------*/

private JPanel createCoursePanel() {
    JPanel coursePanel = new GradientPanel();
    coursePanel.setLayout(null);
    
    // Left side - Course form
    createCourseForm(coursePanel);
    
    // Right side - Search and table
    createCourseSearchAndTable(coursePanel);
    
    // Bottom buttons for course
    createCourseBottomButtons(coursePanel);
    
    return coursePanel;
}

private void createCourseForm(JPanel parent) {
    // Form background panel
    JPanel formPanel = new JPanel();
    formPanel.setBounds(10, 10, 500, 600);
    formPanel.setLayout(null);
    formPanel.setOpaque(false);
    formPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(), "<html><b>STUDENT COURSE INFORMATION</b></html>  ")); //displays title without border line

    // Course form fields
    int yPos = 37;
    int fieldHeight = 35;
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
    
    semesterCombo = new JComboBox<>(new String[]{
        "Select Semester", "1st Semester", "2nd Semester", "3rd Semester", 
        "4th Semester", "5th Semester", "6th Semester"
    });
    semesterCombo.setBounds(150, yPos, 290, 30);
    semesterCombo.setBackground(Color.WHITE);
    formPanel.add(semesterCombo);

    yPos += gap;

    // Course 1
    JLabel course1Label = new JLabel("Course 1 : ");
    course1Label.setBounds(10, yPos, 90, 25);
    course1Label.setFont(new Font("Arial", Font.BOLD, 12));
    formPanel.add(course1Label);
    
    course1Combo = new JComboBox<>(new String[]{  "Select Course",
        "Commuicative English","Basics Mathematics" , "Information Technology and Application" , "Principles of Management & Organization","Python Programming", "Business English", "Mathematics [Numerical Techniques]","System Analysis & Design","C Programming","OS & unix", "C++ Programming" ,"Internet & web designing ", "Java Programming", "Software Engineering" , "RDBMS","Digital electronics CS architecture & organisation", "File & Data Structures", "Statistics" ,"VB.NET","Graphics and Multimedia" , "Computer Networking" , "Accounts",
        "E-Commerce", "Web Technology","NA"
    });
    course1Combo.setBounds(150, yPos, 290, 30);
    course1Combo.setBackground(Color.WHITE);
    formPanel.add(course1Combo);

    yPos += gap;

    // ID
    JLabel idLabel1 = new JLabel("Course ID : ");
    idLabel1.setBounds(10, yPos, 90, 25);
    idLabel1.setFont(new Font("Arial", Font.BOLD, 12));
    formPanel.add(idLabel1);
    
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
    
    course2Combo = new JComboBox<>(new String[]{"Select Course",
        "Commuicative English","Basics Mathematics" , "Information Technology and Application" , "Principles of Management & Organization","Python Programming", "Business English", "Mathematics [Numerical Techniques]","System Analysis & Design","C Programming","OS & unix", "C++ Programming" ,"Internet & web designing ", "Java Programming", "Software Engineering" , "RDBMS","Digital electronics CS architecture & organisation", "File & Data Structures", "Statistics" ,"VB.NET","Graphics and Multimedia" , "Computer Networking" , "Accounts",
        "E-Commerce", "Web Technology","NA"
    
    });
    course2Combo.setBounds(150, yPos, 290, 30);
    course2Combo.setBackground(Color.WHITE);
    formPanel.add(course2Combo);

    yPos += gap;

    // ID
    JLabel idLabel2 = new JLabel("Course ID : ");
    idLabel2.setBounds(10, yPos, 90, 25);
    idLabel2.setFont(new Font("Arial", Font.BOLD, 12));
    formPanel.add(idLabel2);
    
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
    
    course3Combo = new JComboBox<>(new String[]{ "Select Course",
        "Commuicative English","Basics Mathematics" , "Information Technology and Application" , "Principles of Management & Organization","Python Programming", "Business English", "Mathematics [Numerical Techniques]","System Analysis & Design","C Programming","OS & unix", "C++ Programming" ,"Internet & web designing ", "Java Programming", "Software Engineering" , "RDBMS","Digital electronics CS architecture & organisation", "File & Data Structures", "Statistics" ,"VB.NET","Graphics and Multimedia" , "Computer Networking" , "Accounts",
        "E-Commerce", "Web Technology","NA"
    });
    course3Combo.setBounds(150, yPos, 290, 30);
    course3Combo.setBackground(Color.WHITE);
    formPanel.add(course3Combo);

    yPos += gap;

    // ID
    JLabel idLabel3 = new JLabel("Course ID : ");
    idLabel3.setBounds(10, yPos, 90, 25);
    idLabel3.setFont(new Font("Arial", Font.BOLD, 12));
    formPanel.add(idLabel3);
    
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
    
    course4Combo = new JComboBox<>(new String[]{"Select Course",
        "Commuicative English","Basics Mathematics" , "Information Technology and Application" , "Principles of Management & Organization","Python Programming", "Business English", "Mathematics [Numerical Techniques]","System Analysis & Design","C Programming","OS & unix", "C++ Programming" ,"Internet & web designing ", "Java Programming", "Software Engineering" , "RDBMS","Digital electronics CS architecture & organisation", "File & Data Structures", "Statistics" ,"VB.NET","Graphics and Multimedia" , "Computer Networking" , "Accounts",
        "E-Commerce", "Web Technology","NA"
    });
    course4Combo.setBounds(150, yPos, 290, 30);
    course4Combo.setBackground(Color.WHITE);
    formPanel.add(course4Combo);

    yPos += gap;

    // ID
    JLabel idLabel4 = new JLabel("Course ID : ");
    idLabel4.setBounds(10, yPos, 90, 25);
    idLabel4.setFont(new Font("Arial", Font.BOLD, 12));
    formPanel.add(idLabel4);
    
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
    
    course5Combo = new JComboBox<>(new String[]{"Select Course",
        "Commuicative English","Basics Mathematics" , "Information Technology and Application" , "Principles of Management & Organization","Python Programming", "Business English", "Mathematics [Numerical Techniques]","System Analysis & Design","C Programming","OS & unix", "C++ Programming" ,"Internet & web designing ", "Java Programming", "Software Engineering" , "RDBMS","Digital electronics CS architecture & organisation", "File & Data Structures", "Statistics" ,"VB.NET","Graphics and Multimedia" , "Computer Networking" , "Accounts",
        "E-Commerce", "Web Technology", "NA"
    });
    course5Combo.setBounds(150, yPos, 290, 30);
    course5Combo.setBackground(Color.WHITE);
    formPanel.add(course5Combo);

    yPos += gap;

    // ID
    JLabel idLabel5 = new JLabel("Course ID : ");
    idLabel5.setBounds(10, yPos, 90, 25);
    idLabel5.setFont(new Font("Arial", Font.BOLD, 12));
    formPanel.add(idLabel5);
    
    courseId5Field = new JTextField();
    courseId5Field.setBounds(150, yPos, 290, 30);
    courseId5Field.setBackground(Color.WHITE);
    formPanel.add(courseId5Field);

    yPos += gap;

    parent.add(formPanel);
}

private void createCourseSearchAndTable(JPanel parent) {
    // Search panel
    JPanel searchPanel = new JPanel();
    searchPanel.setBounds(550, 20, 900, 600);
    searchPanel.setLayout(null);
    searchPanel.setOpaque(false);
    searchPanel.setBorder(BorderFactory.createTitledBorder(
            BorderFactory.createEmptyBorder(), "<html><b>STUDENT's ID :</b></html>"));

    searchCourseField = new JTextField();
    searchCourseField.setBounds(100, 0, 90, 20);
    searchPanel.add(searchCourseField);

    searchCourseButton = new JButton("Search");
    searchCourseButton.setBounds(200, 0, 100, 20);
    searchCourseButton.setBackground(new Color(218, 177, 218));
    searchCourseButton.setForeground(Color.BLACK);
    searchCourseButton.setFont(new Font("Arial", Font.BOLD, 12));
    searchCourseButton.setContentAreaFilled(false);
    searchCourseButton.setOpaque(true);
    searchPanel.add(searchCourseButton);

    parent.add(searchPanel);

    // Table
    String[] columnNames = {"Stu ID", "Sem", "C1", "C1 ID", "C2", "C2 ID", "C3", "C3 ID", "C4", "C4 ID", "C5", "C5 ID"};
    Object[][] data = {};

    courseTableModel = new DefaultTableModel(data, columnNames);
    courseTable = new JTable(courseTableModel);
    courseTable.setFillsViewportHeight(true);
    courseTable.setRowHeight(20);
    courseTable.setBackground(Color.WHITE);

    JScrollPane scrollPane = new JScrollPane(courseTable);
    scrollPane.setBounds(550, 100, 600, 300);
    parent.add(scrollPane);

    // Load all course data initially
    loadCourseData();

}

private void loadCourseData() {
    try (Connection conn = CBConnection.getConnection()) {
        String sql = "SELECT * FROM course";
        PreparedStatement ps = conn.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();

        // Clear existing data
        courseTableModel.setRowCount(0);

        while (rs.next()) {
            Object[] row = {
                rs.getString("student_id"),
                rs.getString("semester"),
                rs.getString("course1_name"), rs.getString("course1_id"),
                rs.getString("course2_name"), rs.getString("course2_id"),
                rs.getString("course3_name"), rs.getString("course3_id"),
                rs.getString("course4_name"), rs.getString("course4_id"),
                rs.getString("course5_name"), rs.getString("course5_id")
            };
            courseTableModel.addRow(row);
        }

    } catch (Exception e) {
        e.printStackTrace();
        JOptionPane.showMessageDialog(this, "Error loading course data: " + e.getMessage());
    }
}

private void searchCourse() {
    String searchText = searchCourseField.getText().trim();

    if (searchText.isEmpty()) {
        JOptionPane.showMessageDialog(this, "Please enter Student ID to search.");
        return;
    }

    try (Connection conn = CBConnection.getConnection()) {
        String sql = "SELECT * FROM course WHERE student_id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, searchText);

        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            clearCourseForm();

            // Fill form fields
            courseStudentIdField.setText(rs.getString("student_id"));
            semesterCombo.setSelectedItem(rs.getString("semester"));

            course1Combo.setSelectedItem(rs.getString("course1_name"));
            courseId1Field.setText(rs.getString("course1_id"));

            course2Combo.setSelectedItem(rs.getString("course2_name"));
            courseId2Field.setText(rs.getString("course2_id"));

            course3Combo.setSelectedItem(rs.getString("course3_name"));
            courseId3Field.setText(rs.getString("course3_id"));

            course4Combo.setSelectedItem(rs.getString("course4_name"));
            courseId4Field.setText(rs.getString("course4_id"));

            course5Combo.setSelectedItem(rs.getString("course5_name"));
            courseId5Field.setText(rs.getString("course5_id"));

            // Update table with the searched result
            courseTableModel.setRowCount(0); // Clear table

            Object[] row = {
                rs.getString("student_id"),
                rs.getString("semester"),
                rs.getString("course1_name"), rs.getString("course1_id"),
                rs.getString("course2_name"), rs.getString("course2_id"),
                rs.getString("course3_name"), rs.getString("course3_id"),
                rs.getString("course4_name"), rs.getString("course4_id"),
                rs.getString("course5_name"), rs.getString("course5_id")
            };

            courseTableModel.addRow(row);

            JOptionPane.showMessageDialog(this, "Record loaded successfully.");

        } else {
            JOptionPane.showMessageDialog(this, "Student ID not found in course table.");
        }

    } catch (Exception e) {
        e.printStackTrace();
        JOptionPane.showMessageDialog(this, "Database Error: " + e.getMessage());
    }
}

private void createCourseBottomButtons(JPanel parent) {
    int buttonWidth = 110;
    int buttonHeight = 35;
    int startX = 620;
    int y = 430;
    int gap = 120;
    
    // Add Course button
    addCourseButton = new JButton("Add Course");
    addCourseButton.setBounds(startX, y, buttonWidth, buttonHeight);
    addCourseButton.setBackground(new Color(218,177,218));
    addCourseButton.setForeground(Color.BLACK);
    addCourseButton.setFont(new Font("Arial", Font.BOLD, 12));
    addCourseButton.setContentAreaFilled(false);
    addCourseButton.setOpaque(true);
    parent.add(addCourseButton);
    
    // Update Course button
    updateCourseButton = new JButton("Update");
    updateCourseButton.setBounds(startX + gap, y, buttonWidth, buttonHeight);
    updateCourseButton.setBackground(new Color(218,177,218));
    updateCourseButton.setForeground(Color.BLACK);
    updateCourseButton.setFont(new Font("Arial", Font.BOLD, 12));
    updateCourseButton.setContentAreaFilled(false);
    updateCourseButton.setOpaque(true);
    parent.add(updateCourseButton);
    
    // Delete Course button
    deleteCourseButton = new JButton("Delete");
    deleteCourseButton.setBounds(startX + gap * 2, y, buttonWidth, buttonHeight);
    deleteCourseButton.setBackground(new Color(218,177,218));
    deleteCourseButton.setForeground(Color.BLACK);
    deleteCourseButton.setFont(new Font("Arial", Font.BOLD, 12));
    deleteCourseButton.setContentAreaFilled(false);
    deleteCourseButton.setOpaque(true);
    parent.add(deleteCourseButton);
    
    // Clear Course button
    clearCourseButton = new JButton("Clear");
    clearCourseButton.setBounds(startX + gap * 3, y, buttonWidth, buttonHeight);
    clearCourseButton.setBackground(new Color(218,177,218));
    clearCourseButton.setForeground(Color.BLACK);
    clearCourseButton.setFont(new Font("Arial", Font.BOLD, 12));
    clearCourseButton.setContentAreaFilled(false);
    clearCourseButton.setOpaque(true);
    parent.add(clearCourseButton);
    
    // Add action listeners for course functionality
    addCourseActionListeners();
}

private void addCourseActionListeners() {
    // Clear course form
    clearCourseButton.addActionListener(e -> clearCourseForm());
    
    // Add new course
    addCourseButton.addActionListener(e -> addNewCourse());
    
    // Delete course
    deleteCourseButton.addActionListener(e -> deleteCourse());
    
    // Update course
    updateCourseButton.addActionListener(e -> updateCourse());
    
    // Course table row selection
    courseTable.getSelectionModel().addListSelectionListener(e -> {
        if (!e.getValueIsAdjusting()) {
            loadSelectedRowToForm();
        }
    });
    
    // Search course functionality
    searchCourseButton.addActionListener(e -> searchCourse());
}

private void loadSelectedRowToForm() {
    int row = courseTable.getSelectedRow();
    if (row >= 0) {
        courseStudentIdField.setText(courseTableModel.getValueAt(row, 0).toString());
        semesterCombo.setSelectedItem(courseTableModel.getValueAt(row, 1).toString());
        course1Combo.setSelectedItem(courseTableModel.getValueAt(row, 2).toString());
        courseId1Field.setText(courseTableModel.getValueAt(row, 3).toString());
        course2Combo.setSelectedItem(courseTableModel.getValueAt(row, 4).toString());
        courseId2Field.setText(courseTableModel.getValueAt(row, 5).toString());
        course3Combo.setSelectedItem(courseTableModel.getValueAt(row, 6).toString());
        courseId3Field.setText(courseTableModel.getValueAt(row, 7).toString());
        course4Combo.setSelectedItem(courseTableModel.getValueAt(row, 8).toString());
        courseId4Field.setText(courseTableModel.getValueAt(row, 9).toString());
        course5Combo.setSelectedItem(courseTableModel.getValueAt(row, 10).toString());
        courseId5Field.setText(courseTableModel.getValueAt(row, 11).toString());
    }
}

private void clearCourseForm() {
    courseId1Field.setText("");
    courseId2Field.setText("");
    courseId3Field.setText("");
    courseId4Field.setText("");
    courseId5Field.setText("");
    courseStudentIdField.setText("");
    semesterCombo.setSelectedIndex(0);
    course1Combo.setSelectedIndex(0);
    course2Combo.setSelectedIndex(0);
    course3Combo.setSelectedIndex(0);
    course4Combo.setSelectedIndex(0);
    course5Combo.setSelectedIndex(0);
}

private void addNewCourse() {
    if (validateCourseForm()) {
        try (Connection conn = CBConnection.getConnection()) {

            String sql = "INSERT INTO course " +
                         "(student_id, semester, course1_name, course1_id, course2_name, course2_id, course3_name, course3_id, course4_name, course4_id, course5_name, course5_id) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement ps = conn.prepareStatement(sql);

            ps.setString(1, courseStudentIdField.getText().trim());
            ps.setString(2, semesterCombo.getSelectedItem().toString());
            ps.setString(3, course1Combo.getSelectedItem().toString());
            ps.setString(4, courseId1Field.getText().trim());
            ps.setString(5, course2Combo.getSelectedItem().toString());
            ps.setString(6, courseId2Field.getText().trim());
            ps.setString(7, course3Combo.getSelectedItem().toString());
            ps.setString(8, courseId3Field.getText().trim());
            ps.setString(9, course4Combo.getSelectedItem().toString());
            ps.setString(10, courseId4Field.getText().trim());
            ps.setString(11, course5Combo.getSelectedItem().toString());
            ps.setString(12, courseId5Field.getText().trim());

            ps.executeUpdate();

            Object[] newRow = {
                courseStudentIdField.getText().trim(),
                semesterCombo.getSelectedItem().toString(),
                course1Combo.getSelectedItem().toString(),
                courseId1Field.getText().trim(),
                course2Combo.getSelectedItem().toString(),
                courseId2Field.getText().trim(),
                course3Combo.getSelectedItem().toString(),
                courseId3Field.getText().trim(),
                course4Combo.getSelectedItem().toString(),
                courseId4Field.getText().trim(),
                course5Combo.getSelectedItem().toString(),
                courseId5Field.getText().trim()
            };

            courseTableModel.addRow(newRow);
            clearCourseForm();
            JOptionPane.showMessageDialog(this, "Course added to database successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Database Error: " + e.getMessage());
        }
    }
}


private void deleteCourse() {
    int selectedRow = courseTable.getSelectedRow();
    if (selectedRow >= 0) {
        String studentId = courseTableModel.getValueAt(selectedRow, 0).toString();

        int confirm = JOptionPane.showConfirmDialog(this, 
            "Are you sure you want to delete this course record?", 
            "Confirm Delete", 
            JOptionPane.YES_NO_OPTION);

        if (confirm == JOptionPane.YES_OPTION) {
            try (Connection conn = CBConnection.getConnection()) {

                String sql = "DELETE FROM course WHERE student_id = ?";
                PreparedStatement ps = conn.prepareStatement(sql);
                ps.setString(1, studentId);

                ps.executeUpdate();

                courseTableModel.removeRow(selectedRow);
                clearCourseForm();

                JOptionPane.showMessageDialog(this, "Course record deleted successfully from database!");

            } catch (Exception e) {
                e.printStackTrace();
                JOptionPane.showMessageDialog(this, "Database Error: " + e.getMessage());
            }
        }
    } else {
        JOptionPane.showMessageDialog(this, "Please select a course record to delete.");
    }
}

private void updateCourse() {
    int selectedRow = courseTable.getSelectedRow();
    if (selectedRow >= 0 && validateCourseForm()) {
        String studentId = courseStudentIdField.getText().trim();

        try (Connection conn = CBConnection.getConnection()) {

            String sql = "UPDATE course SET " +
                         "semester = ?, course1_name = ?, course1_id = ?, " +
                         "course2_name = ?, course2_id = ?, " +
                         "course3_name = ?, course3_id = ?, " +
                         "course4_name = ?, course4_id = ?, " +
                         "course5_name = ?, course5_id = ? " +
                         "WHERE student_id = ?";

            PreparedStatement ps = conn.prepareStatement(sql);

            ps.setString(1, semesterCombo.getSelectedItem().toString());
            ps.setString(2, course1Combo.getSelectedItem().toString());
            ps.setString(3, courseId1Field.getText().trim());
            ps.setString(4, course2Combo.getSelectedItem().toString());
            ps.setString(5, courseId2Field.getText().trim());
            ps.setString(6, course3Combo.getSelectedItem().toString());
            ps.setString(7, courseId3Field.getText().trim());
            ps.setString(8, course4Combo.getSelectedItem().toString());
            ps.setString(9, courseId4Field.getText().trim());
            ps.setString(10, course5Combo.getSelectedItem().toString());
            ps.setString(11, courseId5Field.getText().trim());
            ps.setString(12, studentId);

            ps.executeUpdate();

            // Update table
            courseTableModel.setValueAt(studentId, selectedRow, 0);
            courseTableModel.setValueAt(semesterCombo.getSelectedItem().toString(), selectedRow, 1);
            courseTableModel.setValueAt(course1Combo.getSelectedItem().toString(), selectedRow, 2);
            courseTableModel.setValueAt(courseId1Field.getText().trim(), selectedRow, 3);
            courseTableModel.setValueAt(course2Combo.getSelectedItem().toString(), selectedRow, 4);
            courseTableModel.setValueAt(courseId2Field.getText().trim(), selectedRow, 5);
            courseTableModel.setValueAt(course3Combo.getSelectedItem().toString(), selectedRow, 6);
            courseTableModel.setValueAt(courseId3Field.getText().trim(), selectedRow, 7);
            courseTableModel.setValueAt(course4Combo.getSelectedItem().toString(), selectedRow, 8);
            courseTableModel.setValueAt(courseId4Field.getText().trim(), selectedRow, 9);
            courseTableModel.setValueAt(course5Combo.getSelectedItem().toString(), selectedRow, 10);
            courseTableModel.setValueAt(courseId5Field.getText().trim(), selectedRow, 11);

            JOptionPane.showMessageDialog(this, "Course updated in database successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Database Error: " + e.getMessage());
        }
    } else if (selectedRow < 0) {
        JOptionPane.showMessageDialog(this, "Please select a course record to update.");
    }
}

private boolean validateCourseForm() {
    String studentId = courseStudentIdField.getText().trim();

    if (studentId.isEmpty()) {
        JOptionPane.showMessageDialog(this, "Please enter Student ID.");
        return false;
    }

    if (!studentId.matches("\\d+")) {
        JOptionPane.showMessageDialog(this, "Student ID must contain digits only (e.g., 1234).", "Invalid Input", JOptionPane.ERROR_MESSAGE);
        return false;
    }

    if (semesterCombo.getSelectedIndex() == 0) {
        JOptionPane.showMessageDialog(this, "Please select a semester.");
        return false;
    }

    String selectedSemester = semesterCombo.getSelectedItem().toString();

    // Check if it's update or add operation
    int selectedRow = courseTable.getSelectedRow();
    boolean isUpdateOperation = (selectedRow >= 0);

    // ----------- Semester Conflict Check (Database) -----------
    try (Connection conn = CBConnection.getConnection()) {
        String sql = "SELECT semester FROM course WHERE student_id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, studentId);

        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            String existingSemester = rs.getString("semester");

            if (isUpdateOperation) {
                String tableStudentId = courseTable.getValueAt(selectedRow, 0).toString();
                if (!studentId.equals(tableStudentId)) {
                    if (!existingSemester.equalsIgnoreCase(selectedSemester)) {
                        JOptionPane.showMessageDialog(this,
                                "Student ID " + studentId + " is already registered in semester " + existingSemester + ". Cannot register for a different semester.",
                                "Semester Conflict", JOptionPane.ERROR_MESSAGE);
                        return false;
                    }
                }
            } else {
                if (!existingSemester.equalsIgnoreCase(selectedSemester)) {
                    JOptionPane.showMessageDialog(this,
                            "Student ID " + studentId + " is already registered in semester " + existingSemester + ". Cannot register for a different semester.",
                            "Semester Conflict", JOptionPane.ERROR_MESSAGE);
                    return false;
                }
            }
        } else {
            // Student ID not found in course table, check in student table
            String studentSql = "SELECT * FROM student WHERE student_id = ?";
            PreparedStatement ps2 = conn.prepareStatement(studentSql);
            ps2.setString(1, studentId);
            ResultSet rs2 = ps2.executeQuery();

            if (!rs2.next()) {
                JOptionPane.showMessageDialog(this, "Student ID " + studentId + " not found in student records.", "Invalid Student ID", JOptionPane.ERROR_MESSAGE);
                return false;
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
        JOptionPane.showMessageDialog(this, "Database Error: " + e.getMessage());
        return false;
    }

    // ---------- Course Name Validations ----------
    String course1 = course1Combo.getSelectedItem().toString();
    String course2 = course2Combo.getSelectedItem().toString();
    String course3 = course3Combo.getSelectedItem().toString();
    String course4 = course4Combo.getSelectedItem().toString();
    String course5 = course5Combo.getSelectedItem().toString();

    if (course1Combo.getSelectedIndex() == 0) {
        JOptionPane.showMessageDialog(this, "Please select Course 1.");
        return false;
    }
    if (course1.equals(course2) || course1.equals(course3) || course1.equals(course4) || course1.equals(course5)) {
        JOptionPane.showMessageDialog(this, course1 + " is already selected in another course field.", "Duplicate Course", JOptionPane.ERROR_MESSAGE);
        return false;
    }

    if (course2Combo.getSelectedIndex() == 0) {
        JOptionPane.showMessageDialog(this, "Please select Course 2.");
        return false;
    }
    if (course2.equals(course3) || course2.equals(course4) || course2.equals(course5)) {
        JOptionPane.showMessageDialog(this, course2 + " is already selected in another course field.", "Duplicate Course", JOptionPane.ERROR_MESSAGE);
        return false;
    }

    if (course3Combo.getSelectedIndex() == 0) {
        JOptionPane.showMessageDialog(this, "Please select Course 3.");
        return false;
    }
    if (course3.equals(course4) || course3.equals(course5)) {
        JOptionPane.showMessageDialog(this, course3 + " is already selected in another course field.", "Duplicate Course", JOptionPane.ERROR_MESSAGE);
        return false;
    }

    if (course4Combo.getSelectedIndex() == 0) {
        JOptionPane.showMessageDialog(this, "Please select Course 4.");
        return false;
    }
    if (course4.equals(course5)) {
        JOptionPane.showMessageDialog(this, course4 + " is already selected in another course field.", "Duplicate Course", JOptionPane.ERROR_MESSAGE);
        return false;
    }

    if (course5Combo.getSelectedIndex() == 0) {
        JOptionPane.showMessageDialog(this, "Please select Course 5.");
        return false;
    }

    // ---------- Course ID Validations ----------
    String courseId1 = courseId1Field.getText().trim();
    String courseId2 = courseId2Field.getText().trim();
    String courseId3 = courseId3Field.getText().trim();
    String courseId4 = courseId4Field.getText().trim();
    String courseId5 = courseId5Field.getText().trim();

    String[] courseIds = {courseId1, courseId2, courseId3, courseId4, courseId5};

    for (int i = 0; i < courseIds.length; i++) {
        if (courseIds[i].isEmpty() || !courseIds[i].matches("\\d+")) {
            JOptionPane.showMessageDialog(this, "Course ID " + (i + 1) + " must contain digits only and cannot be empty.", "Invalid Input", JOptionPane.ERROR_MESSAGE);
            return false;
        }

        if (courseIds[i].equals(studentId)) {
            JOptionPane.showMessageDialog(this, "Course ID " + (i + 1) + " cannot be the same as Student ID.", "Invalid Input", JOptionPane.ERROR_MESSAGE);
            return false;
        }
    }

    // ---------- Duplicate Course ID Check ----------
    for (int i = 0; i < courseIds.length; i++) {
        for (int j = i + 1; j < courseIds.length; j++) {
            if (courseIds[i].equals(courseIds[j])) {
                JOptionPane.showMessageDialog(this, "Duplicate Course ID found: " + courseIds[i], "Duplicate Course ID", JOptionPane.ERROR_MESSAGE);
                return false;
            }
        }
    }

    // All validations passed
    return true;
}

/*---------------------------------------------- SCORE ----------------------------------------------- */

private JPanel createScorePanel() {
    JPanel ResultPanel = new GradientPanel();
    ResultPanel.setLayout(null);
    
    // Left side - Course form
    createScoreForm(ResultPanel);
    
    // Right side - Search and table
    createScoreSearchAndTable(ResultPanel);
    
    // Bottom buttons for course
    createScoreBottomButtons(ResultPanel);
    
    return ResultPanel;
}

private void createScoreForm(JPanel parent) {
    // Form background panel
    JPanel formPanel = new JPanel();
    formPanel.setBounds(10, 10, 500, 600);
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

    semesterscoreCombo = new JComboBox<>(new String[]{
        "Select Semester", "1st Semester", "2nd Semester", "3rd Semester",
        "4th Semester", "5th Semester", "6th Semester"
    });
    semesterscoreCombo.setBounds(150, yPos, textFieldWidth, fieldHeight);
    semesterscoreCombo.setBackground(Color.WHITE);
    formPanel.add(semesterscoreCombo);

    yPos += gap;

    // Course 1 and Score 1
    JLabel course1Label = new JLabel("Course 1 :");
    course1Label.setBounds(10, yPos, labelWidth, 25);
    course1Label.setFont(new Font("Arial", Font.BOLD, 12));
    formPanel.add(course1Label);

    coursescore1Combo = new JComboBox<>(new String[]{"Select Course",
        "Communicative English", "Basic Mathematics", "Information Technology and Application",
        "Principles of Management & Organization", "Python Programming", "Business English",
        "Mathematics [Numerical Techniques]", "System Analysis & Design", "C Programming", "OS & Unix",
        "C++ Programming", "Internet & Web Designing", "Java Programming", "Software Engineering",
        "RDBMS", "Digital Electronics CS Architecture & Organisation", "File & Data Structures",
        "Statistics", "VB.NET", "Graphics and Multimedia", "Computer Networking", "Accounts",
        "E-Commerce", "Web Technology", "NA"
    });
    coursescore1Combo.setBounds(150, yPos, textFieldWidth, fieldHeight);
    coursescore1Combo.setBackground(Color.WHITE);
    formPanel.add(coursescore1Combo);

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

    coursescore2Combo = new JComboBox<>(new String[]{"Select Course",
        "Communicative English", "Basic Mathematics", "Information Technology and Application",
        "Principles of Management & Organization", "Python Programming", "Business English",
        "Mathematics [Numerical Techniques]", "System Analysis & Design", "C Programming", "OS & Unix",
        "C++ Programming", "Internet & Web Designing", "Java Programming", "Software Engineering",
        "RDBMS", "Digital Electronics CS Architecture & Organisation", "File & Data Structures",
        "Statistics", "VB.NET", "Graphics and Multimedia", "Computer Networking", "Accounts",
        "E-Commerce", "Web Technology", "NA"
    });
    coursescore2Combo.setBounds(150, yPos, textFieldWidth, fieldHeight);
    coursescore2Combo.setBackground(Color.WHITE);
    formPanel.add(coursescore2Combo);

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

    coursescore3Combo = new JComboBox<>(new String[]{"Select Course",
        "Communicative English", "Basic Mathematics", "Information Technology and Application",
        "Principles of Management & Organization", "Python Programming", "Business English",
        "Mathematics [Numerical Techniques]", "System Analysis & Design", "C Programming", "OS & Unix",
        "C++ Programming", "Internet & Web Designing", "Java Programming", "Software Engineering",
        "RDBMS", "Digital Electronics CS Architecture & Organisation", "File & Data Structures",
        "Statistics", "VB.NET", "Graphics and Multimedia", "Computer Networking", "Accounts",
        "E-Commerce", "Web Technology", "NA"
    });
    coursescore3Combo.setBounds(150, yPos, textFieldWidth, fieldHeight);
    coursescore3Combo.setBackground(Color.WHITE);
    formPanel.add(coursescore3Combo);

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

    coursescore4Combo = new JComboBox<>(new String[]{"Select Course",
        "Communicative English", "Basic Mathematics", "Information Technology and Application",
        "Principles of Management & Organization", "Python Programming", "Business English",
        "Mathematics [Numerical Techniques]", "System Analysis & Design", "C Programming", "OS & Unix",
        "C++ Programming", "Internet & Web Designing", "Java Programming", "Software Engineering",
        "RDBMS", "Digital Electronics CS Architecture & Organisation", "File & Data Structures",
        "Statistics", "VB.NET", "Graphics and Multimedia", "Computer Networking", "Accounts",
        "E-Commerce", "Web Technology", "NA"
    });
    coursescore4Combo.setBounds(150, yPos, textFieldWidth, fieldHeight);
    coursescore4Combo.setBackground(Color.WHITE);
    formPanel.add(coursescore4Combo);

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

    coursescore5Combo = new JComboBox<>(new String[]{"Select Course",
        "Communicative English", "Basic Mathematics", "Information Technology and Application",
        "Principles of Management & Organization", "Python Programming", "Business English",
        "Mathematics [Numerical Techniques]", "System Analysis & Design", "C Programming", "OS & Unix",
        "C++ Programming", "Internet & Web Designing", "Java Programming", "Software Engineering",
        "RDBMS", "Digital Electronics CS Architecture & Organisation", "File & Data Structures",
        "Statistics", "VB.NET", "Graphics and Multimedia", "Computer Networking", "Accounts",
        "E-Commerce", "Web Technology", "NA"
    });
    coursescore5Combo.setBounds(150, yPos, textFieldWidth, fieldHeight);
    coursescore5Combo.setBackground(Color.WHITE);
    formPanel.add(coursescore5Combo);

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

private void createScoreSearchAndTable(JPanel parent) {
    // Search panel
    JPanel searchPanel = new JPanel();
    searchPanel.setBounds(550, 30, 300, 80);
    searchPanel.setLayout(null);
    searchPanel.setOpaque(false);
    searchPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(), 
        "<html><b>STUDENT ID:</b></html>"));
    
    searchScoreField = new JTextField();
    searchScoreField.setBounds(90, 0, 90, 20);
    searchPanel.add(searchScoreField);
    
    searchScoreButton = new JButton("Search");
    searchScoreButton.setBounds(190, 0, 90, 20);
    searchScoreButton.setBackground(new Color(218, 177, 218));
    searchScoreButton.setForeground(Color.BLACK);
    searchScoreButton.setFont(new Font("Arial", Font.BOLD, 12));
    searchScoreButton.setContentAreaFilled(false);
    searchScoreButton.setOpaque(true);
    searchPanel.add(searchScoreButton);
    
    parent.add(searchPanel);
    
    // Table with corrected structure
    String[] columnNames = {"Stu ID", "Semester", "C1", "S1", "C2", "S2", "C3", "S3", "C4", "S4", "C5", "S5"};
    
    scoreTableModel = new DefaultTableModel(columnNames, 0) {
        @Override
        public boolean isCellEditable(int row, int column) {
            return false;
        }
    };
    
    scoreTable = new JTable(scoreTableModel);
    scoreTable.setFillsViewportHeight(true);
    scoreTable.setRowHeight(25);
    scoreTable.setBackground(Color.WHITE);
    scoreTable.setFont(new Font("Arial", Font.PLAIN, 11));
    scoreTable.getTableHeader().setFont(new Font("Arial", Font.BOLD, 11));
    scoreTable.setAutoResizeMode(JTable.AUTO_RESIZE_ALL_COLUMNS);
    
    JScrollPane scrollPane = new JScrollPane(scoreTable);
    scrollPane.setBounds(550, 100, 650, 300);
    scrollPane.setBackground(Color.WHITE);
    parent.add(scrollPane);

    // Load all saved scores from database when tab is created
    loadAllScoresInTable();
}

private void loadAllScoresInTable() {
    try (Connection con = CBConnection.getConnection()) {
        String sql = "SELECT * FROM result";
        PreparedStatement ps = con.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();

        scoreTableModel.setRowCount(0); // Clear existing data

        while (rs.next()) {
            Object[] row = {
                rs.getString("student_id"),
                rs.getString("semester"),
                rs.getString("course1"), rs.getDouble("score1"),
                rs.getString("course2"), rs.getDouble("score2"),
                rs.getString("course3"), rs.getDouble("score3"),
                rs.getString("course4"), rs.getDouble("score4"),
                rs.getString("course5"), rs.getDouble("score5")
            };
            scoreTableModel.addRow(row);
        }

    } catch (SQLException e) {
        JOptionPane.showMessageDialog(null, "Error loading score data: " + e.getMessage());
    }
}


private void createScoreBottomButtons(JPanel parent) {
    int buttonWidth = 100;
    int buttonHeight = 35;
    int startX = 650;
    int y = 430;
    int gap = 120;
    
    // Add button (was Update)
    editScoreButton = new JButton("Add");
    editScoreButton.setBounds(startX, y, buttonWidth, buttonHeight);
    editScoreButton.setBackground(new Color(218, 177, 218));
    editScoreButton.setForeground(Color.BLACK);
    editScoreButton.setFont(new Font("Arial", Font.BOLD, 12));
    editScoreButton.setContentAreaFilled(false);
    editScoreButton.setOpaque(true);
    parent.add(editScoreButton);
    
    // Update button (was Edit)
    updateScoreButton = new JButton("Update");
    updateScoreButton.setBounds(startX + gap, y, buttonWidth, buttonHeight);
    updateScoreButton.setBackground(new Color(218, 177, 218));
    updateScoreButton.setForeground(Color.BLACK);
    updateScoreButton.setFont(new Font("Arial", Font.BOLD, 12));
    updateScoreButton.setContentAreaFilled(false);
    updateScoreButton.setOpaque(true);
    parent.add(updateScoreButton);
    
    // Delete button
    deleteScoreButton = new JButton("Delete");
    deleteScoreButton.setBounds(startX + gap * 2, y, buttonWidth, buttonHeight);
    deleteScoreButton.setBackground(new Color(218, 177, 218));
    deleteScoreButton.setForeground(Color.BLACK);
    deleteScoreButton.setFont(new Font("Arial", Font.BOLD, 12));
    deleteScoreButton.setContentAreaFilled(false);
    deleteScoreButton.setOpaque(true);
    parent.add(deleteScoreButton);
    
    // Clear button
    clearScoreButton = new JButton("Clear");
    clearScoreButton.setBounds(startX + gap * 3, y, buttonWidth, buttonHeight);
    clearScoreButton.setBackground(new Color(218, 177, 218));
    clearScoreButton.setForeground(Color.BLACK);
    clearScoreButton.setFont(new Font("Arial", Font.BOLD, 12));
    clearScoreButton.setContentAreaFilled(false);
    clearScoreButton.setOpaque(true);
    parent.add(clearScoreButton);
    
    addScoreActionListeners();
}

private void addScoreActionListeners() {
    clearScoreButton.addActionListener(e -> clearScoreForm());
    editScoreButton.addActionListener(e -> editNewScore());
    deleteScoreButton.addActionListener(e -> deleteScore());
    updateScoreButton.addActionListener(e -> updateScore());
    searchScoreButton.addActionListener(e -> searchScore());

    /*scoreStudentIdField.addFocusListener(new FocusAdapter() {
        @Override
        public void focusLost(FocusEvent e) {
            String studentId = scoreStudentIdField.getText().trim();
            if (!studentId.isEmpty()) {
                loadCoursesForStudent(studentId);
            }
        }
    });*/

    scoreTable.getSelectionModel().addListSelectionListener(e -> {
        if (!e.getValueIsAdjusting()) {
            loadSelectedScore(); // Keep this for table selection
        }
    });
}


private void clearScoreForm() {
    scoreStudentIdField.setText("");
    semesterscoreCombo.setSelectedIndex(0);

    coursescore1Combo.setSelectedIndex(0);
    coursescore2Combo.setSelectedIndex(0);
    coursescore3Combo.setSelectedIndex(0);
    coursescore4Combo.setSelectedIndex(0);
    coursescore5Combo.setSelectedIndex(0);

    score1Field.setText("");
    score2Field.setText("");
    score3Field.setText("");
    score4Field.setText("");
    score5Field.setText("");

    // Enable combos again when clearing
    coursescore1Combo.setEnabled(true);
    coursescore2Combo.setEnabled(true);
    coursescore3Combo.setEnabled(true);
    coursescore4Combo.setEnabled(true);
    coursescore5Combo.setEnabled(true);
}

private void editNewScore() {
    if (validateScoreForm()) {
        String studentId = scoreStudentIdField.getText().trim();
        String semester = semesterscoreCombo.getSelectedItem().toString();

        if (isDuplicateScore(studentId, semester)) {
            JOptionPane.showMessageDialog(this, 
                "Score record already exists for Student ID: " + studentId + " in " + semester,
                "Duplicate Record", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try (Connection con = CBConnection.getConnection()) {
            String sql = "INSERT INTO result (student_id, semester, course1, score1, course2, score2, " +
                         "course3, score3, course4, score4, course5, score5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, studentId);
            ps.setString(2, semester);
            ps.setString(3, coursescore1Combo.getSelectedItem().toString());
            ps.setDouble(4, Double.parseDouble(score1Field.getText().trim()));
            ps.setString(5, coursescore2Combo.getSelectedItem().toString());
            ps.setDouble(6, Double.parseDouble(score2Field.getText().trim()));
            ps.setString(7, coursescore3Combo.getSelectedItem().toString());
            ps.setDouble(8, Double.parseDouble(score3Field.getText().trim()));
            ps.setString(9, coursescore4Combo.getSelectedItem().toString());
            ps.setDouble(10, Double.parseDouble(score4Field.getText().trim()));
            ps.setString(11, coursescore5Combo.getSelectedItem().toString());
            ps.setDouble(12, Double.parseDouble(score5Field.getText().trim()));

            ps.executeUpdate();

            loadAllScoresInTable();
// Refresh table
            clearScoreForm();

            JOptionPane.showMessageDialog(this, "Score added successfully!");

        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Database error: " + e.getMessage());
        }
    }
}

private void deleteScore() {
    int selectedRow = scoreTable.getSelectedRow();
    if (selectedRow >= 0) {
        String studentId = scoreTableModel.getValueAt(selectedRow, 0).toString();
        String semester = scoreTableModel.getValueAt(selectedRow, 1).toString();

        int confirm = JOptionPane.showConfirmDialog(this, 
            "Are you sure you want to delete this score record?", 
            "Confirm Delete", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            try (Connection con = CBConnection.getConnection()) {
                String sql = "DELETE FROM result WHERE student_id=? AND semester=?";
                PreparedStatement ps = con.prepareStatement(sql);
                ps.setString(1, studentId);
                ps.setString(2, semester);
                ps.executeUpdate();

                loadAllScoresInTable();

                clearScoreForm();

                JOptionPane.showMessageDialog(this, "Score record deleted successfully!");
            } catch (SQLException e) {
                JOptionPane.showMessageDialog(this, "Database error: " + e.getMessage());
            }
        }
    } else {
        JOptionPane.showMessageDialog(this, "Please select a score record to delete.");
    }
}

private void updateScore() {
    int selectedRow = scoreTable.getSelectedRow();
    if (selectedRow >= 0 && validateScoreForm()) {
        String studentId = scoreStudentIdField.getText().trim();
        String semester = semesterscoreCombo.getSelectedItem().toString();

        try (Connection con = CBConnection.getConnection()) {
            String sql = "UPDATE result SET course1=?, score1=?, course2=?, score2=?, " +
                         "course3=?, score3=?, course4=?, score4=?, course5=?, score5=? " +
                         "WHERE student_id=? AND semester=?";
            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, coursescore1Combo.getSelectedItem().toString());
            ps.setDouble(2, Double.parseDouble(score1Field.getText().trim()));
            ps.setString(3, coursescore2Combo.getSelectedItem().toString());
            ps.setDouble(4, Double.parseDouble(score2Field.getText().trim()));
            ps.setString(5, coursescore3Combo.getSelectedItem().toString());
            ps.setDouble(6, Double.parseDouble(score3Field.getText().trim()));
            ps.setString(7, coursescore4Combo.getSelectedItem().toString());
            ps.setDouble(8, Double.parseDouble(score4Field.getText().trim()));
            ps.setString(9, coursescore5Combo.getSelectedItem().toString());
            ps.setDouble(10, Double.parseDouble(score5Field.getText().trim()));
            ps.setString(11, studentId);
            ps.setString(12, semester);

            ps.executeUpdate();

            loadAllScoresInTable();
            clearScoreForm();

            JOptionPane.showMessageDialog(this, "Score record updated successfully!");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Database error: " + e.getMessage());
        }
    } else if (selectedRow < 0) {
        JOptionPane.showMessageDialog(this, "Please select a score record to update.");
    }
}

private void loadSelectedScore() {
    int selectedRow = scoreTable.getSelectedRow();
    if (selectedRow >= 0) {
        // Set Student ID and Semester
        scoreStudentIdField.setText(scoreTableModel.getValueAt(selectedRow, 0).toString());
        semesterscoreCombo.setSelectedItem(scoreTableModel.getValueAt(selectedRow, 1).toString());

        // Set Courses and Scores
        coursescore1Combo.setSelectedItem(scoreTableModel.getValueAt(selectedRow, 2).toString());
        score1Field.setText(scoreTableModel.getValueAt(selectedRow, 3).toString());

        coursescore2Combo.setSelectedItem(scoreTableModel.getValueAt(selectedRow, 4).toString());
        score2Field.setText(scoreTableModel.getValueAt(selectedRow, 5).toString());

        coursescore3Combo.setSelectedItem(scoreTableModel.getValueAt(selectedRow, 6).toString());
        score3Field.setText(scoreTableModel.getValueAt(selectedRow, 7).toString());

        coursescore4Combo.setSelectedItem(scoreTableModel.getValueAt(selectedRow, 8).toString());
        score4Field.setText(scoreTableModel.getValueAt(selectedRow, 9).toString());

        coursescore5Combo.setSelectedItem(scoreTableModel.getValueAt(selectedRow, 10).toString());
        score5Field.setText(scoreTableModel.getValueAt(selectedRow, 11).toString());
    }
}

private void loadCoursesForStudent(String studentId) {
    try (Connection con = CBConnection.getConnection()) {
        String sql = "SELECT course1, course2, course3, course4, course5 FROM course WHERE student_id = ?";
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setString(1, studentId);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            // Auto-fill courses from database and disable combo boxes
            coursescore1Combo.setSelectedItem(rs.getString("course1"));
            coursescore2Combo.setSelectedItem(rs.getString("course2"));
            coursescore3Combo.setSelectedItem(rs.getString("course3"));
            coursescore4Combo.setSelectedItem(rs.getString("course4"));
            coursescore5Combo.setSelectedItem(rs.getString("course5"));

            coursescore1Combo.setEnabled(false);
            coursescore2Combo.setEnabled(false);
            coursescore3Combo.setEnabled(false);
            coursescore4Combo.setEnabled(false);
            coursescore5Combo.setEnabled(false);
        } else {
            // If no course data found, enable combo boxes for manual selection
            coursescore1Combo.setSelectedIndex(0);
            coursescore2Combo.setSelectedIndex(0);
            coursescore3Combo.setSelectedIndex(0);
            coursescore4Combo.setSelectedIndex(0);
            coursescore5Combo.setSelectedIndex(0);

            coursescore1Combo.setEnabled(true);
            coursescore2Combo.setEnabled(true);
            coursescore3Combo.setEnabled(true);
            coursescore4Combo.setEnabled(true);
            coursescore5Combo.setEnabled(true);
        }
    } catch (SQLException e) {
        JOptionPane.showMessageDialog(this, "Error loading courses: " + e.getMessage());
    }
}

private void loadStudentScoresOnLogin(String studentId) {
    try (Connection con = CBConnection.getConnection()) {
        String sql = "SELECT * FROM result WHERE student_id=?";
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setString(1, studentId);

        ResultSet rs = ps.executeQuery();
        scoreTableModel.setRowCount(0); // Clear previous data

        while (rs.next()) {
            Object[] row = {
                rs.getString("student_id"),
                rs.getString("semester"),
                rs.getString("course1"), rs.getDouble("score1"),
                rs.getString("course2"), rs.getDouble("score2"),
                rs.getString("course3"), rs.getDouble("score3"),
                rs.getString("course4"), rs.getDouble("score4"),
                rs.getString("course5"), rs.getDouble("score5")
            };
            scoreTableModel.addRow(row);
        }

        if (scoreTableModel.getRowCount() == 0) {
            JOptionPane.showMessageDialog(this, "No saved scores found for Student ID: " + studentId);
        }

    } catch (SQLException e) {
        JOptionPane.showMessageDialog(this, "Database error: " + e.getMessage());
    }
}

private void searchScore() {
    String searchId = searchScoreField.getText().trim();
    if (searchId.isEmpty()) {
        JOptionPane.showMessageDialog(this, "Please enter Student ID to search.");
        return;
    }

    try (Connection con = CBConnection.getConnection()) {
        String sql = "SELECT * FROM result WHERE student_id=?";
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setString(1, searchId);

        ResultSet rs = ps.executeQuery();
        scoreTableModel.setRowCount(0); // Clear table

        while (rs.next()) {
            Object[] row = {
                rs.getString("student_id"),
                rs.getString("semester"),
                rs.getString("course1"), rs.getDouble("score1"),
                rs.getString("course2"), rs.getDouble("score2"),
                rs.getString("course3"), rs.getDouble("score3"),
                rs.getString("course4"), rs.getDouble("score4"),
                rs.getString("course5"), rs.getDouble("score5")
            };
            scoreTableModel.addRow(row);
        }

        if (scoreTableModel.getRowCount() == 0) {
            JOptionPane.showMessageDialog(this, "No record found for Student ID: " + searchId);
        }

    } catch (SQLException e) {
        JOptionPane.showMessageDialog(this, "Database error: " + e.getMessage());
    }
}

private boolean validateScoreForm() {
    // Validate Student ID
    if (scoreStudentIdField.getText().trim().isEmpty()) {
        JOptionPane.showMessageDialog(this, "Please enter Student ID.");
        scoreStudentIdField.requestFocus();
        return false;
    }
    
    // Validate Semester
    if (semesterscoreCombo.getSelectedIndex() == 0) {
        JOptionPane.showMessageDialog(this, "Please select a semester.");
        semesterscoreCombo.requestFocus();
        return false;
    }
    
    // Validate Course and Score fields
    JComboBox<?>[] courseCombos = {coursescore1Combo, coursescore2Combo, coursescore3Combo, 
                                   coursescore4Combo, coursescore5Combo};
    JTextField[] scoreFields = {score1Field, score2Field, score3Field, score4Field, score5Field};
    
    for (int i = 0; i < courseCombos.length; i++) {
        if (courseCombos[i].getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Please select course " + (i + 1) + ".");
            courseCombos[i].requestFocus();
            return false;
        }
        
        String scoreText = scoreFields[i].getText().trim();
        if (scoreText.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter score for course " + (i + 1) + ".");
            scoreFields[i].requestFocus();
            return false;
        }
        
        try {
            double score = Double.parseDouble(scoreText);
            if (score < 0 || score > 100) {
                JOptionPane.showMessageDialog(this, "Score " + (i + 1) + " must be between 0 and 100.");
                scoreFields[i].requestFocus();
                return false;
            }
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Score " + (i + 1) + " must be a valid number.");
            scoreFields[i].requestFocus();
            return false;
        }
    }
    
    return true;
}

private boolean isDuplicateScore(String studentId, String semester) {
    for (int i = 0; i < scoreTableModel.getRowCount(); i++) {
        String existingStudentId = scoreTableModel.getValueAt(i, 0).toString();
        String existingSemester = scoreTableModel.getValueAt(i, 1).toString();
        
        if (existingStudentId.equals(studentId) && existingSemester.equals(semester)) {
            return true;
        }
    }
    return false;
}

/*------------------------------------------- NOTICE ---------------------------------------------------- */

// Class field to store attachment bytes
// Class fields
private JPanel displayPanel;   // FIX: Declare displayPanel globally
private byte[] attachmentData = null;

private JPanel createNoticePanel() {
    JPanel noticePanel = new GradientPanel();
    noticePanel.setLayout(null);
    noticePanel.setOpaque(false);

    int y = 10;
    int gap = 50;

    JLabel postLabel = new JLabel("<html><b>NOTICE</b></html>");
    postLabel.setBounds(10, y, 200, 25);
    noticePanel.add(postLabel);

    y += gap;

    JLabel titleLabel = new JLabel("Title :");
    titleLabel.setBounds(20, y, 80, 25);
    noticePanel.add(titleLabel);

    JTextField titleField = new JTextField();
    titleField.setBounds(100, y, 400, 25);
    noticePanel.add(titleField);

    y += gap;

    JLabel contentLabel = new JLabel("Content :");
    contentLabel.setBounds(20, y, 80, 25);
    noticePanel.add(contentLabel);

    JTextArea contentArea = new JTextArea();
    contentArea.setLineWrap(true);
    contentArea.setWrapStyleWord(true);
    JScrollPane contentScroll = new JScrollPane(contentArea);
    contentScroll.setBounds(100, y, 400, 80);
    noticePanel.add(contentScroll);

    y += 100;

    JButton attachButton = new JButton("Attach PDF/Image");
    attachButton.setBounds(100, y, 150, 30);
    noticePanel.add(attachButton);

    attachButton.addActionListener(e -> {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileFilter(new FileNameExtensionFilter("PDF and Images", "pdf", "jpg", "jpeg", "png"));
        int option = fileChooser.showOpenDialog(null);
        if (option == JFileChooser.APPROVE_OPTION) {
            try {
                File file = fileChooser.getSelectedFile();
                attachmentData = Files.readAllBytes(file.toPath());
                JOptionPane.showMessageDialog(null, "Attachment added: " + file.getName());
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(null, "Error reading file: " + ex.getMessage());
            }
        }
    });

    JButton postButton = new JButton("Post");
    postButton.setBounds(260, y, 130, 30);
    noticePanel.add(postButton);

    postButton.addActionListener(e -> {
        String title = titleField.getText().trim();
        String content = contentArea.getText().trim();
        String facultyName = "Faculty"; // Replace with actual session username if needed
        java.sql.Date currentDate = new java.sql.Date(System.currentTimeMillis());

        if (title.isEmpty() || content.isEmpty()) {
            JOptionPane.showMessageDialog(null, "Please fill title and content");
            return;
        }

        try (Connection con = CBConnection.getConnection()) {
            String sql = "INSERT INTO notice (date, faculty_name, title, content, attachment) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setDate(1, currentDate);
            ps.setString(2, facultyName);
            ps.setString(3, title);
            ps.setString(4, content);

            if (attachmentData != null) {
                ps.setBytes(5, attachmentData);
            } else {
                ps.setNull(5, Types.LONGVARBINARY); // FIXED: Use LONGVARBINARY for LONGBLOB
            }

            ps.executeUpdate();

            JOptionPane.showMessageDialog(null, "Notice posted successfully!");

            // Clear form after posting
            titleField.setText("");
            contentArea.setText("");
            attachmentData = null;

            // Refresh display
            loadNoticesFromDatabase();

        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(null, "Database error: " + ex.getMessage());
        }
    });

    // Display Section
    JLabel viewLabel = new JLabel("All Notice");
    viewLabel.setBounds(20, y + 50, 200, 25);
    noticePanel.add(viewLabel);

    displayPanel = new JPanel();
    displayPanel.setLayout(new BoxLayout(displayPanel, BoxLayout.Y_AXIS));
    displayPanel.setBackground(Color.WHITE);

    JScrollPane scrollPane = new JScrollPane(displayPanel);
    scrollPane.setBounds(100, y + 60, 480, 200);
    noticePanel.add(scrollPane);

    // Load notices from database at startup
    loadNoticesFromDatabase();

    return noticePanel;
}

private void loadNoticesFromDatabase() {
    displayPanel.removeAll();

    try (Connection con = CBConnection.getConnection()) {
        String sql = "SELECT * FROM notice ORDER BY notice_id DESC";
        PreparedStatement ps = con.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();

        while (rs.next()) {
            String title = rs.getString("title");
            String content = rs.getString("content");
            String author = rs.getString("faculty_name");
            String date = rs.getDate("date").toString();
            byte[] attachment = rs.getBytes("attachment");

            JPanel notice = createNoticeDisplay(title, content, author, date, attachment);
            displayPanel.add(notice);
        }

        displayPanel.revalidate();
        displayPanel.repaint();

    } catch (SQLException e) {
        JOptionPane.showMessageDialog(null, "Error loading notices: " + e.getMessage());
    }
}

private JPanel createNoticeDisplay(String title, String content, String author, String date, byte[] attachment) {
    JPanel notice = new JPanel();
    notice.setLayout(null);
    notice.setBackground(Color.WHITE);
    notice.setBorder(BorderFactory.createLineBorder(Color.GRAY));
    notice.setPreferredSize(new Dimension(450, 100));

    JLabel titleLabel = new JLabel(title);
    titleLabel.setBounds(10, 5, 400, 20);
    titleLabel.setFont(new Font("Arial", Font.BOLD, 13));
    notice.add(titleLabel);

    JLabel contentLabel = new JLabel("<html>" + content + "</html>");
    contentLabel.setBounds(10, 25, 400, 30);
    notice.add(contentLabel);

    JLabel infoLabel = new JLabel("By: " + author + " | Date: " + date);
    infoLabel.setBounds(10, 60, 400, 15);
    infoLabel.setFont(new Font("Arial", Font.ITALIC, 10));
    notice.add(infoLabel);

    if (attachment != null) {
        JButton downloadBtn = new JButton("Download Attachment");
        downloadBtn.setBounds(10, 75, 180, 20);
        notice.add(downloadBtn);

        downloadBtn.addActionListener(e -> {
            try {
                JFileChooser chooser = new JFileChooser();
                chooser.setSelectedFile(new File("attachment"));
                int option = chooser.showSaveDialog(null);
                if (option == JFileChooser.APPROVE_OPTION) {
                    Files.write(chooser.getSelectedFile().toPath(), attachment);
                    JOptionPane.showMessageDialog(null, "Attachment saved successfully!");
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(null, "Error saving file: " + ex.getMessage());
            }
        });
    }

    return notice;
}

/*---------------------------------------------ATTENDANCE--------------------------------------------------- */

public JPanel createAttendancePanel() {
    JPanel mainPanel = new GradientPanel();
    mainPanel.setLayout(null);
    mainPanel.setOpaque(false);

    JPanel controlsPanel = new JPanel();
    controlsPanel.setLayout(null);
    controlsPanel.setOpaque(false);
    controlsPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(),
            "<html><b>ATTENDANCE DETAILS</b></html>"));
    controlsPanel.setBounds(10, 20, 350, 250);
    mainPanel.add(controlsPanel);

    int y = 30;
    int gap = 40;

    JLabel courseLabel = new JLabel("Course :");
    courseLabel.setBounds(10, y, 100, 25);
    controlsPanel.add(courseLabel);

    JComboBox<String> courseCombo = new JComboBox<>(new String[]{
            "Select Course", "BCA-AKU-6THSEM-B1", "BCA-AKU-6THSEM-B2", "BCA-AKU-6THSEM-B3"
    });
    courseCombo.setBounds(100, y, 200, 25);
    controlsPanel.add(courseCombo);

    y += gap;

    JLabel subjectLabel = new JLabel("Subject :");
    subjectLabel.setBounds(10, y, 100, 25);
    controlsPanel.add(subjectLabel);

    JComboBox<String> subjectCombo = new JComboBox<>(new String[]{
            "Communicative English", "Basic Mathematics", "Information Technology and Application",
            "Principles of Management & Organization", "Python Programming", "Business English",
            "Mathematics [Numerical Techniques]", "System Analysis & Design", "C Programming", "OS & Unix",
            "C++ Programming", "Internet & Web Designing", "Java Programming", "Software Engineering",
            "RDBMS", "Digital Electronics CS Architecture & Organisation", "File & Data Structures",
            "Statistics", "VB.NET", "Graphics and Multimedia", "Computer Networking", "Accounts",
            "E-Commerce", "Web Technology"
    });
    subjectCombo.setBounds(100, y, 200, 25);
    controlsPanel.add(subjectCombo);

    y += gap;

    JLabel dateLabel = new JLabel("Date :");
    dateLabel.setBounds(10, y, 100, 25);
    controlsPanel.add(dateLabel);

    JSpinner dateSpinner = new JSpinner(new SpinnerDateModel());
    JSpinner.DateEditor dateEditor = new JSpinner.DateEditor(dateSpinner, "yyyy-MM-dd");
    dateSpinner.setEditor(dateEditor);
    dateSpinner.setValue(new Date());
    dateSpinner.setBounds(100, y, 200, 25);
    controlsPanel.add(dateSpinner);

    y += gap;

    JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 10));
    buttonPanel.setOpaque(false);
    JButton markButton = new JButton("Mark Attendance");
    JButton saveButton = new JButton("Save");
    JButton clearButton = new JButton("Clear");

    buttonPanel.add(markButton);
    buttonPanel.add(saveButton);
    buttonPanel.add(clearButton);
    buttonPanel.setBounds(10, y, 310, 45);
    controlsPanel.add(buttonPanel);

    JPanel tablePanel = new JPanel();
    tablePanel.setLayout(null);
    tablePanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEmptyBorder(),
            "<html><b>ATTENDANCE DETAILS</b></html>"));
    tablePanel.setOpaque(false);
    tablePanel.setBounds(350, 20, 600, 600);
    mainPanel.add(tablePanel);

    String[] columns = {"Student ID", "Name", "Present"};
    Object[][] data = {};

    DefaultTableModel model = new DefaultTableModel(data, columns) {
        @Override
        public Class<?> getColumnClass(int columnIndex) {
            return columnIndex == 2 ? Boolean.class : super.getColumnClass(columnIndex);
        }

        @Override
        public boolean isCellEditable(int row, int column) {
            return column == 2;
        }
    };

    JTable table = new JTable(model);
    JScrollPane scrollPane = new JScrollPane(table);
    scrollPane.setBounds(10, 20, 580, 320);
    tablePanel.add(scrollPane);

    JLabel presentLabel = new JLabel("Present: 0");
    JLabel absentLabel = new JLabel("Absent: 0");
    JLabel totalLabel = new JLabel("Total: 0");

    JPanel summaryPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 20, 5));
    summaryPanel.add(presentLabel);
    summaryPanel.add(absentLabel);
    summaryPanel.add(totalLabel);
    summaryPanel.setOpaque(false);
    summaryPanel.setBounds(10, 345, 580, 30);
    tablePanel.add(summaryPanel);

    // MySQL Connection Details
    String url = "jdbc:mysql://localhost:3307/student_db";
    String dbUser = "root";
    String dbPass = ""; // Your MySQL password

    // Load Attendance (even previous records)
    markButton.addActionListener(e -> {
    if (courseCombo.getSelectedIndex() == 0 || subjectCombo.getSelectedIndex() == 0) {
        JOptionPane.showMessageDialog(null, "Please select course and subject.");
        return;
    }

    String selectedCourse = courseCombo.getSelectedItem().toString();
    String selectedSubject = subjectCombo.getSelectedItem().toString();
    String selectedDate = new SimpleDateFormat("yyyy-MM-dd").format(dateSpinner.getValue());

    model.setRowCount(0);

    try (Connection con = DriverManager.getConnection(url, dbUser, dbPass)) {

        // Load students of selected course
        String studentSql = "SELECT student_id, name FROM student WHERE course = ?";
        PreparedStatement psStudent = con.prepareStatement(studentSql);
        psStudent.setString(1, selectedCourse);
        ResultSet rsStudent = psStudent.executeQuery();

        boolean studentFound = false;

        while (rsStudent.next()) {
            studentFound = true;

            String sid = rsStudent.getString("student_id");
            String name = rsStudent.getString("name");

            // Check if attendance already exists
            String attendanceSql = "SELECT status FROM attendance WHERE student_id=? AND course_name=? AND subject_name=? AND date=?";
            PreparedStatement psAttend = con.prepareStatement(attendanceSql);
            psAttend.setString(1, sid);
            psAttend.setString(2, selectedCourse);
            psAttend.setString(3, selectedSubject);
            psAttend.setString(4, selectedDate);

            ResultSet rsAttend = psAttend.executeQuery();

            boolean isPresent = false; // Default unchecked
            if (rsAttend.next()) {
                String status = rsAttend.getString("status");
                isPresent = status.equalsIgnoreCase("Present");
            }

            model.addRow(new Object[]{sid, name, isPresent});
        }

        if (!studentFound) {
            JOptionPane.showMessageDialog(null, "No students found for " + selectedCourse + " in " + selectedSubject + ".", "Warning", JOptionPane.WARNING_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(null, "Attendance loaded successfully!");
            updateAttendanceSummary(model, presentLabel, absentLabel, totalLabel);
        }

    } catch (SQLException ex) {
        ex.printStackTrace();
        JOptionPane.showMessageDialog(null, "Error: " + ex.getMessage());
    }
});

    // Save Attendance to DB
    saveButton.addActionListener(e -> {
        try (Connection con = DriverManager.getConnection(url, dbUser, dbPass)) {
            String sql = "INSERT INTO attendance (student_id, course_name, subject_name, date, status) " +
                    "VALUES (?, ?, ?, ?, ?) " +
                    "ON DUPLICATE KEY UPDATE status=VALUES(status)";

            PreparedStatement ps = con.prepareStatement(sql);

            String course = courseCombo.getSelectedItem().toString();
            String subject = subjectCombo.getSelectedItem().toString();
            String date = new SimpleDateFormat("yyyy-MM-dd").format(dateSpinner.getValue());

            for (int i = 0; i < model.getRowCount(); i++) {
                String sid = model.getValueAt(i, 0).toString();
                boolean present = (boolean) model.getValueAt(i, 2);

                ps.setString(1, sid);
                ps.setString(2, course);
                ps.setString(3, subject);
                ps.setString(4, date);
                ps.setString(5, present ? "Present" : "Absent");

                ps.addBatch();
            }

            ps.executeBatch();
            JOptionPane.showMessageDialog(null, "Attendance saved successfully!");
            updateAttendanceSummary(model, presentLabel, absentLabel, totalLabel);

        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(null, "Error: " + ex.getMessage());
        }
    });

    clearButton.addActionListener(e -> {
        courseCombo.setSelectedIndex(0);
        subjectCombo.setSelectedIndex(0);
        dateSpinner.setValue(new Date());
        model.setRowCount(0);
        updateAttendanceSummary(model, presentLabel, absentLabel, totalLabel);
    });

    updateAttendanceSummary(model, presentLabel, absentLabel, totalLabel);
    return mainPanel;
}

private void updateAttendanceSummary(DefaultTableModel model, JLabel presentLabel, JLabel absentLabel, JLabel totalLabel) {
    int total = model.getRowCount();
    int present = 0;

    for (int i = 0; i < total; i++) {
        boolean isPresent = (boolean) model.getValueAt(i, 2);
        if (isPresent) {
            present++;
        }
    }

    int absent = total - present;

    totalLabel.setText("Total: " + total);
    presentLabel.setText("Present: " + present);
    absentLabel.setText("Absent: " + absent);
}


    public static void main(String args[]) {
        try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception e) {
            e.printStackTrace();
        }
        
        SwingUtilities.invokeLater(() -> {

            new Homepage();
        });
    }
}