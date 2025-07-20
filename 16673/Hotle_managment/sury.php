<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gandhi Hotle</title>
    <?php require('inc/link.php'); ?>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
    
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
    </style>
</head>
<body>
     
<?php require('inc/header.php'); ?>


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
                            <label class="form-label" style="font-weight: 500;">Guests</label>
                            <input type="number" class="form-control shadow-none" min="1">
                        </div>
                        <div class="col-lg-3 mb-3">
                            <button type="submit" class="btn custom-bg custom-bg:hover shadow-none w-50">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div><br><br>

    <!-- Our Rooms -->
<h2 class="mt-5 pt-4 mb-4 text-center fw-bold h-font merienda">Our Rooms >>></h2>
<div class="container">
    <div class="row">
        <div class="col-lg-4 col-md-6 my-3">
            <div class="card border-0 shadow" style="max-width: 350px; margin: auto;">
                <img src="Image/Room-1.jpg" class="card-img-top" alt="Simple Room 1 with double bed and seating">
                <div class="card-body">
                    <h5>Simple Room Name</h5>
                    <h6 class="mb-4">₹200 per night</h6>
                    <div class="features mb-4">
                        <h6 class="mb-1">Features</h6>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">2 Rooms</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Bathroom</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Balcony</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">3 Sofa</span>
                    </div> 
                    <div class="features mb-4">
                        <h6 class="mb-1">Facilities</h6>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Wi-Fi</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Television</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">AC</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Room Heater</span>
                    </div>
                    <div class="features mb-4">
                        <h6 class="mb-1">Guest</h6>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">4 Adult</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">5 children</span>
                    </div>
                    <div class="rating mb-4">
                        <h6 class="mb-1">Rating</h6>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                    </div>
                    <div class="d-flex justify-content-evenly mb-2">
                        <a href="book-now-page.html" class="btn btn-sm text-white custom-bg shadow-none">Book Now</a>
                        <a href="more-details-page.html" class="btn btn-sm btn-outline-dark shadow-none">More Detail</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 my-3">
            <div class="card border-0 shadow" style="max-width: 350px; margin: auto;">
                <img src="Image/Room-2.png" class="card-img-top" alt="Room 2 with double bed and seating area">
                <div class="card-body">
                    <h5>Simple Room Name</h5>
                    <h6 class="mb-4">₹200 per night</h6>
                    <div class="features mb-4">
                        <h6 class="mb-1">Features</h6>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">2 Rooms</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Bathroom</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Balcony</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">3 Sofa</span>
                    </div>
                    <div class="features mb-4">
                        <h6 class="mb-1">Facilities</h6>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Wi-Fi</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Television</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">AC</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Room Heater</span>
                    </div>
                    <div class="rating mb-4">
                        <h6 class="mb-1">Rating</h6>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                    </div>
                    <div class="d-flex justify-content-evenly mb-2">
                        <a href="book-now-page.html" class="btn btn-sm text-white custom-bg shadow-none">Book Now</a>
                        <a href="more-details-page.html" class="btn btn-sm btn-outline-dark shadow-none">More Detail</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 my-3">
            <div class="card border-0 shadow" style="max-width: 350px; margin: auto;">
                <img src="Image/Room-3.png" class="card-img-top" alt="Room 3 with modern furniture and décor">
                <div class="card-body">
                    <h5>Simple Room Name</h5>
                    <h6 class="mb-4">₹200 per night</h6>
                    <div class="features mb-4">
                        <h6 class="mb-1">Features</h6>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">2 Rooms</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Bathroom</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">1 Balcony</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">3 Sofa</span>
                    </div>
                    <div class="features mb-4">
                        <h6 class="mb-1">Facilities</h6>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Wi-Fi</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Television</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">AC</span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap merienda">Room Heater</span>
                    </div>
                    <div class="rating mb-4">
                        <h6 class="mb-1">Rating</h6>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                    </div>
                    <div class="d-flex justify-content-evenly mb-2">
                        <a href="book-now-page.html" class="btn btn-sm text-white custom-bg shadow-none">Book Now</a>
                        <a href="more-details-page.html" class="btn btn-sm btn-outline-dark shadow-none">More Detail</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-12 text-center mt-5">
            <a href="more-rooms-page.html" class="btn btn-sm btn-outline-dark rounded-0 fw-bold shadow-none">More Rooms</a>
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
            <img src="Image\facilities-1.svg" width="80px">
            <h5 class="mt-3">Wi-Fi</h5>
        </div>
        <div class="col-lg-2 col-md-2 text-center bg-white rounded shadow py-4 my-3">
            <img src="Image\facilities-1.svg" width="80px">
            <h5 class="mt-3">Wi-Fi</h5>
        </div>
        <div class="col-lg-2 col-md-2 text-center bg-white rounded shadow py-4 my-3">
            <img src="Image\facilities-1.svg" width="80px">
            <h5 class="mt-3">Wi-Fi</h5>
        </div>
        <div class="col-lg-2 col-md-2 text-center bg-white rounded shadow py-4 my-3">
            <img src="Image\facilities-1.svg" width="80px">
            <h5 class="mt-3">Wi-Fi</h5>
        </div>
        <div class="col-lg-12 text-center mt-5">
            <a href="#" class="btn btn-sm btn-outline-dark rounded-0 fw-bold shadow-none">More Facility >>>></a><br><br>
        </div>
    </div>
</div>
 
<!-- Testimonial -->  
<h2 class="mt-5 pt-4 mb-4 text-center fw-bold h-font merienda">TESTIMONIALS</h2>

<div class="container mt-5">
  <div class="swiper Swiper-testimonials">
    <div class="swiper-wrapper mb-5">
      <div class="swiper-slide bg-white p-4">
        <div class="profile d-flex align-items-center mb-3">
          <i class="bi bi-star-fill"></i>
          <h6 class="m-0 ms-2">Room user 1</h6>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam eligendi laboriosam perferendis voluptatem culpa, non sed exercitationem impedit quam fugit.</p>
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
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam eligendi laboriosam perferendis voluptatem culpa, non sed exercitationem impedit quam fugit.</p>
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
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam eligendi laboriosam perferendis voluptatem culpa, non sed exercitationem impedit quam fugit.</p>
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
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam eligendi laboriosam perferendis voluptatem culpa, non sed exercitationem impedit quam fugit.</p>
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
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam eligendi laboriosam perferendis voluptatem culpa, non sed exercitationem impedit quam fugit.</p>
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
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam eligendi laboriosam perferendis voluptatem culpa, non sed exercitationem impedit quam fugit.</p>
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
    <a href="#" class="btn btn-sm btn-outline-dark rounded-0 fw-bold shadow-none">Know More</a><br><br>
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
            <div class="bg-white p-4 rounded mb-4">
                <h5>Call us</h5>
                <a href="tel: +91 9060735605" class="d-inline-block text-decoration-none text-dark">
                    <i class="bi bi-telephone"></i>+91 9060735605
                </a>
                <br>
                <a href="tel: +91 9060735605" class="d-inline-block text-decoration-none text-dark">
                    <i class="bi bi-telephone"></i>+91 9060735605
                </a>
            </div>
            <div class="bg-white p-4 rounded mb-4">
                <h5>Follow us</h5>
                <a href="#" class="d-inline-block mb-3">
                    <span class="badge bg-light text-dark fs-6 p-2">
                        <i class="bi bi-twitter me-1"></i>Twitter
                    </span>
                </a>
                <br>
                <a href="#" class="d-inline-block mb-3">
                    <span class="badge bg-light text-dark fs-6 p-2">
                        <i class="bi bi-facebook me-1"></i>Facebook
                    </span>
                </a>
                <br>
                <a href="#" class="d-inline-block mb-3">
                    <span class="badge bg-light text-dark fs-6 p-2">
                        <i class="bi bi-instagram me-1"></i>Instagram
                    </span>
                </a>
            </div>
        </div>
    </div>
</div>



<?php require('inc/footer.php'); ?>
  

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
        slidesPerView:"3",  // Adjusts the number of slides visible at a time
        loop : true,     
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
        breakpoints:{
            320: {
                 slidesPerView:"1"
            },
            640: {
                 slidesPerView:"1"
            },
            768: {
                 slidesPerView:"2"
            },
            1024: {
                 slidesPerView:"3"
            },
        }
        });


    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
