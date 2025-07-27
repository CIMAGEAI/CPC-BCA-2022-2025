<?php
session_start();
require 'config.php';  // Database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $password = trim($_POST['password'] ?? '');

    // Basic validation
    if (empty($email) || empty($password)) {
        $_SESSION['error'] = "Please fill in all required fields.";
        header("Location: login.php");
        exit;
    }

    // Check if email is valid
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "Invalid email format.";
        header("Location: login.php");
        exit;
    }

    // Fetch user from the database
    $stmt = $conn->prepare("SELECT id, name, email, password FROM registration WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];

            // Redirect to dashboard
            header("Location: sury.php");
            exit;
        } else {
            $_SESSION['error'] = "Invalid password!";
            header("Location: login.php");
            exit;
        }
    } else {
        $_SESSION['error'] = "No user found with this email!";
        header("Location: login.php");
        exit;
    }

    $stmt->close();
    $conn->close();
}
?>