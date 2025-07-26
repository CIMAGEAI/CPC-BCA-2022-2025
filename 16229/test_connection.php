<?php
// Simple connection test
echo "<h1>🔧 Connection Test</h1>";

// Test 1: PHP is working
echo "<h2>✅ PHP Test</h2>";
echo "PHP is working! Version: " . phpversion() . "<br>";

// Test 2: Database connection
echo "<h2>🗄️ Database Test</h2>";
include 'config.php';

if ($conn->connect_error) {
    echo "❌ Database connection failed: " . $conn->connect_error . "<br>";
    echo "Please check:<br>";
    echo "- XAMPP MySQL is running<br>";
    echo "- Database name in config.php is correct<br>";
    echo "- Username/password in config.php are correct<br>";
} else {
    echo "✅ Database connected successfully!<br>";
    echo "Database: " . $database . "<br>";
}

// Test 3: Check if bookings table exists
echo "<h2>📋 Table Test</h2>";
$result = $conn->query("SHOW TABLES LIKE 'bookings'");
if ($result->num_rows > 0) {
    echo "✅ Bookings table exists<br>";
    
    // Count bookings
    $count = $conn->query("SELECT COUNT(*) as total FROM bookings");
    $row = $count->fetch_assoc();
    echo "Total bookings in database: " . $row['total'] . "<br>";
} else {
    echo "❌ Bookings table does not exist<br>";
    echo "Please run setup.php first<br>";
}

// Test 4: Test POST data
echo "<h2>📤 POST Data Test</h2>";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "✅ POST data received:<br>";
    echo "<pre>";
    print_r($_POST);
    echo "</pre>";
} else {
    echo "ℹ️ No POST data received (this is normal for GET requests)<br>";
}

// Test 5: File permissions
echo "<h2>📁 File Test</h2>";
$files_to_check = ['submit.php', 'config.php', 'get_user_bookings.php'];
foreach ($files_to_check as $file) {
    if (file_exists($file)) {
        echo "✅ $file exists<br>";
    } else {
        echo "❌ $file missing<br>";
    }
}

$conn->close();
echo "<h2>🎯 Next Steps</h2>";
echo "<p>If all tests pass, try making a booking again.</p>";
echo "<p>If any test fails, fix the issue and try again.</p>";
?> 