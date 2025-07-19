<?php
include 'config.php';

header('Content-Type: application/json');

$roomType = $_POST['roomType'] ?? '';
$checkin = $_POST['checkin'] ?? '';
$checkout = $_POST['checkout'] ?? '';

$bookedRooms = [];

if (!empty($roomType) && !empty($checkin) && !empty($checkout)) {
    // Get rooms that are booked during the selected dates
    $query = "SELECT room_number FROM allotted_rooms 
              WHERE room_type = ? 
              AND booked_status = TRUE 
              AND (
                  (booking_date <= ? AND checkout_date >= ?) OR
                  (booking_date <= ? AND checkout_date >= ?) OR
                  (booking_date >= ? AND checkout_date <= ?)
              )";
    
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "sssssss", 
        $roomType, 
        $checkout, $checkin,  // Check for date range overlap
        $checkin, $checkout,  // Check for date range overlap
        $checkin, $checkout   // Check for dates completely within range
    );
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    while ($row = mysqli_fetch_assoc($result)) {
        $bookedRooms[] = $row['room_number'];
    }
}

echo json_encode(['bookedRooms' => $bookedRooms]);
?>