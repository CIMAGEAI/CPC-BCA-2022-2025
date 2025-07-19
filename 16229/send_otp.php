<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_error.log');
error_reporting(E_ALL);
include 'config.php';
header('Content-Type: application/json');

// PHPMailer setup
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';
require_once __DIR__ . '/PHPMailer/Exception.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}

$email = isset($_POST['email']) ? strtolower(trim($_POST['email'])) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
if (empty($email) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Email and phone are required.']);
    exit;
}
// Check user exists (case-insensitive, trimmed)
$stmt = $conn->prepare('SELECT * FROM users WHERE LOWER(email) = ? AND TRIM(mobile) = ?');
$stmt->bind_param('ss', $email, $phone);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'No account found. Please create a new account.']);
    exit;
}
// Generate OTP
$otp = rand(100000, 999999);
session_start();
$_SESSION['otp_' . $email] = $otp;

// Send OTP using PHPMailer
$mail = new PHPMailer(true);
try {
    // SMTP config (replace with your real credentials)
    // 1. Enable 2-Step Verification on your Google Account
    // 2. Go to https://myaccount.google.com/apppasswords
    // 3. Generate an App Password for 'Mail' and 'Windows Computer'
    // 4. Paste your Gmail and App Password below (do NOT use your normal Gmail password)
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'himmatearth@gmail.com';
    $mail->Password = 'rvxgdasclhubofaq';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->setFrom('himmatearth@gmail.com', 'The Bike Solution');
    $mail->addAddress($email);
    $mail->Subject = 'Your OTP for Password Reset - The Bike Solution';
    $mail->Body = "Your OTP for password reset is: $otp\n\nIf you did not request this, please ignore this email.";
    $mail->send();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    error_log('Mailer Error: ' . $mail->ErrorInfo);
    echo json_encode(['success' => false, 'message' => 'Failed to send OTP email. ' . $mail->ErrorInfo]);
} 