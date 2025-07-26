<?php
include 'config.php';

echo "<h2>Database Test</h2>";

// Check if bookings table exists
$result = $conn->query("SHOW TABLES LIKE 'bookings'");
if ($result->num_rows > 0) {
    echo "<p>✅ Bookings table exists</p>";
    
    // Show table structure
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
    
    // Show all bookings
    $result = $conn->query("SELECT * FROM bookings ORDER BY id DESC");
    echo "<h3>All Bookings (" . $result->num_rows . "):</h3>";
    if ($result->num_rows > 0) {
        echo "<table border='1'>";
        echo "<tr><th>ID</th><th>Name</th><th>Mobile</th><th>Bike Model</th><th>Status</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['id'] . "</td>";
            echo "<td>" . htmlspecialchars($row['name']) . "</td>";
            echo "<td>" . htmlspecialchars($row['mobile']) . "</td>";
            echo "<td>" . htmlspecialchars($row['bike_model']) . "</td>";
            echo "<td>" . htmlspecialchars($row['status'] ?? 'Pending') . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>No bookings found in database</p>";
    }
} else {
    echo "<p>❌ Bookings table does not exist</p>";
}

$conn->close();
?> 