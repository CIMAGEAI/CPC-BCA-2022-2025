package Hotel.Management.System;

import javax.swing.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;

public class con {
    Connection connection;

    Statement statement;
    PreparedStatement ps;
    public con() {
        try {
           // Class.forName("com.mysql.cj.jdbc.Driver");
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/hotel", "root", "rahulsoni@123#");
            statement = connection.createStatement();

        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(null, "Error while adding customer: " + e.getMessage());


        }
    }
    public Statement getStatement() {

        return statement;
    }
    public Connection getConnection() {
        return connection;
    }
    public static void main(String[] args)
    {
       //new con();
    }

}
