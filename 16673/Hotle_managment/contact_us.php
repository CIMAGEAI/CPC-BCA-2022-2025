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
   <h2 class="fw-bold h-font text-center">OUR FACILITIES</h2> 
   <div class="h-line bg-dark"></div>
   <p class="text-center mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, minima.<br> Natus hic doloribus autem eaque libero provident numquam placeat dolore.</p>
</div>

<div class="container">
    <div class="row">
     <div class="col-lg-6 col-md-6 mb-5 px-4 rounded shadow">
        <iframe class="w-100 rounded mb-4" height="320" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115132.86724361168!2d85.06064087374844!3d25.608169162910194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f29937c52d4f05%3A0x831a0e05f607b270!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1735926306666!5m2!1sen!2sin"  height="450" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          <h5>Address</h5> 
          <a href="https://maps.app.goo.gl/3oAFbJh8SkGGZBAD8" target="_blank" class="d-inline-block text-decoration-none text-dark mb-2"><i class="bi bi-geo-alt"></i>Tj,Hotel, patliputra Patna , Bihar</a>
          <h5 class="mt-2">Call us</h5>
                <a href="tel: +91 9060735605" class="d-inline-block text-decoration-none text-dark">
                    <i class="bi bi-telephone"></i>+91 9060735605
                </a>
                <br>
                <a href="tel: +91 9060735605" class="d-inline-block text-decoration-none text-dark">
                    <i class="bi bi-telephone"></i>+91 9060735605
                </a>
                <h5 class="mt-4">Email</h5>
                <a href="mailto:suryant5605@gmail.com" class="d-inline-block text-decoration-none text-dark">
                 <i class="bi bi-envelope p-2"></i>suryant5605@gmail.com</a>


                    <h5 class="mt4">Follow us</h5>
                <a href="#" class="d-inline-block text-dark fs-5 me-2">
                        <i class="bi bi-twitter me-1"></i>
                </a>

                <a href="#" class="d-inline-block text-dark fs-5 me-2">
                        <i class="bi bi-facebook me-1"></i>
                </a>
               
                <a href="#" class="d-inline-block text-dark fs-5 ">
                        <i class="bi bi-instagram me-1"></i>
                </a>
        </div>
        

    <div class="col-lg-6 col-md-6 px-4">
        <div class="bg-white rounded shadow p-4 ">
           <form>
            <h3>Send a massage.</h3>
            <div class="mt-3">
              <label class="form-label" style="font-weight:500;">Name </label>
              <input type="text" class="form-control shadow-none">
                </div>
                <div class="mt-3">
              <label class="form-label" style="font-weight:500;">Email </label>
              <input type="Email" class="form-control shadow-none">
                </div>
                <div class="mt-3">
              <label class="form-label" style="font-weight:500;">subject</label>
              <input type="text" class="form-control shadow-none">
                </div>
                <div class="mt-3">
              <label class="form-label" style="font-weight:500">Message</label> </label>
              <textarea class="form-control shadow-none" row="1" style="resize: none;"></textarea>
                </div>
                
                <button type="submit" class="btn text-white custom-bg mt-3">SEND</button>
            </h5>
           </form>     
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
