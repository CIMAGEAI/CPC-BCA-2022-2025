<?php
include 'config.php';

echo "<h2>Database Check</h2>";

// Check if bookings table exists
$result = $conn->query("SHOW TABLES LIKE 'bookings'");
if ($result->num_rows > 0) {
    echo "<p>✅ Bookings table exists</p>";
    
    // Check table structure
    $result = $conn->query("DESCRIBE bookings");
    echo "<h3>Table Structure:</h3>";
    echo "<table border='1'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['Field'] . "</td>";
        echo "<td>" . $row['Type'] . "</td>";
        echo "<td>" . $row['Null'] . "</td>";
        echo "<td>" . $row['Key'] . "</td>";
        echo "<td>" . $row['Default'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    // Check if user_email column exists
    $result = $conn->query("SHOW COLUMNS FROM bookings LIKE 'user_email'");
    if ($result->num_rows > 0) {
        echo "<p>✅ user_email column exists</p>";
    } else {
        echo "<p>❌ user_email column does not exist</p>";
        echo "<p>Run this SQL: ALTER TABLE bookings ADD COLUMN user_email VARCHAR(100) AFTER name;</p>";
    }
    
    // Show all bookings
    $result = $conn->query("SELECT * FROM bookings ORDER BY id DESC LIMIT 10");
    echo "<h3>Recent Bookings:</h3>";
    if ($result->num_rows > 0) {
        echo "<table border='1'>";
        echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Status</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['id'] . "</td>";
            echo "<td>" . htmlspecialchars($row['name']) . "</td>";
            echo "<td>" . htmlspecialchars($row['user_email'] ?? 'NULL') . "</td>";
            echo "<td>" . htmlspecialchars($row['mobile']) . "</td>";
            echo "<td>" . htmlspecialchars($row['status'] ?? 'Pending') . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>No bookings found</p>";
    }
} else {
    echo "<p>❌ Bookings table does not exist</p>";
}

$conn->close();
?> 