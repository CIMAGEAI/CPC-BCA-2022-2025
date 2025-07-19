import java.awt.Color;
import java.awt.Font;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import static java.awt.image.ImageObserver.WIDTH;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;




public class IssueBook extends javax.swing.JFrame {
    
    Connection con = ConnectWithDB.Connection();
    PreparedStatement pst =null;
    ResultSet rs = null;
    
    public IssueBook() {
        initComponents();
        
        setVisible(true);
        setLayout(null);
        
        //background
        ImageIcon img1 = new ImageIcon(ClassLoader.getSystemResource("images/issue.png"));
        Image temp = img1.getImage().getScaledInstance(1366,766,Image.SCALE_DEFAULT);
        ImageIcon finalset = new ImageIcon(temp);
        JLabel bg=new JLabel(finalset);
        bg.setBounds(0,0,1366,766);
        bg.setLayout(null);
        add(bg);
        
        
        //heading
        ImageIcon headicon = new ImageIcon(ClassLoader.getSystemResource("images/isue.jpg"));
        Image ic = headicon.getImage().getScaledInstance(100,50,Image.SCALE_DEFAULT);
        ImageIcon icon2 = new ImageIcon(ic);
        JLabel head = new JLabel("Issue Books", icon2, JLabel.LEFT);
        head.setFont(new Font("Tahoma", Font.BOLD, 62));
        Color headcolor = new Color(148, 104, 57);
        head.setForeground(headcolor);
        head.setBounds(450, 50, 700, 60); // x, y, width, height
        bg.add(head);
        
        //close Btn
        ImageIcon icon = new ImageIcon(ClassLoader.getSystemResource("images/close.png"));
        JButton closeBtn = new JButton(icon);
        closeBtn.setBounds(1326, 1, 40, 40);     //frameWidth=1366 and btnWidth=40 .So frameWidth - btnWidth = closebtn on the right top-corner.
        bg.add(closeBtn);
        add(bg);
        //action performed by close button
        closeBtn.addActionListener(new ActionListener(){

            @Override
            public void actionPerformed(ActionEvent e) {
               dispose();
            }
        });
        
       
        
        //labels
        JLabel id = new JLabel("Book ID"); // 1. Create label with text
        id.setFont(new Font("Arial", Font.BOLD, 28));
        id.setForeground(Color.BLACK);
        id.setBounds(400, 200, 200, 20);        // 2. Set position and size 
        bg.add(id);
        add(bg);     

        JLabel stdId = new JLabel("Student ID"); // 1. Create label with text
        stdId.setFont(new Font("Arial", Font.BOLD, 28));
        stdId.setForeground(Color.BLACK);
        stdId.setBounds(400, 280, 200, 20);        // 2. Set position and size 
        bg.add(stdId);
        add(bg);   
        
 
        JLabel  bname= new JLabel("Book Name"); // 1. Create label with text
        bname.setFont(new Font("Arial", Font.BOLD, 28));
        bname.setForeground(Color.BLACK);
        bname.setBounds(400, 360, 200, 20);        // 2. Set position and size 
        bg.add(bname);
        add(bg);     

        JLabel issDate = new JLabel("Issue Date"); // 1. Create label with text
        issDate.setFont(new Font("Arial", Font.BOLD, 28));
        issDate.setForeground(Color.BLACK);
        issDate.setBounds(400, 440, 200, 20);        // 2. Set position and size 
        bg.add(issDate);
        add(bg);    
        
        JLabel dueDate = new JLabel("Due Date"); // 1. Create label with text
        dueDate.setFont(new Font("Arial", Font.BOLD, 28));
        dueDate.setForeground(Color.BLACK);
        dueDate.setBounds(400, 520, 200, 20);        // 2. Set position and size 
        bg.add(dueDate);
        add(bg);    
        
        
        
        
        
        //fields
        JTextField txtBookid = new JTextField();
        txtBookid.setFont(new Font("Arial", Font.BOLD, 28));
        txtBookid.setForeground(Color.BLACK);
        txtBookid.setBackground(Color.WHITE);
        txtBookid.setBounds(600, 200, 350, 40);        // 2. Set position and size 
        bg.add(txtBookid);
        add(bg); 
        
        JTextField txtStudid = new JTextField();
        txtStudid.setFont(new Font("Arial", Font.BOLD, 28));
        txtStudid.setForeground(Color.BLACK);
        txtStudid.setBackground(Color.WHITE);
        txtStudid.setBounds(600, 280, 350, 40);        // 2. Set position and size 
        bg.add(txtStudid);
        add(bg); 
        
        JTextField txtBookfield = new JTextField();
        txtBookfield.setFont(new Font("Arial", Font.BOLD, 28));
        txtBookfield.setForeground(Color.BLACK);
        txtBookfield.setBackground(Color.WHITE);
        txtBookfield.setBounds(600, 360, 350, 40);        // 2. Set position and size 
        bg.add(txtBookfield);
        add(bg); 
        
        
        JTextField issDateField = new JTextField();
        issDateField.setFont(new Font("Arial", Font.BOLD, 28));
        issDateField.setForeground(Color.BLACK);
        issDateField.setBackground(Color.WHITE);
        issDateField.setBounds(600, 440, 350, 40);        
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        issDateField.setText(today.format(formatter)); // Format: YYYY-MM-DD

        bg.add(issDateField);
        add(bg); 
        
        
        JTextField dueDateField = new JTextField();
        dueDateField.setFont(new Font("Arial", Font.BOLD, 28));
        dueDateField.setForeground(Color.BLACK);
        dueDateField.setBackground(Color.WHITE);
        dueDateField.setBounds(600, 520, 350, 40);       
        bg.add(dueDateField);
        add(bg); 
        
        //Issue Btn
        JButton issue = new JButton("Issue");
        issue.setFont(new Font("Arial", Font.BOLD, 18));
        Color clr = new Color(204, 0, 0);
        issue.setBackground(clr);
        issue.setForeground(Color.WHITE);
        issue.setBounds(550, 610, 120, 50);     //frameWidth=1366 and btnWidth=40 .So frameWidth - btnWidth = closebtn on the right top-corner.
        bg.add(issue);
        add(bg);
        
        //action performed by issueBtn
        issue.addActionListener(new ActionListener(){

            public void actionPerformed(ActionEvent e) {
                if(txtBookid.getText().equals("")){
                    JOptionPane.showMessageDialog(IssueBook.this, "Please enter boook id and search it");
                    txtBookid.requestFocus();
                }
                else{
                    try {
                        pst = con.prepareStatement("Update Book SET STATUS=?,ISSUEDATE=?, DUEDATE=?, STUDENTID=?  Where id = ?");
                        pst.setString(1, "ISSUED");
                        pst.setString(2, issDateField.getText());
                        pst.setString(3, dueDateField.getText());
                        pst.setString(4, txtStudid.getText());
                        pst.setString(5, txtBookid.getText());
                        pst.executeUpdate();
                        
                        JOptionPane.showMessageDialog(IssueBook.this, "Book Issued");
                        
                        txtBookid.setText("");
                        txtStudid.setText("");
                        txtBookfield.setText("");
                        issDateField.setText("");
                        dueDateField.setText("");
                    } catch (SQLException ex) {
                        Logger.getLogger(IssueBook.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    
                }
            }
            
        });
        
        
         //search Button
        JButton searchBtn = new JButton("Search");
        searchBtn.setFont(new Font("Arial", Font.BOLD, 18));
        searchBtn.setBackground(Color.RED);
        searchBtn.setForeground(Color.WHITE);
        searchBtn.setBounds(995, 200, 90, 40);     //frameWidth=1366 and btnWidth=40 .So frameWidth - btnWidth = closebtn on the right top-corner.
        bg.add(searchBtn);
        add(bg);
        
        //action performed by search btn
        searchBtn.addActionListener(new ActionListener(){

            @Override
            public void actionPerformed(ActionEvent e) {
                if(txtBookid.getText().equals("")){
                    JOptionPane.showMessageDialog(IssueBook.this, "Please enter book id and search it");
                    txtBookid.requestFocus();
                }else{
                    try {
                        pst = con.prepareStatement("Select * from book where ID =?");
                        pst.setString(1, txtBookid.getText());
                        rs = pst.executeQuery();
                        if(rs.next()){
                            txtBookfield.setText(rs.getString(2));
                        }
                        
                        
                    } catch (SQLException ex) {
                        Logger.getLogger(IssueBook.class.getName()).log(Level.SEVERE, null, ex);
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

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setUndecorated(true);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 1366, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 766, Short.MAX_VALUE)
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
            java.util.logging.Logger.getLogger(IssueBook.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(IssueBook.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(IssueBook.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(IssueBook.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new IssueBook().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    // End of variables declaration//GEN-END:variables
}
