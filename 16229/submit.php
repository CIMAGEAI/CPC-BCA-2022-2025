<?php
include 'config.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set JSON header
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Log received data
    error_log("Received POST data: " . print_r($_POST, true));
    
    // Get form data
    $name = $_POST['name'] ?? '';
    $mobile = $_POST['mobile'] ?? '';
    $bike_model = $_POST['bike_model'] ?? '';
    $regno = $_POST['regno'] ?? '';
    $address = $_POST['address'] ?? '';
    $problem = $_POST['problem'] ?? '';
    $company = $_POST['company'] ?? '';
    $token = $_POST['token'] ?? '';
    $service_date = $_POST['service_date'] ?? '';
    $user_email = $_POST['user_email'] ?? '';

    // Log individual fields
    error_log("Name: $name, Mobile: $mobile, Bike Model: $bike_model, Reg No: $regno, Address: $address, Problem: $problem, Company: $company, Token: $token, Service Date: $service_date, User Email: $user_email");

    // Validate required fields
    if (empty($name) || empty($mobile) || empty($bike_model) || empty($regno) || empty($address) || empty($problem) || empty($company) || empty($token) || empty($service_date)) {
        echo json_encode([
            'success' => false,
            'message' => 'Error: All fields are required'
        ]);
        exit;
    }

    // Check if user_email column exists
    $check_column = $conn->query("SHOW COLUMNS FROM bookings LIKE 'user_email'");
    
    if ($check_column->num_rows > 0) {
        // user_email column exists
        $sql = "INSERT INTO bookings (name, mobile, bike_model, regno, address, problem, company, token, service_date, user_email, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode([
                'success' => false,
                'message' => 'Error preparing statement: ' . $conn->error
            ]);
            exit;
        }
        $stmt->bind_param("ssssssssss", $name, $mobile, $bike_model, $regno, $address, $problem, $company, $token, $service_date, $user_email);
    } else {
        // user_email column doesn't exist, insert without it
        $sql = "INSERT INTO bookings (name, mobile, bike_model, regno, address, problem, company, token, service_date, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode([
                'success' => false,
                'message' => 'Error preparing statement: ' . $conn->error
            ]);
            exit;
        }
        $stmt->bind_param("sssssssss", $name, $mobile, $bike_model, $regno, $address, $problem, $company, $token, $service_date);
    }

    // Execute the statement
    if ($stmt->execute()) {
        $booking_id = $conn->insert_id;
        error_log("Booking saved successfully with ID: $booking_id");
        echo json_encode([
            'success' => true,
            'message' => 'Booking saved successfully!',
            'booking_id' => $booking_id
        ]);
    } else {
        error_log("Error saving booking: " . $stmt->error);
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $stmt->error
        ]);
    }

    // Close statement
    $stmt->close();
} else {
    echo "Invalid request method";
}

// Close connection
$conn->close();
?>
