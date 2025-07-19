<?php
include 'config.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type to JSON
header('Content-Type: application/json');

try {
    // Fetch all bookings from database
    $sql = "SELECT * FROM bookings ORDER BY id DESC";
    $result = $conn->query($sql);
    if (!$result) {
        echo json_encode([
            'success' => false,
            'message' => 'MySQL Error: ' . $conn->error
        ]);
        exit;
    }
    $bookings = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $bookings[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'mobile' => $row['mobile'],
                'bike_model' => $row['bike_model'],
                'regno' => $row['regno'],
                'address' => $row['address'],
                'problem' => $row['problem'],
                'company' => $row['company'],
                'token' => $row['token'],
                'service_date' => $row['service_date'],
                'status' => $row['status'] ?? 'Pending',
                'created_at' => $row['created_at'],
                'amount' => $row['amount'] ?? null
            ];
        }
    }
    echo json_encode([
        'success' => true,
        'bookings' => $bookings,
        'total' => count($bookings)
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'PHP Exception: ' . $e->getMessage()
    ]);
}

$conn->close();
?> 