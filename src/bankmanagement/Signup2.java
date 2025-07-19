package bankmanagement;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Signup2 extends JFrame implements ActionListener {
    JComboBox comboBox,comboBox2,comboBox3,comboBox4,comboBox5;
    JTextField textPan,textAadhar;
    JRadioButton r1,r2, e1,e2;
    JButton next;
    String formno;
    Signup2(String formno){
        super("APPLICATION FORM");
        this.formno = formno;
        ImageIcon img1 = new ImageIcon(ClassLoader.getSystemResource("icon/signup1.jpg"));
        Image img2 = img1.getImage().getScaledInstance(850, 800, Image.SCALE_DEFAULT);
        ImageIcon img3 = new ImageIcon(img2);
        JLabel img = new JLabel(img3);
        setContentPane(img);
        img.setLayout(null);

        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icon/B.png"));
        Image i2 = i1.getImage().getScaledInstance(100,100,Image.SCALE_DEFAULT);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel image = new JLabel(i3);
        image.setBounds(150,50,50,50);
        img.add(image);



        JLabel l1 = new JLabel("Page 2 :-");
        l1.setForeground(Color.white);
        l1.setFont(new Font("Raleway", Font.BOLD,22));
        l1.setBounds(300,30,600,40);
        img.add(l1);

        JLabel l2 = new JLabel("Additonal Details");
        l2.setForeground(Color.WHITE);
        l2.setFont(new Font("Raleway", Font.BOLD,22));
        l2.setBounds(300,60,600,40);
        img.add(l2);

        JLabel l3 = new JLabel("Religion :");
        l3.setForeground(Color.WHITE);
        l3.setFont(new Font("Raleway", Font.BOLD,18));
        l3.setBounds(100,120,100,30);
        img.add(l3);

        String religion[] = {"Hindu","Muslim","Sikh", "Christian", "Other"};
        comboBox = new JComboBox(religion);
        comboBox.setForeground(Color.BLACK);
        comboBox.setFont(new Font("Raleway",Font.BOLD,14));
        comboBox.setBounds(350,120,320,30);
        img.add(comboBox);

        JLabel l4 = new JLabel("Category : ");
        l4.setForeground(Color.WHITE);
        l4.setFont(new Font("Raleway", Font.BOLD,18));
        l4.setBounds(100,170,100,30);
        img.add(l4);

        String Category [] = {"General","OBC","SC", "ST", "Other"};
        comboBox2 = new JComboBox(Category);
        comboBox2.setForeground(Color.black);
        comboBox2.setFont(new Font("Raleway",Font.BOLD,14));
        comboBox2.setBounds(350,170,320,30);
        img.add(comboBox2);

        JLabel l5 = new JLabel("Income : ");
        l5.setForeground(Color.WHITE);
        l5.setFont(new Font("Raleway", Font.BOLD,18));
        l5.setBounds(100,220,100,30);
        img.add(l5);

        String income [] = {"Null","<1,50,000","<2,50,000", "5,00,000", "Upto 10,00,000","Above 10,00,000"};
        comboBox3 = new JComboBox(income);
        comboBox3.setForeground(Color.black);
        comboBox3.setFont(new Font("Raleway",Font.BOLD,14));
        comboBox3.setBounds(350,220,320,30);
        img.add(comboBox3);

        JLabel l6 = new JLabel("Education : ");
        l6.setForeground(Color.WHITE);
        l6.setFont(new Font("Raleway", Font.BOLD,18));
        l6.setBounds(100,270,150,30);
        img.add(l6);

        String educational [] = {"Non-Graduate","Graduate","Post-Graduate", "Doctrate", "Others"};
        comboBox4 = new JComboBox(educational);
        comboBox4.setForeground(Color.black);
        comboBox4.setFont(new Font("Raleway",Font.BOLD,14));
        comboBox4.setBounds(350,270,320,30);
        img.add(comboBox4);


        JLabel l7 = new JLabel("Occupation : ");
        l7.setForeground(Color.WHITE);
        l7.setFont(new Font("Raleway", Font.BOLD,18));
        l7.setBounds(100,340,150,30);
        img.add(l7);

        String Occupation [] = {"Salaried","Self-Employed","Business", "Student", "Retired", "Other"};
        comboBox5 = new JComboBox(Occupation);
        comboBox5.setForeground(Color.black);
        comboBox5.setFont(new Font("Raleway",Font.BOLD,14));
        comboBox5.setBounds(350,340,320,30);
        img.add(comboBox5);

        JLabel l8 = new JLabel("PAN Number : ");
        l8.setForeground(Color.WHITE);
        l8.setFont(new Font("Raleway", Font.BOLD,18));
        l8.setBounds(100,390,150,30);
        img.add(l8);

        textPan = new JTextField();
        textPan.setFont(new Font("Raleway", Font.BOLD,18));
        textPan.setForeground(Color.WHITE);
        textPan.setOpaque(false);
        textPan.setBounds(350,390,320,30);
        img.add(textPan);

        JLabel l9 = new JLabel("Aadhar Number : ");
        l9.setForeground(Color.WHITE);
        l9.setFont(new Font("Raleway", Font.BOLD,18));
        l9.setBounds(100,440,180,30);
        img.add(l9);

        textAadhar = new JTextField();
        textAadhar.setFont(new Font("Raleway", Font.BOLD,18));
        textAadhar.setForeground(Color.WHITE);
        textAadhar.setOpaque(false);
        textAadhar.setBounds(350,440,320,30);
        img.add(textAadhar);


        JLabel l10 = new JLabel("Senior Citizen : ");
        l10.setForeground(Color.WHITE);
        l10.setFont(new Font("Raleway", Font.BOLD,18));
        l10.setBounds(100,490,180,30);
        img.add(l10);

        r1 = new JRadioButton("Yes");
        r1.setFont(new Font("Raleway", Font.BOLD,16));
        r1.setForeground(Color.WHITE);
        r1.setOpaque(false);
        r1.setBounds(350,490,100,30);
        img.add(r1);

        r2 = new JRadioButton("No");
        r2.setFont(new Font("Raleway", Font.BOLD,16));
        r2.setForeground(Color.WHITE);
        r2.setOpaque(false);
        r2.setBounds(460,490,100,30);
        img.add(r2);

        JLabel l11 = new JLabel("Existing Account : ");
        l11.setForeground(Color.WHITE);
        l11.setFont(new Font("Raleway", Font.BOLD,18));
        l11.setBounds(100,540,180,30);
        img.add(l11);

        e1 = new JRadioButton("Yes");
        e1.setFont(new Font("Raleway", Font.BOLD,16));
        e1.setForeground(Color.WHITE);
        e1.setOpaque(false);
        e1.setBounds(350,540,100,30);
        img.add(e1);

        e2 = new JRadioButton("No");
        e2.setFont(new Font("Raleway", Font.BOLD,16));
        e2.setForeground(Color.WHITE);
        e2.setOpaque(false);
        e2.setBounds(460,540,100,30);
        img.add(e2);

        JLabel l12 = new JLabel("Form No : ");
        l12.setForeground(Color.WHITE);
        l12.setFont(new Font("Raleway", Font.BOLD,14));
        l12.setBounds(650,10,100,30);
        img.add(l12);

        JLabel l13 = new JLabel(formno);
        l13.setForeground(Color.WHITE);
        l13.setFont(new Font("Raleway", Font.BOLD,14));
        l13.setBounds(760,10,60,30);
        img.add(l13);

        next = new JButton("Next");
        next.setFont(new Font("Raleway",Font.BOLD,14));
        next.setBackground(Color.BLACK);
        next.setForeground(Color.WHITE);
        next.setBounds(570,640,100,30);
        next.addActionListener(this);
        img.add(next);


        setLayout(null);
        setSize(850,750);
        setLocation(450,80);
        getContentPane().setBackground(new Color(252, 208, 76));
        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        String rel = (String) comboBox.getSelectedItem();
        String cate = (String) comboBox2.getSelectedItem();
        String inc = (String) comboBox3.getSelectedItem();
        String edu = (String) comboBox4.getSelectedItem();
        String occ = (String) comboBox5.getSelectedItem();

        String pan = textPan.getText();
        String addhar = textAadhar.getText();

        String scitizen = " ";
        if ((r1.isSelected())){
            scitizen = "Yes";
        } else if (r2.isSelected()) {
            scitizen ="No";
        }
        String eAccount = " ";
        if ((r1.isSelected())){
            eAccount = "Yes";
        } else if (r2.isSelected()) {
            eAccount ="No";
        }

        try{
            if (textPan.getText().equals("") || textAadhar.getText().equals("")){
                JOptionPane.showMessageDialog(null,"Fill all the fields");
            }else {
                Connn c = new Connn();
                String q = "insert into Signuptwo values('"+formno+"', '"+rel+"', '"+cate+"','"+inc+"','"+edu+"','"+occ+"','"+pan+"','"+addhar+"','"+scitizen+"','"+eAccount+"')";
                c.statement.executeUpdate(q);
                new Signup3(formno);
                setVisible(false);
            }


        }catch (Exception E){
            E.printStackTrace();
        }


    }

    public static void main(String[] args) {
        new Signup2("");
    }
}
