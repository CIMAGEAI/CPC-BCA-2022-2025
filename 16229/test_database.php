<?php
include 'config.php';

echo "<h1>Database Structure Test</h1>";

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "✅ Database connected successfully<br>";

// Check if bookings table exists
$result = $conn->query("SHOW TABLES LIKE 'bookings'");
if ($result->num_rows == 0) {
    echo "❌ Bookings table does not exist. Creating it...<br>";
    
    $sql = "CREATE TABLE bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        bike_model VARCHAR(255) NOT NULL,
        regno VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        problem TEXT NOT NULL,
        company VARCHAR(255) NOT NULL,
        token VARCHAR(50) NOT NULL,
        service_date DATE NOT NULL,
        user_email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($sql) === TRUE) {
        echo "✅ Bookings table created successfully<br>";
    } else {
        echo "❌ Error creating table: " . $conn->error . "<br>";
    }
} else {
    echo "✅ Bookings table exists<br>";
}

// Check if user_email column exists
$check_column = $conn->query("SHOW COLUMNS FROM bookings LIKE 'user_email'");
if ($check_column->num_rows == 0) {
    echo "❌ user_email column does not exist. Adding it...<br>";
    
    $sql = "ALTER TABLE bookings ADD COLUMN user_email VARCHAR(255) AFTER service_date";
    if ($conn->query($sql) === TRUE) {
        echo "✅ user_email column added successfully<br>";
    } else {
        echo "❌ Error adding column: " . $conn->error . "<br>";
    }
} else {
    echo "✅ user_email column exists<br>";
}

// Show final table structure
echo "<h2>Final Table Structure:</h2>";
$structure = $conn->query("DESCRIBE bookings");
echo "<table border='1' style='border-collapse: collapse;'>";
echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
while ($row = $structure->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . $row['Field'] . "</td>";
    echo "<td>" . $row['Type'] . "</td>";
    echo "<td>" . $row['Null'] . "</td>";
    echo "<td>" . $row['Key'] . "</td>";
    echo "<td>" . $row['Default'] . "</td>";
    echo "<td>" . $row['Extra'] . "</td>";
    echo "</tr>";
}
echo "</table>";

// Test inserting a booking
echo "<h2>Test Booking Insertion</h2>";
$test_sql = "INSERT INTO bookings (name, mobile, bike_model, regno, address, problem, company, token, service_date, user_email, status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')";
$stmt = $conn->prepare($test_sql);
$name = "Test User";
$mobile = "1234567890";
$bike_model = "Test Model";
$regno = "TEST123";
$address = "Test Address";
$problem = "Test Problem";
$company = "Test Company";
$token = "TEST" . rand(1000, 9999);
$service_date = date('Y-m-d');
$user_email = "test@example.com";

$stmt->bind_param("ssssssssss", $name, $mobile, $bike_model, $regno, $address, $problem, $company, $token, $service_date, $user_email);

if ($stmt->execute()) {
    $booking_id = $conn->insert_id;
    echo "✅ Test booking inserted successfully! ID: " . $booking_id . "<br>";
    
    // Now delete the test booking
    $delete_sql = "DELETE FROM bookings WHERE id = ?";
    $delete_stmt = $conn->prepare($delete_sql);
    $delete_stmt->bind_param("i", $booking_id);
    $delete_stmt->execute();
    echo "✅ Test booking deleted<br>";
} else {
    echo "❌ Error inserting test booking: " . $stmt->error . "<br>";
}

$stmt->close();
$conn->close();

echo "<h2>Database is ready for bookings!</h2>";
?> 