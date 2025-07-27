package Hotel.Management.System;
import javax.swing.*;

public class Splash extends JFrame{
    public Splash()
    {
        JLabel lb = new JLabel();
        lb.setIcon(new ImageIcon("src/hotelImage.jpg"));
        lb.setBounds(0,0,1700,1133);
        add(lb);
     //   ImageIcon img = new ImageIcon()
        setLayout(null);
      setSize(1700,1133);
      setVisible(true);
      setLocation(0,0);
      setDefaultCloseOperation(EXIT_ON_CLOSE);

      try
      {
         Thread.sleep(3000);
         setVisible(false);
         new LoginPage();
      }
      catch (Exception e)
      {
          e.printStackTrace();
      }
    }
    public static void main(String[] args)
    {

        new Splash();
    }
}
