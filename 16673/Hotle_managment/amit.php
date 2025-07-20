    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TJ Hotel</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <link
            href="https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&family=Poppins:wght@400;500;600&display=swap"
            rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <style>
        .swiper-container {
            width: 100%;
            height: 500px;
            /* Set the desired height of the Swiper container */
        }

        .swiper-slide img {
            width: 100%;
            /* Ensures the image fills the full width */
            height: 100%;
            /* Ensures the image fills the full height */
            object-fit: cover;
            /* Ensures the image covers the area without distortion */
        }

        .poppins-regular {
            font-family: "Poppins", serif;
            font-weight: 400;
            font-style: normal;
        }

        .poppins-medium {
            font-family: "Poppins", serif;
            font-weight: 500;
            font-style: normal;
        }

        .poppins-semibold {
            font-family: "Poppins", serif;
            font-weight: 600;
            font-style: normal;
        }

        .merienda {
            font-family: "Merienda", serif;
            font-optical-sizing: auto;
            font-weight: <weight>;
            font-style: normal;
        }

        .custom-bg {
            background-color: #2ec12eac;
        }

        .custom-bg:hover {
            background-color: #279e8c;
        }

        .availability-form {
            margin-top: -50px;
            z-index: 2;
            position: relative;
        }

        @media screen and (max-width:575px) {
            .availability-form {
                margin-top: 0px;
                padding: 0 35;
            }
        }
        </style>
    </head>



    <body>

        <nav class="navbar navbar-expand-lg navbar-light bg-white px-lg-2 shadow-sm sticky-top">
            <div class="container-fluid">
                <a class="navbar-brand me-5 fw-bold fs-3 merienda" href="index.php">TJ Hotel</a>
                <button class="navbar-toggler shadow-none" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 poppins-medium ">
                        <li class="nav-item">
                            <a class="nav-link active me-2" aria-current="page" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link me-2" href="#">Rooms</a>
                        </li>
                        <li class="nav-item me-2">
                            <a class="nav-link" href="#">Facilities</a>
                        </li>
                        <li class="nav-item me-2">
                            <a class="nav-link" href="#">Contact Us</a>
                        </li>
                        <li class="nav-item me-2">
                            <a class="nav-link" href="#">About</a>
                        </li>


                    </ul>
                    <div class="d-flex">
                        <button type="button" class="btn btn-outline-dark shadow-none me-lg-3 me-2"
                            data-bs-toggle="modal" data-bs-target="#loginModal">
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

        <div class="modal fade" id="loginModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form>
                        <div class="modal-header">
                            <h5 class="modal-title d-flex align-items-center ">
                                <i class="bi bi-person-circle fs-3 me-2"></i>User Login
                            </h5>
                            <button type="reset" class="btn-close shadow-none" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Email address</label>
                                <input type="email" class="form-control shadow-none">
                            </div>
                            <div class="mb-4">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control shadow-none">
                            </div>
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <button type="submit" class="btn-dark shadow-none">LOGIN</button>
                                <a href="javascript: void(0)" class="text-decoration-none">Forgot Password</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="modal fade" id="ResisterModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <form>
                        <div class="modal-header">
                            <h5 class="modal-title d-flex align-items-center ">
                                <i class="bi bi-person-dash-fill fs-3 me-2"></i>User Registration
                            </h5>
                            <button type="reset" class="btn-close shadow-none" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <span class="badge rounded-pill bg-light text-dark mb-3 text-wrap lh-base">Note: Your detail
                                must match with your Id (Aadhaar card,password, driving license, etc.)
                                that will be required during check-in
                            </span>
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-md-6 ps-0 mb-3">
                                        <label class="form-label">Name</label>
                                        <input type="text" class="form-control shadow-none">
                                    </div>
                                    <div class="col-md-6 ps-0">
                                        <label class="form-label">Email Address</label>
                                        <input type="email" class="form-control shadow-none">
                                    </div>
                                    <div class="col-md-6 ps-0 mb-3">
                                        <label class="form-label">Phone no:</label>
                                        <input type="number" class="form-control shadow-none">
                                    </div>
                                    <div class="col-md-6 ps-0 mb-3">
                                        <label class="form-label">Picture</label>
                                        <input type="file" class="form-control shadow-none">
                                    </div>
                                    <div class="col-md-12 ps-0 mb-3">
                                        <label class="form-label">Address</label>
                                        <input type="text" class="form-control shadow-none">
                                    </div>
                                    <div class="col-md-6 ps-0 mb-3">
                                        <label class="form-label">Pin Code::</label>
                                        <input type="number" class="form-control shadow-none">
                                    </div>
                                    <div class="col-md-6 ps-0 mb-3">
                                        <label class="form-label">Date of Birth</label>
                                        <input type="date" class="form-control shadow-none">
                                    </div>
                                    <div class="col-md-6 ps-0 mb-3">
                                        <label class="form-label">Password:</label>
                                        <input type="password" class="form-control shadow-none">
                                    </div>
                                    <div class="col-md-6 ps-0 mb-3">
                                        <label class="form-label">Conform Password</label>
                                        <input type="password" class="form-control shadow-none">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center">
                            <button type="submit" class=" btn btn-dark shadow-none mb-4">RESISTER</button>
                        </div>


                        <!--   <div class="mb-3">
                <label class="form-label">Email address</label>
                <input type="email" class="form-control shadow-none">
            </div>
            <div class="mb-4">
                <label class="form-label">Password</label>
                <input type="password" class="form-control shadow-none">
            </div>
            <div class="d-flex align-items-center justify-content-between mb-2">
                <button type="submit" class=" btn btn-dark shadow-none">LOGIN</button>
                <a href="javascript: void(0)" class="text-decoration-none">Forgot Password</a>
            </div> -->
                </div>
                </form>
            </div>
        </div>
        </div>

        <!-- Carousel -->

        <div class="container-fluid px-lg-4 mt-4">
            <!-- Swiper -->
            <div class=" swiper swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <img src="Image\2pic.jpg" class="w-100 d-block" />
                    </div>
                    <div class="swiper-slide">
                        <img src="Image\3pic.jpg" class="w-100 d-block" />
                    </div>
                    <div class="swiper-slide">
                        <img src="Image\4pic.jpg" class="w-100 d-block" />
                    </div>
                    <div class="swiper-slide">
                        <img src="Image\3pic.jpg" class="w-100 d-block" />
                    </div>
                </div>
            </div>
        </div>

        <!-- check availability form -->

        <div class="container availability-form">
            <div class="row">
                <div class="col-lg-12 bg-white shadow p-4 rounded">
                    <h5 class="mb-4">Check Booking Availability</h5>
                    <form>
                        <div class="row align-items-end">
                            <div class="col-lg-3 mb-3">
                                <label class="form-label" style="font-weight: 500;">Check-in</label>
                                <input type="date" class="form-control shadow-none">
                            </div>
                            <div class="col-lg-3 mb-3">
                                <label class="form-label" style="font-weight: 500;">Check-out</label>
                                <input type="date" class="form-control shadow-none">
                            </div>
                            <div class="col-lg-3 mb-3">
                                <label class="form-label" style="font-weight: 500;">Adult</label>
                                <select class="form-select shadow-none">
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div class="col-lg-2 mb-3">
                                <label class="form-label" style="font-weight: 500;">Children</label>
                                <select class="form-select shadow-none">
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div class="col-lg-1 mt-2 mb-lg-3">
                                <button type="submit"
                                    class="btn custom-bg text-white shadow-none custom-bg">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <br><br><br>


        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous">
        </script>
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
        <script>
        var swiper = new Swiper(".swiper-container", {
            spaceBetween: 30,
            effect: "fade", // Use fade effect
            loop: true, // Optional: to enable looping of slides
            autoplay: {
                delay: 2500, // Optional: slide changes automatically every 2.5 seconds
            }
        });
        </script>

    </body>

    </html>