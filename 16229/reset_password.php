<?php
include 'config.php';
header('Content-Type: application/json');
$email = isset($_POST['email']) ? strtolower(trim($_POST['email'])) : '';
$newPassword = $_POST['newPassword'] ?? '';
if (empty($email) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Email and new password are required.']);
    exit;
}
// Hash the password for security
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
// Update password (case-insensitive email)
$stmt = $conn->prepare('UPDATE users SET password = ? WHERE LOWER(email) = ?');
$stmt->bind_param('ss', $hashedPassword, $email);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update password.']);
} 