<!DOCTYPE html>
<html class="no-js" lang="en">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>Home Three</title>
  <meta name="description" content="" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- favicon
		============================================ -->
  <link rel="shortcut icon" type="image/x-icon" href="{{ publicPath() }}frontend/img/favicon.ico" />

  <!-- Google Fonts
		============================================ -->
  <link href="https://fonts.googleapis.com/css?family=Poppins:400,300,500,600,700" rel="stylesheet" type="text/css" />

  <!-- Style CSS
		============================================ -->
  <link rel="stylesheet" href="{{ publicPath() }}frontend/style.css" />

  <!-- Modernizr JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/vendor/modernizr-2.8.3.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.5/dist/cdn.min.js" defer></script>


</head>

<body>
  <!--Header Area Start-->
  <header class="header-three">
    <div class="header-top">
      <div class="container">
        <div class="row px-3 d-flex justify-content-between align-items-center">
          <div class="">
            <div class="header-top-info">
                <span x-data="{
                remaining: '',
                init() {
                    this.updateTime();
                    setInterval(() => this.updateTime(), 1000);
                },
                updateTime() {
                    const now = new Date();
                    const close = new Date();
                    close.setHours(18, 0, 0, 0); // 6:00 PM
                    const diff = close - now;
                    if (diff <= 0) {
                        this.remaining = 'Closed';
                        return;
                    }
                    const hrs = Math.floor(diff / 1000 / 60 / 60);
                    const mins = Math.floor((diff / 1000 / 60) % 60);
                    const secs = Math.floor((diff / 1000) % 60);
                    this.remaining = `${hrs}h ${mins}m ${secs}s`;
                }
            }" x-init="init()">
              <i class="fa fa-clock-o"></i> Closes in: <span x-text="remaining"></span>
            </span>

            
            </div>
          </div>
          <div class="" style="display: flex
;
    justify-content: end;
    align-items: center;">
            <div class="header-login-register">
              <ul class="login">
                <li>
                  <a href="{{ route('admin.login')}}"><i class="fa fa-key"></i>Login</a>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </div>
    </div>
    <!--Logo Mainmenu Start-->
    <div class="header-logo-menu sticker">
      <div class="container">
        <div class="logo-menu-bg">
          <div class="row">
            <div class="col-lg-3 col-md-12">
              <div class="logo">
                <a href="{{route('home')}}"> <img src="{{publicPath('logo.png')}}" class="img-fluid" loading="lazy" height="50"  alt="logo"> </a>
              </div>
            </div>
            <div class="col-lg-9 d-none d-lg-block">
              <div class="mainmenu-area">
                <div class="mainmenu">
                  <nav>
                    <ul id="nav">
                      <li class="current">
                        <a href="{{ route('home') }}">Home <i class="fa fa-angle-down"></i></a>
                      </li>
                      <li><a href="{{ route('about') }}">About us</a></li>

                      <li><a href="{{ route('contact') }}">Contact</a></li>
                    </ul>
                  </nav>
                </div>
                
                <!--Search Form-->
                <div class="search">
                  <div class="search-form">
                    <form id="search-form" action="#">
                      <input type="search" placeholder="Search here..." name="search" />
                      <button type="submit">
                        <span><i class="fa fa-search"></i></span>
                      </button>
                    </form>
                  </div>
                </div>
                <!--End of Search Form-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--End of Logo Mainmenu-->
    <!-- Mobile Menu Area start -->
    <div class="mobile-menu-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <div class="mobile-menu">
              <nav id="dropdown">
                <ul>
                  <li>
                    <a href="{{route('home')}}">HOME</a>
                  
                  </li>
                  <li><a href="{{route('about')}}">About Us</a></li>
                 
                
                  
                  <li><a href="{{route('contact')}}">CONTACT</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Mobile Menu Area end -->
  </header>



  @yield('content')

  <!--End of Google Map Area-->
  <!--Footer Area Start-->
  <div class="footer-area">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="footer-info-container text-center section-padding">
            <div class="footer-logo">
              <a href="#"><img src="img/logo/footer-logo.png" alt="" /></a>
            </div>
            <div class="footer-info">
              <span><i class="fa fa-map-marker"></i> Boaring, Road, Patna
              </span>
              <span><i class="fa fa-envelope"></i>manish.jag8080@gmail.com</span>
              <span><i class="fa fa-phone"></i>9708195576</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-widget-container section-padding">
        <div class="row">
          <div class="col-lg-2 col-md-2 col-sm-4">
            <div class="single-footer-widget">
              <h4>Our School</h4>
              <ul class="footer-widget-list">
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
              </ul>

            </div>
          </div>
          <div class="col-lg-2 col-md-2 col-sm-4">
            <div class="single-footer-widget">
              <h4>Follow Us</h4>
              <ul class="footer-widget-list">
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">YouTube</a></li>
                <li><a href="#">Twitter</a></li>
              </ul>

            </div>
          </div>
          <div class="col-lg-2 col-md-2 col-sm-4">
            <div class="single-footer-widget">
              <h4>Support</h4>
              <ul class="footer-widget-list">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Parent Guide</a></li>
                <li><a href="#">Technical Support</a></li>
                <li><a href="#">FAQs</a></li>
              </ul>

            </div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
<div class="feature-box">
  <h3 class="text-white">Smart Learning, Smarter Future</h3>
  
    <p style="color: white;">
  Our School Management System is not just software — it’s a complete digital solution designed to simplify school operations, enhance learning, and improve communication between teachers, students, and parents.  
  With clean design, robust features, and easy-to-use tools, it supports academic excellence and administrative efficiency in every school environment.
</p>



  </p>
</div>


          </div>

        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="footer-container">
            <div class="row">
              <div class="col-lg-6">
                <span>&copy; {{ date('Y') }}
                  <span class="text-white">Designed and devlopment by Manish kumar</span>
              </div>
              <div class="col-lg-6">
                <div class="social-links">
                  <a href="#"><i class="fa fa-facebook"></i></a>
                  <a href="#"><i class="fa fa-google-plus"></i></a>
                  <a href="#"><i class="fa fa-twitter"></i></a>
                  <a href="#"><i class="fa fa-pinterest-p"></i></a>
                  <a href="#"><i class="fa fa-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--End of Footer Area-->

  <!-- jquery
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/vendor/jquery-1.12.3.min.js"></script>

  <!-- Popper JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/popper.js"></script>

  <!-- bootstrap JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/bootstrap.min.js"></script>

  <!-- bootstrap Toggle JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/bootstrap-toggle.min.js"></script>

  <!-- nivo slider js
		============================================ -->
  <script src="{{ publicPath() }}frontend/lib/nivo-slider/js/jquery.nivo.slider.js"></script>
  <script src="{{ publicPath() }}frontend/lib/nivo-slider/home.js"></script>

  <!-- wow JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/wow.min.js"></script>

  <!-- meanmenu JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/jquery.meanmenu.js"></script>

  <!-- Owl carousel JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/owl.carousel.min.js"></script>

  <!-- Countdown JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/jquery.countdown.min.js"></script>

  <!-- scrollUp JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/jquery.scrollUp.min.js"></script>

  <!-- Waypoints JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/waypoints.min.js"></script>

  <!-- Counterup JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/jquery.counterup.min.js"></script>

  <!-- Slick JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/slick.min.js"></script>

  <!-- Mix It Up JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/jquery.mixitup.js"></script>

  <!-- Venubox JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/venobox.min.js"></script>

  <!-- plugins JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/plugins.js"></script>

  <!-- Google Map js
		============================================ -->

  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBuU_0_uLMnFM-2oWod_fzC0atPZj7dHlU"></script>
  <script src="https://www.google.com/jsapi"></script>
  <script>
    function initialize() {
      var mapOptions = {
        zoom: 15,
        scrollwheel: false,
        center: new google.maps.LatLng(23.763494, 90.432226),
      };

      var map = new google.maps.Map(
        document.getElementById("googleMap"),
        mapOptions
      );

      var marker = new google.maps.Marker({
        position: map.getCenter(),
        animation: google.maps.Animation.BOUNCE,
        icon: "img/map-marker.png",
        map: map,
      });
    }

    google.maps.event.addDomListener(window, "load", initialize);
  </script>

  <!-- main JS
		============================================ -->
  <script src="{{ publicPath() }}frontend/js/main.js"></script>
</body>

<!-- Mirrored from demo.hasthemes.com/techedu-preview/techedu/index-3.html by HTTrack Website Copier/3.x [XR&CO'2014], Mon, 25 May 2020 13:44:44 GMT -->

</html>