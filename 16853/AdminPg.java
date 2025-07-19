
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.Image;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;

public class AdminPg extends javax.swing.JFrame {
    private JTable studentTable;
private DefaultTableModel studentModel;

private JTable bookTable;
private DefaultTableModel bookModel;

private JTable reqBookTable;
private DefaultTableModel reqBookModel;


    public AdminPg() {
        initComponents();
        
        setVisible(true);
        setSize(1366,766);
        setLayout(null);
        
        
        //background
        ImageIcon img1= new ImageIcon(ClassLoader.getSystemResource("images/admin.png"));
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
        
        
        
        //heading
        
        JLabel head = new JLabel("Admin Page");
        head.setFont(new Font("Tahoma", Font.BOLD, 62));
        Color myColor = new Color(111, 53, 25);
        head.setForeground(myColor);
        head.setBounds(490, 2, 600, 80); // x, y, width, height
        bg.add(head);
        
        
        //no of student
        JLabel stdId = new JLabel("Total Students"); // 1. Create label with text
        stdId.setFont(new Font("Arial", Font.BOLD, 25));
        stdId.setForeground(Color.BLACK);
        stdId.setBounds(20, 80, 200, 30);        // 2. Set position and size 
        bg.add(stdId);
      
        
        int tableWidth1 = 350;
        int tableHeight1 = 300;
        
        studentTable();
        
        JScrollPane stdScroll = new JScrollPane(studentTable);

        stdScroll.setBounds(20, 110, tableWidth1, tableHeight1);
        bg.add(stdScroll);
        
        
        //number of book
        JLabel bookid = new JLabel("Total Books"); // 1. Create label with text
        bookid.setFont(new Font("Arial", Font.BOLD, 25));
        bookid.setForeground(Color.BLACK);
        bookid.setBounds(600, 80, 200, 30);        // 2. Set position and size 
        bg.add(bookid);
      
        
        int tableWidth2 = 350;
        int tableHeight2 = 300;
        
        bookTable();
        
       JScrollPane bookScroll = new JScrollPane(bookTable);

        bookScroll.setBounds(500, 110, tableWidth2, tableHeight2);
        bg.add(bookScroll);
        
        
        
        int tableWidth3 = 350;
        int tableHeight3 = 300;
        
        reqBookTable();
        
       JScrollPane reqBookScroll = new JScrollPane(reqBookTable);

        reqBookScroll.setBounds(500, 110, tableWidth3, tableHeight3);
        bg.add(reqBookScroll);
        
        
    }
    
    
    public void studentTable(){
        
        try{
            Connection con = ConnectWithDB.Connection();
            PreparedStatement pst = null;
            ResultSet rs = null;
        
            String sql = "SELECT * FROM signup";
            pst = con.prepareStatement(sql);
            rs = pst.executeQuery();
            
            
            studentModel = new DefaultTableModel(new String[]{"Student Id","Full name", "phone number", "email ID"}, 0);
            studentTable = new JTable(studentModel);
            
            while (rs.next()) {
                int id = rs.getInt("stdId");
                String fname = rs.getString("fullname");
                int phone = rs.getInt("phn");
                String eml = rs.getString("email");
               
                
                // ✅ Add each row to model
                 studentModel.addRow(new Object[]{id, fname, phone, eml});
            }
            
            
            con.close();
        }catch(SQLException e){
            JOptionPane.showMessageDialog(this, "Error loading books: " + e.getMessage());
        }

    }
    
    
    public void bookTable(){
        try{
            Connection con = ConnectWithDB.Connection();
            PreparedStatement pst = null;
            ResultSet rs = null;
        
            String sql = "SELECT * FROM book";
            pst = con.prepareStatement(sql);
            rs = pst.executeQuery();
            
            
            bookModel = new DefaultTableModel(new String[]{"Book ID", "Title", "Author", "Price"}, 0);
            bookTable = new JTable(bookModel);
            
            while (rs.next()) {
                int b_id = rs.getInt("id");
                String b_title = rs.getString("title");
                String b_author = rs.getString("author");
                String b_price = rs.getString("price");
               
                
                // ✅ Add each row to model
                 bookModel.addRow(new Object[]{b_id, b_title, b_author, b_price});
            }
            
            
            con.close();
        }catch(SQLException e){
            JOptionPane.showMessageDialog(this, "Error loading books: " + e.getMessage());
        }

    }
    
    
    public void reqBookTable(){
        try{
            Connection con = ConnectWithDB.Connection();
            PreparedStatement pst = null;
            ResultSet rs = null;
        
            String sql = "SELECT * FROM book";
            pst = con.prepareStatement(sql);
            rs = pst.executeQuery();
            
            
            bookModel = new DefaultTableModel(new String[]{"Book ID", "Title", "Author", "Price"}, 0);
            bookTable = new JTable(bookModel);
            
            while (rs.next()) {
                int b_id = rs.getInt("id");
                String b_title = rs.getString("title");
                String b_author = rs.getString("author");
                String b_price = rs.getString("price");
               
                
                // ✅ Add each row to model
                 bookModel.addRow(new Object[]{b_id, b_title, b_author, b_price});
            }
            
            
            con.close();
        }catch(SQLException e){
            JOptionPane.showMessageDialog(this, "Error loading books: " + e.getMessage());
        }
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
            java.util.logging.Logger.getLogger(AdminPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(AdminPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(AdminPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(AdminPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new AdminPg().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    // End of variables declaration//GEN-END:variables
}
