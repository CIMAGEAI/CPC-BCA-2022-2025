<?php
// Include database configuration
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate and sanitize input
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $register_id = $conn->real_escape_string($_POST['register_id']);
    $full_name = $conn->real_escape_string($_POST['full_name']);
    $razorpay_payment_id = $conn->real_escape_string($_POST['razorpay_payment_id']);

    // Validate required fields
    if (empty($id) || empty($register_id) || empty($full_name) || empty($razorpay_payment_id)) {
        die("All fields are required");
    }

    // Use prepared statement to prevent SQL injection
    $stmt = $conn->prepare("UPDATE payments SET register_id=?, full_name=?, razorpay_payment_id=? WHERE id=?");
    $stmt->bind_param("sssi", $register_id, $full_name, $razorpay_payment_id, $id);
    
    if ($stmt->execute()) {
        header("Location: paymenthistry.php");
        exit();
    } else {
        error_log("Error updating record: " . $stmt->error);
        die("An error occurred while updating the record. Please try again.");
    }
    
    $stmt->close();
}

$conn->close();
?>