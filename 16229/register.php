<?php
include 'config.php';
header('Content-Type: application/json');

$fullName = isset($_POST['fullName']) ? trim($_POST['fullName']) : '';
$email = isset($_POST['email']) ? strtolower(trim($_POST['email'])) : '';
$mobile = isset($_POST['mobile']) ? trim($_POST['mobile']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (empty($fullName) || empty($email) || empty($mobile) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

// Check for duplicate email
$stmt = $conn->prepare('SELECT id FROM users WHERE LOWER(email) = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'An account with this email already exists. Please login or use a different email.']);
    exit;
}
$stmt->close();

// Check for duplicate mobile
$stmt = $conn->prepare('SELECT id FROM users WHERE mobile = ?');
$stmt->bind_param('s', $mobile);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'An account with this mobile number already exists. Please login or use a different mobile number.']);
    exit;
}
$stmt->close();

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$stmt = $conn->prepare('INSERT INTO users (fullName, email, mobile, password) VALUES (?, ?, ?, ?)');
$stmt->bind_param('ssss', $fullName, $email, $mobile, $hashedPassword);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
}
$stmt->close();
$conn->close(); 