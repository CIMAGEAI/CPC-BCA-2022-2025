<?php
require 'config.php';  // Database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';

    // Validate required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo "<script>alert('Please fill in all fields.'); window.history.back();</script>";
        exit;
    }

    // Prepare SQL query to insert comment
    $stmt = $conn->prepare("INSERT INTO comments (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $subject, $message);

    if ($stmt->execute()) {
        echo "<script>alert('Thank you for your message! We will get back to you soon.'); window.location.href='thankyou.php';</script>";
    } else {
        echo "<script>alert('Error submitting your message. Please try again later.'); window.history.back();</script>";
    }

    $stmt->close();
    $conn->close();
}
?>