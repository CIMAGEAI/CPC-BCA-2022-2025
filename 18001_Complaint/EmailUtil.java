import com.itextpdf.text.DocumentException;

import javax.mail.*;
import javax.mail.internet.*;
import java.io.File;
import java.util.List;
import java.util.Properties;

public class EmailUtil {

    private static final String fromEmail = "tulikakumari002@gmail.com";
    private static final String password = "jkkkgrijnxgzfnbu"; // App password

    // ✅ Main method to call after complaint submission
    public static void sendComplaintEmailsAfterSubmission(String studentEmail, String studentName, int studentId) {
        try {
            // Generate PDFs
            File studentPDF = ComplaintPDFGenerator.generateComplaintPDFForStudent(studentId);
            File adminPDF = ComplaintPDFGenerator.generateAllComplaintsPDFForAdmin();

            if (studentPDF == null || adminPDF == null) {
                System.err.println("❌ PDF generation failed. Emails not sent.");
                return;
            }

            // === Send to Student ===
            String studentSubject = "✅ Your Complaint Has Been Submitted";
            String studentBody = "Dear " + studentName + ",\n\n"
                    + "Thank you for submitting your complaint.\n\n"
                    + "Please find your complaint details in the attached PDF.\n\n"
                    + "Regards,\nCollege Complaint Management System";
            sendEmailWithAttachment(studentEmail, studentSubject, studentBody, studentPDF, true); // delete after

            // === Send to Admins ===
            String adminSubject = "📩 New Complaint Submitted by " + studentName;
            String adminBody = "Dear Admin,\n\nA new complaint has been submitted by " + studentName
                    + ".\n\nPlease find the updated report of all complaints attached.\n\n"
                    + "Regards,\nCollege Complaint Management System";

            List<String> adminEmails = AdminUtils.getAllAdminEmails();
            if (adminEmails == null || adminEmails.isEmpty()) {
                System.err.println("⚠️ No admin emails found.");
            } else {
                for (String adminEmail : adminEmails) {
                    sendEmailWithAttachment(adminEmail, adminSubject, adminBody, adminPDF, false); // do not delete immediately
                }
            }

            // ✅ Cleanup admin PDF once all sent
            if (adminPDF.exists()) adminPDF.delete();

        } catch (Exception e) {
            System.err.println("❌ Error sending emails after complaint submission.");
            e.printStackTrace();
        }
    }

    // ✅ General-purpose email sender with attachment
    public static void sendEmailWithAttachment(String toEmail, String subject, String body, File attachment, boolean deleteAfterSending) {
        if (attachment == null || !attachment.exists()) {
            System.err.println("❌ Attachment missing. Skipping email to " + toEmail);
            return;
        }

        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject(subject);

            // Text
            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setText(body);

            // Attachment
            MimeBodyPart attachmentPart = new MimeBodyPart();
            attachmentPart.attachFile(attachment);

            // Combine
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(textPart);
            multipart.addBodyPart(attachmentPart);

            message.setContent(multipart);

            // Send
            Transport.send(message);
            System.out.println("✅ Email sent to: " + toEmail);

        } catch (Exception e) {
            System.err.println("❌ Failed to send email to: " + toEmail);
            e.printStackTrace();
        } finally {
            if (deleteAfterSending && attachment.exists()) {
                boolean deleted = attachment.delete();
                if (!deleted) {
                    System.err.println("⚠️ Failed to delete PDF after sending: " + attachment.getName());
                }
            }
        }
    }
}
