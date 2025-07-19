@extends('frontend.main')
@section('content')
 <!--End of Header Area-->
    <!--Slider Area Start-->
    <div class="slider-area slider-three-area">
      <div class="preview-2">
        <div id="nivoslider" class="slides">
          <img src="{{ publicPath() }}frontend/img/slider/5.jpg" alt="" title="#slider-1-caption1" />
          <img src="{{ publicPath() }}frontend/img/slider/6.jpg" alt="" title="#slider-1-caption2" />
        </div>
        <div id="slider-1-caption1" class="nivo-html-caption nivo-caption">
          <div class="banner-content slider-1">
            <div class="container">
              <div class="row">
                <div class="col-lg-6">
                  <div class="text-content hidden-xs">
                    <p class="sub-title">Your Child can be a genius</p>
                    <h1 class="title1">
                      best Education for <br />
                      Kids perfectly
                    </h1>
                    <div class="banner-readmore">
                      <a title="Read more" href="{{ route('contact') }}">make an enquiry</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="slider-1-caption2" class="nivo-html-caption nivo-caption">
          <div class="banner-content slider-2">
            <div class="container">
              <div class="row">
                <div class="col-lg-6">
                  <div class="text-content hidden-xs">
                    <p class="sub-title">Learn computer with fun</p>
                    <h1 class="title1">
                      best Education for<br />
                      Kids perfectly
                    </h1>
                    <div class="banner-readmore">
                      <a title="Read more" href="#">Enroll your child</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--End of Slider Area-->
    <!--Advertise Area Start-->
    <div class="advertise-area text-center section-sea-green">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <h2>
              Start Your Child’s Learning Journey With BrightMinds Academy Today!
            </h2>
            
          </div>
        </div>
      </div>
    </div>
    <!--End of Advertise Area-->
    <!--Class Area Start-->
    @if ($classs->count() > 0)
         <div class="class-area section-padding class-column">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="section-title-wrapper">
              <div class="section-title">
                <h3>Our Classes</h3>
                <p>Our preschool program has  dedicated classes</p>
              </div>
            </div>
          </div>
        </div>
        <div class="class-carousel carousel-style-one owl-carousel">
          @foreach ($classs as $class)
          <div class="single-class-column">
            <div class="single-class">
              <div class="single-class-image">
                <a href="#">
                  <img src="{{route('uploads',['file'=>$class->image,'folder'=>'sections'])}}" alt="classes image" loading="lazy" />
                  <span class="class-date">{{$class->created_at->format('M d')}} <span>{{$class->created_at->format('Y')}} </span></span>
                </a>
              </div>
              <div class="single-class-text">
                <div class="class-des">
                  <h4><a href="#">{{ $class->title }}</a></h4>
                  <p>
                    {!! $class->description !!}
                  </p>
                </div>
                <div class="class-schedule">
                  <span>AGE: {{$class->age}} years</span>
                  <span>CLASS SIZE: {{$class->class}}</span>
                  <span class="arrow"
                    ><a href="#"><i class="fa fa-angle-right"></i></a
                  ></span>
                </div>
              </div>
            </div>
          
          </div>
          @endforeach
         
        </div>
      </div>
    </div>
    @endif

    <!--End of Class Area-->
    <!--Fun Factor Area Start-->
    <div class="fun-factor-area fun-factor-three">
      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-md-3 col-sm-6 col-6">
            <div class="single-fun-factor">
              <div class="fun-factor-icon">
                <i class="fa fa-users"></i>
              </div>
              <h2><span class="counter">25</span></h2>
              <span>Teacher</span>
            </div>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-6 col-6">
            <div class="single-fun-factor">
              <div class="fun-factor-icon">
                <i class="fa fa-bank"></i>
              </div>
              <h2><span class="counter">45</span></h2>
              <span>Campus</span>
            </div>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-6 col-6">
            <div class="single-fun-factor">
              <div class="fun-factor-icon">
                <i class="fa fa-user"></i>
              </div>
              <h2><span class="counter">55</span></h2>
              <span>Students</span>
            </div>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-6 col-6">
            <div class="single-fun-factor">
              <div class="fun-factor-icon">
                <i class="fa fa-clock-o"></i>
              </div>
              <h2><span class="counter">250</span></h2>
              <span>Teaching Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--End of Fun Factor Area-->
    <!--Teachers Column Carousel Start-->
    
    @if ($teachers->count() > 0)
        
    <div class="teachers-column-carousel-area section-padding">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="section-title-wrapper">
              <div class="section-title">
                <h3>Our Teachers</h3>
                <p>We are glad to introduce our professional staff</p>
              </div>
            </div>
          </div>
        </div>
        <div class="teachers-column-carousel carousel-style-one owl-carousel">
         @foreach ($teachers as $item)
             
         <div class="single-teachers-column text-center">
           <div class="teachers-image-column">
             <a href="teacher-info.html">
               <img src="{{route('uploads',['file'=>$item->image,'folder'=>'sections'])}}" alt="teacher image" loading="lazy"/>
               <span class="class-date">{{$item->created_at->format('M d')}} <span>{{$item->created_at->format('Y')}} </span></span>
             </a>
           </div>
           <div class="teacher-column-carousel-text">
             <h4>{{ $item->title }}</h4>
             <span> {{ $item->age }} {{ $item->class }}</span>
             <p>
              {!! $item->description !!}

             </p>
           
           </div>
         </div>
         @endforeach
    
        </div>
      </div>
    </div>
    @endif


    <!--End of Teachers Column Carousel-->
    <!--Gallery Fullwidth Area start-->
    <div class="gallery-area gallery-fullwidth section-gray section-padding">
      <div class="section-title-wrapper">
        <div class="section-title">
          <h3>Our Gallery</h3>
          <p>Every photo tells a story — of smiles, growth, learning, and friendship. Take a glimpse into our wonderful school journey</p>
        </div>
      </div>
      <div class="gallery-wrapper">
        <div class="row no-gutters">
          <div
            class="single-items col-lg-3 col-md-3 col-sm-6 col-12 overlay-hover"
          >
            <div class="overlay-effect sea-green-overlay">
              <a href="#"><img src="{{ publicPath() }}frontend/img/gallery/13.jpg" alt="" /></a>
              <div class="gallery-hover-effect">
                <a class="gallery-icon venobox" href="img/gallery/13.jpg"
                  ><i class="fa fa-search-plus"></i
                ></a>
                <span class="gallery-text">Drawings</span>
              </div>
            </div>
          </div>
          <div
            class="single-items col-lg-3 col-md-3 col-sm-6 col-12 overlay-hover"
          >
            <div class="overlay-effect sea-green-overlay">
              <a href="#"><img src="{{ publicPath() }}frontend/img/gallery/3.jpg" alt="" /></a>
              <div class="gallery-hover-effect">
                <a class="gallery-icon venobox" href="img/gallery/3.jpg"
                  ><i class="fa fa-search-plus"></i
                ></a>
                <span class="gallery-text">Activities, Photos</span>
              </div>
            </div>
          </div>
          <div
            class="single-items col-lg-3 col-md-3 col-sm-6 col-12 overlay-hover"
          >
            <div class="overlay-effect sea-green-overlay">
              <a href="#"><img src="{{ publicPath() }}frontend/img/gallery/9.jpg" alt="" /></a>
              <div class="gallery-hover-effect">
                <a class="gallery-icon venobox" href="img/gallery/9.jpg"
                  ><i class="fa fa-search-plus"></i
                ></a>
                <span class="gallery-text">Play Time</span>
              </div>
            </div>
          </div>
          <div
            class="single-items col-lg-3 col-md-3 col-sm-6 col-12 overlay-hover"
          >
            <div class="overlay-effect sea-green-overlay">
              <a href="#"><img src="{{ publicPath() }}frontend/img/gallery/6.jpg" alt="" /></a>
              <div class="gallery-hover-effect">
                <a class="gallery-icon venobox" href="img/gallery/6.jpg"
                  ><i class="fa fa-search-plus"></i
                ></a>
                <span class="gallery-text">Excursions, Play</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="view-gallery text-center">
        <h4>See Our Kindergarten <span>Photo Gallery!</span></h4>
        <a href="#" class="button-default">View Now</a>
      </div>
    </div>
    <!--End of Gallery Fullwidth Area-->
    <!--Blog Area Start-->

    <!--End of Blog Area-->
    <!--Testimonial Small Carousel Start-->
    <div class="testimonial-small-carousel section-gray">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="section-title-wrapper">
              <div class="section-title">
                <h3>Our Testimonials</h3>
                <p>How Our School Management Solution is Making a Difference</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-8 col-lg-10 col-12 ml-auto mr-auto">
            <div class="testimonial-image-text-wrapper">
              <div class="testimonial-small-image-slider text-center">
                <div class="sin-testiImage">
                  <div class="teacher-image-carousel">
                    <img src="{{ publicPath() }}frontend/img/teacher/14.jpg" alt="" />
                  </div>
                </div>
                <div class="sin-testiImage">
                  <div class="teacher-image-carousel">
                    <img src="{{ publicPath() }}frontend/img/teacher/15.jpg" alt="" />
                  </div>
                </div>
                <div class="sin-testiImage">
                  <div class="teacher-image-carousel">
                    <img src="{{ publicPath() }}frontend/img/teacher/4.jpg" alt="" />
                  </div>
                </div>
                <div class="sin-testiImage">
                  <div class="teacher-image-carousel">
                    <img src="{{ publicPath() }}frontend/img/teacher/16.jpg" alt="" />
                  </div>
                </div>
                <div class="sin-testiImage">
                  <div class="teacher-image-carousel">
                    <img src="{{ publicPath() }}frontend/img/teacher/2.jpg" alt="" />
                  </div>
                </div>
                <div class="sin-testiImage">
                  <div class="teacher-image-carousel">
                    <img src="{{ publicPath() }}frontend/img/teacher/14.jpg" alt="" />
                  </div>
                </div>
                <div class="sin-testiImage">
                  <div class="teacher-image-carousel">
                    <img src="{{ publicPath() }}frontend/img/teacher/15.jpg" alt="" />
                  </div>
                </div>
                <div class="sin-testiImage">
                  <div class="teacher-image-carousel">
                    <img src="{{ publicPath() }}frontend/img/teacher/4.jpg" alt="" />
                  </div>
                </div>
                <div class="sin-testiImage">
                  <div class="teacher-image-carousel">
                    <img src="{{ publicPath() }}frontend/img/teacher/16.jpg" alt="" />
                  </div>
                </div>
                <div class="sin-testiImage">
                  <div class="teacher-image-carousel">
                    <img src="{{ publicPath() }}frontend/img/teacher/2.jpg" alt="" />
                  </div>
                </div>
              </div>
              <div class="testimonial-small-text-slider text-center">
                <div class="sin-testiText">
                  <h2> Neha Gupta</h2>
                  <span>Sience Director</span>
                  <p>
                    Science 
"I love how I can take attendance, upload marks, and communicate with parents all in one place!"


                  </p>
                </div>
                <div class="sin-testiText">
                  <h2> Ritu Malhotra</h2>
                  <span>  Admin Coordinator</span>
                  <p>
Fee collection and student data management is so organized now. No more paperwork hassles!


                  </p>
                </div>
                <div class="sin-testiText">
                  <h2> Sanjay Kumar</h2>
                  <span>  Computer Science Teacher, Harmony Public School</span>
                  <p>
                  
Expert in coding and digital literacy. He introduces students to computers, programming, and modern technology in a practical and easy-to-learn manner.


                  </p>
                </div>
                <div class="sin-testiText">
                  <h2>Kavita Nair</h2>
                  <span> English Teacher </span>
                  <p>
                   English Teacher
The dashboard is user-friendly and makes everyday tasks like homework updates and report generation super easy.
                  </p>
                </div>
                <div class="sin-testiText">
                  <h2> Anita Verma</h2>
                  <span> Principal, Blooming Valley School</span>
                  <p>
Managing staff, students, and academics has become smoother than ever. It saves time and improves school efficiency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--End of Testimonial Small Carousel-->
    <!--Google Map Area Start -->
    <div class="google-map-area">
      <!--  Map Section -->
      <div id="contacts" class="map-area">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230265.56973137337!2d84.97822588360062!3d25.608254695288544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f29937c52d4f05%3A0x831a0e05f607b270!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1752493405710!5m2!1sen!2sin"  style="width: 100%; height: 451px;"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    
      </div>
    </div>


@endsection