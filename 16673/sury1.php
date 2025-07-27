 <?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gandhi Hotle</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link
        href="https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
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


    <!-- carousel -->
    <div class="container-fluid px-lg-4 mt-4">
        <div class="swiper swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <img src="Image\IMG_1.png" class="w-100 d-block" />
                </div>
                <div class="swiper-slide">
                    <img src="Image\IMG_2.png" class="w-100 d-block" />
                </div>
                <div class="swiper-slide">
                    <img src="Image\IMG_3.png" class="w-100 d-block" />
                </div>
                <div class="swiper-slide">
                    <img src="Image\IMG_4.png" class="w-100 d-block" />
                </div>
                <div class="swiper-slide">
                    <img src="Image\IMG_5.png" class="w-100 d-block" />
                </div>
                <div class="swiper-slide">
                    <img src="Image\IMG_6.png" class="w-100 d-block" />
                </div>
            </div>
        </div>
    </div>

    <!-- Check Availability Form -->
    <!-- Check Availability Form -->
    <!-- <div class="container availability-form">
        <div class="row">
            <div class="col-lg-12 bg-white shadow p-4 rounded">
                <h5 class="mb-4">Check Booking Availability</h5>
                <form action="booking.php" method="POST" onsubmit="return checkLogin()">
                    <div class="row align-items-end">
                        <div class="col-lg-3 mb-3">
                            <label class="form-label" style="font-weight: 500;">Check-in</label>
                            <input type="date" name="check_in" class="form-control shadow-none" required>
                        </div>
                        <div class="col-lg-3 mb-3">
                            <label class="form-label" style="font-weight: 500;">Check-out</label>
                            <input type="date" name="check_out" class="form-control shadow-none" required>
                        </div>
                        <div class="col-lg-3 mb-3">
                            <label class="form-label" style="font-weight: 500;">Guests</label>
                            <input type="number" name="guests" class="form-control shadow-none" min="1" required>
                        </div>
                        <div class="col-lg-3 mb-3">
                            <button type="submit" class="btn custom-bg custom-bg:hover shadow-none w-50">Submit</button>
                        </div>
                    </div>
                </form>
                <script>
                function checkLogin() {
                    <?php if (!isset($_SESSION['user_id'])) { ?>
                    alert("Please log in to book a room!");
                    window.location.href = "usersignup.php";
                    return false;
                    <?php } ?>
                    return true;
                }
                </script>
            </div>
        </div>
    </div>
    <br><br> -->


    <!-- Our Rooms -->
    <h2 class="mt-5 pt-4 mb-4 text-center fw-bold h-font merienda">Our Rooms >>></h2>
    <div class="container">

        <div class="row">
            <div class="col-lg-4 col-md-6 my-3">
                <div class="card border-0 shadow" style="max-width: 350px; margin: auto;">
                    <img src="Image\Room-1.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5>Simple Room Name</h5>
                        <h6 class="mb-4">₹200 per night</h6>
                        <div class="features mb-4">
                            <h6 class="mb-1 ">Features</h6>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                2 Rooms
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda">
                                1 Bathroom
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                1 Balcony
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                3 sofa
                            </span>
                        </div>
                        <div class="features mb-4">
                            <h6 class="mb-1 ">Facilities</h6>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                wi-fi
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda">
                                Television
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                Ac
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                Room heater
                            </span>
                        </div>
                        <div class="rating mb-4">
                            <h6 class="mb-1">Rating</h6>
                            <i class="bi bi-star-half text-warning"></i>
                            <i class="bi bi-star-half text-warning"></i>
                            <i class="bi bi-star-half text-warning"></i>
                            <i class="bi bi-star-half text-warning"></i>
                            <a href="#" class="btn btn-sm text-white custom-bg shadow-none ">Book Now</a>
                            <a href="Rooms.php" class="btn btn-sm btn-outline-dark shadow-none ">More Detail </a>
                        </div>
                        <div class="d-flex justify-content-evenly mb-2">

                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-6 my-3">
                <div class="card border-0 shadow" style="max-width: 350px; margin: auto;">
                    <img src="Image\Room-2.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5>Simple Room Name</h5>
                        <h6 class="mb-4">₹200 per night</h6>
                        <div class="features mb-4">
                            <h6 class="mb-1 ">Features</h6>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                2 Rooms
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda">
                                1 Bathroom
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                1 Balcony
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                3 sofa
                            </span>
                        </div>
                        <div class="features mb-4">
                            <h6 class="mb-1 ">Facilities</h6>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                wi-fi
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda">
                                Television
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                Ac
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                Room heater
                            </span>
                        </div>
                        <div class="rating mb-4">
                            <h6 class="mb-1">Rating</h6>
                            <i class="bi bi-star-half text-warning"></i>
                            <i class="bi bi-star-half text-warning"></i>
                            <i class="bi bi-star-half text-warning"></i>
                            <i class="bi bi-star-half text-warning"></i>
                            <a href="Rooms.php" class="btn btn-sm text-white custom-bg shadow-none ">Book Now</a>
                            <a href="Rooms.php" class="btn btn-sm btn-outline-dark shadow-none ">More Detail </a>
                        </div>
                        <div class="d-flex justify-content-evenly mb-2">

                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-6 my-3">
                <div class="card border-0 shadow" style="max-width: 350px; margin: auto;">
                    <img src="Image\Room-3.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5>Simple Room Name</h5>
                        <h6 class="mb-4">₹200 per night</h6>
                        <div class="features mb-4">
                            <h6 class="mb-1 ">Features</h6>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                2 Rooms
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda">
                                1 Bathroom
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                1 Balcony
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                3 sofa
                            </span>
                        </div>
                        <div class="features mb-4">
                            <h6 class="mb-1 ">Facilities</h6>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                wi-fi
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda">
                                Television
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                Ac
                            </span>
                            <span class="badge rounded-pill bg-light text-dark text-wrap merienda ">
                                Room heater
                            </span>
                        </div>
                        <div class="rating mb-4">
                            <h6 class="mb-1">Rating</h6>
                            <i class="bi bi-star-half text-warning"></i>
                            <i class="bi bi-star-half text-warning"></i>
                            <i class="bi bi-star-half text-warning"></i>
                            <i class="bi bi-star-half text-warning"></i>
                            <a href="#" class="btn btn-sm text-white custom-bg shadow-none ">Book Now</a>
                            <a href="Rooms.php" class="btn btn-sm btn-outline-dark shadow-none ">More Detail </a>
                        </div>
                        <div class="d-flex justify-content-evenly mb-2">

                        </div>
                    </div>

                </div>
            </div>

            <div class="col-lg-12 text-center mt-5">
                <a href="rooms.php" class="btn btn-sm btn-outline-dark rounded-0 fw-bold shadow-none">More Rooms</a>
            </div>
        </div>
    </div>
    <!-- Our Facilities -->
    <h2 class="mt-5 pt-4 mb-4 text-center fw-bold h-font merienda">Our FACILITIES </h2>

    <div class="container ">
        <div class="row justify-content-evenly px-lg-0 px-md-0 px-5">
            <div class="col-lg-2 col-md-2 text-center bg-white rounded shadow py-4 my-3">
                <img src="Image\facilities-1.svg" width="80px">
                <h5 class="mt-3">Wi-Fi</h5>
            </div>
            <div class="col-lg-2 col-md-2 text-center bg-white rounded shadow py-4 my-3">
                <img src="Image\facilities2.svg" width="80px">
                <h5 class="mt-3">FIRE</h5>
            </div>
            <div class="col-lg-2 col-md-2 text-center bg-white rounded shadow py-4 my-3">
                <img src="Image\facilities3.svg" width="80px">
                <h5 class="mt-3">TV</h5>
            </div>
            <div class="col-lg-2 col-md-2 text-center bg-white rounded shadow py-4 my-3">
                <img src="Image\facilities4.svg" width="80px">
                <h5 class="mt-3">BED</h5>
            </div>
            <div class="col-lg-2 col-md-2 text-center bg-white rounded shadow py-4 my-3">
                <img src="Image\facilities5.svg" width="80px">
                <h5 class="mt-3">AC</h5>
            </div>
            <div class="col-lg-12 text-center mt-5">
                <a href="#" class="btn btn-sm btn-outline-dark rounded-0 fw-bold shadow-none">More Facility
                    >>>></a><br><br>
            </div>
        </div>
    </div>

    <!-- Testimonial -->
    <h2 class="mt-5 pt-4 mb-4 text-center fw-bold h-font merienda"> TESTIMONIALS </h2>

    <div class="container mt-5">
        <div class="swiper Swiper-testimonials">
            <div class="swiper-wrapper mb-5 ">
                <div class="swiper-slide bg-white p-4">
                    <div class="profile d-flex align-items-center mb-3">
                        <i class="bi bi-star-fill"></i>
                        <h6 class="m-0 ms-2">Room user 1</h6>
                    </div>
                    <p>"The check-in was super fast and hassle-free. It felt like everything was already prepared before
                        we arrived."</p>
                    <div class="rating">
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                    </div>
                </div>

                <div class="swiper-slide bg-white p-4">
                    <div class="profile d-flex align-items-center mb-3">
                        <i class="bi bi-star-fill"></i>
                        <h6 class="m-0 ms-2">Room user 2</h6>
                    </div>
                    <p>"Booking the room online was quick and I got my confirmation instantly. I liked how I could
                        choose my room preferences easily."</p>
                    <div class="rating">
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                    </div>
                </div>

                <div class="swiper-slide bg-white p-4">
                    <div class="profile d-flex align-items-center mb-3">
                        <i class="bi bi-star-fill"></i>
                        <h6 class="m-0 ms-2">Room user 3</h6>
                    </div>
                    <p>"The bill was ready when I checked out, and it was accurate without any confusion. I even got a
                        digital copy right away."</p>
                    <div class="rating">
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                    </div>
                </div>

                <div class="swiper-slide bg-white p-4">
                    <div class="profile d-flex align-items-center mb-3">
                        <i class="bi bi-star-fill"></i>
                        <h6 class="m-0 ms-2">Room user 4</h6>
                    </div>
                    <p>"Room service requests were handled quickly, and I could track my orders through the hotel app.
                        Really convenient!"</p>
                    <div class="rating">
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                    </div>
                </div>

                <div class="swiper-slide bg-white p-4">
                    <div class="profile d-flex align-items-center mb-3">
                        <i class="bi bi-star-fill"></i>
                        <h6 class="m-0 ms-2">Room user 5</h6>
                    </div>
                    <p>
                        "They remembered my room preference from my last stay and even greeted me by name. It felt very
                        personal.".</p>
                    <div class="rating">
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                    </div>
                </div>

                <div class="swiper-slide bg-white p-4">
                    <div class="profile d-flex align-items-center mb-3">
                        <i class="bi bi-star-fill"></i>
                        <h6 class="m-0 ms-2">Room user 6</h6>
                    </div>
                    <p>"Booking the room online was quick and I got my confirmation instantly. I liked how I could
                        choose my room preferences easily."</p>
                    <div class="rating">
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                    </div>
                </div>


            </div>
            <div class="swiper-pagination"></div>
        </div>
        <div class="col-lg-12 text-center mt-5">
            <a href="#" class="btn btn-sm btn-outline-dark rounded-0 fw-bold shadow-none">Know More </a><br><br>
        </div>
    </div>

    <!-- REACH US -->
    <h2 class="mt-5 pt-4 mb-4 text-center fw-bold h-font">REACH US</h2>

    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-md-8 p-4 mb-lg-0 mb-3 bg-white rounded">
                <iframe class="w-100" height="320"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115132.86724361168!2d85.06064087374844!3d25.608169162910194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f29937c52d4f05%3A0x831a0e05f607b270!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1735926306666!5m2!1sen!2sin"
                    height="450" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div class="col-lg-4 col-md-4">
                <div class="bg-white p-4 rounded mb-4 ">
                    <h5>Call us</h5>
                    <a href="tel: +91 9060735605" class="d-inline-block text-decoration-none text-dark"></a><i
                        class="bi bi-telephone"></i>+91 9142609665</a>
                    <br> <a href="tel: +91 9060735605" class="d-inline-block text-decoration-none text-dark"></a><i
                        class="bi bi-telephone"></i>+91 9142609665</a>
                </div>

                <div class="bg-white p-4 rounded mb-4 ">
                    <h5>Follow us</h5>
                    <a href="#" class="d-inline-block mb-3">
                        <span class="badge bg-light text-dark fs-6 p-2">
                            <i class="bi bi-twitter me-1"></i>Twitter
                        </span>
                    </a><br>
                    <a href="https://www.facebook.com/share/16HT5fmTqE/" class="d-inline-block mb-3">
                        <span class="badge bg-light text-dark fs-6 p-2">
                            <i class="bi bi-facebook me-1"></i>Facebook
                        </span>
                    </a><br>
                    <a href="https://www.instagram.com/aryan_sharma___06?igsh=MTg2dmt5ZGVyamlmMQ==" class="d-inline-block mb-3">
                        <span class="badge bg-light text-dark fs-6 p-2">
                            <i class="bi bi-instagram me-1 "></i>Instagram
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="container-fluid bg-white mt-5">
        <div class="row">
            <div class="col-lg-4 p-4">
                <h3 class="h-font fw-bold fs-3 mb-2 merienda">Tj Hotel</h3>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Optio minus aspernatur enim autem rem qui,
                    odit officiis repellat quisquam architecto numquam! Perspiciatis culpa,
                    voluptatibus libero provident facilis perferendis cupiditate nam.
                </p>
            </div>
            <div class="col-lg-4 p-4">
                <h5 class="mb-3"> links </h5>
                <a href="#" class="d-inline-black mb-2 text-dark text-decoration-none ">Home</a><br>
                <a href="#" class="d-inline-black mb-2 text-dark text-decoration-none ">Rooms</a><br>
                <a href="#" class="d-inline-black mb-2 text-dark text-decoration-none ">Facilities</a><br>
                <a href="#" class="d-inline-black mb-2 text-dark text-decoration-none ">Contact Us</a><br>
                <a href="#" class="d-inline-black mb-2 text-dark text-decoration-none ">About</a><br>
            </div>
            <div class="col-lg-4 p-4">
                <h5 class="mb-3">Follow us</h5>
                <a href="#" class="d-inline-block mb-2 text-dark text-decoration-none mb-2"><i
                        class="bi bi-twitter me-1"></i>Twitter </a> <br>
                <a href="#" class="d-inline-block mb-2 text-dark text-decoration-none mb-2"><i
                        class="bi bi-facebook me-1"></i>Facebook </a><br>
                <a href="#" class="d-inline-block mb-2 text-dark text-decoration-none "><i
                        class="bi bi-instagram me-1"></i>Instagram </a>
            </div>
        </div>
    </div>


    <h6 class=" text-center bg-dark text-white p-3 m-0">Designed and Developed by Tj Hotel</h6>







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