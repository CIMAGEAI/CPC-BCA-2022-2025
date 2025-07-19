package travel.and.tourism;

import java.sql.*;

public class Conn {
    Connection c;
    Statement s;
    public Conn(){  
        try{  
            c =DriverManager.getConnection("jdbc:mysql:///tms","root","AtulMySQL"); 
            s =c.createStatement();  
        }catch(Exception e){ 
            System.out.println(e);
        }  
    }
}