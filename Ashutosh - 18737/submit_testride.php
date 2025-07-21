<?php
include 'db.php';

$name = $_POST['name'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$day = $_POST['day'];
$date = $_POST['date'];
$time = $_POST['time'];
$bike = $_POST['bike'];

$sql = "INSERT INTO test_rides (name, phone, email, day, date, time, bike) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $name, $phone, $email, $day, $date, $time, $bike);
if ($stmt->execute()) {
    echo "Test ride booked successfully!";
} else {
    echo "Error: " . $stmt->error;
}
$conn->close();
?>
