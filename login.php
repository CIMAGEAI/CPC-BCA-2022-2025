<?php
session_start();
include 'connect.php';

// 🚫 If accessed without POST (like directly from browser), block with a friendly message
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  echo "<h3>⚠️ Access Denied!</h3><p>Please login through the login form.</p>";
  exit;
}

$email = $_POST["email"];
$password = $_POST["password"];

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
  $user = $result->fetch_assoc();

  if (password_verify($password, $user['password'])) {
    $_SESSION["user"] = $user["name"];
    echo "<script>alert('Login successful'); window.location.href='../grocify_user/index.html';</script>";
  } else {
    echo "<script>alert('Incorrect password'); history.back();</script>";
  }
} else {
  echo "<script>alert('Email not found'); history.back();</script>";
}

$stmt->close();
$conn->close();
?>
