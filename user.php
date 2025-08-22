<?php
require_once __DIR__ . '/../config/db.php';

function loginUser($email, $password) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        return $user;
    }

    return false;
}

function registerUser($name, $email, $password) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        return "Email already exists!";
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $insert = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    if ($insert->execute([$name, $email, $hashedPassword])) {
        return true;
    }
    return "Registration failed.";
}
?>