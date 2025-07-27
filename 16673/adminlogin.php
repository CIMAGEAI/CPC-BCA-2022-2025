<?php
require 'config.php';
$plain_password = "sury@9060";
$hashed_password = password_hash($plain_password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("UPDATE adminlogin SET password = ? WHERE email = ?");
$stmt->bind_param("ss", $hashed_password, $email);
$email = "kumararyan19242@gmail.com";
$stmt->execute();
$stmt->close();
$conn->close();

?>
<?php
session_start();
require 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $password = trim($_POST['password'] ?? '');

    if (empty($email) || empty($password)) {
        $_SESSION['error'] = "Please enter email and password.";
        header("Location: adminlogin.php");
        exit;
    }

    $stmt = $conn->prepare("SELECT password FROM adminlogin WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $admin = $result->fetch_assoc();
        if (password_verify($password, $admin['password'])) {
            $_SESSION['admin_email'] = $email;
            header("Location: admin.php"); // Redirect to admin dashboard
            exit;
        } else {
            $_SESSION['error'] = "Invalid password!";
        }
    } else {
        $_SESSION['error'] = "No admin found with this email!";
    }

    header("Location: adminlogin.php");
    exit;
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
    :root {
        --matrix-green: #00ff9d;
        --cyber-blue: #00f7ff;
        --deep-space: #050510;
        --hologram-white: rgba(255, 255, 255, 0.95);
        --electric-purple: #9d00ff;
        --alert-red: #ff3860;
    }

    body {
        font-family: 'Orbitron', 'Rajdhani', sans-serif;
        background:
            radial-gradient(circle at 20% 30%, #0a0a1a 0%, var(--deep-space) 70%),
            linear-gradient(135deg, red 0%, black 100%);
        color: var(--hologram-white);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 20px;
        perspective: 1000px;
    }

    .login-container {
        width: 100%;
        max-width: 420px;
        padding: 40px;
        background: rgba(18, 18, 32, 0.7);
        border-radius: 16px;
        box-shadow:
            0 0 30px rgba(0, 247, 255, 0.3),
            inset 0 0 20px rgba(0, 247, 255, 0.2);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(0, 247, 255, 0.3);
        transform-style: preserve-3d;
        animation: float 6s ease-in-out infinite;
        position: relative;
        overflow: hidden;
    }

    @keyframes float {

        0%,
        100% {
            transform: translateY(0) rotateX(2deg);
        }

        50% {
            transform: translateY(-20px) rotateX(4deg);
        }
    }

    .login-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:
            linear-gradient(45deg,
                transparent 48%,
                rgba(0, 247, 255, 0.05) 49%,
                rgba(0, 247, 255, 0.05) 51%,
                transparent 52%);
        background-size: 4em 4em;
        opacity: 0.5;
        pointer-events: none;
        animation: holographic 4s linear infinite;
        color: white;
    }

    @keyframes holographic {
        0% {
            background-position: 0 0;
        }

        100% {
            background-position: 4em 4em;
        }
    }

    h3 {
        text-align: center;
        color: var(--matrix-green);
        margin-bottom: 30px;
        font-size: 2rem;
        text-transform: uppercase;
        letter-spacing: 3px;
        text-shadow: 0 0 15px rgba(0, 255, 157, 0.5);
        position: relative;
    }

    h3::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 3px;
        background: linear-gradient(90deg, var(--matrix-green), var(--cyber-blue));
        border-radius: 3px;
    }

    .alert-danger {
        background: rgba(255, 56, 96, 0.2);
        color: var(--hologram-white);
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid var(--alert-red);
        margin-bottom: 25px;
        font-size: 14px;
        animation: alert-pulse 2s infinite;
    }

    @keyframes alert-pulse {

        0%,
        100% {
            box-shadow: 0 0 0 0 rgba(255, 56, 96, 0.3);
        }

        50% {
            box-shadow: 0 0 0 10px rgba(255, 56, 96, 0);
        }
    }

    .mb-3 {
        margin-bottom: 25px;
        position: relative;
    }

    .form-label {
        display: block;
        color: var(--cyber-blue);
        margin-bottom: 10px;
        font-size: 15px;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    .form-control {
        width: 100%;
        padding: 15px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(0, 247, 255, 0.3);
        border-radius: 8px;
        color: red;
        font-size: 16px;
        transition: all 0.3s ease;
        box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
    }

    .form-control:focus {
        outline: none;
        border-color: var(--matrix-green);
        box-shadow:
            inset 0 0 20px rgba(0, 255, 157, 0.2),
            0 0 20px rgba(0, 255, 157, 0.1);
        background: rgba(255, 255, 255, 0.12);
    }

    .btn-primary {
        width: 100%;
        padding: 16px;
        background: linear-gradient(45deg, var(--matrix-green), var(--electric-purple));
        color: var(--deep-space);
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.4s ease;
        margin-top: 10px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        box-shadow: 0 5px 20px rgba(0, 255, 157, 0.4);
        position: relative;
        overflow: hidden;
    }

    .btn-primary:hover {
        background: linear-gradient(45deg, var(--electric-purple), var(--matrix-green));
        box-shadow: 0 8px 30px rgba(157, 0, 255, 0.6);
        transform: translateY(-3px);
    }

    .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent);
        transition: all 0.6s ease;
        color: white;
    }

    .btn-primary:hover::before {
        left: 100%;
    }

    /* Cyberpunk Scanlines */
    body::after {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:
            linear-gradient(rgba(18, 18, 32, 0.2) 1px,
                transparent 1px);
        background-size: 100% 4px;
        pointer-events: none;
        animation: scanlines 80s linear infinite;
        z-index: -1;
    }

    @keyframes scanlines {
        from {
            background-position: 0 0;
        }

        to {
            background-position: 0 100vh;
        }
    }

    /* Responsive Design */
    @media (max-width: 480px) {
        .login-container {
            padding: 30px 20px;
            margin: 0 15px;
        }

        h3 {
            font-size: 1.8rem;
        }
    }
    </style>
</head>

<body>

    <div class="login-container">
        <h3 class="text-center">Admin Login</h3>

        <?php if (isset($_SESSION['error'])): ?>
        <div class="alert alert-danger">
            <?= $_SESSION['error']; unset($_SESSION['error']); ?>
        </div>
        <?php endif; ?>

        <form action="adminlogin.php" method="POST">
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>