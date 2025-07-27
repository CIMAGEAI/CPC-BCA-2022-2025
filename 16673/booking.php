<?php
session_start();
include 'config.php'; // Include database connection

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: signup.php");
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $check_in = $_POST['check_in'];
    $check_out = $_POST['check_out'];
    $guests = $_POST['guests'];
    $user_id = $_SESSION['user_id']; // Get logged-in user's ID

    // Insert into booking table
    $sql = "INSERT INTO booking (id, check_in, check_out, guests) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issi", $user_id, $check_in, $check_out, $guests);

    if ($stmt->execute()) {
        echo "<script>alert('Booking Successful!'); window.location.href='sury1.php';</script>";
    } else {
        echo "<script>alert('Error: " . $stmt->error . "');</script>";
    }

    $stmt->close();
    $conn->close();
}
?>