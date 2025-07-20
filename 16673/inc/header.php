<?php
require 'config.php';  // Database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $pincode = trim($_POST['pincode'] ?? '');
    $dob = $_POST['dob'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $picture = $_FILES['picture']['name'] ?? '';

    // Validate required fields
    if (empty($name) || empty($email) || empty($phone) || empty($password) || empty($confirm_password)) {
        echo "Please fill in all required fields.";
        exit;
    }

    // Check if passwords match
    if ($password !== $confirm_password) {
        echo "Passwords do not match!";
        exit;
    }

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Handle picture upload with validation
    $target_file = null;
    if (!empty($picture)) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $file_type = mime_content_type($_FILES['picture']['tmp_name']);
        if (!in_array($file_type, $allowed_types)) {
            echo "Invalid file type. Only JPG, PNG, and GIF are allowed.";
            exit;
        }
        
        $target_dir = "uploads/";
        $target_file = $target_dir . uniqid() . "_" . basename($picture);
        if (!move_uploaded_file($_FILES['picture']['tmp_name'], $target_file)) {
            echo "Failed to upload picture.";
            exit;
        }
    }

    // Prepare SQL query
    $stmt = $conn->prepare("INSERT INTO registration (name, email, phone, picture, address, pincode, dob, password) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", $name, $email, $phone, $target_file, $address, $pincode, $dob, $hashed_password);

    if ($stmt->execute()) {
        echo "Registration successful!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>

<?php
require 'config.php';  // Database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo "<script>alert('Please fill in all fields.');</script>";
        exit;
    }

    // Prepare SQL query to check if the email exists
    $stmt = $conn->prepare("SELECT id, name, password FROM registration WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Verify the hashed password
        if (password_verify($password, $user['password'])) {
            echo "<script>alert('Login successful! Welcome, " . $user['name'] . "');</script>";
            // You can redirect the user to the dashboard or another page:
            // echo "<script>window.location.href='dashboard.php';</script>";
        } else {
            echo "<script>alert('Incorrect password. Please try again.');</script>";
        }
    } else {
        echo "<script>alert('No account found with this email address.');</script>";
    }

    $stmt->close();
    $conn->close();
}
?>



<nav class="navbar navbar-expand-lg navbar-light bg-white px-lg-2 shadow-sm sticky-top">
    <div class="container-fluid">
        <a class="navbar-brand me-5 fw-bold fs-3 merienda" href="index.php">Tj Hotel</a>
        <button class="navbar-toggler shadow-none" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 poppins-medium">
                <li class="nav-item">
                    <a class="nav-link active me-2" href="sury.php">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link me-2" href="Rooms.php">Rooms</a>
                </li>
                <li class="nav-item me-2">
                    <a class="nav-link" href="Facilities.php">Facilities</a>
                </li>
                <li class="nav-item me-2">
                    <a class="nav-link" href="contact_us.php">Contact Us</a>
                </li>
                <li class="nav-item me-2">
                    <a class="nav-link" href="about.php">About</a>
                </li>
            </ul>
            <div class="d-flex">
                <button type="button" class="btn btn-outline-dark shadow-none me-lg-3 me-2" data-bs-toggle="modal"
                    data-bs-target="#loginModal">
                    Login
                </button>
                <button type="button" class="btn btn-outline-dark shadow-none " data-bs-toggle="modal"
                    data-bs-target="#ResisterModal">
                    Register
                </button>
            </div>
        </div>
    </div>
</nav>

<!-- Login Modal -->
<div class="modal fade" id="loginModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">

            <form action="login.php" method="POST" enctype="multipart/form-data">
                <div class="modal-header">
                    <h5 class="modal-title d-flex align-items-center">
                        <i class="bi bi-person-circle fs-3 me-2"></i>User Login
                    </h5>
                    <button type="reset" class="btn-close shadow-none" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Email address</label>
                        <input name="email" type="email" class="form-control shadow-none" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Password</label>
                        <input name="password" type="password" class="form-control shadow-none" required>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <button type="submit" class="btn btn-dark shadow-none">LOGIN</button>
                        <a href="javascript:void(0)" class="text-decoration-none">Forgot Password</a>
                    </div>
                </div>
            </form>



        </div>
    </div>
</div>



<!-- Registration Modal -->
<div class="modal fade" id="ResisterModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">


            <form method="POST" enctype="multipart/form-data">
                <h5 class="text-center mb-4">
                    <i class="bi bi-person-dash-fill fs-3 me-2"></i>User Registration
                </h5>

                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" name="name" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email Address</label>
                    <input type="email" name="email" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Phone No</label>
                    <input type="number" name="phone" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Picture</label>
                    <input type="file" name="picture" class="form-control">
                </div>
                <div class="mb-3">
                    <label class="form-label">Address</label>
                    <input type="text" name="address" class="form-control">
                </div>
                <div class="mb-3">
                    <label class="form-label">Pin Code</label>
                    <input type="number" name="pincode" class="form-control">
                </div>
                <div class="mb-3">
                    <label class="form-label">Date of Birth</label>
                    <input type="date" name="dob" class="form-control">
                </div>
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" name="password" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Confirm Password</label>
                    <input type="password" name="confirm_password" class="form-control" required>
                </div>
                <div class="text-center">
                    <button type="submit" class="btn btn-dark">REGISTER</button>
                </div>
            </form>

        </div>
    </div>
</div>