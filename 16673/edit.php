<?php
include 'config.php'; // Database connection

// Check if ID is set in the URL
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Fetch user details based on ID
    $sql = "SELECT * FROM registration WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
    } else {
        echo "User not found!";
        exit;
    }
}

// Handle form submission for updating user details
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = trim($_POST['fullname']); // Match database column
    $email = trim($_POST['email']);
    $mobile = trim($_POST['mobile']); // Match database column

    // Validate input
    if (empty($fullname) || empty($email) || empty($mobile)) {
        echo "All fields are required!";
        exit;
    }

    // Update user details in the database
    $update_sql = "UPDATE registration SET fullname = ?, email = ?, mobile = ? WHERE id = ?";
    $stmt = $conn->prepare($update_sql);
    $stmt->bind_param("sssi", $fullname, $email, $mobile, $id);

    if ($stmt->execute()) {
        // Redirect to registration.php with success message
        header("Location: adminregistration.php?updated=1");
        exit;
    } else {
        echo "Error updating record!";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit User</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
    body {
        font-family: 'Orbitron', sans-serif;
        background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
        padding: 30px;
        color: #e0e0e0;
    }

    /* Centered Container */
    .container {
        width: 60%;
        margin: auto;
        background: rgba(27, 39, 59, 0.85);
        padding: 30px;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        border-radius: 15px;
        border: 1px solid rgba(0, 255, 255, 0.2);
        backdrop-filter: blur(10px);
    }

    /* Heading */
    h2 {
        text-align: center;
        color: #00ffcc;
        margin-bottom: 25px;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 10px rgba(0, 255, 204, 0.7);
    }

    /* Form Styling */
    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        font-weight: 500;
        display: block;
        margin-bottom: 8px;
        color: #b0bec5;
        text-transform: uppercase;
        font-size: 14px;
    }

    .form-control {
        width: 100%;
        padding: 12px;
        border: 1px solid #00ffcc;
        border-radius: 8px;
        font-size: 16px;
        background: rgba(14, 22, 33, 0.7);
        color: #e0e0e0;
        transition: all 0.3s ease;
    }

    .form-control:focus {
        border-color: #ff4081;
        outline: none;
        box-shadow: 0 0 10px rgba(255, 64, 129, 0.5);
        background: rgba(14, 22, 33, 0.9);
    }

    /* Buttons */
    .btn {
        width: 100%;
        padding: 12px;
        font-size: 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .btn-primary {
        background: linear-gradient(45deg, #00ffcc, #ff4081);
        color: #0d1b2a;
        border: none;
        box-shadow: 0 0 15px rgba(0, 255, 204, 0.5);
    }

    .btn-primary:hover {
        background: linear-gradient(45deg, #ff4081, #00ffcc);
        box-shadow: 0 0 20px rgba(255, 64, 129, 0.7);
        transform: translateY(-2px);
    }

    .btn-secondary {
        background: linear-gradient(45deg, #b0bec5, #546e7a);
        color: #0d1b2a;
        border: none;
        box-shadow: 0 0 15px rgba(176, 190, 197, 0.5);
    }

    .btn-secondary:hover {
        background: linear-gradient(45deg, #546e7a, #b0bec5);
        box-shadow: 0 0 20px rgba(84, 110, 122, 0.7);
        transform: translateY(-2px);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .container {
            width: 95%;
            padding: 20px;
        }

        .btn {
            width: 100%;
            padding: 10px;
        }

        h2 {
            font-size: 24px;
        }
    }
    </style>
</head>

<body>

    <div class="container">
        <h2>Edit User</h2>
        <form method="POST">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="fullname" class="form-control"
                    value="<?php echo htmlspecialchars($row['fullname']); ?>" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" class="form-control"
                    value="<?php echo htmlspecialchars($row['email']); ?>" required>
            </div>
            <div class="form-group">
                <label>Mobile</label>
                <input type="text" name="mobile" class="form-control"
                    value="<?php echo htmlspecialchars($row['mobile']); ?>" required>
            </div>
            <button type="submit" class="btn btn-primary">Update</button>
            <a href="adminregistration.php" class="btn btn-secondary">Cancel</a>
        </form>
    </div>

</body>

</html>