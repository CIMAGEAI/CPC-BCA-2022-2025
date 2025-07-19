<?php
session_start();
include('./db_connect.php');

$messageType = ''; // success or error
$formVisible = true;

if (isset($_GET['token']) && isset($_GET['table'])) {
    $token = $_GET['token'];
    $table = $_GET['table'];

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $new_password = password_hash($_POST['password'], PASSWORD_DEFAULT);

        // Validate token and update password
        $stmt = $conn->prepare("SELECT * FROM $table WHERE reset_token = ? AND reset_token_expiry > NOW()");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $update = $conn->prepare("UPDATE $table SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?");
            $update->bind_param("ss", $new_password, $token);
            $update->execute();

            $_SESSION['message'] = "Password updated successfully!";
            $messageType = 'success';
            $formVisible = false;
        } else {
            $_SESSION['message'] = "Invalid or expired token.";
            $messageType = 'error';
        }
    }
} else {
    $_SESSION['message'] = "Invalid request.";
    $messageType = 'error';
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
    <style>
        body {
            font-family: Arial;
            background: #f7f7f7;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            width: 320px;
            text-align: center;
        }
        input[type="password"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button, .back-btn {
            width: 100%;
            padding: 10px;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            text-decoration: none;
            display: block;
            margin-top: 10px;
        }
        button:hover, .back-btn:hover {
            background: #0056b3;
        }
        .success { color: green; margin-top: 15px; }
        .error { color: red; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Reset Password</h2>

        <?php if ($formVisible): ?>
            <form method="POST">
                <input type="password" name="password" placeholder="Enter New Password" required>
                <button type="submit">Reset Password</button>
            </form>
        <?php endif; ?>

        <?php
        if (isset($_SESSION['message'])) {
            $class = ($messageType == 'success') ? 'success' : 'error';
            echo "<p class='$class'>{$_SESSION['message']}</p>";
            if ($messageType == 'success') {
                echo '<a href="login.php" class="back-btn">Back to Login</a>';
            }
            unset($_SESSION['message']);
        }
        ?>
    </div>
</body>
</html>
