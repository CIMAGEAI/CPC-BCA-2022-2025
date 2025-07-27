import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.File;

public class ComplaintForm extends JFrame {
    private JComboBox<String> categoryBox;
    private JTextField titleField, filePathField;
    private JTextArea descriptionArea;
    private JButton submitButton, uploadButton;

    public ComplaintForm(String studentName) {
        setTitle("Submit Complaint");
        setSize(600, 500);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(null);

        // Dark Theme
        getContentPane().setBackground(new Color(30, 30, 30));

        JLabel heading = new JLabel("Submit New Complaint");
        heading.setBounds(180, 20, 300, 30);
        heading.setFont(new Font("Arial", Font.BOLD, 20));
        heading.setForeground(Color.WHITE);
        add(heading);

        JLabel catLabel = new JLabel("Category:");
        catLabel.setBounds(80, 70, 100, 25);
        catLabel.setForeground(Color.WHITE);
        add(catLabel);

        categoryBox = new JComboBox<>(new String[]{"Academic", "Hostel", "Infrastructure", "Harassment", "Other"});
        categoryBox.setBounds(200, 70, 250, 25);
        add(categoryBox);

        JLabel titleLabel = new JLabel("Title:");
        titleLabel.setBounds(80, 110, 100, 25);
        titleLabel.setForeground(Color.WHITE);
        add(titleLabel);

        titleField = new JTextField();
        titleField.setBounds(200, 110, 250, 25);
        add(titleField);

        JLabel descLabel = new JLabel("Description:");
        descLabel.setBounds(80, 150, 100, 25);
        descLabel.setForeground(Color.WHITE);
        add(descLabel);

        descriptionArea = new JTextArea();
        descriptionArea.setLineWrap(true);
        descriptionArea.setWrapStyleWord(true);
        JScrollPane scrollPane = new JScrollPane(descriptionArea);
        scrollPane.setBounds(200, 150, 250, 100);
        add(scrollPane);

        JLabel fileLabel = new JLabel("Attach File (optional):");
        fileLabel.setBounds(80, 270, 150, 25);
        fileLabel.setForeground(Color.WHITE);
        add(fileLabel);

        filePathField = new JTextField();
        filePathField.setBounds(200, 270, 180, 25);
        filePathField.setEditable(false);
        add(filePathField);

        uploadButton = new JButton("Browse");
        uploadButton.setBounds(390, 270, 80, 25);
        add(uploadButton);

        submitButton = new JButton("Submit Complaint");
        submitButton.setBounds(200, 330, 250, 35);
        submitButton.setBackground(new Color(25, 118, 211));
        submitButton.setForeground(Color.WHITE);
        submitButton.setFont(new Font("SansSerif", Font.BOLD, 14));
        add(submitButton);

        uploadButton.addActionListener(e -> chooseFile());
        submitButton.addActionListener(e -> {
            // Submit logic here (DB)
            JOptionPane.showMessageDialog(this, "Complaint submitted successfully.");
            dispose();
        });

        setVisible(true);
    }

    private void chooseFile() {
        JFileChooser fileChooser = new JFileChooser();
        int option = fileChooser.showOpenDialog(this);
        if (option == JFileChooser.APPROVE_OPTION) {
            File selected = fileChooser.getSelectedFile();
            filePathField.setText(selected.getAbsolutePath());
        }
    }

    public static void main(String[] args) {
        new ComplaintForm("Student Name");
    }
}
