<?php
include 'config.php';
$result = $conn->query("SELECT * FROM bookings ORDER BY id DESC");
if ($result && $result->num_rows > 0) {
    echo "<h2>Bookings:</h2><table border='1'><tr><th>ID</th><th>Name</th><th>Mobile</th><th>Bike Model</th><th>Status</th></tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr><td>{$row['id']}</td><td>{$row['name']}</td><td>{$row['mobile']}</td><td>{$row['bike_model']}</td><td>{$row['status']}</td></tr>";
    }
    echo "</table>";
} else {
    echo "No bookings found.";
}
$conn->close();
?> 