package university_managment_system;

import net.proteanit.sql.DbUtils;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.ResultSet;

public class DisplayMarks extends JFrame implements ActionListener {
    JTextField search;
    JButton resultbutton,backbutton;
    JTable table;

    DisplayMarks(){
        setSize(1000,475);
        setLocation(300,100);
        setLayout(null);
        getContentPane().setBackground(Color.WHITE);

        // Main heading
        JLabel heading = new JLabel("Check Result");
        heading.setBounds(100, 10, 500, 50);
        heading.setFont(new Font("Tahoma", Font.BOLD, 30));
        add(heading);

        JLabel lblrollno= new JLabel("Select Roll No");
        lblrollno.setBounds(60,100,120,30);
        lblrollno.setFont(new Font("serif",Font.BOLD,15));
        add(lblrollno);

        search= new JTextField();
        search.setBounds(180,100,150,30);
        search.setFont(new Font("Tahoma",Font.BOLD,18));
        add(search);

        // Buttons
        resultbutton = new JButton("Result");
        resultbutton.setBounds(350, 100, 200, 30);
        resultbutton.setBackground(Color.black);
        resultbutton.setForeground(Color.black);
        resultbutton.addActionListener(this);
        add(resultbutton);

        backbutton = new JButton("Back");
        backbutton.setBounds(570, 100, 200, 30);
        backbutton.setBackground(Color.black);
        backbutton.setForeground(Color.black);
        backbutton.addActionListener(this);
        add(backbutton);

        table= new JTable();
        table.setFont(new Font("Tahoma",Font.PLAIN,16));

        JScrollPane jsp= new JScrollPane(table);
        jsp.setBounds(0,135,1000,310);
        add(jsp);

        //inserting the marks in table from database
        try{
            Conn con =new Conn();
            ResultSet rs=con.s.executeQuery("select * from student");
            table.setModel(DbUtils.resultSetToTableModel(rs));
        }catch (Exception e){
            e.printStackTrace();
        }

        //adding the mouselistner to click the table then it auto filled in rolno
        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int row = table.getSelectedRow();
                search.setText(table.getModel().getValueAt(row,2).toString());
            }
        });
        setVisible(true);
    }
    public void actionPerformed(ActionEvent ae){
        if (ae.getSource()==resultbutton){
            try{
                setVisible(false);
                new Marks(search.getText());
            }catch (Exception e){
                e.printStackTrace();
            }

        } else if (ae.getSource()==backbutton) {
            setVisible(false);
        }
    }

    public static void main(String[] args) {
        new DisplayMarks();
    }
}
