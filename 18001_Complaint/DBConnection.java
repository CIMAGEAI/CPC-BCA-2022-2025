import java.sql.*;

public class DBConnection {
    public static Connection getConnection() {
        try {
            String url = "jdbc:mysql://localhost:3306/college_complaint_system";
            String user = "root";
            String password = "9334548574"; // Add your MySQL password here
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(url, user, password);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}
