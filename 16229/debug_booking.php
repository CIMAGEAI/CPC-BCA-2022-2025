<?php
include 'config.php';

echo "<h1>Debug Booking System</h1>";

// Test database connection
echo "<h2>Database Connection Test</h2>";
if ($conn->connect_error) {
    echo "❌ Connection failed: " . $conn->connect_error;
} else {
    echo "✅ Database connected successfully<br>";
    echo "Database: " . $database . "<br>";
}

// Check if bookings table exists
echo "<h2>Table Structure</h2>";
$result = $conn->query("SHOW TABLES LIKE 'bookings'");
if ($result->num_rows > 0) {
    echo "✅ Bookings table exists<br>";
    
    // Show table structure
    $structure = $conn->query("DESCRIBE bookings");
    echo "<h3>Bookings Table Structure:</h3>";
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
} else {
    echo "❌ Bookings table does not exist<br>";
}

// Check existing bookings
echo "<h2>Existing Bookings</h2>";
$bookings = $conn->query("SELECT * FROM bookings ORDER BY id DESC LIMIT 10");
if ($bookings->num_rows > 0) {
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><th>ID</th><th>Name</th><th>Mobile</th><th>Company</th><th>Model</th><th>Reg No</th><th>Token</th><th>Status</th><th>User Email</th></tr>";
    while ($row = $bookings->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . $row['name'] . "</td>";
        echo "<td>" . $row['mobile'] . "</td>";
        echo "<td>" . $row['company'] . "</td>";
        echo "<td>" . $row['bike_model'] . "</td>";
        echo "<td>" . $row['regno'] . "</td>";
        echo "<td>" . $row['token'] . "</td>";
        echo "<td>" . ($row['status'] ?? 'Pending') . "</td>";
        echo "<td>" . ($row['user_email'] ?? 'N/A') . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "No bookings found in database<br>";
}

// Test booking submission
echo "<h2>Test Booking Submission</h2>";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "<h3>Received POST Data:</h3>";
    echo "<pre>";
    print_r($_POST);
    echo "</pre>";
    
    // Simulate the booking submission
    $name = $_POST['name'] ?? 'Test User';
    $mobile = $_POST['mobile'] ?? '1234567890';
    $bike_model = $_POST['bike_model'] ?? 'Test Model';
    $regno = $_POST['regno'] ?? 'TEST123';
    $address = $_POST['address'] ?? 'Test Address';
    $problem = $_POST['problem'] ?? 'Test Problem';
    $company = $_POST['company'] ?? 'Test Company';
    $token = $_POST['token'] ?? 'TEST' . rand(1000, 9999);
    $service_date = $_POST['service_date'] ?? date('Y-m-d');
    $user_email = $_POST['user_email'] ?? 'test@example.com';
    
    // Check if user_email column exists
    $check_column = $conn->query("SHOW COLUMNS FROM bookings LIKE 'user_email'");
    
    if ($check_column->num_rows > 0) {
        $sql = "INSERT INTO bookings (name, mobile, bike_model, regno, address, problem, company, token, service_date, user_email, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssssss", $name, $mobile, $bike_model, $regno, $address, $problem, $company, $token, $service_date, $user_email);
    } else {
        $sql = "INSERT INTO bookings (name, mobile, bike_model, regno, address, problem, company, token, service_date, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssssss", $name, $mobile, $bike_model, $regno, $address, $problem, $company, $token, $service_date);
    }
    
    if ($stmt->execute()) {
        $booking_id = $conn->insert_id;
        echo "<div style='color: green; font-weight: bold;'>✅ Test booking inserted successfully! ID: " . $booking_id . "</div>";
    } else {
        echo "<div style='color: red; font-weight: bold;'>❌ Error inserting test booking: " . $stmt->error . "</div>";
    }
    
    $stmt->close();
}

// Show test form
echo "<h2>Test Booking Form</h2>";
echo "<form method='POST' style='border: 1px solid #ccc; padding: 20px; margin: 20px 0;'>";
echo "<div style='margin: 10px 0;'>";
echo "<label>Name: </label><input type='text' name='name' value='Test User' required><br>";
echo "</div>";
echo "<div style='margin: 10px 0;'>";
echo "<label>Mobile: </label><input type='text' name='mobile' value='1234567890' required><br>";
echo "</div>";
echo "<div style='margin: 10px 0;'>";
echo "<label>Company: </label><input type='text' name='company' value='Test Company' required><br>";
echo "</div>";
echo "<div style='margin: 10px 0;'>";
echo "<label>Model: </label><input type='text' name='bike_model' value='Test Model' required><br>";
echo "</div>";
echo "<div style='margin: 10px 0;'>";
echo "<label>Reg No: </label><input type='text' name='regno' value='TEST123' required><br>";
echo "</div>";
echo "<div style='margin: 10px 0;'>";
echo "<label>Address: </label><input type='text' name='address' value='Test Address' required><br>";
echo "</div>";
echo "<div style='margin: 10px 0;'>";
echo "<label>Problem: </label><input type='text' name='problem' value='Test Problem' required><br>";
echo "</div>";
echo "<div style='margin: 10px 0;'>";
echo "<label>Token: </label><input type='text' name='token' value='TEST" . rand(1000, 9999) . "' required><br>";
echo "</div>";
echo "<div style='margin: 10px 0;'>";
echo "<label>Service Date: </label><input type='date' name='service_date' value='" . date('Y-m-d') . "' required><br>";
echo "</div>";
echo "<div style='margin: 10px 0;'>";
echo "<label>User Email: </label><input type='email' name='user_email' value='test@example.com' required><br>";
echo "</div>";
echo "<button type='submit' style='background: #007cba; color: white; padding: 10px 20px; border: none; cursor: pointer;'>Submit Test Booking</button>";
echo "</form>";

$conn->close();
?> 