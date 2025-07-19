
import java.awt.Color;
import java.awt.Font;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.ButtonGroup;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPasswordField;
import javax.swing.JRadioButton;
import javax.swing.JTextField;


 
public class SignUpPg extends javax.swing.JFrame {
        
    Connection con = ConnectWithDB.Connection();
    PreparedStatement pst = null;
    ResultSet rs = null;
    
    public SignUpPg() {
        initComponents();
        
        
        setVisible(true);
        setSize(1366,766);
        setLayout(null);
        

        
        //background
        ImageIcon img1= new ImageIcon(ClassLoader.getSystemResource("images/sign.png"));
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
                       new LoginPg().setVisible(true);
                }   
        });
        // And also set:
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        
        
        //heading
        
        JLabel head = new JLabel("Sign up---");
        head.setFont(new Font("Tahoma", Font.BOLD, 62));
        Color myColor = new Color(201, 151, 95);
        head.setForeground(myColor);
        head.setBounds(100, 20, 800, 80); // x, y, width, height
        bg.add(head);
        
        //student Id
        JLabel stdId = new JLabel("Student id"); // 1. Create label with text
        stdId.setFont(new Font("Arial", Font.BOLD, 30));
        stdId.setForeground(Color.BLACK);
        stdId.setBounds(450, 70, 150, 30);        // 2. Set position and size 
        bg.add(stdId);
        add(bg); 
        
        //fullname
        JLabel fname = new JLabel("Full Name"); // 1. Create label with text
        fname.setFont(new Font("Arial", Font.BOLD, 30));
        fname.setForeground(Color.BLACK);
        fname.setBounds(450, 130, 150, 30);        // 2. Set position and size 
        bg.add(fname);
        add(bg); 
        
        
        //gender
        JLabel gender = new JLabel("Gender"); // 1. Create label with text
        gender.setFont(new Font("Arial", Font.BOLD, 30));
        gender.setForeground(Color.BLACK);
        gender.setBounds(450, 190, 500, 30);        // 2. Set position and size 
        bg.add(gender);
        add(bg); 
        
        //phone no
        JLabel ph = new JLabel("Phone no"); // 1. Create label with text
        ph.setFont(new Font("Arial", Font.BOLD, 30));
        ph.setForeground(Color.BLACK);
        ph.setBounds(450, 250, 500, 30);        // 2. Set position and size 
        bg.add(ph);
        add(bg); 
        
        //email 
        JLabel eid = new JLabel("Email"); // 1. Create label with text
        eid.setFont(new Font("Arial", Font.BOLD, 30));
        eid.setForeground(Color.BLACK);
        eid.setBounds(450, 310, 500, 30);        // 2. Set position and size 
        bg.add(eid);
        add(bg); 
        
        //user 
        JLabel user = new JLabel("Username"); // 1. Create label with text
        user.setFont(new Font("Arial", Font.BOLD, 30));
        user.setForeground(Color.BLACK);
        user.setBounds(450, 370, 500, 30);        // 2. Set position and size 
        bg.add(user);
        add(bg); 
        
        //password
        JLabel pwd = new JLabel("Password"); // 1. Create label with text
        pwd.setFont(new Font("Arial", Font.BOLD, 30));
        pwd.setForeground(Color.BLACK);
        pwd.setBounds(450, 430, 500, 30);        // 2. Set position and size 
        bg.add(pwd);
        add(bg); 
        
        
        //confirm password
        JLabel conpass = new JLabel("Confirm Password"); // 1. Create label with text
        conpass.setFont(new Font("Arial", Font.BOLD, 30));
        conpass.setForeground(Color.BLACK);
        conpass.setBounds(430, 490, 500, 30);        // 2. Set position and size 
        bg.add(conpass);
        add(bg); 
        
        
        //fields
        
        
        //idField
        JTextField txtStdId = new JTextField();
        txtStdId.setForeground(Color.BLACK);
        txtStdId.setBackground(Color.WHITE);
        txtStdId.setBounds(750, 70, 300, 35);        // 2. Set position and size 
        bg.add(txtStdId);
        add(bg); 
        
        //nameField
        JTextField txtname = new JTextField();
        txtname.setForeground(Color.BLACK);
        txtname.setBackground(Color.WHITE);
        txtname.setBounds(750, 130, 300, 35);        // 2. Set position and size 
        bg.add(txtname);
        add(bg); 
        
        
        
        //genderfield
        Font radioFont = new Font("Arial", Font.BOLD, 16);

        JRadioButton maleBtn = new JRadioButton("Male");
        maleBtn.setBounds(750, 190, 60, 30);
        maleBtn.setFont(radioFont);

        JRadioButton femaleBtn = new JRadioButton("Female");
        femaleBtn.setBounds(820, 190, 80, 30);
        femaleBtn.setFont(radioFont);

        JRadioButton otherBtn = new JRadioButton("Other");
        otherBtn.setBounds(920, 190, 80, 30);
        otherBtn.setFont(radioFont);
        
        //Group them to allow only one selection
        ButtonGroup genderGroup = new ButtonGroup();
        genderGroup.add(maleBtn);
        genderGroup.add(femaleBtn);
        genderGroup.add(otherBtn);
        
        // Add to frame
        bg.add(maleBtn);
        bg.add(femaleBtn);
        bg.add(otherBtn);
        
        //phnField
        JTextField txtphn = new JTextField();
        txtphn.setForeground(Color.BLACK);
        txtphn.setBackground(Color.WHITE);
        txtphn.setBounds(750, 250 , 300, 35);        // 2. Set position and size 
        bg.add(txtphn);
        add(bg); 
        
       //emailField
        JTextField txteml = new JTextField();
        txteml.setForeground(Color.BLACK);
        txteml.setBackground(Color.WHITE);
        txteml.setBounds(750, 310 , 300, 35);        // 2. Set position and size 
        bg.add(txteml);
        add(bg); 
        
        
        //userField
        JTextField txtuser = new JTextField();
        txtuser.setForeground(Color.BLACK);
        txtuser.setBackground(Color.WHITE);
        txtuser.setBounds(750,370 , 300, 35);        // 2. Set position and size 
        bg.add(txtuser);
        add(bg); 
        
        
        //passwordfld
        JPasswordField txtpass = new JPasswordField();
        txtpass.setForeground(Color.BLACK);
        txtpass.setBackground(Color.WHITE);
        txtpass.setBounds(750,430 , 300, 35);        // 2. Set position and size 
        bg.add(txtpass);
        add(bg); 
        
        //confirm passwordfld
        JPasswordField txtCfrmPass = new JPasswordField();
        txtCfrmPass.setForeground(Color.BLACK);
        txtCfrmPass.setBackground(Color.WHITE);
        txtCfrmPass.setBounds(750,490 , 300, 35);        // 2. Set position and size 
        bg.add(txtCfrmPass);
        add(bg); 
        
        //Confirm Btn
        JButton cfrmBtn = new JButton("Confirm");
        cfrmBtn.setBounds(1100, 490, 100, 30);
        cfrmBtn.setBackground(Color.GREEN);
        cfrmBtn.setForeground(Color.WHITE);
        cfrmBtn.setFont(new Font("Arial", Font.BOLD, 16));
        bg.add(cfrmBtn);
        add(bg);  
        
        cfrmBtn.addActionListener(new ActionListener(){

            
            public void actionPerformed(ActionEvent e) {
                String password = String.valueOf(txtpass.getPassword());
                String confirmPassword = String.valueOf(txtCfrmPass.getPassword());
                
                if (!password.equals(confirmPassword)) {
                    JOptionPane.showMessageDialog(SignUpPg.this, "Confirmation Password doesn't match! Please re-enter.");
                    txtCfrmPass.requestFocus();
                    return; // stop further processing
                }
                else{
                    JOptionPane.showMessageDialog(SignUpPg.this, "Password Confirmed!");
                    txtCfrmPass.requestFocus();
                }

            }
            
        });
        
        
        //Singup Btn
        JButton signBtn = new JButton("Sign up");
        signBtn.setBounds(600, 550, 130, 50);
        signBtn.setBackground(Color.GREEN);
        signBtn.setForeground(Color.WHITE);
        signBtn.setFont(new Font("Arial", Font.BOLD, 16));
        bg.add(signBtn);
        add(bg);  
       
        
        signBtn.addActionListener(new ActionListener(){
            
            @Override
            public void actionPerformed(ActionEvent e) {
                String mobile = txtphn.getText().trim();
                int len = mobile.length();
                
                if(len > 12) {
                    JOptionPane.showMessageDialog(SignUpPg.this, "Mobile number should be upto 12 digits.");
                }
                
                
                
                if(txtname.getText().equals("")){
                        JOptionPane.showMessageDialog(SignUpPg.this, "All feilds are required");
                        txtname.requestFocus();
                }

                else if(genderGroup.getSelection() == null){
                    JOptionPane.showMessageDialog(SignUpPg.this, "All feilds are required");
                    if (maleBtn.isEnabled()) {
                        maleBtn.requestFocus();
                    }else if (femaleBtn.isEnabled()) {
                        femaleBtn.requestFocus();
                    }else if(otherBtn.isEnabled()){
                        otherBtn.requestFocus();
                    }
                }

                else if(txtphn.getText().equals("")){
                    JOptionPane.showMessageDialog(SignUpPg.this, "All feilds are required");
                    txtphn.requestFocus();
                }
                else if(txteml.getText().equals("")){
                    JOptionPane.showMessageDialog(SignUpPg.this, "All feilds are required");
                    txtuser.requestFocus();
                }
        
                else if(txtuser.getText().equals("")){
                    JOptionPane.showMessageDialog(SignUpPg.this, "All feilds are required");
                    txtuser.requestFocus();
                }
                
                else if(txtpass.getText().equals("")){
                    JOptionPane.showMessageDialog(SignUpPg.this, "All feilds are required");
                    txtpass.requestFocus();
                }
                
                else if(txtCfrmPass.getText().equals("")){
                    JOptionPane.showMessageDialog(SignUpPg.this, "All feilds are required");
                    txtCfrmPass.requestFocus();
                }
                else {
                    try {
                          String sql = "INSERT INTO signup (stdId, fullname, gender, phn, email, username, password, confirmpass) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                          pst = con.prepareStatement(sql);
                          pst.setInt(1, Integer.parseInt(txtStdId.getText()));
                          pst.setString(2, txtname.getText());
                          String gender = "";
                          if (maleBtn.isSelected()) gender = "Male";
                          else if (femaleBtn.isSelected()) gender = "Female";
                          else if (otherBtn.isSelected()) gender = "Other";
                          pst.setString(3, gender);
                          pst.setString(4, txtphn.getText());
                          pst.setString(5, txteml.getText());
                          pst.setString(6, txtuser.getText());
                          pst.setString(7, txtpass.getText());
                          pst.setString(8, txtCfrmPass.getText());
                          pst.executeUpdate();
                          JOptionPane.showMessageDialog(SignUpPg.this, "Successfully Registered");
                          txtStdId.setText("");
                          txtname.setText("");
                          genderGroup.clearSelection();
                          txtphn.setText("");
                          txteml.setText("");
                          txtuser.setText("");
                          txtpass.setText("");
                          txtCfrmPass.setText("");
                      } 
                      catch (SQLException ex) {
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
            java.util.logging.Logger.getLogger(SignUpPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(SignUpPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(SignUpPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(SignUpPg.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new SignUpPg().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    // End of variables declaration//GEN-END:variables
}
