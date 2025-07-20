<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection
    $conn = new mysqli("localhost", "root", "", "hotal_man"); // Replace with your actual database credentials

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Collect form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $picture = $_FILES['picture']['name'];
    $address = $_POST['address'];
    $pincode = $_POST['pincode'];
    $dob = $_POST['dob'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validate password match
    if ($password !== $confirm_password) {
        echo "Passwords do not match!";
        exit;
    }

    // Hash the password for security
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Handle picture upload
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($picture);
    move_uploaded_file($_FILES['picture']['tmp_name'], $target_file);

    // Prepare SQL query to insert data
    $sql = "INSERT INTO registration (name, email, phone, picture, address, pincode, dob, password, confirmpassword) 
            VALUES ('$name', '$email', '$phone', '$target_file', '$address', '$pincode', '$dob', '$hashed_password', '$hashed_password')";

    if ($conn->query($sql) === TRUE) {
        echo "Registration successful!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>