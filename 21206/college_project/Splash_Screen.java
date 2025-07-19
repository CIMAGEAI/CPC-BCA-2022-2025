/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package college_project;
import javax.swing.*;
import java.awt.*;

/**
 *
 * @author VISHALKUMAR
 */
public class Splash_Screen  extends JFrame implements Runnable{
    Thread t;
    
    Splash_Screen(){
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icons/aryabhata.jpg"));
        Image i2 = i1.getImage().getScaledInstance(1000,700 ,Image.SCALE_DEFAULT);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel image = new JLabel(i3);
        add(image);
        t = new Thread(this);
        
        t.start();
        setVisible(true);
        
        int x=1;
        for(int i =2; i<800;i+=4, x+=1){
            setLocation((800-i+x)/2, 350-(i/2));
            setSize(i+3*x, i+x/2);
        try{
            Thread.sleep(10);
            
        }catch(Exception e){
            e.printStackTrace();
        }
    }
        
    }
    public void run(){
        try{
            Thread.sleep(7000);
            setVisible(false);
            new Login();
            
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        new Splash_Screen();
        System.out.println("hello india");
        // TODO code application logic here
    }
    
}
