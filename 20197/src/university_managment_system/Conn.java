package university_managment_system;

import java.sql.*;

public class Conn {

    Connection c;
    Statement s;
    Conn(){
        try
        {
            Class.forName("com.mysql.cj.jdbc.Driver");
            c = DriverManager.getConnection("jdbc:mysql://localhost:3306/universitymanagementsystem","root","Bhatia@9939");
            s=c.createStatement();
            System.out.println("Database Connected Successfully!"); // Confirmation

        }
        catch(Exception e){
            System.out.println("Database Connection Failed!");

            e.printStackTrace();
        }
     }
}
