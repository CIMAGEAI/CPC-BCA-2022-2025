<?php
include 'config.php';

// Set content type to JSON
header('Content-Type: application/json');

// Get user email from query parameter
$user_email = $_GET['email'] ?? '';

if (empty($user_email)) {
    echo json_encode([
        'success' => false,
        'message' => 'User email is required'
    ]);
    exit;
}

try {
    // First check if user_email column exists
    $check_column = $conn->query("SHOW COLUMNS FROM bookings LIKE 'user_email'");
    
    if ($check_column->num_rows > 0) {
        // user_email column exists, use it
        $sql = "SELECT * FROM bookings WHERE user_email = ? ORDER BY id DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $user_email);
    } else {
        // user_email column doesn't exist, fall back to name matching
        // Get user name from localStorage (we'll need to pass it)
        $user_name = $_GET['name'] ?? '';
        if (empty($user_name)) {
            echo json_encode([
                'success' => false,
                'message' => 'User name is required (user_email column not found)'
            ]);
            exit;
        }
        $sql = "SELECT * FROM bookings WHERE name = ? ORDER BY id DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $user_name);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
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
                'amount' => isset($row['amount']) ? $row['amount'] : null
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
        'message' => 'Database Error: ' . $e->getMessage()
    ]);
}

$stmt->close();
$conn->close();
?> 