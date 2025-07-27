import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.File;
import java.io.FileOutputStream;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ComplaintPDFGenerator {

    // ✅ 1. Generate complaint PDF for specific student
    public static File generateComplaintPDFForStudent(int studentId) {
        Connection conn = null;
        File file = null;

        try {
            conn = DBConnection.getConnection();

            String studentQuery = "SELECT name, rollno, email, department FROM student_users WHERE id = ?";
            PreparedStatement studentStmt = conn.prepareStatement(studentQuery);
            studentStmt.setInt(1, studentId);
            ResultSet studentRs = studentStmt.executeQuery();

            if (!studentRs.next()) {
                System.out.println("❌ Student not found.");
                return null;
            }

            String studentName = studentRs.getString("name");
            String rollNo = studentRs.getString("rollno");
            String email = studentRs.getString("email");
            String dept = studentRs.getString("department");

            String fileName = "Complaint_Report_" + rollNo + "_" +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".pdf";
            file = new File(fileName);
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(file));
            document.open();

            // Logo
            try {
                Image logo = Image.getInstance("college_logo.jpeg");
                logo.scaleToFit(100, 100);
                logo.setAlignment(Element.ALIGN_CENTER);
                document.add(logo);
            } catch (Exception ex) {
                System.out.println("⚠️ Logo not found or couldn't load. Skipping.");
            }

            // Title
            Paragraph title = new Paragraph("College Complaint Report",
                    new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY));
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            // Date
            Paragraph date = new Paragraph("Generated On: " +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")),
                    new Font(Font.FontFamily.HELVETICA, 10));
            date.setAlignment(Element.ALIGN_RIGHT);
            document.add(date);

            // Student Info
            PdfPTable studentTable = new PdfPTable(2);
            studentTable.setWidthPercentage(100);
            studentTable.setSpacingBefore(10);

            studentTable.addCell(getLabelCell("Name:"));
            studentTable.addCell(getValueCell(studentName));
            studentTable.addCell(getLabelCell("Roll No:"));
            studentTable.addCell(getValueCell(rollNo));
            studentTable.addCell(getLabelCell("Email:"));
            studentTable.addCell(getValueCell(email));
            studentTable.addCell(getLabelCell("Department:"));
            studentTable.addCell(getValueCell(dept));
            document.add(studentTable);

            // Complaint Table
            Paragraph complaintHeader = new Paragraph("\nComplaint History",
                    new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD));
            complaintHeader.setSpacingBefore(20);
            complaintHeader.setSpacingAfter(10);
            document.add(complaintHeader);

            PdfPTable complaintTable = new PdfPTable(3);
            complaintTable.setWidthPercentage(100);
            complaintTable.setWidths(new int[]{4, 2, 3});
            complaintTable.setSpacingBefore(10);
            complaintTable.addCell(getHeaderCell("Complaint"));
            complaintTable.addCell(getHeaderCell("Status"));
            complaintTable.addCell(getHeaderCell("Submitted On"));

            String complaintQuery = "SELECT complaint_text, status, created_at FROM complaints WHERE student_id = ?";
            PreparedStatement complaintStmt = conn.prepareStatement(complaintQuery);
            complaintStmt.setInt(1, studentId);
            ResultSet complaintRs = complaintStmt.executeQuery();

            int count = 0;
            while (complaintRs.next()) {
                complaintTable.addCell(getWrappedCell(complaintRs.getString("complaint_text")));
                complaintTable.addCell(getValueCell(complaintRs.getString("status")));
                complaintTable.addCell(getValueCell(
                        complaintRs.getTimestamp("created_at").toLocalDateTime()
                                .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))));
                count++;
            }

            if (count > 0) {
                document.add(complaintTable);
            } else {
                Paragraph noComplaints = new Paragraph("No complaints found for this student.",
                        new Font(Font.FontFamily.HELVETICA, 12, Font.ITALIC, BaseColor.GRAY));
                document.add(noComplaints);
            }

            document.close();
            System.out.println("✅ Complaint PDF generated: " + fileName);

            return file;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // ✅ 2. Generate all complaints for admin
    public static File generateAllComplaintsPDFForAdmin() {
        File file = null;

        try (Connection conn = DBConnection.getConnection()) {
            String fileName = "All_Complaints_Report_" +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".pdf";
            file = new File(fileName);
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(file));
            document.open();

            // Logo
            try {
                Image logo = Image.getInstance("college_logo.jpeg");
                logo.scaleToFit(100, 100);
                logo.setAlignment(Element.ALIGN_CENTER);
                document.add(logo);
            } catch (Exception e) {
                System.out.println("⚠️ Logo not found.");
            }

            // Title
            Paragraph title = new Paragraph("All Student Complaints Report",
                    new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY));
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            // Date
            Paragraph date = new Paragraph("Generated On: " +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")),
                    new Font(Font.FontFamily.HELVETICA, 10));
            date.setAlignment(Element.ALIGN_RIGHT);
            document.add(date);

            // Complaint Table
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setSpacingBefore(20);
            table.setWidths(new int[]{2, 2, 3, 3, 2, 3});

            table.addCell(getHeaderCell("Name"));
            table.addCell(getHeaderCell("Roll No"));
            table.addCell(getHeaderCell("Email"));
            table.addCell(getHeaderCell("Complaint"));
            table.addCell(getHeaderCell("Status"));
            table.addCell(getHeaderCell("Submitted On"));

            String query = "SELECT name, rollno, email, complaint_text, status, created_at FROM complaints ORDER BY created_at DESC";
            PreparedStatement ps = conn.prepareStatement(query);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                table.addCell(getWrappedCell(rs.getString("name")));
                table.addCell(getWrappedCell(rs.getString("rollno")));
                table.addCell(getWrappedCell(rs.getString("email")));
                table.addCell(getWrappedCell(rs.getString("complaint_text")));
                table.addCell(getWrappedCell(rs.getString("status")));
                table.addCell(getWrappedCell(rs.getTimestamp("created_at").toLocalDateTime()
                        .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))));
            }

            document.add(table);
            document.close();
            System.out.println("✅ All Complaints PDF for Admin generated: " + fileName);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return file;
    }

    // ================== Helper Methods ==================

    private static PdfPCell getLabelCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setBackgroundColor(new BaseColor(230, 230, 250));
        return cell;
    }

    private static PdfPCell getValueCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, new Font(Font.FontFamily.HELVETICA, 12)));
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        return cell;
    }

    private static PdfPCell getHeaderCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        cell.setBackgroundColor(new BaseColor(200, 200, 200));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(6);
        return cell;
    }

    private static PdfPCell getWrappedCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, new Font(Font.FontFamily.HELVETICA, 12)));
        cell.setPadding(6);
        cell.setNoWrap(false);
        return cell;
    }

    // For testing
    public static void main(String[] args) {
        File studentPDF = generateComplaintPDFForStudent(1);
        System.out.println("Student PDF: " + (studentPDF != null ? studentPDF.getAbsolutePath() : "null"));

        File adminPDF = generateAllComplaintsPDFForAdmin();
        System.out.println("Admin PDF: " + (adminPDF != null ? adminPDF.getAbsolutePath() : "null"));
    }
}
