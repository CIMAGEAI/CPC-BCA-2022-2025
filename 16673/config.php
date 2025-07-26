<?php
$servername = "localhost";  // Change if your server is different
$username = "root";         // Your database username
$password = "";             // Your database password
$dbname = "hotal_man(1)"; 
$port=3306 ;    // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname,$port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>