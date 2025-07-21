<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $booking_id = $_POST['booking_id'] ?? '';
    $status = $_POST['status'] ?? '';

    // Validate required fields
    if (empty($booking_id) || empty($status)) {
        echo "Error: Booking ID and status are required";
        exit;
    }

    // Validate status
    $allowed_statuses = ['Pending', 'Started', 'Completed', 'Rejected', 'Delivered', 'Cancelled'];
    if (!in_array($status, $allowed_statuses)) {
        echo "Error: Invalid status";
        exit;
    }

    // Check if amount is provided and status is Delivered
    $amount = isset($_POST['amount']) ? $_POST['amount'] : null;
    if ($status === 'Delivered' && $amount !== null) {
        $sql = "UPDATE bookings SET status = ?, amount = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sii", $status, $amount, $booking_id);
    } else {
        $sql = "UPDATE bookings SET status = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $booking_id);
    }

    // Execute the statement
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "Booking status updated successfully!";
        } else {
            echo "No booking found with ID: " . $booking_id;
        }
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close statement
    $stmt->close();
} else {
    echo "Invalid request method";
}

// Close connection
$conn->close();
?> 