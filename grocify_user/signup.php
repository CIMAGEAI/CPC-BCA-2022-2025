<?php
include 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST["name"];
  $email = $_POST["email"];
  $phone = $_POST["phone"];
  $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

  // Check if email already exists
  $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
  $check->bind_param("s", $email);
  $check->execute();
  $check->store_result();

  if ($check->num_rows > 0) {
    echo "<script>alert('Email already registered'); history.back();</script>";
    $check->close();
    $conn->close();
    exit;
  }
  $check->close();

  // Insert new user
  $stmt = $conn->prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)");
  $stmt->bind_param("ssss", $name, $email, $phone, $password);

  if ($stmt->execute()) {
    echo "<script>alert('Signup successful'); window.location.href = '../grocify_user/login.html';</script>";
  } else {
    echo "<script>alert('Signup failed: " . $conn->error . "'); history.back();</script>";
  }

  $stmt->close();
  $conn->close();
}
?>
