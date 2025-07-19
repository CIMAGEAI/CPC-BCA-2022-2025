/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package college_project;
import java.sql.Connection;
import java.sql.DriverManager;//
import java.sql.Statement;

/**
 *
 * @author VISHALKUMAR
 */
public class Connection_Class {
    Connection conne;
    Statement statement;
    Connection_Class(){
            try{
    
    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
    conne=DriverManager.getConnection("jdbc:sqlserver://localhost;databasename=University_Management;user=sa;password=cimagepatna");
    statement= conne.createStatement();
} catch(Exception e){
    e.printStackTrace();
}
    }    
}
