import java.awt.Color;
import java.awt.Font;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;


public class ReturnBookPg extends javax.swing.JFrame {

    Connection con = ConnectWithDB.Connection();
    PreparedStatement pst = null;
    ResultSet rs = null;
    
    
    public ReturnBookPg() {
        initComponents();
        
         setVisible(true);
        setLayout(null);
        
        //background
        ImageIcon img1 = new ImageIcon(ClassLoader.getSystemResource("images/retnBook.png"));
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
        JLabel head = new JLabel("Return Books", icon2, JLabel.LEFT);
        head.setFont(new Font("Tahoma", Font.BOLD, 62));
        Color headcolor = new Color(212, 241, 244);
        head.setForeground(headcolor);
        head.setBounds(100, 50, 700, 60); // x, y, width, height
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
        id.setBounds(100, 200, 200, 20);        // 2. Set position and size 
        bg.add(id);
        add(bg);     

        JLabel stdId = new JLabel("Student ID"); // 1. Create label with text
        stdId.setFont(new Font("Arial", Font.BOLD, 28));
        stdId.setForeground(Color.BLACK);
        stdId.setBounds(100, 280, 200, 20);        // 2. Set position and size 
        bg.add(stdId);
        add(bg);   
        
 
        JLabel  bname= new JLabel("Book Name"); // 1. Create label with text
        bname.setFont(new Font("Arial", Font.BOLD, 28));
        bname.setForeground(Color.BLACK);
        bname.setBounds(100, 360, 200, 20);        // 2. Set position and size 
        bg.add(bname);
        add(bg);  
        
        JLabel  sname= new JLabel("Student Name"); // 1. Create label with text
        sname.setFont(new Font("Arial", Font.BOLD, 28));
        sname.setForeground(Color.BLACK);
        sname.setBounds(100, 440, 200, 20);        // 2. Set position and size 
        bg.add(sname);
        add(bg);  

        JLabel issDate = new JLabel("Issue Date"); // 1. Create label with text
        issDate.setFont(new Font("Arial", Font.BOLD, 28));
        issDate.setForeground(Color.BLACK);
        issDate.setBounds(100, 520, 200, 20);        // 2. Set position and size 
        bg.add(issDate);
        add(bg);    
        
        JLabel dueDate = new JLabel("Due Date"); // 1. Create label with text
        dueDate.setFont(new Font("Arial", Font.BOLD, 28));
        dueDate.setForeground(Color.BLACK);
        dueDate.setBounds(100, 600, 200, 20);        // 2. Set position and size 
        bg.add(dueDate);
        add(bg);    
        
        
        
        
        
        //fields
        JTextField txtBookid = new JTextField(10);
        txtBookid.setFont(new Font("Arial", Font.BOLD, 28));
        txtBookid.setForeground(Color.BLACK);
        txtBookid.setBackground(Color.WHITE);
        txtBookid.setBounds(300, 200, 350, 40);        // 2. Set position and size 
        bg.add(txtBookid);
        add(bg); 
        
        JTextField txtStudid = new JTextField();
        txtStudid.setFont(new Font("Arial", Font.BOLD, 28));
        txtStudid.setForeground(Color.BLACK);
        txtStudid.setBackground(Color.WHITE);
        txtStudid.setBounds(300, 280, 350, 40);        // 2. Set position and size 
        bg.add(txtStudid);
        add(bg); 
        
        JTextField txtBookfield = new JTextField();
        txtBookfield.setFont(new Font("Arial", Font.BOLD, 28));
        txtBookfield.setForeground(Color.BLACK);
        txtBookfield.setBackground(Color.WHITE);
        txtBookfield.setBounds(300, 360, 350, 40);        // 2. Set position and size 
        bg.add(txtBookfield);
        add(bg); 
        
        JTextField txtStudField = new JTextField();
        txtStudField.setFont(new Font("Arial", Font.BOLD, 28));
        txtStudField.setForeground(Color.BLACK);
        txtStudField.setBackground(Color.WHITE);
        txtStudField.setBounds(300, 440, 350, 40);        // 2. Set position and size 
        bg.add(txtStudField);
        add(bg); 
        
        JTextField issDateField = new JTextField(20);
        issDateField.setFont(new Font("Arial", Font.BOLD, 28));
        issDateField.setForeground(Color.BLACK);
        issDateField.setBackground(Color.WHITE);
        issDateField.setBounds(300, 520, 350, 40);        
        bg.add(issDateField);
        add(bg); 
        
        
        JTextField dueDateField = new JTextField(20);
        dueDateField.setFont(new Font("Arial", Font.BOLD, 28));
        dueDateField.setForeground(Color.BLACK);
        dueDateField.setBackground(Color.WHITE);
        dueDateField.setBounds(300, 600, 350, 40);    
        //LocalDate today = LocalDate.now();
        //issDateField.setText(today.toString()); // Format: YYYY-MM-DD
        bg.add(dueDateField);
        add(bg);
        
         //search Button
        JButton searchBtn = new JButton("Search");
        searchBtn.setFont(new Font("Arial", Font.BOLD, 18));
        searchBtn.setBackground(Color.RED);
        searchBtn.setForeground(Color.WHITE);
        searchBtn.setBounds(700, 200, 90, 40);     //frameWidth=1366 and btnWidth=40 .So frameWidth - btnWidth = closebtn on the right top-corner.
        bg.add(searchBtn);
        add(bg);
        
        //action perfored by search btn
        searchBtn.addActionListener(new ActionListener(){
            
            public void actionPerformed(ActionEvent e) {
                if(txtStudid.getText().equals("")){
                    JOptionPane.showMessageDialog(ReturnBookPg.this, "Please Enter Student id and Search it");
                    txtStudid.requestFocus();
                    
                }else{
                    try {
                        pst = con.prepareStatement("select student.name,book.id,book.title,book.issuedate,book.duedate from book inner join student using(id) where student.id=?");
                        pst.setString(1, txtStudid.getText());
                        
                        rs = pst.executeQuery();
                        if(rs.next()){
                            txtBookid.setText(rs.getString(2)); //3 ->3rd index of preparedStatement 
                            txtStudField.setText(rs.getString(1));
                            dueDateField.setText(rs.getString(5));
                            txtBookfield.setText(rs.getString(3));
                            issDateField.setText(rs.getString(4));
                            
                        }else{
                            JOptionPane.showMessageDialog(ReturnBookPg.this, "Please enter valid Student id");
                        }
                        
                        
                    } catch (SQLException ex) {
                        Logger.getLogger(ReturnBookPg.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    
                }
            }
            
        });
        
        
        //return Button
        JButton rtn = new JButton("Return");
        rtn.setFont(new Font("Arial", Font.BOLD, 18));
        Color clr = new Color(0,205,55);
        rtn.setBackground(clr);
        rtn.setForeground(Color.WHITE);
        rtn.setBounds(300, 650, 120, 50);     //frameWidth=1366 and btnWidth=40 .So frameWidth - btnWidth = closebtn on the right top-corner.
        bg.add(rtn);
        add(bg);
        
        //action performed by issueBtn
        rtn.addActionListener(new ActionListener(){

            public void actionPerformed(ActionEvent e) {
                if(txtBookid.getText().equals("")){
                    JOptionPane.showMessageDialog(ReturnBookPg.this, "Please enter Student id and search it");
                    txtBookid.requestFocus();
                }
                else{
                    try {
                        pst = con.prepareStatement("Update book SET STATUS=?,ISSUEDATE=?, DUEDATE=?, STUDENTID=?");
                        pst.setString(1, "Successfully Returned");
                        pst.setString(2, issDateField.getText());
                        pst.setString(3, dueDateField.getText());
                        pst.setString(4, txtStudid.getText() );
                        pst.executeUpdate();
                        
                        JOptionPane.showMessageDialog(ReturnBookPg.this, "Successfully Returned");
                        
                        txtBookid.setText("");
                        txtStudid.setText("");
                        txtBookfield.setText("");
                        txtStudField.setText("");
                        issDateField.setText("");
                        dueDateField.setText("");
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
            java.util.logging.Logger.getLogger(ReturnBookPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(ReturnBookPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(ReturnBookPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(ReturnBookPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new ReturnBookPg().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    // End of variables declaration//GEN-END:variables
}
