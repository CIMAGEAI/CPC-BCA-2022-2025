<?php
session_start();
include 'config.php';

$sql = "SELECT * FROM rooms";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facility</title>
    <?php require('inc/link.php'); ?>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <style>
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
                        <a class="nav-link" href="Facilities.php">Facilities</a>
                    </li>
                    <li class="nav-item me-2">
                        <a class="nav-link" href="contact.php">Contact Us</a>
                    </li>
                    <li class="nav-item me-2">
                        <a class="nav-link" href="about.php">About</a>
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




    <div class="container">
        <div class="row">
            <!-- Sidebar for Filter (Left Column) -->
            <div class="col-lg-3 col-md-4 mb-4 px-lg-0">
                <nav class="navbar navbar-expand-lg navbar-light bg-white rounded shadow">
                    <div class="container-fluid flex-lg-column align-items-stretch">
                        <h4 class="my-2">Filter</h4>
                        <button class="navbar-toggler shadow-none" type="button" data-bs-toggle="collapse"
                            data-bs-target="#filterDropdown" aria-controls="navbarNav" aria-expanded="false"
                            aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse flex-column mt-2 align-items-lg-stretch"
                            id="filterDropdown">
                            <div class="border bg-light p-3 rounded mb-3">
                                <h5 class="mb-3" style="font-size: 18px;">CHECK AVAILABILITY</h5>
                                <label class="form-label">Check-in</label>
                                <input type="date" class="form-control shadow-none mb-3">
                                <label class="form-label">Check-out</label>
                                <input type="date" class="form-control shadow-none">
                            </div>
                            <div class="border bg-light p-3 rounded mb-3">
                                <h5 class="mb-3" style="font-size: 18px;">FACILITIES</h5>
                                <div class="mb-2">
                                    <input type="checkbox" id="wifi" class="form-check-input shadow-none me-1">
                                    <label class="form-label" for="wifi">WiFi</label>
                                </div>
                                <div class="mb-2">
                                    <input type="checkbox" id="tv" class="form-check-input shadow-none me-1">
                                    <label class="form-check-label" for="tv">Television</label>
                                </div>
                                <div class="mb-2">
                                    <input type="checkbox" id="ac" class="form-check-input shadow-none me-1">
                                    <label class="form-check-label" for="ac">AC</label>
                                </div>
                            </div>
                            <div class="border bg-light p-3 rounded mb-3">
                                <h5 class="mb-3" style="font-size: 18px;">GUESTS</h5>
                                <div class="d-flex">
                                    <div class="me-3">
                                        <label class="form-label"></label>
                                        <input type="number" class="form-control shadow-none">
                                    </div>
                                    <div>
                                        <label class="form-label">Children</label>
                                        <input type="number" class="form-control shadow-none">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            <!-- Rooms Section (Dynamic Data) -->
            <div class="col-lg-9 col-md-12 px-4">
                <?php while ($row = $result->fetch_assoc()) { ?>
                <div class="card mb-4 border-0 shadow">
                    <div class="row g-0 p-3 align-items-center">
                        <!-- Room Image -->
                        <div class="col-md-4 mb-lg-0 mb-md-0 mb-3">
                            <img src="<?php echo $row['image']; ?>" class="img-fluid rounded-start" alt="Room Image">
                        </div>

                        <!-- Room Features and Facilities -->
                        <div class="col-md-5 px-lg-3 px-md-3 px-0">
                            <h5 class="mb-1">Room ID: <?php echo $row['id']; ?></h5>

                            <!-- Room Features -->
                            <div class="features mb-3 px-0">
                                <h6 class="mb-1">Features</h6>
                                <span
                                    class="badge rounded-pill bg-light text-dark text-wrap merienda"><?php echo $row['room_count']; ?>
                                    Rooms</span>
                                <span
                                    class="badge rounded-pill bg-light text-dark text-wrap merienda"><?php echo $row['bathroom_count']; ?>
                                    Bathroom</span>
                                <span
                                    class="badge rounded-pill bg-light text-dark text-wrap merienda"><?php echo $row['balcony_count']; ?>
                                    Balcony</span>
                                <span
                                    class="badge rounded-pill bg-light text-dark text-wrap merienda"><?php echo $row['sofa_count']; ?>
                                    Sofas</span>
                            </div>

                            <!-- Room Facilities -->
                            <div class="features">
                                <h6 class="mb-1">Facilities</h6>
                                <?php 
                                $facilities = explode(", ", $row['facilities']);
                                foreach ($facilities as $facility) {
                                    echo '<span class="badge rounded-pill bg-light text-dark text-wrap merienda">' . $facility . '</span> ';
                                }
                                ?>
                            </div>
                        </div>

                        <!-- Room Pricing and Actions -->
                        <div class="col-md-3 col-12 text-center">
                            <h6 class="mb-4">₹<?php echo number_format($row['price'], 2); ?> per night</h6>


                            <a href="#" class="primary-btn pricing-btn" onclick="openCheckout()">Book now</a>

                            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                            <script>
                            function openCheckout() {
                                var options = {
                                    "key": "rzp_test_CrbDsalYjYvbmm",
                                    "amount": 1000000, // Amount in paisa (10000 = ₹100)
                                    "currency": "INR",
                                    "name": "Tj Hotel",
                                    "description": "Batch Payment",
                                    "prefill": {
                                        "contact": "9631508765",
                                        "email": "alisaif11016@gmail.com"
                                    },
                                    "theme": {
                                        "color": "#3399cc"
                                    },
                                    "handler": function(response) {
                                        alert("Payment Successful! Payment ID: " + response
                                            .razorpay_payment_id);
                                        window.location.href = "feedback.php?payment_id=" + response
                                            .razorpay_payment_id;
                                    }
                                };

                                var rzp1 = new Razorpay(options);
                                rzp1.open();
                            }
                            </script>




                        </div>
                    </div>
                </div>
                <?php } ?>
            </div>
        </div>
    </div>

    <?php
$conn->close();
?>



    <?php require('inc/footer.php'); ?>

    <script>
    // Swiper for image slider
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

    // Swiper for testimonials with coverflow effect
    var swiper = new Swiper(".Swiper-testimonials", {
        effect: "coverflow", // The effect to apply: coverflow in this case
        grabCursor: true, // Allows the user to grab and drag the swiper
        centeredSlides: true, // Centers the active slide
        slidesPerView: "auto",
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
                slidesPerView: 1
            },
            640: {
                slidesPerView: 1
            },
            768: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 3
            },
        }
    });
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>