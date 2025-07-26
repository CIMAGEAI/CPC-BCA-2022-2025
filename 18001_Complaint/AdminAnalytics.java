import javax.swing.*;
import java.awt.*;
import java.sql.*;
import org.jfree.chart.*;
import org.jfree.chart.plot.*;
import org.jfree.chart.axis.CategoryAxis;
import org.jfree.chart.axis.CategoryLabelPositions;
import org.jfree.chart.renderer.category.BarRenderer;
import org.jfree.data.category.DefaultCategoryDataset;

public class AdminAnalytics extends JPanel {

    public AdminAnalytics() {
        setLayout(new BorderLayout());
        setBackground(Color.WHITE);

        JLabel title = new JLabel("📊 Complaint Analytics Dashboard", SwingConstants.CENTER);
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));
        title.setForeground(new Color(50, 50, 100));
        title.setBorder(BorderFactory.createEmptyBorder(20, 0, 10, 0));
        add(title, BorderLayout.NORTH);

        JPanel chartPanel = new JPanel(new GridLayout(1, 2, 20, 20));
        chartPanel.setBackground(Color.WHITE);
        chartPanel.setBorder(BorderFactory.createEmptyBorder(10, 20, 20, 20));

        chartPanel.add(createStatusChart());
        chartPanel.add(createDepartmentChart());

        add(chartPanel, BorderLayout.CENTER);
    }

    private ChartPanel createStatusChart() {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        try (Connection conn = DBConnection.getConnection()) {
            String[] statuses = {"Pending", "In Progress", "Resolved"};
            for (String status : statuses) {
                PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) FROM complaints WHERE status = ?");
                ps.setString(1, status);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    dataset.addValue(rs.getInt(1), "Total", status);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        JFreeChart chart = ChartFactory.createBarChart(
            "Complaints by Status",         // Chart title
            "Status",                       // X-axis label
            "Number of Complaints",         // Y-axis label
            dataset,                        // Dataset
            PlotOrientation.VERTICAL,
            false, true, false              // Legend, tooltips, URLs
        );

        customizeChart(chart, new Color[]{
            new Color(255, 165, 0),    // Pending - Orange
            new Color(30, 144, 255),   // In Progress - Blue
            new Color(34, 139, 34)     // Resolved - Green
        });

        return new ChartPanel(chart);
    }

    private ChartPanel createDepartmentChart() {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        try (Connection conn = DBConnection.getConnection()) {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT department, COUNT(*) FROM complaints GROUP BY department");

            while (rs.next()) {
                dataset.addValue(rs.getInt(2), "Total", rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        JFreeChart chart = ChartFactory.createBarChart(
            "Complaints by Department",
            "Department",
            "Number of Complaints",
            dataset,
            PlotOrientation.VERTICAL,
            false, true, false
        );

        customizeChart(chart, generateColorPalette(10));
        return new ChartPanel(chart);
    }

    private void customizeChart(JFreeChart chart, Color[] barColors) {
        chart.setBackgroundPaint(Color.WHITE);
        chart.getTitle().setFont(new Font("Segoe UI", Font.BOLD, 16));

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(Color.WHITE);
        plot.setRangeGridlinePaint(new Color(200, 200, 200));
        plot.getRangeAxis().setLabelFont(new Font("Segoe UI", Font.PLAIN, 13));
        plot.getDomainAxis().setLabelFont(new Font("Segoe UI", Font.PLAIN, 13));

        CategoryAxis xAxis = plot.getDomainAxis();
        xAxis.setCategoryLabelPositions(CategoryLabelPositions.UP_45); // Rotate labels
        xAxis.setTickLabelFont(new Font("Segoe UI", Font.PLAIN, 12));

        BarRenderer renderer = (BarRenderer) plot.getRenderer();
        for (int i = 0; i < barColors.length; i++) {
            renderer.setSeriesPaint(i, barColors[i]);
        }

        renderer.setBaseToolTipGenerator((categoryDataset, row, column) -> {
            String category = (String) categoryDataset.getColumnKey(column);
            Number value = categoryDataset.getValue(row, column);
            return category + ": " + value + " complaints";
        });
    }

    private Color[] generateColorPalette(int count) {
        Color[] baseColors = {
            new Color(72, 201, 176), new Color(93, 173, 226), new Color(165, 105, 189),
            new Color(243, 156, 18), new Color(231, 76, 60), new Color(52, 152, 219),
            new Color(46, 204, 113), new Color(241, 196, 15), new Color(52, 73, 94), new Color(230, 126, 34)
        };
        Color[] palette = new Color[count];
        for (int i = 0; i < count; i++) {
            palette[i] = baseColors[i % baseColors.length];
        }
        return palette;
    }

    // For testing
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Admin Analytics");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setSize(1000, 600);
            frame.setLocationRelativeTo(null);
            frame.add(new AdminAnalytics());
            frame.setVisible(true);
        });
    }
}
