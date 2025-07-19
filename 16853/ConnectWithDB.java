
import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
/**
 *
 * @author HP
 */
public class ConnectWithDB {
    public static Connection Connection(){
        Connection con = null;
        try {
            
            con = DriverManager.getConnection("jdbc:mysql://localhost:3306/library","root", "elevatedev");
            
        } catch (SQLException ex) {
            Logger.getLogger(ConnectWithDB.class.getName()).log(Level.SEVERE, null, ex);
        }
        return con;
    }  
    
}
