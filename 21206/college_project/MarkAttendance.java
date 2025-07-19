package college_project;

import javax.swing.*;
import javax.swing.table.*;
import com.toedter.calendar.JDateChooser;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import java.util.*;

public class MarkAttendance extends JFrame implements ActionListener {

    JTable table;
    JButton submit, cancel;
    JDateChooser dateChooser;
    DefaultTableModel model;
    String empId, department;

    public MarkAttendance(String empId, String department) {
        this.empId = empId;
        this.department = department;

        setTitle("Mark Attendance");
        setSize(950, 600);
        setLocationRelativeTo(null);
        setLayout(null);
        getContentPane().setBackground(new Color(245, 250, 255));

        JLabel heading = new JLabel("Mark Attendance");
        heading.setBounds(320, 10, 400, 40);
        heading.setFont(new Font("Tahoma", Font.BOLD, 28));
        heading.setForeground(new Color(0, 51, 102));
        add(heading);

        JLabel dateLabel = new JLabel("Select Date:");
        dateLabel.setBounds(50, 70, 120, 30);
        dateLabel.setFont(new Font("Tahoma", Font.PLAIN, 18));
        add(dateLabel);

        dateChooser = new JDateChooser();
        dateChooser.setBounds(180, 70, 180, 30);
        dateChooser.setFont(new Font("Tahoma", Font.PLAIN, 14));
        add(dateChooser);

        model = new DefaultTableModel(new String[]{"Roll No", "Name", "Course", "Branch", "Status"}, 0) {
            public boolean isCellEditable(int row, int column) {
                return column == 4;
            }
        };

        table = new JTable(model);
        table.setRowHeight(35);
        table.setFont(new Font("Tahoma", Font.PLAIN, 14));
        table.setSelectionBackground(new Color(204, 229, 255));
        table.setSelectionForeground(Color.BLACK);

        JTableHeader header = table.getTableHeader();
        header.setFont(new Font("Tahoma", Font.BOLD, 15));
        header.setBackground(new Color(0, 102, 204));
        header.setForeground(Color.WHITE);

        table.getColumnModel().getColumn(4).setCellRenderer(new RadioButtonRenderer());
        table.getColumnModel().getColumn(4).setCellEditor(new RadioButtonEditor());

        JScrollPane pane = new JScrollPane(table);
        pane.setBounds(50, 120, 830, 310);
        pane.getViewport().setBackground(Color.WHITE);
        add(pane);

        submit = new JButton("Submit / Update");
        submit.setBounds(250, 460, 180, 40);
        submit.setFont(new Font("Tahoma", Font.BOLD, 14));
        submit.setBackground(new Color(0, 153, 76));
        submit.setForeground(Color.WHITE);
        submit.addActionListener(this);
        add(submit);

        cancel = new JButton("Cancel");
        cancel.setBounds(470, 460, 180, 40);
        cancel.setFont(new Font("Tahoma", Font.BOLD, 14));
        cancel.setBackground(new Color(153, 0, 0));
        cancel.setForeground(Color.WHITE);
        cancel.addActionListener(this);
        add(cancel);

        // Default to today
        java.util.Date today = new java.util.Date();
        dateChooser.setDate(today);
        java.sql.Date sqlToday = new java.sql.Date(today.getTime());

        if (attendanceAlreadyMarked(sqlToday)) {
            loadAttendanceFromDatabase(sqlToday);
            JOptionPane.showMessageDialog(this, "Attendance already marked for today. You can update it.");
        } else {
            loadStudents();
        }

        dateChooser.getDateEditor().addPropertyChangeListener("date", evt -> {
            model.setRowCount(0);
            java.util.Date selected = dateChooser.getDate();
            if (selected != null) {
                java.sql.Date sqlDate = new java.sql.Date(selected.getTime());
                if (attendanceAlreadyMarked(sqlDate)) {
                    loadAttendanceFromDatabase(sqlDate);
                    JOptionPane.showMessageDialog(this, "Attendance already marked for this date. You can update it.");
                } else {
                    loadStudents();
                }
            }
        });

        setVisible(true);
    }

    private boolean attendanceAlreadyMarked(java.sql.Date date) {
        try {
            Connection_Class c = new Connection_Class();
            String query = "SELECT COUNT(*) FROM attendance WHERE date = '" + date + "' AND branch = '" + department + "'";
            ResultSet rs = c.statement.executeQuery(query);
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private void loadStudents() {
        try {
            Connection_Class c = new Connection_Class();
            ResultSet rs = c.statement.executeQuery("SELECT * FROM student WHERE branch = '" + department + "'");
            while (rs.next()) {
                model.addRow(new Object[]{
                        rs.getString("rollno"),
                        rs.getString("name"),
                        rs.getString("course"),
                        rs.getString("branch"),
                        "Present"
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void loadAttendanceFromDatabase(java.sql.Date date) {
        try {
            Connection_Class c = new Connection_Class();
            String query = "SELECT * FROM attendance WHERE date = '" + date + "' AND branch = '" + department + "'";
            ResultSet rs = c.statement.executeQuery(query);
            while (rs.next()) {
                model.addRow(new Object[]{
                        rs.getString("rollno"),
                        rs.getString("name"),
                        rs.getString("course"),
                        rs.getString("branch"),
                        rs.getString("status")
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == submit) {
            java.util.Date selectedDate = dateChooser.getDate();
            if (selectedDate == null) {
                JOptionPane.showMessageDialog(this, "Please select a date.");
                return;
            }

            java.sql.Date sqlDate = new java.sql.Date(selectedDate.getTime());

            try {
                Connection_Class c = new Connection_Class();
                String deleteQuery = "DELETE FROM attendance WHERE date = '" + sqlDate + "' AND branch = '" + department + "'";
                c.statement.executeUpdate(deleteQuery);

                for (int i = 0; i < model.getRowCount(); i++) {
                    String rollno = (String) model.getValueAt(i, 0);
                    String name = (String) model.getValueAt(i, 1);
                    String course = (String) model.getValueAt(i, 2);
                    String branch = (String) model.getValueAt(i, 3);
                    String status = (String) model.getValueAt(i, 4);

                    String query = "INSERT INTO attendance(date, rollno, name, course, branch, status) VALUES('" +
                            sqlDate + "', '" + rollno + "', '" + name + "', '" + course + "', '" + branch + "', '" + status + "')";
                    c.statement.executeUpdate(query);
                }

                JOptionPane.showMessageDialog(this, "Attendance submitted/updated successfully.");
                setVisible(false);
            } catch (Exception e) {
                e.printStackTrace();
            }

        } else {
            setVisible(false);
        }
    }

    class RadioButtonRenderer extends JPanel implements TableCellRenderer {
        JRadioButton present = new JRadioButton("Present");
        JRadioButton absent = new JRadioButton("Absent");
        ButtonGroup group = new ButtonGroup();

        public RadioButtonRenderer() {
            setLayout(new FlowLayout(FlowLayout.LEFT));
            present.setForeground(new Color(0, 102, 0));
            absent.setForeground(new Color(153, 0, 0));
            group.add(present);
            group.add(absent);
            add(present);
            add(absent);
        }

        public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
            if ("Absent".equals(value)) {
                absent.setSelected(true);
            } else {
                present.setSelected(true);
            }
            return this;
        }
    }

    class RadioButtonEditor extends AbstractCellEditor implements TableCellEditor {
        JPanel panel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        JRadioButton present = new JRadioButton("Present");
        JRadioButton absent = new JRadioButton("Absent");
        ButtonGroup group = new ButtonGroup();
        String selectedValue = "Present";

        RadioButtonEditor() {
            present.setForeground(new Color(0, 102, 0));
            absent.setForeground(new Color(153, 0, 0));
            group.add(present);
            group.add(absent);
            panel.add(present);
            panel.add(absent);

            ActionListener listener = e -> {
                selectedValue = ((JRadioButton) e.getSource()).getText();
                stopCellEditing();
            };

            present.addActionListener(listener);
            absent.addActionListener(listener);
        }

        public Component getTableCellEditorComponent(JTable table, Object value, boolean isSelected, int row, int column) {
            if ("Absent".equals(value)) {
                absent.setSelected(true);
                selectedValue = "Absent";
            } else {
                present.setSelected(true);
                selectedValue = "Present";
            }
            return panel;
        }

        public Object getCellEditorValue() {
            return selectedValue;
        }
    }
}
