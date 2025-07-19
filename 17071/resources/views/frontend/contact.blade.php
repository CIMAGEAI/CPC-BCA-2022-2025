
@extends('frontend.main')
@section('content')
    <div class="contact-area section-padding">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <div class="contact-area-container">
              <div class="single-title">
                <h3>Contact Info</h3>
              </div>
              <p>
                
  For any queries related to admissions, student records, fee payments, or technical support, feel free to reach out to our school office.  
  Our dedicated team is always available to assist parents, students, and staff with reliable information, guidance, and timely support to ensure smooth and effective communication.



              </p>
              <div class="contact-address-container">
                <div class="contact-address-info">
                  <div class="contact-icon">
                    <i class="fa fa-map-marker"></i>
                  </div>
                  <div class="contact-text">
                    <h4>Address</h4>
                    <span>Boaring Road, Patna</span>
                  </div>
                </div>
                <div class="contact-address-info">
                  <div class="contact-icon">
                    <i class="fa fa-phone"></i>
                  </div>
                  <div class="contact-text">
                    <h4>Phone</h4>
                    <span>9708195576</span>
                  </div>
                </div>
                <div class="contact-address-info">
                  <div class="contact-icon">
                    <i class="fa fa-envelope"></i>
                  </div>
                  <div class="contact-text">
                    <h4>Email</h4>
                    <span>manish.jag8080@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="contact-form">
              <div class="single-title">
                <h3>Send A Message</h3>
              </div>
              <div class="contact-form-container">
                <form
                  id="contact-form"
                  action="http://whizthemes.com/mail-php/contact/mail.php"
                  method="post"
                >
                  <div class="row">
                    <div class="col-md-6">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name *"
                      />
                    </div>
                    <div class="col-md-6">
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email *"
                      />
                    </div>
                  </div>
                  <input type="text" name="subject" placeholder="Subject *" />
                  <textarea
                    name="message"
                    class="yourmessage"
                    placeholder="Your message"
                  ></textarea>
                  <button
                    type="submit"
                    class="button-default button-yellow submit"
                  >
                    <i class="fa fa-send"></i>Submit
                  </button>
                </form>
                <p class="form-messege"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
@endsection