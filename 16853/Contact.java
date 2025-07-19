
import java.awt.Font;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;


public class Contact extends javax.swing.JFrame {
    
    private JTextField nameField, emailField;
    private JTextArea messageArea;

    public Contact() {
        initComponents();
        
        setVisible(true);
        setSize(1366,766);
        setLayout(null);
        
        //background
        ImageIcon img1= new ImageIcon(ClassLoader.getSystemResource("images/contactpg.png"));
        Image temp = img1.getImage().getScaledInstance(1366,766,Image.SCALE_DEFAULT);
        ImageIcon img2 = new ImageIcon(temp);
        JLabel bg=new JLabel(img2);
        bg.setBounds(0,0,1366,766);
        bg.setLayout(null);
        add(bg);
        
         //close button
        ImageIcon closeIcon = new ImageIcon(ClassLoader.getSystemResource("images/close.png"));
        JButton closeBtn = new JButton(closeIcon);
        closeBtn.setBounds(1326, 1, 40, 40);     //frameWidth=1366 and btnWidth=40 .So frameWidth - btnWidth = closebtn on the right top-corner.
        bg.add(closeBtn);
        add(bg); 
        //ActionPerformed by Close Btn
        // Close button manually
        closeBtn.addActionListener(e -> dispose());

        // Handle both close button and window [X]
        addWindowListener(new java.awt.event.WindowAdapter() {
                @Override
                public void windowClosed(java.awt.event.WindowEvent e) {
                        dispose();
                }   
        });
        
        
        JLabel heading = new JLabel("Contact Us");
        heading.setFont(new Font("Arial", Font.BOLD, 30));
        heading.setBounds(160, 20, 200, 30);
        bg.add(heading);

        // Name
        JLabel nameLabel = new JLabel("Name:");
        nameLabel.setFont(new Font("Arial", Font.PLAIN, 18));
        nameLabel.setBounds(50, 80, 100, 30);
        bg.add(nameLabel);

        nameField = new JTextField();
        nameField.setBounds(150, 80, 280, 30);
        bg.add(nameField);
        
        // Email
        JLabel emailLabel = new JLabel("Email:");
        emailLabel.setFont(new Font("Arial", Font.PLAIN, 18));
        emailLabel.setBounds(50, 130, 100, 30);
        bg.add(emailLabel);

        emailField = new JTextField();
        emailField.setBounds(150, 130, 280, 30);
        bg.add(emailField);

        // Message
        JLabel msgLabel = new JLabel("Message:");
        msgLabel.setFont(new Font("Arial", Font.PLAIN, 18));
        msgLabel.setBounds(50, 180, 100, 30);
        bg.add(msgLabel);

        messageArea = new JTextArea();
        JScrollPane scrollPane = new JScrollPane(messageArea);
        scrollPane.setBounds(150, 180, 280, 150);
        bg.add(scrollPane);

        // Submit Button
        JButton submitBtn = new JButton("Submit");
        submitBtn.setBounds(180, 350, 120, 40);
        bg.add(submitBtn);

        // Submit Action
        submitBtn.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String name = nameField.getText().trim();
                String email = emailField.getText().trim();
                String message = messageArea.getText().trim();

                if (name.isEmpty() || email.isEmpty() || message.isEmpty()) {
                    JOptionPane.showMessageDialog(Contact.this, "Please fill in all fields.", "Warning", JOptionPane.WARNING_MESSAGE);
                } else {
                    JOptionPane.showMessageDialog(Contact.this, "Thank you for contacting us, " + name + "!");
                    nameField.setText("");
                    emailField.setText("");
                    messageArea.setText("");
                }
            }
        });
        
        
       // Description Title
        JLabel aboutLabel = new JLabel("About BookHive Library Management System");
        aboutLabel.setFont(new Font("Arial", Font.BOLD, 18));
        aboutLabel.setBounds(50, 400, 400, 30);
        bg.add(aboutLabel);
        
        
        // Description (multi-line using HTML in JLabel)
        JLabel description = new JLabel("<html>" +
                "BookHive is a smart and efficient Library Management System built for managing<br>" +
                "students, books, and issuing/returning transactions with ease. It includes:<br><br>" +
                "- Student Registration and Management<br>" +
                "- Book Cataloging and Availability Tracking<br>" +
                "- Book Issue and Return Features<br>" +
                "- Admin Dashboard for Real-time Statistics<br>" +
                "- Simple and Interactive User Interface<br><br>" +
                "This system helps libraries operate more smoothly and allows students<br>" +
                "to check book availability and manage their borrowed books easily." +
                "</html>");
        description.setFont(new Font("Arial", Font.PLAIN, 14));
        description.setBounds(50, 430, 400, 200); // Adjust height as needed
        bg.add(description);
        
        
        
        setVisible(true);
        
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setUndecorated(true);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 400, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 300, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(Contact.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(Contact.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(Contact.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(Contact.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new Contact().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    // End of variables declaration//GEN-END:variables
}
