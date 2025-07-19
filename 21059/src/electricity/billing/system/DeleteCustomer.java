package electricity.billing.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class DeleteCustomer extends JFrame implements ActionListener{
    JButton del, back, search;
    JTextField tfnumber;
    JLabel lblname, lblemail, lblphone;
            
    DeleteCustomer(){
        super("Delete Customer Details");
        setBounds(350, 120, 880, 550);
	getContentPane().setBackground(Color.WHITE);
	setLayout(null);

        JLabel text = new JLabel("DELETE CUSTOMER DETAILS");
        text.setBounds(270, 20, 300, 25);
        text.setFont(new Font("Tahoma", Font.PLAIN, 22));
        text.setForeground(Color.red);
        add(text);

        JLabel labelnumber = new JLabel("Meter_no:");
        labelnumber.setBounds(50, 80, 100, 25);
        labelnumber.setFont(new Font("Tahoma", Font.PLAIN, 16));
        add(labelnumber);

        tfnumber = new JTextField();
        tfnumber.setBounds(160, 80, 120, 25);
        tfnumber.setFont(new Font("Tahoma", Font.PLAIN, 16));
        add(tfnumber);

        search = new JButton("Search");
        search.setBounds(290, 80, 120, 24);
        search.setFont(new Font("Tahoma", Font.PLAIN, 14));
        search.setBackground(Color.BLACK);
        search.setForeground(Color.WHITE);
        search.addActionListener(this);
        add(search);

        JLabel labelname = new JLabel("Name");
        labelname.setBounds(50, 130, 100, 25);
        labelname.setFont(new Font("Tahoma", Font.PLAIN, 16));
        add(labelname);

        lblname = new JLabel();
        lblname.setBounds(160, 130, 150, 25);
        lblname.setFont(new Font("Tahoma", Font.PLAIN, 16));
        add(lblname);

        JLabel labelemail = new JLabel("Email");
        labelemail.setBounds(50, 180, 100, 25);
        labelemail.setFont(new Font("Tahoma", Font.PLAIN, 16));
        add(labelemail);

        lblemail = new JLabel();
        lblemail.setBounds(160, 180, 150, 25);
        lblemail.setFont(new Font("Tahoma", Font.PLAIN, 16));
        add(lblemail);

        JLabel labelephone = new JLabel("Phone");
        labelephone.setBounds(50, 230, 100, 25);
        labelephone.setFont(new Font("Tahoma", Font.PLAIN, 16));
        add(labelephone);

        lblphone = new JLabel();
        lblphone.setBounds(160, 230, 150, 25);
        lblphone.setFont(new Font("Tahoma", Font.PLAIN, 16));
        add(lblphone);

        del = new JButton("Delete");
        del.setBounds(90, 310, 80, 24);
        del.setFont(new Font("Tahoma", Font.PLAIN, 14));
        del.setBackground(Color.BLACK);
        del.setForeground(Color.WHITE);
        del.addActionListener(this);
        add(del);

        back = new JButton("Back");
        back.setBounds(220, 310, 80, 24);
        back.setFont(new Font("Tahoma", Font.PLAIN, 14));
        back.setBackground(Color.BLACK);
        back.setForeground(Color.WHITE);
        back.addActionListener(this);
        add(back);
        
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icon/DelDetails.jpeg"));
        Image i2 = i1.getImage().getScaledInstance(250, 250, Image.SCALE_DEFAULT);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel image = new JLabel(i3);
        image.setBounds(500, 140, 250, 250);
        add(image);

        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent ae){
        if(ae.getSource()==search){
            try{
                Conn c = new Conn();
                String query = "select * from customer where meter_no = '"+tfnumber.getText()+"'";
                ResultSet rs = c.s.executeQuery(query);
                while(rs.next()){
                    lblname.setText(rs.getString("name"));
                    lblemail.setText(rs.getString("email"));
                    lblphone.setText(rs.getString("phone"));
                }
            }catch(Exception e){
                System.out.println(e);
            }
        }else if(ae.getSource()==del){
            try{
                Conn c = new Conn();
                c.s.executeUpdate("delete from login where meter_no = '"+tfnumber.getText()+"'");
                c.s.executeUpdate("delete from customer where meter_no = '"+tfnumber.getText()+"'");
                c.s.executeUpdate("delete from meter_info where meter_no = '"+tfnumber.getText()+"'");
                c.s.executeUpdate("delete from bill where meter_no = '"+tfnumber.getText()+"'");
                
                JOptionPane.showMessageDialog(null, "Data Deleted Successfully");
                
                setVisible(false);
            }catch(Exception e){
                System.out.println(e);
            }
        }else if(ae.getSource()==back){
            setVisible(false);
        }
    }

    public static void main(String[] args){
        new DeleteCustomer();
    }
}
