package university_managment_system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.ResultSet;

public class EnterMarks extends JFrame  implements ActionListener {
    Choice cRollNo ,cSemester;
    JButton submitbutton,backbutton;
    JTextField tfsub1,tfsub2,tfsub3,tfsub4,tfsub5,tfmarks1,tfmarks5,tfmarks4,tfmarks3,tfmarks2;

    EnterMarks(){
        setSize(950,550);
        setLocation(300,150);
        setLayout(null);
        getContentPane().setBackground(Color.WHITE);

        //adding image to the login screen
        ImageIcon icon = new ImageIcon(ClassLoader.getSystemResource("icons/exam.jpg"));//to display the login image
        Image icon2 = icon.getImage().getScaledInstance(400, 300, Image.SCALE_DEFAULT);//to display the first image with default scale factor
        ImageIcon icon3=new ImageIcon(icon2);//converting the image into an imageicon to display on the label
        JLabel image=new JLabel(icon3);// pasting that image into label and displaying
        image.setBounds(520,45,400,300);
        add(image);

        // Main heading
        JLabel heading = new JLabel("Enter Marks");
        heading.setBounds(100, 10, 500, 50);
        heading.setFont(new Font("Tahoma", Font.BOLD, 30));
        add(heading);

        JLabel lblrollno= new JLabel("Select Roll No");
        lblrollno.setBounds(60,100,120,20);
        lblrollno.setFont(new Font("serif",Font.BOLD,15));
        add(lblrollno);

        cRollNo= new Choice();
        cRollNo.setBounds(180,100,150,20);
        add(cRollNo);

        try{
            Conn con=new Conn();
            ResultSet rs =con.s.executeQuery("select * from student ");
            //fetch while data is empty
            while (rs.next()){
                cRollNo.add(rs.getString("rollno"));//fetch the data from coloumn name
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        //adding semester label and choice
        JLabel lblsemester= new JLabel("Enter Semester");
        lblsemester.setBounds(60,150,120,20);
        lblsemester.setFont(new Font("serif",Font.BOLD,15));
        add(lblsemester);

        cSemester= new Choice();
        cSemester.setBounds(180,150,150,20);
        cSemester.add("First");
        cSemester.add("Second");
        cSemester.add("Third");
        cSemester.add("Fourth");
        cSemester.add("Fifth");
        cSemester.add("Sixth");
        cSemester.add("Seventh");
        cSemester.add("Eight");
        add(cSemester);

        JLabel lblSubject=new JLabel("Subject");
        lblSubject.setBounds(120,200,100,20);
        lblSubject.setFont(new Font("Tahona",Font.BOLD,17));
        add(lblSubject);

        JLabel lblMarks=new JLabel("Marks");
        lblMarks.setBounds(270,200,100,20);
        lblMarks.setFont(new Font("Tahona",Font.BOLD,17));
        add(lblMarks);

        //adding the subject fields
        tfsub1= new JTextField();
        tfsub1.setBounds(18,230,235,25);
        add(tfsub1);

        tfsub2= new JTextField();
        tfsub2.setBounds(18,260,235,25);
        add(tfsub2);

        tfsub3= new JTextField();
        tfsub3.setBounds(18,290,235,25);
        add(tfsub3);

        tfsub4= new JTextField();
        tfsub4.setBounds(18,320,235,25);
        add(tfsub4);

        tfsub5= new JTextField();
        tfsub5.setBounds(18,350,235,25);
        add(tfsub5);


        //adding the marks fields
        tfmarks1= new JTextField();
        tfmarks1.setBounds(255,230,235,25);
        add(tfmarks1);

        tfmarks2= new JTextField();
        tfmarks2.setBounds(255,260,235,25);
        add(tfmarks2);

        tfmarks3= new JTextField();
        tfmarks3.setBounds(255,290,235,25);
        add(tfmarks3);

        tfmarks4= new JTextField();
        tfmarks4.setBounds(255,320,235,25);
        add(tfmarks4);

        tfmarks5= new JTextField();
        tfmarks5.setBounds(255,350,235,25);
        add(tfmarks5);

        // Buttons
        submitbutton = new JButton("Submit");
        submitbutton.setBounds(100, 400, 120, 30);
        submitbutton.setBackground(Color.black);
        submitbutton.setForeground(Color.black);
        submitbutton.addActionListener(this);
        add(submitbutton);

        backbutton = new JButton("Back");
        backbutton.setBounds(300, 400, 120, 30);
        backbutton.setBackground(Color.black);
        backbutton.setForeground(Color.black);
        backbutton.addActionListener(this);
        add(backbutton);



        setVisible(true);

    }

    public void actionPerformed(ActionEvent ae){
        if (ae.getSource()==submitbutton){
            try{
                Conn con=new Conn();
                String query1="insert into subject values('"+cRollNo.getSelectedItem()+"','"+cSemester.getSelectedItem()+"','"+tfsub1.getText()+"','"+tfsub2.getText()+"','"+tfsub3.getText()+"','"+tfsub4.getText()+"','"+tfsub5.getText()+"')";
                String query2="insert into marks values('"+cRollNo.getSelectedItem()+"','"+cSemester.getSelectedItem()+"','"+tfmarks1.getText()+"','"+tfmarks2.getText()+"','"+tfmarks3.getText()+"','"+tfmarks4.getText()+"','"+tfmarks5.getText()+"')";

                con.s.executeUpdate(query1);
                con.s.executeUpdate(query2);

                JOptionPane.showMessageDialog(null,"Marks inserted Successfully.");
                setVisible(false);

            }catch (Exception e){
                e.printStackTrace();
            }
        } else if (ae.getSource()==backbutton) {
            setVisible(false);
        }
    }

    public static void main(String[] args) {
        new EnterMarks();
    }
}
