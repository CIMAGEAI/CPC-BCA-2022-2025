<?php
$servername = "localhost";
$username = "root"; // change if needed
$password = "";     // change if you have a DB password
$dbname = "grocify"; // make sure your DB is named this

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
