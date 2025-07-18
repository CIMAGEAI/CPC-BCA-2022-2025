import java.sql.Connection;
import java.sql.DriverManager;

public class TestDB1 {
    public static void main(String[] args) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/ccms", "root", "9334548574"
            );
            System.out.println("Connected successfully!");
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

