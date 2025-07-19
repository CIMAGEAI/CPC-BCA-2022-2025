

package college_project;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.ResultSet;

/**
 *
 * @author VISHALKUMAR
 */
public class Login extends JFrame implements ActionListener{
    JTextField textField;
    JPasswordField pass;

    JButton login, signup;
    
    Login(){
        
        textField = new JTextField();
        textField.setBounds(150, 20,  150,20);
        add(textField);

//



        JLabel  label_name= new JLabel("Uesrname");
        label_name.setBounds(40, 20,100,20);
        label_name.setForeground(Color.WHITE);
        add(label_name);


       JLabel password = new JLabel("password");
        password.setBounds(40,70,100,20);
        password.setForeground(Color.WHITE);
       add(password);

      pass = new JPasswordField();
       pass.setBounds(150,70,150,20);
       add(pass);

       login = new JButton("login");
       login.setBounds(40,140,120,30);
       login.setBackground(Color.BLACK);
       login.setForeground(Color.white);

       login.addActionListener(this);
       add(login);

       signup = new JButton("Signup");
       signup.setBounds(175, 140,120,30);
        signup.setBackground(Color.BLACK);
        signup.setForeground(Color.white);
        signup.addActionListener(this);
        add(signup);

        ImageIcon l1 =new ImageIcon( ClassLoader.getSystemResource("icons/second-removebg-preview.png"));
        Image l2 =  l1.getImage().getScaledInstance(200,200,Image.SCALE_DEFAULT);
        ImageIcon l3 = new ImageIcon(l2);
        JLabel img = new JLabel(l3);
        img.setBounds(350,20, 200,200);
        add(img);


        // set the background
        ImageIcon l11 =new ImageIcon( ClassLoader.getSystemResource("icons/loginback.jpeg"));
        Image l22 =  l11.getImage().getScaledInstance(600,300,Image.SCALE_DEFAULT);
        ImageIcon l33 = new ImageIcon(l22);
        JLabel backimg = new JLabel(l33);
        backimg.setBounds(0,0,600,300);
        add(backimg);
        
        setSize(600,300);
        setLocation(500,300);
        setLayout(null);
        setVisible(true);
        
    }
    
    
     public void actionPerformed(ActionEvent e){
        if(e.getSource()==login){
            String username = textField.getText(); // to get the data form textfield and store which create the usename string variable
            String password = pass.getText();
            String query = "select * from login where username ='" +username+"' and password = '"+password+"'";


                    try{
                        Connection_Class con = new Connection_Class();// creating the object of connection classs
                        ResultSet res = con.statement.executeQuery(query);
//check the resulst where data is cominig or not
                        if (res.next()){
                            setVisible(false);
                            new main_class();//opean the main window


                            // next class


                        }else {
                           JOptionPane.showMessageDialog(null,"Invalid username or password");

                        }


                    }catch(Exception E){
                        E.printStackTrace();
                    }

        }else if(e.getSource()== signup){
            setVisible(false);
            new Signup();
        
        
        }
        
        
        else{

            setVisible(false);// if click the back button then page is close

        }
    }
     
     
    
    public static void main(String args[]){
        new Login();
    }
    
    
}






