import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.swing.table.DefaultTableModel;
import java.sql.*;
import java.util.Vector;
import javax.mail.*;
import java.util.ArrayList;
import java.util.List;

import java.util.ArrayList;
import java.util.Properties;

public class AdminUtils {

    // Load all complaints for admin view
    public static DefaultTableModel getAllComplaints() {
        String[] columns = {"ID", "Student ID", "Name", "Roll No", "Email", "Department", "Complaint", "Status", "Date"};
        DefaultTableModel model = new DefaultTableModel(columns, 0);

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM complaints ORDER BY created_at DESC")) {

            while (rs.next()) {
                Vector<Object> row = new Vector<>();
                row.add(rs.getInt("id"));
                row.add(rs.getInt("student_id"));
                row.add(rs.getString("name"));
                row.add(rs.getString("rollno"));
                row.add(rs.getString("email"));
                row.add(rs.getString("department"));
                row.add(rs.getString("complaint_text"));
                row.add(rs.getString("status"));
                row.add(rs.getTimestamp("created_at"));
                model.addRow(row);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return model;
    }

    // Update complaint status
    public static boolean updateComplaintStatus(int complaintId, String status) {
        String query = "UPDATE complaints SET status = ? WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {

            ps.setString(1, status);
            ps.setInt(2, complaintId);
            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static List<String> getAllAdminEmails() {
    List<String> emails = new ArrayList<>();
    String query = "SELECT email FROM admin_users";

    try (Connection conn = DBConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(query);
         ResultSet rs = ps.executeQuery()) {

        while (rs.next()) {
            emails.add(rs.getString("email"));
        }

    } catch (Exception e) {
        e.printStackTrace();
    }

    return emails;
}
    // Reply to a complaint - update resolution, notify student and all admins
    public static boolean replyToComplaint(int complaintId, String replyMsg) {
        String updateQuery = "UPDATE complaints SET resolution = ?, status = 'Resolved' WHERE id = ?";
        String fetchStudentQuery = "SELECT email, name FROM complaints WHERE id = ?";

        try (Connection conn = DBConnection.getConnection()) {
            // 1. Update complaint
            PreparedStatement ps = conn.prepareStatement(updateQuery);
            ps.setString(1, replyMsg);
            ps.setInt(2, complaintId);
            boolean updated = ps.executeUpdate() > 0;

            if (updated) {
                // 2. Fetch student details
                PreparedStatement fetchPs = conn.prepareStatement(fetchStudentQuery);
                fetchPs.setInt(1, complaintId);
                ResultSet rs = fetchPs.executeQuery();

                if (rs.next()) {
                    String studentEmail = rs.getString("email");
                    String studentName = rs.getString("name");

                    // 3. Email student
                    sendEmail(studentEmail, "✅ Your Complaint has been Resolved",
                            "Dear " + studentName + ",\n\nYour complaint has been addressed:\n\n"
                                    + replyMsg + "\n\nThank you,\nAdmin Team\nCollege Complaint Management System");

                    // 4. Notify all admins
                    notifyAdminsOfResolution(complaintId, studentName, replyMsg);
                }
            }

            return updated;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Notify all admins that a complaint was resolved
    private static void notifyAdminsOfResolution(int complaintId, String studentName, String resolutionText) {
        String adminQuery = "SELECT email FROM admin_users";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(adminQuery);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                String adminEmail = rs.getString("email");

                String subject = "📬 Complaint ID " + complaintId + " Resolved for " + studentName;
                String body = "Hello Admin,\n\n"
                        + "The following complaint has been marked as resolved:\n\n"
                        + "Complaint ID: " + complaintId + "\n"
                        + "Student Name: " + studentName + "\n"
                        + "Resolution:\n" + resolutionText + "\n\n"
                        + "Please verify and take any further necessary actions if needed.\n\n"
                        + "Regards,\nCollege Complaint Management System";

                sendEmail(adminEmail, subject, body);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Email sender utility
    private static void sendEmail(String to, String subject, String body) {
        final String fromEmail = "tulikakumari002@gmail.com";
        final String password = "jkkkgrijnxgzfnbu"; // Use App Password

        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        props.put("mail.debug", "true");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setText(body);
            Transport.send(message);
            System.out.println("✅ Email sent to: " + to);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    // Search complaints by name, roll, or department
    public static DefaultTableModel searchComplaints(String keyword) {
        String[] columns = {"ID", "Student ID", "Name", "Roll No", "Email", "Department", "Complaint", "Status", "Date"};
        DefaultTableModel model = new DefaultTableModel(columns, 0);

        String query = "SELECT * FROM complaints WHERE name LIKE ? OR rollno LIKE ? OR department LIKE ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {

            String searchTerm = "%" + keyword + "%";
            ps.setString(1, searchTerm);
            ps.setString(2, searchTerm);
            ps.setString(3, searchTerm);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Vector<Object> row = new Vector<>();
                row.add(rs.getInt("id"));
                row.add(rs.getInt("student_id"));
                row.add(rs.getString("name"));
                row.add(rs.getString("rollno"));
                row.add(rs.getString("email"));
                row.add(rs.getString("department"));
                row.add(rs.getString("complaint_text"));
                row.add(rs.getString("status"));
                row.add(rs.getTimestamp("created_at"));
                model.addRow(row);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return model;
    }
}
