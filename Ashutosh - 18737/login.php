<?php
include 'db.php';

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT password FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($hashed);
if ($stmt->fetch() && password_verify($password, $hashed)) {
    echo "Login successful!";
} else {
    echo "Invalid credentials!";
}
$conn->close();
?>
