<?php
// Database connection
$conn = new mysqli('localhost', 'root', '', 'hotal_man',3306);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if(isset($_GET['id'])) {
    $id = $_GET['id'];
    
    // Fetch the specific payment record
    $sql = "SELECT * FROM payments WHERE id = $id";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
}
?>

<!DOCTYPE html>
<html>

<head>
    <title>Edit Payment</title>
</head>
<style>
/* General Body Styling */
body {
    font-family: 'Neuropol', sans-serif;
    background: linear-gradient(145deg, #0a1428 0%, #1c2b4b 100%);
    margin: 0;
    padding: 0;
    color: #e0e0e0;
    overflow-x: hidden;
}

/* Form Container Styling */
form {
    max-width: 600px;
    margin: 60px auto;
    background: rgba(15, 23, 42, 0.95);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.5),
        0 0 64px rgba(236, 72, 153, 0.3),
        inset 0 0 20px rgba(59, 130, 246, 0.2);
    border: 2px solid rgba(59, 130, 246, 0.4);
    backdrop-filter: blur(15px);
    position: relative;
    transform: perspective(1000px) rotateX(5deg);
    transition: transform 0.5s ease;
}

/* 3D Hover Effect */
form:hover {
    transform: perspective(1000px) rotateX(0deg);
}

/* Neon Glow Animation */
form::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #3b82f6, #ec4899, #3b82f6);
    z-index: -1;
    border-radius: 22px;
    filter: blur(10px);
    opacity: 0.7;
    animation: neonGlow 3s infinite alternate;
}

@keyframes neonGlow {
    0% {
        filter: blur(10px) brightness(100%);
    }

    100% {
        filter: blur(15px) brightness(150%);
    }
}

/* Heading Styling */
h2 {
    color: #3b82f6;
    font-size: 32px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 4px;
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.8),
        0 0 40px rgba(59, 130, 246, 0.4);
    margin-bottom: 40px;
    position: relative;
    z-index: 1;
    transform: translateZ(20px);
}

/* Label Styling */
label {
    color: black;
    font-weight: 500;

    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 2px;
    margin-bottom: 12px;
    display: wheat;
    text-shadow: 0 0 5px rgba(165, 180, 252, 0.5);
}

/* Input Styling */
input[type="text"],
input[type="hidden"] {
    width: 100%;
    padding: 14px;
    border: 2px solid #3b82f6;
    border-radius: 10px;
    font-size: 16px;
    background: rgba(15, 23, 42, 0.7);
    color: #e0e0e0;
    transition: all 0.3s ease;
    box-shadow: inset 0 0 10px rgba(59, 130, 246, 0.3);
    transform: translateZ(10px);
}

input[type="text"]:focus {
    border-color: #ec4899;
    box-shadow: 0 0 15px rgba(236, 72, 153, 0.6),
        inset 0 0 10px rgba(236, 72, 153, 0.3);
    background: rgba(15, 23, 42, 0.9);
    outline: none;
}

/* Submit Button Styling */
input[type="submit"] {
    width: 100%;
    padding: 14px;
    font-size: 16px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(45deg, #3b82f6, #ec4899);
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.4s ease;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5),
        0 0 40px rgba(236, 72, 153, 0.3);
    position: relative;
    overflow: hidden;
    transform: translateZ(15px);
}

input[type="submit"]:hover {
    background: linear-gradient(45deg, #ec4899, #3b82f6);
    box-shadow: 0 0 30px rgba(236, 72, 153, 0.8),
        0 0 50px rgba(59, 130, 246, 0.6);
    transform: translateZ(20px) translateY(-3px);
}

/* Button Shine Effect */
input[type="submit"]::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: 0.5s;
}

input[type="submit"]:hover::before {
    left: 100%;
}

/* Spacing */
br {
    display: block;
    margin: 10px 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    form {
        max-width: 90%;
        padding: 25px;
        margin: 40px auto;
    }

    h2 {
        font-size: 26px;
    }

    input[type="text"],
    input[type="submit"] {
        padding: 12px;
        font-size: 14px;
    }

    label {
        font-size: 12px;
    }
}
</style>

<body>
    <h2>Edit Payment Record</h2>
    <form action="update_payment.php" method="post">
        <input type="hidden" name="id" value="<?php echo $row['id']; ?>">

        <label>Register ID:</label>
        <input type="text" name="register_id" value="<?php echo $row['register_id']; ?>" required><br><br>

        <label>Full Name:</label>
        <input type="text" name="full_name" value="<?php echo $row['full_name']; ?>" required><br><br>

        <label>Razorpay Payment ID:</label>
        <input type="text" name="razorpay_payment_id" value="<?php echo $row['razorpay_payment_id']; ?>"
            required><br><br>

        <input type="submit" value="Update">
    </form>
</body>

</html>