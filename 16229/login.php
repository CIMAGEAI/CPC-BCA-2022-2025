<?php
include 'config.php';
header('Content-Type: application/json');

$email = isset($_POST['email']) ? strtolower(trim($_POST['email'])) : '';
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

$stmt = $conn->prepare('SELECT fullName, email, mobile, password FROM users WHERE LOWER(email) = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        // Remove password from response
        unset($row['password']);
        echo json_encode(['success' => true, 'user' => $row]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
}
$stmt->close();
$conn->close(); 