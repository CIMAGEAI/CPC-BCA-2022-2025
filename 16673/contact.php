<?php
session_start();
include 'config.php';

 // Database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $message = trim($_POST['message']);

    // Validate input
    if (empty($name) || empty($email) || empty($message)) {
        echo "All fields are required!";
        exit;
    }

    // Prepare SQL query to insert data
    $sql = "INSERT INTO contactus (name, email, message) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $name, $email, $message);

    // Execute the query
    if ($stmt->execute()) {
        echo "Your message has been sent successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close connection
    $stmt->close();
    $conn->close();
}

// Database connection if needed
?>
<?php
if (isset($_GET['success']) && $_GET['success'] == 1) {
    echo "<p style='color: green; text-align: center;'>Your message has been sent successfully!</p>";
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us | Hotel Management</title>
    <link rel="stylesheet" href="contact.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <script src="https://kit.fontawesome.com/your-fontawesome-kit.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="sury.css">

    <style>
    .availability-form {
        margin-top: -50px;
        z-index: 2;
        position: relative;
    }

    @media screen and (max-width: 575px) {
        .availability-form {
            margin-top: 0px;
            padding: 0 35px;
        }
    }

    body {
        font-family: Arial, sans-serif;
    }

    .d-flex {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        position: absolute;
        top: 10px;
        right: 20px;
    }

    .btn {
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        text-decoration: none;
        cursor: pointer;
        font-size: 14px;
    }

    .login-btn {
        background: #007bff;
        color: white;
    }

    .logout-btn {
        background: #dc3545;
        color: white;
    }
    </style>
</head>

<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white px-lg-2 shadow-sm sticky-top">
        <div class="container-fluid">
            <a class="navbar-brand me-5 fw-bold fs-3 merienda" href="sury1.php">Tj Hotel</a>
            <button class="navbar-toggler shadow-none" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 poppins-medium">
                    <li class="nav-item">
                        <a class="nav-link active me-2" href="sury1.php">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link me-2" href="rooms.php">Rooms</a>
                    </li>
                    <li class="nav-item me-2">
                        <a class="nav-link" href="#">Facilities</a>
                    </li>
                    <li class="nav-item me-2">
                        <a class="nav-link" href="contact.php">Contact Us</a>
                    </li>
                    <li class="nav-item me-2">
                        <a class="nav-link" href="#">About</a>
                    </li>
                </ul>


                <nav>
                    <ul class="navbar-nav">
                        <li class="nav-item me-2 ">
                            <?php if (isset($_SESSION['user_name'])): ?>
                            <span>Welcome, <?php echo htmlspecialchars($_SESSION['user_name']); ?>!</span>
                            <a href="logout.php" class="btn logout-btn" style="margin-left: 10px;">Logout</a>
                            <?php else: ?>
                            <a href="userlogin.php" class="btn login-btn">Login</a>
                            <?php endif; ?>
                        </li>
                    </ul>
                </nav>


    </nav>


    </div>
    </nav>
    <div class="contact-container">
        <h2>Contact Us</h2>
        <p>We’d love to hear from you! Reach out via phone, email, or social media.</p>

        <div class="contact-details">
            <div class="contact-item">
                <i class="fas fa-phone"></i>
                <p>+919142609665</p>
            </div>
            <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <p>kumararyan19242@gmail.com</p>
            </div>
            <div class="contact-item">
                <i class="fab fa-whatsapp"></i>
                <p><a href="https://wa.me/9142609665" target="_blank">WhatsApp</a></p>
            </div>
            <div class="contact-item">
                <i class="fab fa-facebook"></i>
                <p><a href="https://www.facebook.com/share/16HT5fmTqE/" target="_blank">Facebook</a></p>
            </div>
            <div class="contact-item">
                <i class="fab fa-instagram"></i>
                <p><a href="https://www.instagram.com/aryan_sharma___06?igsh=MTg2dmt5ZGVyamlmMQ==" target="_blank">Instagram</a></p>
            </div>
        </div>

        <form class="contact-form" method="POST" action="send_mail.php">
            <input type="text" name="name" placeholder="Your Name" required>
            <input type="email" name="email" placeholder="Your Email" required>
            <textarea name="message" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
        </form>
    </div>





    <!-- Include Swiper JS -->
    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script>
    var swiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 3000,
        },
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
    var swiper = new Swiper(".Swiper-testimonials", {
        effect: "coverflow", // The effect to apply: coverflow in this case
        grabCursor: true, // Allows the user to grab and drag the swiper
        centeredSlides: true, // Centers the active slide
        slidesPerView: "auto",
        slidesPerView: "3", // Adjusts the number of slides visible at a time
        loop: true,
        coverflowEffect: {
            rotate: 50, // Angle at which the slides will rotate
            stretch: 0, // How much the slides will stretch
            depth: 100, // Depth of the effect
            modifier: 1, // Modifier for the effect's intensity
            slideShadows: false, // Adds shadow to the slides for a 3D effect
        },
        pagination: {
            el: ".swiper-pagination", // Pagination controls for the swiper
        },
        breakpoints: {
            320: {
                slidesPerView: "1"
            },
            640: {
                slidesPerView: "1"
            },
            768: {
                slidesPerView: "2"
            },
            1024: {
                slidesPerView: "3"
            },
        }
    });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>