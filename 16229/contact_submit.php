<?php
include 'config.php'; // database connection

// Check if form submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get values from form
    $name = $_POST['name'];
    $email = $_POST['email'];
    $mobile = $_POST['mobile'];
    $message = $_POST['message'];

    // Insert into contacts table
    $sql = "INSERT INTO contacts (name, email, mobile, message) 
            VALUES ('$name', '$email', '$mobile', '$message')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>
                alert('✅ Message submitted successfully! We will connect with you shortly');
                window.location.href = 'contactus.html';
              </script>";
    } else {
        echo "❌ Error: " . $sql . "<br>" . $conn->error;
    }
}
?>
