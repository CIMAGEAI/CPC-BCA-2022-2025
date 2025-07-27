package travel.and.tourism;

import javax.swing.*;
import java.awt.*;

public class Loading extends JFrame implements Runnable{
    Thread t;
    JProgressBar bar;
    String username;
    
    Loading(String username){
        super("Loading Screen");
        this.username = username;
        t = new Thread(this);
        setBounds(500,200,650,400);
        getContentPane().setBackground(Color.WHITE);
        setLayout(null);
        
        JLabel text = new JLabel("Tarvel and Tourism Application");
        text.setBounds(50,20,600,40);
        text.setFont(new Font("Raleway", Font.BOLD, 35));
        text.setForeground(Color.BLUE);
        add(text);
        
        bar = new JProgressBar();
        bar.setBounds(150,100,300,35);
        bar.setStringPainted(true);
        add(bar);
        
        JLabel loading = new JLabel("Loading, Please Wait...");
        loading.setBounds(230,130,180,30);
        loading.setFont(new Font("Raleway", Font.BOLD, 16));
        loading.setForeground(Color.RED);
        add(loading);
        
        JLabel lblusername = new JLabel("Welcome "+username);
        lblusername.setBounds(20,310,400,40);
        lblusername.setFont(new Font("Raleway", Font.BOLD, 16));
        lblusername.setForeground(Color.RED);
        add(lblusername);
        
        t.start();
        
        setVisible(true);
    }
    
    @Override
    public void run(){
        try{
            for(int i=1; i<=101; i++){
                int max = bar.getMaximum();
                int value = bar.getValue();
                
                if(value < max){
                    bar.setValue(bar.getValue() + 1);
                }else{
                    setVisible(false);
                    new Dashboard(username);
                }
                Thread.sleep(50);
            }
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    public static void main(String[] args){
        new Loading("");
    }
}