package university;


import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

public class Marks extends JFrame implements ActionListener {
    String rollno,targetemail;
    JButton cancel,Email;
    Marks(String rollno){
        this.rollno = rollno;

        setSize(500, 600);
        setLocation(500, 100);
        setLayout(null);

        getContentPane().setBackground(new Color(210, 252, 248));

        JLabel heading = new JLabel("JAMES UNIVERSITY ");
        heading.setBounds(100, 10, 500, 25);
        heading.setFont(new Font("Tahoma", Font.BOLD, 20));
        add(heading);

        JLabel subheading = new JLabel("RESULTS OF EXAMINATION");
        subheading.setBounds(100, 50, 500, 20);
        subheading.setFont(new Font("Tahoma", Font.BOLD, 18));
        add(subheading);

        JLabel lblrollno = new JLabel("Roll Number " + rollno);
        lblrollno.setBounds(60, 100, 500, 20);
        lblrollno.setFont(new Font("Tahoma", Font.PLAIN, 18));
        add(lblrollno);

        JLabel lblsemester = new JLabel();
        lblsemester.setBounds(60, 130, 500, 20);
        lblsemester.setFont(new Font("Tahoma", Font.PLAIN, 18));
        add(lblsemester);

        JLabel sub1 = new JLabel();
        sub1.setBounds(100, 200, 500, 20);
        sub1.setFont(new Font("Tahoma", Font.PLAIN, 18));
        add(sub1);

        JLabel sub2 = new JLabel();
        sub2.setBounds(100, 230, 500, 20);
        sub2.setFont(new Font("Tahoma", Font.PLAIN, 18));
        add(sub2);

        JLabel sub3 = new JLabel();
        sub3.setBounds(100, 260, 500, 20);
        sub3.setFont(new Font("Tahoma", Font.PLAIN, 18));
        add(sub3);

        JLabel sub4 = new JLabel();
        sub4.setBounds(100, 290, 500, 20);
        sub4.setFont(new Font("Tahoma", Font.PLAIN, 18));
        add(sub4);

        JLabel sub5 = new JLabel();
        sub5.setBounds(100, 320, 500, 20);
        sub5.setFont(new Font("Tahoma", Font.PLAIN, 18));
        add(sub5);

        try {
            Conn c = new Conn();

            ResultSet rs1 = c.statement.executeQuery("select * from subject where rollno = '"+rollno+"'");
            while(rs1.next()) {
                sub1.setText(rs1.getString("subj1"));
                sub2.setText(rs1.getString("subj2"));
                sub3.setText(rs1.getString("subj3"));
                sub4.setText(rs1.getString("subj4"));
                sub5.setText(rs1.getString("subj5"));
            }

            ResultSet rs2 = c.statement.executeQuery("select * from marks where rollno = '"+rollno+"'");
            while(rs2.next()) {
                sub1.setText(sub1.getText() + "------------" + rs2.getString("mark1"));
                sub2.setText(sub2.getText() + "------------" + rs2.getString("mark2"));
                sub3.setText(sub3.getText() + "------------" + rs2.getString("mark3"));
                sub4.setText(sub4.getText() + "------------" + rs2.getString("mark4"));
                sub5.setText(sub5.getText() + "------------" + rs2.getString("mark5"));
                lblsemester.setText("Semester " + rs2.getString("semester"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        cancel = new JButton("Back");
        cancel.setBounds(250, 500, 120, 25);
        cancel.setBackground(Color.BLACK);
        cancel.setForeground(Color.WHITE);
        cancel.addActionListener(this);
        cancel.setFont(new Font("Tahoma", Font.BOLD, 15));
        add(cancel);

        Email=new JButton("Email Marks");
        Email.setBounds(50,500,150,25);
        Email.setBackground(Color.BLACK);
        Email.setForeground(Color.WHITE);
        Email.addActionListener(this);
        Email.setFont(new Font("Tahoma", Font.BOLD, 15));
        add(Email);


        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if(e.getSource()==Email)
        {
            final String myEmail="kanhaiya.bcastudent22.18076@cimage.in";
            final String password="evge cbsc xapm rrhy";
            Conn c=new Conn();
            try {
                ResultSet resultSet=c.statement.executeQuery("Select email from student where rollno="+rollno);
                while(resultSet.next())
                {
                    targetemail=resultSet.getString(1);
                }
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
            //targetemail="kanhaiyakohli895@gmail.com";
            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");
            Session session = Session.getInstance(props,
                    new javax.mail.Authenticator() {
                        protected PasswordAuthentication getPasswordAuthentication() {
                            return new PasswordAuthentication(myEmail, password);
                        }
                    }
            );
            try {
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress(myEmail, "XYZ University"));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(targetemail));
                message.setSubject("Result Report Card - XYZ University");
                Conn c1=new Conn();
                String studentName = "", semester = "";
                String subj1 = "", subj2 = "", subj3 = "", subj4 = "", subj5 = "";
                int mark1 = 0, mark2 = 0, mark3 = 0, mark4 = 0, mark5 = 0;

                ResultSet rs1 = c1.statement.executeQuery("select * from student where rollno = '"+rollno+"'");
                if (rs1.next()) {
                    studentName = rs1.getString("name");
                }

                ResultSet rs2 = c1.statement.executeQuery("select * from subject where rollno = '"+rollno+"'");
                if (rs2.next()) {
                    subj1 = rs2.getString("subj1");
                    subj2 = rs2.getString("subj2");
                    subj3 = rs2.getString("subj3");
                    subj4 = rs2.getString("subj4");
                    subj5 = rs2.getString("subj5");
                }

                ResultSet rs3 = c1.statement.executeQuery("select * from marks where rollno = '"+rollno+"'");
                if (rs3.next()) {
                    mark1 = rs3.getInt("mark1");
                    mark2 = rs3.getInt("mark2");
                    mark3 = rs3.getInt("mark3");
                    mark4 = rs3.getInt("mark4");
                    mark5 = rs3.getInt("mark5");
                    semester = rs3.getString("semester");
                }

                int totalMarks = mark1 + mark2 + mark3 + mark4 + mark5;
                double percentage = (totalMarks / 500.0) * 100;

                String content = "Dear " + studentName + ",\n\n"
                        + "Here is your result from James University.\n\n"
                        + "Roll Number: " + rollno + "\n"
                        + "Semester: " + semester + "\n\n"
                        + "Subject-wise Marks:\n"
                        + subj1 + ": " + mark1 + "\n"
                        + subj2 + ": " + mark2 + "\n"
                        + subj3 + ": " + mark3 + "\n"
                        + subj4 + ": " + mark4 + "\n"
                        + subj5 + ": " + mark5 + "\n\n"
                        + "Total Marks: " + totalMarks + " / 500\n"
                        + String.format("Percentage: %.2f%%\n\n", percentage)
                        + "Regards,\n"
                        + "XYZ University Examination Cell";

                message.setText(content);


                Transport.send(message);

                JOptionPane.showMessageDialog(this, "Marks emailed successfully to " + targetemail);





            } catch (Exception f) {
                f.printStackTrace();
            }



        }
        if(e.getSource()==cancel)
        {
            setVisible(false);
        }

    }

    public static void main(String[] args) {
        new Marks("");
    }
}
