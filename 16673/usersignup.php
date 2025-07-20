<?php
session_start(); // Start session
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = $_POST['fullname'];
    $mobile = $_POST['mobile'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Insert into registration table
    $sql = "INSERT INTO registration (fullname, mobile, email, password) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $fullname, $mobile, $email, $password);

    if ($stmt->execute()) {
        // Store user name in session
        $_SESSION['user_name'] = $fullname;

        // Redirect to sury1.php
        echo "<script>alert('Registration Successful'); window.location.href='sury1.php';</script>";
    } else {
        echo "<script>alert('Error: " . $stmt->error . "');</script>";
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
    <title>User Signup</title>
</head>
<style>
body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    background: black;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1000px;
    /* Remove default body margin */
}

.container {
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
    /* Smooth transition for hover effect */
}

.container:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    /* Slightly more pronounced shadow on hover */
}

.login-container:hover {
    box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.6),
        inset 0 0 20px rgba(74, 172, 254, 0.4);
}


h2 {
    color: #2c3e50;
    /* Dark blue-gray heading */
    text-align: center;
    margin-bottom: 30px;
    font-weight: 700;
    /* Bold heading */
    letter-spacing: 0.8px;
    /* Slight letter spacing for a modern look */
}

.input-group {
    margin-bottom: 25px;
}

label {
    display: block;
    color: #555;
    margin-bottom: 8px;
    font-weight: 600;
    /* Semi-bold label */
}

input[type="text"],
input[type="tel"],
input[type="email"],
input[type="password"] {
    width: calc(100% - 20px);
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="tel"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
    border-color: #3498db;
    /* Focus color */
    outline: none;
    /* Remove default focus outline */
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    /* Subtle focus shadow */
}

button[type="submit"] {
    background-color: #27ae60;
    /* Green submit button */
    color: white;
    padding: 14px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
    width: 100%;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

button[type="submit"]:hover {
    background-color: #219653;
    /* Darker green on hover */
    transform: translateY(-2px);
    /* Slight lift on hover */
}

p {
    margin-top: 20px;
    font-size: 14px;
    color: #777;
    text-align: center;
}

p a {
    color: #3498db;
    /* Link color */
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

p a:hover {
    color: #1e8bc3;
    /* Darker link color on hover */
    text-decoration: underline;
}
</style>

<body>
    <div class="container">
        <h2>Register</h2>
        <form action="" method="POST">
            <div class="input-group">
                <label>Full Name</label>
                <input type="text" name="fullname" required>
            </div>
            <div class="input-group">
                <label>Mobile No</label>
                <input type="tel" name="mobile" pattern="[0-9]{10}" required>
            </div>
            <div class="input-group">
                <label>Email ID</label>
                <input type="email" name="email" required>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" required>
                <br><br>
                <button type="submit">Register</button>
                <p><a href="userlogin.php">login</a>Already SignUp</p>
        </form>
    </div>
</body>

</html>