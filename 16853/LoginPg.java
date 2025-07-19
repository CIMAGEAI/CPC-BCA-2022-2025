import java.awt.Color;
import java.awt.Font;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPasswordField;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;


public class LoginPg extends javax.swing.JFrame {

    public LoginPg() {
        initComponents();
        
        setVisible(true);
        setSize(1366,766);
        setLayout(null);
        

        
        //background
        ImageIcon img1= new ImageIcon(ClassLoader.getSystemResource("images/login.jpg"));
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
        closeBtn.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                int yes = JOptionPane.showConfirmDialog(LoginPg.this ,"Are you sure you really want to close this application", "Exit", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE);
            if(yes == JOptionPane.YES_OPTION)
                System.exit(0);
            }
        }); 
        
        //heading
        JLabel head = new JLabel("Login");
        head.setFont(new Font("Tahoma", Font.BOLD, 50));
        head.setForeground(Color.WHITE);
        head.setBounds(600, 230, 700, 80); // x, y, width, height
        bg.add(head);
        
        
        //labels
        JLabel id = new JLabel("User Name"); // 1. Create label with text
        id.setFont(new Font("Arial", Font.BOLD, 20));
        id.setForeground(Color.white);
        id.setBounds(500, 380, 200, 20);        // 2. Set position and size 
        bg.add(id);
        add(bg);     

        JLabel name = new JLabel("Password"); // 1. Create label with text
        name.setFont(new Font("Arial", Font.BOLD, 20));
        name.setForeground(Color.white);
        name.setBounds(500, 450, 200, 20);        // 2. Set position and size 
        bg.add(name);
        add(bg);    
        
        
        //usernameField
        JTextField username = new JTextField();
       // username.setFont(null);
        username.setForeground(Color.BLACK);
        username.setBackground(Color.WHITE);
        username.setBounds(650, 380, 260, 30);        // 2. Set position and size 
        bg.add(username);
        add(bg); 
        
        //usernameField
        JPasswordField password = new JPasswordField();
        password.setFont(new Font("Arial", Font.BOLD, 16));
        password.setForeground(Color.BLACK);
        password.setBackground(Color.WHITE);
        password.setBounds(650, 450, 260, 30);        // 2. Set position and size 
        bg.add(password);
        add(bg);
        
        
        //Save Btn
        JButton loginBtn = new JButton("Login");
        loginBtn.setBounds(600, 550, 130, 40);
        loginBtn.setBackground(new Color(204,0,0));
        loginBtn.setForeground(Color.WHITE);
        loginBtn.setFont(new Font("Arial", Font.BOLD, 16));
        bg.add(loginBtn);
        add(bg);  
        
        loginBtn.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e) {
               try{ 
                Connection con = ConnectWithDB.Connection();
                PreparedStatement pst = null;
                ResultSet rs = null;
                
                pst = con.prepareStatement("select * from signup where username=? and password=?");
                pst.setString(1, username.getText());
                pst.setString(2, password.getText());
                rs = pst.executeQuery();
                
                if(rs.next()){
                    new Home().setVisible(true);
                }
                else
                    JOptionPane.showMessageDialog(LoginPg.this, "Please enter valid Id or Password");
                
                
               }catch(SQLException ex){
                   
               }   
            }
            
        });
        
        //Signup Btn
        JButton signupBtn = new JButton("SignUP");
        signupBtn.setBounds(800, 550, 130, 40);
        signupBtn.setBackground(new Color(204,0,0));
        signupBtn.setForeground(Color.WHITE);
        signupBtn.setFont(new Font("Arial", Font.BOLD, 16));
        bg.add(signupBtn);
        add(bg);  
        
        signupBtn.addActionListener(new ActionListener(){

           @Override
            public void actionPerformed(ActionEvent e) {
               SwingUtilities.invokeLater(() -> {
                            dispose();
                           new SignUpPg().setVisible(true);
                            });
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
            java.util.logging.Logger.getLogger(LoginPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(LoginPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(LoginPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(LoginPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new LoginPg().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    // End of variables declaration//GEN-END:variables
}
