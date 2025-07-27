<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facility</title>
    <?php require('inc/link.php'); ?>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
</head>
<body>
     
<?php require('inc/header.php'); ?>
<div class="my-5 px-4">
   <h2 class="fw-bold h-font text-center">OUR Rooms</h2> 
   <div class="h-line bg-dark"></div>
</div>

<div class="container">
    <div class="row">
        <!-- Sidebar for Filter (Left Column) -->
        <div class="col-lg-3 col-md-4 mb-4 px-lg-0">
            <nav class="navbar navbar-expand-lg navbar-light bg-white rounded shadow">
                <div class="container-fluid flex-lg-column align-items-stretch">
                    <h4 class="my-2">Filter</h4>
                    <button class="navbar-toggler shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#filterDropdown" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse flex-column mt-2 align-items-lg-stretch" id="filterDropdown">
                        <div class="border bg-light p-3 rounded mb-3">
                            <h5 class="mb-3" style="font-size: 18px;">CHECK AVAILABILITY</h5>
                            <label class="form-label">Check-in</label>
        l                    <input type="date" class="form-control shadow-none mb-3">
                            <label class="form-label">Check-out</label>
                            <input type="date" class="form-control shadow-none">
                        </div>
                        <div class="border bg-light p-3 rounded mb-3">
                            <h5 class="mb-3" style="font-size: 18px;">FACILITIES</h5>
                            <div class="mb-2">
                                <input type="checkbox" id="f1" class="form-check-input shadow-none me-1">
                                <label class="form-label" for="f1">Facility one</label>
                            </div>
                            <div class="mb-2">
                                <input type="checkbox" id="f2" class="form-check-input shadow-none me-1">
                                <label class="form-check-label" for="f2">Facility two</label>
                            </div>
                            <div class="mb-2">
                                <input type="checkbox" id="f3" class="form-check-input shadow-none me-1">
                                <label class="form-check-label" for="f3">Facility three</label>
                            </div>
                        </div>

                        <div class="border bg-light p-3 rounded mb-3">
                            <h5 class="mb-3" style="font-size: 18px;">GUESTS</h5>
                            <div class="d-flex">
                                <div class="me-3">
                                    <label class="form-label">Adults</label>
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

       <!-- Rooms Section -->
<div class="col-lg-9 col-md-12 px-4">
    <div class="card mb-4 border-0 shadow">
        <div class="row g-0 p-3 align-items-center">
            <!-- Room Image -->
            <div class="col-md-4 mb-lg-0 mb-md-0 mb-3">
                <img src="Image/Room-1.jpg" class="img-fluid rounded-start" alt="Room Image">
            </div>

            <!-- Room Features and Facilities -->
            <div class="col-md-5 px-lg-3 px-md-3 px-0">
                <h5 class="mb-1">Simple Room Name</h5>

                <!-- Room Features -->
                <div class="features mb-3 px-0">
                    <h6 class="mb-1">Features</h6>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">2 Rooms</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Bathroom</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Balcony</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">3 Sofas</span>
                </div>

                <!-- Room Facilities -->
                <div class="features ">
                    <h6 class="mb-1">Facilities</h6>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Wi-Fi</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Television</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">AC</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Room Heater</span>
                </div>
            </div>

            <!-- Room Pricing and Actions -->
            <div class="col-md-3 col-12 text-center">
                <h6 class="mb-4">₹200 per night</h6>
                <a href="#" class="btn btn-sm text-white custom-bg shadow-none">Book Now</a><br>
                <a href="#" class="btn btn-sm btn-outline-dark shadow-none mt-2">More Detail</a>
            </div>
        </div>
    </div>
    <div class="card mb-4 border-0 shadow">
        <div class="row g-0 p-3 align-items-center">
            <!-- Room Image -->
            <div class="col-md-4 mb-lg-0 mb-md-0 mb-3">
                <img src="Image/Room-1.jpg" class="img-fluid rounded-start" alt="Room Image">
            </div>

            <!-- Room Features and Facilities -->
            <div class="col-md-5 px-lg-3 px-md-3 px-0">
                <h5 class="mb-1">Simple Room Name</h5>

                <!-- Room Features -->
                <div class="features mb-3 px-0">
                    <h6 class="mb-1">Features</h6>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">2 Rooms</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Bathroom</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Balcony</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">3 Sofas</span>
                </div>

                <!-- Room Facilities -->
                <div class="features ">
                    <h6 class="mb-1">Facilities</h6>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Wi-Fi</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Television</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">AC</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Room Heater</span>
                </div>
            </div>

            <!-- Room Pricing and Actions -->
            <div class="col-md-3 col-12 text-center">
                <h6 class="mb-4">₹200 per night</h6>
                <a href="#" class="btn btn-sm text-white custom-bg shadow-none">Book Now</a><br>
                <a href="#" class="btn btn-sm btn-outline-dark shadow-none mt-2">More Detail</a>
            </div>
        </div>
    </div>
    <div class="card mb-4 border-0 shadow">
        <div class="row g-0 p-3 align-items-center">
            <!-- Room Image -->
            <div class="col-md-4 mb-lg-0 mb-md-0 mb-3">
                <img src="Image/Room-1.jpg" class="img-fluid rounded-start" alt="Room Image">
            </div>

            <!-- Room Features and Facilities -->
            <div class="col-md-5 px-lg-3 px-md-3 px-0">
                <h5 class="mb-1">Simple Room Name</h5>

                <!-- Room Features -->
                <div class="features mb-3 px-0">
                    <h6 class="mb-1">Features</h6>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">2 Rooms</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Bathroom</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Balcony</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">3 Sofas</span>
                </div>

                <!-- Room Facilities -->
                <div class="features ">
                    <h6 class="mb-1">Facilities</h6>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Wi-Fi</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Television</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">AC</span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Room Heater</span>
                </div>
            </div>

            <!-- Room Pricing and Actions -->
            <div class="col-md-3 col-12 text-center">
                <h6 class="mb-4">₹200 per night</h6>
                <a href="#" class="btn btn-sm text-white custom-bg shadow-none">Book Now</a><br>
                <a href="#" class="btn btn-sm btn-outline-dark shadow-none mt-2">More Detail</a>
            </div>
        </div>
    </div>
</div>

</div>
</div>



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
