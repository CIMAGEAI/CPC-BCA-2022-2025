import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class CBConnection {

    // Database credentials and URL
    private static final String URL = "jdbc:mysql://localhost:3307/student_db?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASS = "";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("✅ JDBC Driver loaded.");
        } catch (ClassNotFoundException ex) {
            System.err.println("❌ MySQL JDBC Driver not found: " + ex.getMessage());
        }
    }

    // Always return a NEW connection
    public static Connection getConnection() {
        try {
            Connection conn = DriverManager.getConnection(URL, USER, PASS);
            System.out.println("✅ Connected to database.");
            return conn;
        } catch (SQLException ex) {
            System.err.println("❌ Database connection failed: " + ex.getMessage());
            return null;
        }
    }
}
