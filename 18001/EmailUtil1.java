import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

public class EmailUtil1 {

    private static final String FROM_EMAIL = "your_email@gmail.com"; // ✅ Replace with your email
    private static final String PASSWORD = "your_app_password";      // ✅ Use app password (not your normal password)

    private static Session createEmailSession() {
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com"); 
        props.put("mail.smtp.port", "587"); 
        props.put("mail.smtp.auth", "true"); 
        props.put("mail.smtp.starttls.enable", "true");

        return Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(FROM_EMAIL, PASSWORD);
            }
        });
    }

    // ✅ Send email after complaint submission
    public static void sendComplaintEmail(String toEmail, String studentName, String complaintText) {
        try {
            Message message = new MimeMessage(createEmailSession());
            message.setFrom(new InternetAddress(FROM_EMAIL));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject("New Complaint Submitted by " + studentName);

            String emailBody = "Dear " + studentName + ",\n\n"
                             + "Your complaint has been successfully submitted. Below are the details:\n\n"
                             + "Complaint:\n" + complaintText + "\n\n"
                             + "We will look into this and get back to you shortly.\n\n"
                             + "Regards,\nCCMS Team";

            message.setText(emailBody);
            Transport.send(message);
            System.out.println("Complaint email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Error sending complaint email.");
        }
    }

    // ✅ Send email after complaint status update (used by admin)
    public static void sendComplaintStatusUpdate(String toEmail, String status, String replyMessage) {
        try {
            Message message = new MimeMessage(createEmailSession());
            message.setFrom(new InternetAddress(FROM_EMAIL));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject("Complaint Status Updated");

            String emailBody = "Dear Student,\n\n"
                             + "Your complaint status has been updated.\n\n"
                             + "New Status: " + status + "\n"
                             + "Admin Reply: " + (replyMessage.isEmpty() ? "No reply added." : replyMessage) + "\n\n"
                             + "Regards,\nCCMS Admin";

            message.setText(emailBody);
            Transport.send(message);
            System.out.println("Status update email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Error sending status update email.");
        }
    }
}
