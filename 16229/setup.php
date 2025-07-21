<?php
// Setup script for Bike Booking System
echo "<h1>🚀 Bike Booking System Setup</h1>";
echo "<p>This script will set up your database and ensure everything is working correctly.</p>";

// Include config
include 'config.php';

echo "<h2>📊 Database Connection Test</h2>";
if ($conn->connect_error) {
    echo "❌ <strong>Database Connection Failed:</strong> " . $conn->connect_error . "<br>";
    echo "Please check your XAMPP MySQL service is running and config.php has correct settings.<br>";
    exit;
} else {
    echo "✅ <strong>Database Connected Successfully!</strong><br>";
    echo "Database: " . $database . "<br>";
}

// Create bookings table if it doesn't exist
echo "<h2>🗄️ Database Table Setup</h2>";
$result = $conn->query("SHOW TABLES LIKE 'bookings'");
if ($result->num_rows == 0) {
    echo "📝 Creating bookings table...<br>";
    
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
        echo "✅ Bookings table created successfully!<br>";
    } else {
        echo "❌ Error creating table: " . $conn->error . "<br>";
    }
} else {
    echo "✅ Bookings table already exists<br>";
}

// Check if user_email column exists
$check_column = $conn->query("SHOW COLUMNS FROM bookings LIKE 'user_email'");
if ($check_column->num_rows == 0) {
    echo "📝 Adding user_email column...<br>";
    
    $sql = "ALTER TABLE bookings ADD COLUMN user_email VARCHAR(255) AFTER service_date";
    if ($conn->query($sql) === TRUE) {
        echo "✅ user_email column added successfully!<br>";
    } else {
        echo "❌ Error adding column: " . $conn->error . "<br>";
    }
} else {
    echo "✅ user_email column already exists<br>";
}

// Create users table if it doesn't exist
echo "<h2>👥 Users Table Setup</h2>";
$result = $conn->query("SHOW TABLES LIKE 'users'");
if ($result->num_rows == 0) {
    echo "📝 Creating users table...<br>";
    
    $sql = "CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($sql) === TRUE) {
        echo "✅ Users table created successfully!<br>";
    } else {
        echo "❌ Error creating users table: " . $conn->error . "<br>";
    }
} else {
    echo "✅ Users table already exists<br>";
}

// Create contacts table if it doesn't exist
echo "<h2>📞 Contacts Table Setup</h2>";
$result = $conn->query("SHOW TABLES LIKE 'contacts'");
if ($result->num_rows == 0) {
    echo "📝 Creating contacts table...<br>";
    
    $sql = "CREATE TABLE contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($sql) === TRUE) {
        echo "✅ Contacts table created successfully!<br>";
    } else {
        echo "❌ Error creating contacts table: " . $conn->error . "<br>";
    }
} else {
    echo "✅ Contacts table already exists<br>";
}

// Test booking insertion
echo "<h2>🧪 Test Booking Insertion</h2>";
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
    
    // Delete test booking
    $delete_sql = "DELETE FROM bookings WHERE id = ?";
    $delete_stmt = $conn->prepare($delete_sql);
    $delete_stmt->bind_param("i", $booking_id);
    $delete_stmt->execute();
    echo "✅ Test booking cleaned up<br>";
} else {
    echo "❌ Error inserting test booking: " . $stmt->error . "<br>";
}

$stmt->close();

// Show final table structure
echo "<h2>📋 Final Database Structure</h2>";
$tables = ['bookings', 'users', 'contacts'];
foreach ($tables as $table) {
    echo "<h3>$table Table:</h3>";
    $structure = $conn->query("DESCRIBE $table");
    echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
    echo "<tr style='background: #f0f0f0;'><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
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
}

$conn->close();

echo "<h2>🎉 Setup Complete!</h2>";
echo "<p><strong>Your Bike Booking System is now ready to use!</strong></p>";
echo "<p>✅ Database tables created</p>";
echo "<p>✅ All necessary columns added</p>";
echo "<p>✅ Test booking functionality verified</p>";
echo "<br>";
echo "<p><strong>Next Steps:</strong></p>";
echo "<ol>";
echo "<li>Open <a href='index.html' style='color: #007cba;'>index.html</a> in your browser</li>";
echo "<li>Register a new account</li>";
echo "<li>Login and try booking a service</li>";
echo "<li>Check the admin panel at <a href='admin.php' style='color: #007cba;'>admin.php</a></li>";
echo "</ol>";
echo "<br>";
echo "<p style='color: #666;'>If you encounter any issues, check the browser console (F12) for error messages.</p>";
?> 