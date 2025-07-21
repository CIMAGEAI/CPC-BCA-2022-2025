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

echo json_encode([
    'success' => true,
    'debug_info' => [
        'user_email' => $user_email,
        'table_exists' => false,
        'column_exists' => false,
        'bookings_found' => 0
    ]
]);

// Check if bookings table exists
$result = $conn->query("SHOW TABLES LIKE 'bookings'");
if ($result->num_rows > 0) {
    echo json_encode([
        'success' => true,
        'debug_info' => [
            'user_email' => $user_email,
            'table_exists' => true,
            'column_exists' => false,
            'bookings_found' => 0
        ]
    ]);
    
    // Check if user_email column exists
    $result = $conn->query("SHOW COLUMNS FROM bookings LIKE 'user_email'");
    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => true,
            'debug_info' => [
                'user_email' => $user_email,
                'table_exists' => true,
                'column_exists' => true,
                'bookings_found' => 0
            ]
        ]);
        
        // Count bookings for this user
        $sql = "SELECT COUNT(*) as count FROM bookings WHERE user_email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $user_email);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'debug_info' => [
                'user_email' => $user_email,
                'table_exists' => true,
                'column_exists' => true,
                'bookings_found' => $row['count']
            ]
        ]);
    }
}

$conn->close();
?> 