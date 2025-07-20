<?php
require('inc/essentials.php');
require('inc/db_config.php');
session_start();
if ((isset($_SESSION['adminLogin']) && $_SESSION['adminLogin']==true)) {
     redirect('dashboard.php');
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login panel</title>
    <?php require ('inc/link.php'); ?>
    <link rel="stylesheet" href="css/index.css">
    <style>
    div.login-form {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
    }
    </style>
</head>

<body class="bg-light">

    <div class="login-form text-center rounded bg-white shadow overflow-hidden">
        <form method="POST">
            <h4 class="bg-dark text-white py-3">ADMIN LOGIN PANEL</h4>
            <div class="p-4">
                <div class="mb-3">
                    <input name="admin_name" required type="text" class="form-control shadow-none text-center"
                        placeholder="Admin Name">
                </div>
                <div class="mb-4">
                    <input name="admin_pass" required type="password" class="form-control shadow-none text-center"
                        placeholder="Password">
                </div>
                <button type="submit" name="login" class="btn text-white custom-bg shadow-none">Login</button>
            </div>
        </form>
    </div>

    <?php
if (isset($_POST['login'])) {
    $frm_data = filteration($_POST);

    // Secure SQL Query with prepared statements
    $query = "SELECT * FROM `admin_cred` WHERE `admin_name` = ? AND `admin_pass` = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("ss", $frm_data['admin_name'], $frm_data['admin_pass']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $_SESSION['adminLogin'] = true;  // Fix session key spelling
        $_SESSION['adminID'] = $row['sr_no'];
        redirect('dashboard.php');
    } else {
        alert('error', 'Login failed - Invalid credentials!');
    }
}
?>

    <?php require('inc/script.php'); ?>
</body>

</html>