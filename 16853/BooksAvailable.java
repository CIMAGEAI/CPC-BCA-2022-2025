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
import javax.swing.JTextField;
import static javax.swing.WindowConstants.DISPOSE_ON_CLOSE;
import javax.swing.table.DefaultTableModel;


public class BooksAvailable extends javax.swing.JFrame {

    JTable table;
    DefaultTableModel model;
    
    public BooksAvailable() {
        initComponents();
        
        setVisible(true);
        setSize(1366,766);
        setLayout(null);
        setLayout(new BorderLayout());
        
        //background
        ImageIcon img1= new ImageIcon(ClassLoader.getSystemResource("images/avbooks.png"));
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
        
        
        //heading
        
        JLabel head = new JLabel("Books Available");
        head.setFont(new Font("Tahoma", Font.BOLD, 62));
        Color myColor = new Color(111, 53, 25);
        head.setForeground(myColor);
        head.setBounds(450, 20, 600, 80); // x, y, width, height
        bg.add(head);
        
        
        // Search bar components
        JLabel searchLabel = new JLabel("Search:");
        searchLabel.setFont(new Font("Tahoma", Font.PLAIN, 22));
        searchLabel.setBounds(300, 140, 100, 30);
        bg.add(searchLabel);

        JTextField searchField = new JTextField();
        searchField.setFont(new Font("Tahoma", Font.PLAIN, 20));
        searchField.setBounds(400, 140, 300, 30);
        bg.add(searchField);

        JButton searchButton = new JButton("Search");
        searchButton.setFont(new Font("Tahoma", Font.BOLD, 20));
        searchButton.setBounds(720, 140, 120, 30);
        bg.add(searchButton);
        
        searchButton.addActionListener(e -> {
            String keyword = searchField.getText().trim();
            if (!keyword.isEmpty()) {
                searchAndHighlight(keyword);
            } else {
                JOptionPane.showMessageDialog(this, "Please enter a book title to search.");
            }
        });


        
        // creating table
        int tableWidth = 800;
        int tableHeight = 500;
        int frameWidth = 1366;
        int frameHeight = 858;

        // Calculate center position
        int x = (frameWidth - tableWidth) / 2;
        int y = (frameHeight - tableHeight) / 2;

        

        
        
        loadBooks();
        
        
        JScrollPane scrollPane = new JScrollPane(table);

        scrollPane.setBounds(x, y, tableWidth, tableHeight);
        bg.add(scrollPane);
        
        add(bg);
        
        
        
    }
    
    
    public void loadBooks(){
        try{
            Connection con = ConnectWithDB.Connection();
            PreparedStatement pst = null;
            ResultSet rs = null;

            String sql = "SELECT * FROM book where status = 'Available'";
            pst = con.prepareStatement(sql);
            rs = pst.executeQuery();
            
            model = new DefaultTableModel(new String[]{"ID", "Title", "Author", "Status"}, 0);
            table = new JTable(model);
            
            while (rs.next()) {
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String author = rs.getString("author");
               // String category = rs.getString("category");
                String status = rs.getString("status");
                
                
                // ✅ Add each row to model
                 model.addRow(new Object[]{id, title, author, status});
            }
            
            
            con.close();
            
            
        }catch(SQLException e){
            JOptionPane.showMessageDialog(this, "Error loading books: " + e.getMessage());
        }

    }
    
    
    public void searchAndHighlight(String keyword) {
    try {
        Connection con = ConnectWithDB.Connection();
        PreparedStatement pst = con.prepareStatement(
            "SELECT * FROM book WHERE status = 'Available' AND title LIKE ?"
        );
        pst.setString(1, "%" + keyword + "%");
        ResultSet rs = pst.executeQuery();

        model.setRowCount(0); // clear old rows

        int rowIndexToHighlight = -1;

        while (rs.next()) {
            int id = rs.getInt("id");
            String title = rs.getString("title");
            String author = rs.getString("author");
            String status = rs.getString("status");

            model.addRow(new Object[]{id, title, author, status});

            // Save index to highlight
            if (title.toLowerCase().contains(keyword.toLowerCase()) && rowIndexToHighlight == -1) {
                rowIndexToHighlight = model.getRowCount() - 1;
            }
        }

        // Highlight the row
        if (rowIndexToHighlight != -1) {
            table.setRowSelectionInterval(rowIndexToHighlight, rowIndexToHighlight);
            table.scrollRectToVisible(table.getCellRect(rowIndexToHighlight, 0, true));
        } else {
            JOptionPane.showMessageDialog(this, "No matching book found.");
        }

        con.close();

    } catch (SQLException e) {
        JOptionPane.showMessageDialog(this, "Error: " + e.getMessage());
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
            java.util.logging.Logger.getLogger(BooksAvailable.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(BooksAvailable.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(BooksAvailable.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(BooksAvailable.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new BooksAvailable().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    // End of variables declaration//GEN-END:variables
}


