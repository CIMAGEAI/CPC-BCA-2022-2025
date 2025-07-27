<?php
session_start();
include('./db_connect.php'); // DB Connection

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Load PHPMailer

$showLoginButton = false;
$formVisible = true;
$messageType = ''; // ✅ New: To control color (success or error)

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $tables = ['users', 'student'];
    $found = false;
    $tableName = '';

    foreach ($tables as $table) {
        $query = $conn->prepare("SELECT * FROM $table WHERE email = ?");
        $query->bind_param("s", $email);
        $query->execute();
        $result = $query->get_result();

        if ($result->num_rows > 0) {
            $found = true;
            $tableName = $table;
            break;
        }
    }

    if ($found) {
        $reset_token = bin2hex(random_bytes(16));
        $expiry_time = date("Y-m-d H:i:s", strtotime('+1 hour'));

        $update_query = $conn->prepare("UPDATE $tableName SET reset_token = ?, reset_token_expiry = ? WHERE email = ?");
        $update_query->bind_param("sss", $reset_token, $expiry_time, $email);
        $update_query->execute();

        $reset_link = "http://localhost/eval/reset_password.php?token=" . $reset_token . "&table=" . $tableName;

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'sandbox.smtp.mailtrap.io';
            $mail->SMTPAuth = true;
            $mail->Username = '5ffe5adce9b875'; // Your Mailtrap Username
            $mail->Password = '9df937a95953a3'; // Your Mailtrap Password
            $mail->Port = 2525;
            $mail->SMTPSecure = 'tls';

            $mail->setFrom('no-reply@yourwebsite.com', 'Your Website');
            $mail->addAddress($email);
            $mail->isHTML(true);
            $mail->Subject = 'Password Reset Request';
            $mail->Body = "
                <p>You requested a password reset. Click the link below:</p>
                <a href='$reset_link'>$reset_link</a>
                <p>This link will expire in 1 hour.</p>
            ";

            $mail->send();
            $_SESSION['message'] = "Password reset link sent successfully!";
            $messageType = 'success'; // ✅ Green
            $showLoginButton = true;
            $formVisible = false;
        } catch (Exception $e) {
            $_SESSION['message'] = "Email could not be sent. Error: {$mail->ErrorInfo}";
            $messageType = 'error';
        }
    } else {
        $_SESSION['message'] = "Email address not found.";
        $messageType = 'error'; // ✅ Red
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Forgot Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            background: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            width: 320px;
        }
        h2 { margin-bottom: 20px; }
        input[type="email"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
        }
        button, .back-btn {
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: block;
            margin-top: 10px;
        }
        button:hover, .back-btn:hover { background-color: #0056b3; }
        .success { color: green; margin-top: 15px; }
        .error { color: red; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Forgot Password</h2>

        <?php if ($formVisible): ?>
            <form method="POST">
                <input type="email" name="email" placeholder="Enter Email" required>
                <button type="submit">Submit</button>
            </form>
        <?php endif; ?>

        <?php
        if (isset($_SESSION['message'])) {
            $class = ($messageType == 'success') ? 'success' : 'error';
            echo "<p class='$class'>{$_SESSION['message']}</p>";
            if ($showLoginButton) {
                echo '<a href="login.php" class="back-btn">Back to Login</a>';
            }
            unset($_SESSION['message']);
        }
        ?>
    </div>
</body>
</html>
