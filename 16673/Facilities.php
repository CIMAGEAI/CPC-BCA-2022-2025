<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facility</title>
    <?php require('inc/link.php'); ?>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

    <style>
    :root {
        --teal: rgb(184, 229, 49);
        /* Define the teal color here */
    }

    .pop:hover {
        border-top-color: var(--teal) !important;
        transform: scale(1.03);
        transition: all 0.3s;
    }
    </style>

</head>

<body>

    <?php require('inc/header.php'); ?>
    <div class="my-5 px-4">
        <h2 class="fw-bold h-font text-center">OUR FACILITIES</h2>
        <div class="h-line bg-dark"></div>
        <p class="text-center mt-3">
            A Hotel Management System is a digital solution that streamlines and automates hotel operations. <br>
            It manages bookings, check-ins, check-outs, billing, and room availability in real-time.The system <br>
            helps staff coordinate tasks efficiently and enhances the guest experience.It often includes modules <br>
            for inventory, housekeeping, customer data, and reporting.
        </p>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="bg-white rounded shadow p-4 border-top border-4 border-dark pop">
                    <div class="d-flex align-items-center mb-2">
                        <!-- Image with 2px margin and height set to 80px -->
                        <img src="Image/facilities-1.svg" style="height: 80px; margin-right: 2px;">
                        <h5 class="m-0 ms-3">Wifi</h5>
                    </div>
                    <p>Hotel Wi-Fi offers high-speed internet access throughout guest rooms and public areas.
                        It supports multiple devices, allowing guests to connect phones, laptops, and tablets.</p>
                </div>
            </div>

            <div class="col-lg-4 col-md-6 mb-4">
                <div class="bg-white rounded shadow p-4 border-top border-4 border-dark pop">
                    <div class="d-flex align-items-center mb-2">
                        <!-- Image with 2px margin and height set to 80px -->
                        <img src="Image/facilities2.svg" style="height: 80px; margin-right: 2px;">
                        <h5 class="m-0 ms-3">Fire</h5>
                    </div>
                    <p>Hotels are equipped with advanced fire detection systems, including smoke and heat detectors.
                        Fire alarms are installed throughout the building to provide immediate alerts in case of
                        emergencies.</p>
                </div>
            </div>

            <div class="col-lg-4 col-md-6 mb-4">
                <div class="bg-white rounded shadow p-4 border-top border-4 border-dark pop">
                    <div class="d-flex align-items-center mb-2">
                        <!-- Image with 2px margin and height set to 80px -->
                        <img src="Image/facilities3.svg" style="height: 80px; margin-right: 2px;">
                        <h5 class="m-0 ms-3">TV</h5>
                    </div>
                    <p>Hotel rooms are equipped with flat-screen TVs for guest entertainment and comfort.
                        They offer a variety of local and international channels, including news, movies, and sports.
                    </p>
                </div>
            </div>

            <div class="col-lg-4 col-md-6 mb-4">
                <div class="bg-white rounded shadow p-4 border-top border-4 border-dark pop">
                    <div class="d-flex align-items-center mb-2">
                        <!-- Image with 2px margin and height set to 80px -->
                        <img src="Image/facilities4.svg" style="height: 80px; margin-right: 2px;">
                        <h5 class="m-0 ms-3">Bed</h5>
                    </div>
                    <p>Hotel beds are designed for maximum comfort, often featuring high-quality mattresses and soft
                        linens.
                        They typically come with multiple pillow options to suit guest preferences.</p>
                </div>
            </div>

            <div class="col-lg-4 col-md-6 mb-4">
                <div class="bg-white rounded shadow p-4 border-top border-4 border-dark pop">
                    <div class="d-flex align-items-center mb-2">
                        <!-- Image with 2px margin and height set to 80px -->
                        <img src="Image/facilities5.svg" style="height: 80px; margin-right: 2px;">
                        <h5 class="m-0 ms-3">AC</h5>
                    </div>
                    <p>Hotel rooms are equipped with air conditioning systems to ensure a comfortable indoor climate.
                        Guests can control the temperature using in-room thermostats for personalized comfort.</p>
                </div>
            </div>

            <div class="col-lg-4 col-md-6 mb-4">
                <div class="bg-white rounded shadow p-4 border-top border-4 border-dark pop">
                    <div class="d-flex align-items-center mb-2">
                        <!-- Image with 2px margin and height set to 80px -->
                        <img src="Image\facilities4.svg" style="height: 80px; margin-right: 2px;">
                        <h5 class="m-0 ms-3"></h5>
                    </div>
                    <p>Hotel beds are designed for maximum comfort, often featuring high-quality mattresses and soft
                        linens.
                        They typically come with multiple pillow options to suit guest preferences.</p>
                </div>
            </div>

        </div>
    </div>






    <?php require('inc/footer.php'); ?>
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