<?php
require 'config.php'; // Include the database configuration file
session_start();

// Log the request method and POST data for debugging
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Received POST data: " . json_encode($_POST));


    // Retrieve data from POST request dynamically
    $razorpay_payment_id = $_POST['razorpay_payment_id'] ?? '';  // Razorpay payment ID
    $full_name = $_POST['full_name'] ?? '';      // Full Name

    // Log the values received to verify
    error_log("razorpay_payment_id: $razorpay_payment_id, full_name: $full_name");

    // Validate the input data
    if (empty($razorpay_payment_id) || empty($full_name)) {
        error_log("Missing required fields: " . json_encode($_POST));
        echo "All fields (Full Name, Payment ID) are required!";
        exit;
    }

    // Log the point before attempting database insertion
    error_log("Attempting to insert into the database.");

    // Prepare the SQL query to insert data excluding the register_id
    $stmt = $conn->prepare("INSERT INTO payments (full_name, razorpay_payment_id, payment_date) VALUES (?, ?, CURRENT_TIMESTAMP)");
    if ($stmt === false) {
        // If the statement preparation fails, log the error
        error_log("SQL Error: " . $conn->error);
        echo "Database error: " . $conn->error;  // Provide more detailed error
        exit;
    }

    // Log before binding parameters
    error_log("Binding parameters to SQL statement.");

    // Bind parameters dynamically (excluding register_id)
    $stmt->bind_param("ss", $full_name, $razorpay_payment_id);

    // Execute the query and check if it succeeds
    if ($stmt->execute()) {
        error_log("SQL executed successfully! Payment saved.");
        echo "Payment saved successfully!";
    } else {
        // Log any error during query execution
        error_log("Execution Error: " . $stmt->error);
        echo "Failed to save payment: " . $stmt->error;  // Provide more detailed error
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();


?>