<?php
session_start();
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Fetch user from the database
    $sql = "SELECT id, fullname, password FROM registration WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $fullname, $hashed_password);
        $stmt->fetch();

        // Verify password
        if (password_verify($password, $hashed_password)) {
            $_SESSION['user_id'] = $id;
            $_SESSION['user_name'] = $fullname;
            echo "<script>alert('Login Successful'); window.location.href='sury1.php';</script>";
        } else {
            echo "<script>alert('Invalid email or password');</script>";
        }
    } else {
        echo "<script>alert('Invalid email or password');</script>";
    }

    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Login</title>
    <link rel="stylesheet" href="userlogin.css">
</head>
<style>
:root {
    --ocean-blue: #4facfe;
    --sea-green: #00f2fe;
    --deep-space: #0a1a2a;
    --moonlight: #e6f7ff;
    --soft-purple: #a18cd1;
    --misty-white: rgba(255, 255, 255, 0.9);
}

body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, var(--deep-space), #162a47);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1000px;
}

.login-container {
    width: 380px;
    padding: 40px;
    background: rgba(10, 26, 42, 0.7);
    border-radius: 20px;
    box-shadow:
        0 15px 35px rgba(0, 0, 0, 0.5),
        inset 0 0 15px rgba(74, 172, 254, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(79, 172, 254, 0.2);
    transform-style: preserve-3d;
    animation: float 6s ease-in-out infinite;
    transition: all 0.5s ease;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotateX(5deg) rotateY(0);
    }

    50% {
        transform: translateY(-20px) rotateX(5deg) rotateY(5deg);
    }
}

.login-container:hover {
    box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.6),
        inset 0 0 20px rgba(74, 172, 254, 0.4);
}

h2 {
    color: var(--misty-white);
    text-align: center;
    margin-bottom: 30px;
    font-size: 2.2rem;
    font-weight: 300;
    letter-spacing: 2px;
    text-shadow: 0 0 10px rgba(79, 172, 254, 0.5);
    position: relative;
}

h2::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, var(--ocean-blue), var(--sea-green));
    border-radius: 3px;
}

.input-group {
    margin-bottom: 25px;
    position: relative;
}

.input-group label {
    display: block;
    color: var(--misty-white);
    margin-bottom: 8px;
    font-size: 14px;
    letter-spacing: 1px;
}

.input-group input {
    width: 100%;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(79, 172, 254, 0.3);
    border-radius: 10px;
    color: var(--misty-white);
    font-size: 16px;
    transition: all 0.3s ease;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

.input-group input:focus {
    outline: none;
    border-color: var(--sea-green);
    box-shadow:
        inset 0 0 15px rgba(0, 242, 254, 0.2),
        0 0 15px rgba(0, 242, 254, 0.1);
    background: rgba(255, 255, 255, 0.15);
}

button[type="submit"] {
    width: 100%;
    padding: 15px;
    background: linear-gradient(45deg, var(--ocean-blue), var(--soft-purple));
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.4s ease;
    margin-top: 10px;
    letter-spacing: 1px;
    font-weight: 500;
    box-shadow: 0 5px 15px rgba(79, 172, 254, 0.4);
    position: relative;
    overflow: hidden;
}

button[type="submit"]:hover {
    background: linear-gradient(45deg, var(--soft-purple), var(--ocean-blue));
    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.6);
    transform: translateY(-3px);
}

button[type="submit"]::before {
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
}

button[type="submit"]:hover::before {
    left: 100%;
}

.login-container p {
    text-align: center;
    color: var(--misty-white);
    margin-top: 20px;
    font-size: 14px;
}

.login-container a {
    color: var(--sea-green);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
}

.login-container a:hover {
    color: var(--ocean-blue);
    text-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
}

.login-container a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--ocean-blue);
    transition: width 0.3s ease;
}

.login-container a:hover::after {
    width: 100%;
}

/* Floating bubbles background */
.bubbles {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
}

.bubble {
    position: absolute;
    bottom: -100px;
    background: rgba(79, 172, 254, 0.1);
    border-radius: 50%;
    animation: rise 15s infinite ease-in;
}

@keyframes rise {
    0% {
        bottom: -100px;
        transform: translateX(0);
    }

    50% {
        transform: translateX(100px);
    }

    100% {
        bottom: 1080px;
        transform: translateX(-200px);
    }
}

/* Responsive Design */
@media (max-width: 480px) {
    .login-container {
        width: 90%;
        padding: 30px;
    }
}
</style>

<body>
    <div class="bubbles">
        <div class="bubble" style="left: 10%; width: 40px; height: 40px; animation-delay: 0s;"></div>
        <div class="bubble" style="left: 20%; width: 20px; height: 20px; animation-delay: 2s;"></div>
        <div class="bubble" style="left: 75%; width: 30px; height: 30px; animation-delay: 4s;"></div>
        <div class="bubble" style="left: 80%; width: 25px; height: 25px; animation-delay: 6s;"></div>
        <div class="bubble" style="left: 40%; width: 35px; height: 35px; animation-delay: 8s;"></div>
    </div>

    <div class="login-container">
        <h2>Login</h2>
        <form action="" method="POST">
            <div class="input-group">
                <label>Email</label>
                <input type="email" name="email" required>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="usersignup.php">Register here</a></p>
        <p>Admin <a href="adminlogin.php">Login Here</a></p>
    </div>
</body>

</html>