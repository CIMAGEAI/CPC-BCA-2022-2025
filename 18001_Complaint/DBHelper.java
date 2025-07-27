import java.sql.*;

public class DBHelper {

    public static boolean registerStudent(String name, String email, String password, String rollno, String department) {
        String query = "INSERT INTO student_users (name, email, password, rollno, department) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, name);
            stmt.setString(2, email);
            stmt.setString(3, password);
            stmt.setString(4, rollno);
            stmt.setString(5, department);
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public static boolean validateStudent(String email, String password) {
        String query = "SELECT * FROM student_users WHERE email = ? AND password = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, email);
            stmt.setString(2, password);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public static boolean submitComplaint(int studentId, String name, String rollno, String department, String complaintText) {
        String insertQuery = "INSERT INTO complaints (student_id, name, rollno, department, complaint_text) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(insertQuery)) {

            stmt.setInt(1, studentId);
            stmt.setString(2, name);
            stmt.setString(3, rollno);
            stmt.setString(4, department);
            stmt.setString(5, complaintText);
            stmt.executeUpdate();

            // Get student email
            String email = getEmailByStudentId(studentId);

            // ✅ Send emails if email found
            if (email != null && !email.isEmpty()) {
                EmailUtil.sendComplaintEmailsAfterSubmission(email, name, studentId);
            }

            return true;

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }

    public static String getEmailByStudentId(int id) {
        String query = "SELECT email FROM student_users WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getString("email");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
