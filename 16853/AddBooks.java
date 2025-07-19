 import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.Connection;
import javax.swing.*;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;



public class AddBooks extends javax.swing.JFrame {

     JTextField bid = new JTextField("");
     JTextField bname = new JTextField("");
     JTextField publiser = new JTextField("");
     JTextField price = new JTextField("");
     JTextField pubYr = new JTextField("");
     JTextField statusfld = new JTextField("");
      
      
     public AddBooks() {
        initComponents();
        
        setSize(1366,766);
        setLayout(null);
        setVisible(true);
        
        //background
        ImageIcon img1= new ImageIcon(ClassLoader.getSystemResource("images/addbooks.png"));
        Image img2 = img1.getImage().getScaledInstance(1366,766,Image.SCALE_DEFAULT);
        ImageIcon img3 = new ImageIcon(img2);
        JLabel img=new JLabel(img3);
        img.setBounds(0,0,1366,766);
        img.setLayout(null);
        add(img);
        
        
        //close button
        ImageIcon closeIcon = new ImageIcon(ClassLoader.getSystemResource("images/close.png"));
        JButton closeBtn = new JButton(closeIcon);
        closeBtn.setBounds(1326, 1, 40, 40);     //frameWidth=1366 and btnWidth=40 .So frameWidth - btnWidth = closebtn on the right top-corner.
        img.add(closeBtn);
        add(img);
        //ActionPerformed by Close Btn
        closeBtn.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                dispose(); // This works because we're inside the JFrame class
            }
        }); 
        
        
        
        //heading
        ImageIcon icon = new ImageIcon(ClassLoader.getSystemResource("images/isue.jpg"));
        Image ic = icon.getImage().getScaledInstance(100,50,Image.SCALE_DEFAULT);
        ImageIcon icon2 = new ImageIcon(ic);
        JLabel head = new JLabel("Add Books", icon2, JLabel.LEFT);
        head.setFont(new Font("Tahoma", Font.BOLD, 62));
        head.setForeground(Color.ORANGE);
        head.setBounds(100, 20, 700, 60); // x, y, width, height
        img.add(head);
       
        //labels
        JLabel id = new JLabel("Book ID"); // 1. Create label with text
        id.setFont(new Font("Arial", Font.BOLD, 28));
        id.setForeground(Color.BLACK);
        id.setBounds(50, 200, 200, 20);        // 2. Set position and size 
        img.add(id);
        add(img);     

        JLabel name = new JLabel("Book Name"); // 1. Create label with text
        name.setFont(new Font("Arial", Font.BOLD, 28));
        name.setForeground(Color.BLACK);
        name.setBounds(50, 265, 200, 20);        // 2. Set position and size 
        img.add(name);
        add(img);    
        
        JLabel course = new JLabel("Author"); // 1. Create label with text
        course.setFont(new Font("Arial", Font.BOLD, 28));
        course.setForeground(Color.BLACK);
        course.setBounds(50, 325, 200, 20);        // 2. Set position and size 
        img.add(course);
        add(img);     

        
        JLabel branch = new JLabel("Price"); // 1. Create label with text
        branch.setFont(new Font("Arial", Font.BOLD, 28));
        branch.setForeground(Color.BLACK);
        branch.setBounds(50, 385, 200, 20);        // 2. Set position and size 
        img.add(branch);
        add(img);     

        
        JLabel pub = new JLabel("Publisher Year"); // 1. Create label with text
        pub.setFont(new Font("Arial", Font.BOLD, 28));
        pub.setForeground(Color.BLACK);
        pub.setBounds(50, 445, 200, 20);        // 2. Set position and size 
        img.add(pub);
        add(img);     

        
        JLabel lblStatus = new JLabel("Status"); // 1. Create label with text
        lblStatus.setFont(new Font("Arial", Font.BOLD, 28));
        lblStatus.setForeground(Color.BLACK);
        lblStatus.setBounds(50, 505, 200, 20);        // 2. Set position and size 
        img.add(lblStatus);
        add(img);     
        
        
        //id- Textfield
       
        bid.setFont(new Font("Arial", Font.BOLD, 28));
        bid.setForeground(Color.BLACK);
        bid.setBackground(Color.WHITE);
        bid.setBounds(300, 200, 300, 40);        // 2. Set position and size 
        img.add(bid);
        add(img); 
        
        
        //book name - field
        
        bname.setFont(new Font("Arial", Font.BOLD, 28));
        bname.setForeground(Color.BLACK);
        bname.setBackground(Color.WHITE);
        bname.setBounds(300, 265, 300, 40);        // 2. Set position and size 
        img.add(bname);
        add(img); 
        
        //publisher - field
       
        publiser.setFont(new Font("Arial", Font.BOLD, 28));
        publiser.setForeground(Color.BLACK);
        publiser.setBackground(Color.WHITE);
        publiser.setBounds(300, 325, 300, 40);        // 2. Set position and size 
        img.add(publiser);
        add(img); 
        
        
        //price - field
        
        price.setFont(new Font("Arial", Font.BOLD, 28));
        price.setForeground(Color.BLACK);
        price.setBackground(Color.WHITE);
        price.setBounds(300, 385, 300, 40);        // 2. Set position and size 
        img.add(price);
        add(img); 
        
        //publisher year - field
       
        pubYr.setFont(new Font("Arial", Font.BOLD, 28));
        pubYr.setForeground(Color.BLACK);
        pubYr.setBackground(Color.WHITE);
        pubYr.setBounds(300, 445, 300, 40);        // 2. Set position and size 
        img.add(pubYr);
        add(img); 
        
        
        //status field
        statusfld.setFont(new Font("Arial", Font.BOLD, 28));
        statusfld.setForeground(Color.BLACK);
        statusfld.setBackground(Color.WHITE);
        statusfld.setBounds(300, 505, 300, 40);        // 2. Set position and size 
        img.add(statusfld);
        add(img); 
        
        
        //Save Btn
        JButton saveBtn = new JButton("Save");
        saveBtn.setBounds(200, 580, 130, 50);
        saveBtn.setBackground(Color.GREEN);
        saveBtn.setForeground(Color.WHITE);
        saveBtn.setFont(new Font("Arial", Font.BOLD, 28));
        img.add(saveBtn);
        add(img);  
        
        saveBtn.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if(bid.getText().equals("")){
            JOptionPane.showMessageDialog(AddBooks.this, "All feilds are required");
            bid.requestFocus();
        }
        else if(bname.getText().equals("")){
             JOptionPane.showMessageDialog(AddBooks.this, "All feilds are required");
             bname.requestFocus();
        }
        
        else if(publiser.getText().equals("")){
            JOptionPane.showMessageDialog(AddBooks.this, "All feilds are required");
            publiser.requestFocus();
        }
        
        else if(price.getText().equals("")){
            JOptionPane.showMessageDialog(AddBooks.this, "All feilds are required");
            price.requestFocus();
        }
        
        else if(pubYr.getText().equals("")){
            JOptionPane.showMessageDialog(AddBooks.this, "All feilds are required");
            pubYr.requestFocus();
        }
        
        else{
            try {
                Connection con = ConnectWithDB.Connection();
                PreparedStatement ps = con.prepareStatement("INSERT INTO BOOK(id, title, author, price, year, status) values(?, ?, ?, ?, ?, ?)");
                ps.setString(1, bid.getText());
                ps.setString(2, bname.getText());
                ps.setString(3, publiser.getText());
                ps.setString(4, price.getText());
                ps.setString(5, pubYr.getText());
                ps.setString(6, statusfld.getText());
                ps.executeUpdate();
                JOptionPane.showMessageDialog(AddBooks.this, "Record Saved");
                
                bid.setText("");
                bname.setText("");
                publiser.setText("");
                price.setText("");
                pubYr.setText("");
                statusfld.setText("");
                
                
            } catch (SQLException ex) {
                Logger.getLogger(AddBooks.class.getName()).log(Level.SEVERE, null, ex);
                 JOptionPane.showMessageDialog(AddBooks.this, "Error: " + ex.getMessage());
            }
        }
                
            }
        }); 
        
        
        
    }  
    
   
    

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jLabel10 = new javax.swing.JLabel();

        jLabel10.setFont(new java.awt.Font("Tahoma", 1, 24)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(255, 255, 255));
        jLabel10.setIcon(new javax.swing.ImageIcon("D:\\Java GUI Projects\\Library Management System\\src\\images\\register.png")); // NOI18N
        jLabel10.setText("jLabel9");

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setUndecorated(true);
        getContentPane().setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

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
            java.util.logging.Logger.getLogger(AddBooks.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(AddBooks.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(AddBooks.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(AddBooks.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new AddBooks().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel jLabel10;
    // End of variables declaration//GEN-END:variables
}
