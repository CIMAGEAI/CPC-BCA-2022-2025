<?php
session_start();
header('Content-Type: application/json');
$email = $_POST['email'] ?? '';
$otp = $_POST['otp'] ?? '';
if (empty($email) || empty($otp)) {
    echo json_encode(['success' => false, 'message' => 'Email and OTP are required.']);
    exit;
}
if (isset($_SESSION['otp_' . $email]) && $_SESSION['otp_' . $email] == $otp) {
    unset($_SESSION['otp_' . $email]);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Incorrect OTP. Please try again.']);
} 