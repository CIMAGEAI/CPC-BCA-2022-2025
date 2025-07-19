<?php
include 'config.php';
session_start();

// Page redirect
$usermail = $_SESSION['usermail'] ?? '';
if (!$usermail) {
  header("location: index.php");
  exit();
}

// Create rooms table if not exists
$createTableQuery = "CREATE TABLE IF NOT EXISTS allotted_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    booked_status BOOLEAN DEFAULT FALSE,
    booking_date DATE,
    checkout_date DATE,
    UNIQUE (room_number)
)";

mysqli_query($conn, $createTableQuery);

// Initialize rooms if table is empty
$checkRoomsQuery = "SELECT COUNT(*) as count FROM allotted_rooms";
$result = mysqli_query($conn, $checkRoomsQuery);
$row = mysqli_fetch_assoc($result);

if ($row['count'] == 0) {
  // Insert rooms
  $roomTypes = [
    'Superior Room' => range(401, 410),
    'Deluxe Room' => range(301, 310),
    'Guest House' => range(201, 210),
    'Single Room' => range(101, 110)
  ];

  foreach ($roomTypes as $type => $numbers) {
    foreach ($numbers as $number) {
      mysqli_query($conn, "INSERT INTO allotted_rooms (room_number, room_type) VALUES ('$number', '$type')");
    }
  }
}

// Handle booking submission
if (isset($_POST['guestdetailsubmit'])) {
  $Name = mysqli_real_escape_string($conn, $_POST['Name']);
  $Email = mysqli_real_escape_string($conn, $_POST['Email']);
  $Country = mysqli_real_escape_string($conn, $_POST['Country']);
  $Phone = mysqli_real_escape_string($conn, $_POST['Phone']);
  $RoomType = mysqli_real_escape_string($conn, $_POST['RoomType']);
  $Bed = mysqli_real_escape_string($conn, $_POST['Bed']);
  $RoomNumber = mysqli_real_escape_string($conn, $_POST['RoomNumber']);
  $Meal = mysqli_real_escape_string($conn, $_POST['Meal']);
  $cin = mysqli_real_escape_string($conn, $_POST['cin']);
  $cout = mysqli_real_escape_string($conn, $_POST['cout']);

  if (empty($Name) || empty($Email) || empty($Country) || empty($RoomNumber)) {
    echo "<script>swal({title: 'Fill the proper details', icon: 'error'});</script>";
  } else {
    $sta = "NotConfirm";
    $sql = "INSERT INTO roombook(Name,Email,Country,Phone,RoomType,Bed,NoofRoom,Meal,cin,cout,stat,nodays) 
                VALUES ('$Name','$Email','$Country','$Phone','$RoomType','$Bed','$RoomNumber','$Meal','$cin','$cout','$sta',DATEDIFF('$cout','$cin'))";
    $result = mysqli_query($conn, $sql);

    if ($result) {
    // Update room status
    $updateQuery = "UPDATE allotted_rooms SET 
                   booked_status = TRUE, 
                   booking_date = '$cin', 
                   checkout_date = '$cout' 
                   WHERE room_number = '$RoomNumber'";
    mysqli_query($conn, $updateQuery);

    echo "<script>
        swal({title: 'Reservation successful!', icon: 'success'})
        .then(() => {
            window.location.href = 'payment.php?roomtype=" . urlencode($RoomType) . "';
        });
    </script>";


      // echo "<script>
      //     swal({title: 'Reservation successful', icon: 'success'})
      //     .then(() => {
      //         document.getElementById('guestdetailpanel').style.display = 'none';
      //         window.location.reload();
      //     });
      // </script>";


    } else {
      echo "<script>swal({title: 'Something went wrong', icon: 'error'});</script>";
    }
  }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Desert Hotel</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css">
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
  <link rel="stylesheet" href="./css/home.css">
  <link rel="stylesheet" href="./admin/css/roombook.css">
  <style>
    /* Booking Panel Styles */
    #guestdetailpanel {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }

    .guestdetailpanelform {
      background: white;
      padding: 30px;
      border-radius: 10px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    }

    #guestdetailpanel .middle {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .guestinfo,
    .reservationinfo {
      flex: 1;
      width: 330px;
    }

    .line {
      display: none;
    }

    .room-number-select {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .disabled-room {
      color: #999;
      background-color: #f5f5f5;
    }

    #phone-error {
      color: red;
      font-size: 14px;
      display: block;
      margin-top: -10px;
      margin-bottom: 10px;
    }

    .datesection {
      display: flex;
      gap: 15px;
    }

    .datesection span {
      flex: 1;
    }

    .datesection input {
      width: 100%;
    }

    /* Contact form styling */
    #contactus {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      padding: 40px;
      margin-top: 30px;
      border-radius: 12px;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
      width: 100%;
    }

    .contactform {
      width: 100%;
      max-width: 500px;
    }

    .contactform h4 {
      margin-bottom: 20px;
      text-align: center;
      color: #333;
    }

    .contactform input,
    .contactform textarea {
      width: 100%;
      padding: 10px 15px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 16px;
    }

    .contactform button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 12px 20px;
      font-size: 16px;
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
    }

    .contactform button:hover {
      background-color: #0056b3;
    }

    .createdby {
      margin-top: 60px;
      text-align: center;
      color: #000;
      font-size: 14px;
    }


    /* Make sure book buttons are visible */
    .bookbtn {
      margin-top: 15px;
    }
    .fancy-welcome {
  font-family: 'Segoe Script', 'Brush Script MT', cursive;
  font-size: 60px;
  text-align: center;
  color: #a16832;
  margin-top: 40px;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.fancy-welcome span {
  font-weight: bold;
  color: #8a4b15;
}
  </style>
</head>

<body>
  <nav>
    <div class="logo">
      <img class="deserthotellogo" src="./image/icon/bluebirdlogo.png" alt="logo">
      <p>DESERT HOTEL</p>
    </div>
    <ul>
      <li><a href="#firstsection">Home</a></li>
      <li><a href="#secondsection">Rooms</a></li>
      <li><a href="#thirdsection">Services</a></li>
      <li><a href="#contactus">contact us</a></li>
      <a href="./logout.php"><button class="btn btn-danger">Logout</button></a>
    </ul>
  </nav>

  <section id="firstsection" class="carousel slide carousel_section" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img class="carousel-image" src="./image/superior_room.jpg">
      </div>
      <div class="carousel-item">
        <img class="carousel-image" src="./image/delux_room.jpg">
      </div>
      <div class="carousel-item">
        <img class="carousel-image" src="./image/hotel3.jpg">
      </div>
      <div class="carousel-item">
        <img class="carousel-image" src="./image/single.room.jpg" alt="single ROOM">
      </div>

      <div class="welcomeline">
        <h1 class="fancy-welcome">🍃 Welcome to <span>Desert Hotel</span> 🍃</h1>
      </div>
    </div>
  </section>

  <section id="secondsection">
    <img src="./image/homeanimatebg.svg">
    <div class="ourroom">
      <h1 class="head">Our room</h1>
      <div class="roomselect">
        <div class="roombox">
          <div class="hotelphoto h1"></div>
          <div class="roomdata">
            <h2>Superior Room</h2>
            <div class="services">
              <i class="fa-solid fa-wifi"></i>
              <i class="fa-solid fa-burger"></i>
              <i class="fa-solid fa-spa"></i>
              <i class="fa-solid fa-dumbbell"></i>
              <i class="fa-solid fa-person-swimming"></i>
            </div>
            <button class="btn btn-primary bookbtn">Book</button>
          </div>
        </div>
        <div class="roombox">
          <div class="hotelphoto h2"></div>
          <div class="roomdata">
            <h2>Delux Room</h2>
            <div class="services">
              <i class="fa-solid fa-wifi"></i>
              <i class="fa-solid fa-burger"></i>
              <i class="fa-solid fa-spa"></i>
              <i class="fa-solid fa-dumbbell"></i>
              <i class="fa-solid fa-person-swimming"></i>
            </div>
            <button class="btn btn-primary bookbtn">Book</button>
          </div>
        </div>
        <div class="roombox">
          <div class="hotelphoto h3"></div>
          <div class="roomdata">
            <h2>Guest Room</h2>
            <div class="services">
              <i class="fa-solid fa-wifi"></i>
              <i class="fa-solid fa-burger"></i>
              <i class="fa-solid fa-spa"></i>
              <i class="fa-solid fa-dumbbell"></i>
              <i class="fa-solid fa-person-swimming"></i>
            </div>
            <button class="btn btn-primary bookbtn">Book</button>
          </div>
        </div>
        <div class="roombox">
          <div class="hotelphoto h4"></div>
          <div class="roomdata">
            <h2>Single Room</h2>
            <div class="services">
              <i class="fa-solid fa-wifi"></i>
              <i class="fa-solid fa-burger"></i>
              <i class="fa-solid fa-spa"></i>
              <i class="fa-solid fa-dumbbell"></i>
              <i class="fa-solid fa-person-swimming"></i>
            </div>
            <button class="btn btn-primary bookbtn">Book</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="thirdsection">
  <h1 class="head">Services</h1>
  <div class="Service">

    <div class="box">
      <img src="image/pool.jpg" alt="Swimming Pool">
      <p>Swimming Pool</p>
    </div>

    <div class="box">
      <img src="image/restaurant.jpg" alt="Restaurants">
      <p>24*7 Restaurants</p>
    </div>

    <div class="box">
      <img src="image/gym.jpg" alt="Gym">
      <p>24*7 Gym</p>
    </div>

    <div class="box">
      <img src="image/helicopter.jpg" alt="12*7 Helicopter Service">
      <p>12*7 Helicopter Service</p>
    </div>
</section>

  <section id="contactus">
    <div class="social">
      <i class="fa-brands fa-instagram"></i>
      <i class="fa-brands fa-facebook"></i>
    </div>
    <div class="createdby">
      <h5>Developed by SHABANA</h5>
    </div>
    <form action="contact.php" method="POST" class="contactform">
      <h4>Contact Us</h4>
      <input type="text" name="name" placeholder="Enter Your Name" required>
      <input type="email" name="email" placeholder="Enter Your Email" required>
      <textarea name="message" placeholder="Your Message..." required></textarea>
      <button type="submit">Send Message</button>
    </form>
  </section>

  <!-- Booking Panel -->
  <div id="guestdetailpanel">
    <form action="payment.php" method="POST" class="guestdetailpanelform">
      <div class="head d-flex justify-content-between align-items-center mb-3">
        <h3>RESERVATION</h3>
        <i class="fa-solid fa-circle-xmark" style="cursor:pointer; font-size:24px;" onclick="closeBookingPanel()"></i>
      </div>
      <div class="middle">
        <div class="guestinfo">
          <h4>Guest information</h4>
          <input type="text" name="Name" placeholder="Enter Full name" class="form-control mb-3" required>
          <input type="email" name="Email" placeholder="Enter Email" class="form-control mb-3" required>

          <?php
          $countries = [
            "Afghanistan",
            "Albania",
            "Algeria",
            "Andorra",
            "Angola",
            "Antigua and Barbuda",
            "Argentina",
            "Armenia",
            "Australia",
            "Austria",
            "Azerbaijan",
            "Bahamas",
            "Bahrain",
            "Bangladesh",
            "Barbados",
            "Belarus",
            "Belgium",
            "Belize",
            "Benin",
            "Bhutan",
            "Bolivia",
            "Bosnia and Herzegovina",
            "Botswana",
            "Brazil",
            "Brunei",
            "Bulgaria",
            "Burkina Faso",
            "Burundi",
            "Côte d'Ivoire",
            "Cabo Verde",
            "Cambodia",
            "Cameroon",
            "Canada",
            "Central African Republic",
            "Chad",
            "Chile",
            "China",
            "Colombia",
            "Comoros",
            "Congo (Congo-Brazzaville)",
            "Costa Rica",
            "Croatia",
            "Cuba",
            "Cyprus",
            "Czechia (Czech Republic)",
            "Democratic Republic of the Congo",
            "Denmark",
            "Djibouti",
            "Dominica",
            "Dominican Republic",
            "Ecuador",
            "Egypt",
            "El Salvador",
            "Equatorial Guinea",
            "Eritrea",
            "Estonia",
            "Eswatini",
            "Ethiopia",
            "Fiji",
            "Finland",
            "France",
            "Gabon",
            "Gambia",
            "Georgia",
            "Germany",
            "Ghana",
            "Greece",
            "Grenada",
            "Guatemala",
            "Guinea",
            "Guinea-Bissau",
            "Guyana",
            "Haiti",
            "Holy See",
            "Honduras",
            "Hungary",
            "Iceland",
            "India",
            "Indonesia",
            "Iran",
            "Iraq",
            "Ireland",
            "Israel",
            "Italy",
            "Jamaica",
            "Japan",
            "Jordan",
            "Kazakhstan",
            "Kenya",
            "Kiribati",
            "Kuwait",
            "Kyrgyzstan",
            "Laos",
            "Latvia",
            "Lebanon",
            "Lesotho",
            "Liberia",
            "Libya",
            "Liechtenstein",
            "Lithuania",
            "Luxembourg",
            "Madagascar",
            "Malawi",
            "Malaysia",
            "Maldives",
            "Mali",
            "Malta",
            "Marshall Islands",
            "Mauritania",
            "Mauritius",
            "Mexico",
            "Micronesia",
            "Moldova",
            "Monaco",
            "Mongolia",
            "Montenegro",
            "Morocco",
            "Mozambique",
            "Myanmar (formerly Burma)",
            "Namibia",
            "Nauru",
            "Nepal",
            "Netherlands",
            "New Zealand",
            "Nicaragua",
            "Niger",
            "Nigeria",
            "North Korea",
            "North Macedonia",
            "Norway",
            "Oman",
            "Pakistan",
            "Palau",
            "Palestine State",
            "Panama",
            "Papua New Guinea",
            "Paraguay",
            "Peru",
            "Philippines",
            "Poland",
            "Portugal",
            "Qatar",
            "Romania",
            "Russia",
            "Rwanda",
            "Saint Kitts and Nevis",
            "Saint Lucia",
            "Saint Vincent and the Grenadines",
            "Samoa",
            "San Marino",
            "Sao Tome and Principe",
            "Saudi Arabia",
            "Senegal",
            "Serbia",
            "Seychelles",
            "Sierra Leone",
            "Singapore",
            "Slovakia",
            "Slovenia",
            "Solomon Islands",
            "Somalia",
            "South Africa",
            "South Korea",
            "South Sudan",
            "Spain",
            "Sri Lanka",
            "Sudan",
            "Suriname",
            "Sweden",
            "Switzerland",
            "Syria",
            "Tajikistan",
            "Tanzania",
            "Thailand",
            "Timor-Leste",
            "Togo",
            "Tonga",
            "Trinidad and Tobago",
            "Tunisia",
            "Turkey",
            "Turkmenistan",
            "Tuvalu",
            "Uganda",
            "Ukraine",
            "United Arab Emirates",
            "United Kingdom",
            "United States of America",
            "Uruguay",
            "Uzbekistan",
            "Vanuatu",
            "Venezuela",
            "Vietnam",
            "Yemen",
            "Zambia",
            "Zimbabwe"
          ];
          ?>

          <select name="Country" class="form-select mb-3" required>
            <option value="" selected disabled>Select your country</option>
            <?php foreach ($countries as $country): ?>
              <option value="<?= htmlspecialchars($country) ?>"><?= htmlspecialchars($country) ?></option>
            <?php endforeach; ?>
          </select>
          <label for="phone">Phone Number:</label>
          <input type="text" name="Phone" id="phone" placeholder="Enter Phone No" maxlength="10"
            class="form-control mb-1" required oninput="validatePhone()">
          <span id="phone-error"></span>
        </div>

        <div class="reservationinfo">
          <h4>Reservation information</h4>
          <select name="RoomType" class="form-select mb-3" id="roomType" onchange="updateRoomNumbers()" required>
            <option value="" selected disabled>Type Of Room</option>
            <option value="Superior Room">SUPERIOR ROOM</option>
            <option value="Deluxe Room">DELUXE ROOM</option>
            <option value="Guest House">GUEST ROOM</option>
            <option value="Single Room">SINGLE ROOM</option>
          </select>
          <select name="Bed" class="form-select mb-3" required>
            <option value="" selected disabled>Bedding Type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Triple">Triple</option>
            <option value="Quad">Quad</option>
            <option value="None">None</option>
          </select>
          <select name="RoomNumber" class="form-select mb-3 room-number-select" id="roomNumber" required>
            <option value="" selected disabled>Select Room Number</option>
          </select>
          <select name="Meal" class="form-select mb-3" required>
            <option value="" selected disabled>Meal</option>
            <option value="Room only">Room only</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Half Board">Half Board</option>
            <option value="Full Board">Full Board</option>
          </select>
          <div class="datesection mb-3">
            <span>
              <label for="cin">Check-In</label>
              <input name="cin" type="date" id="checkinDate" class="form-control"
                onchange="validateDates(); updateRoomNumbers()" required>
            </span>
            <span>
              <label for="cout">Check-Out</label>
              <input name="cout" type="date" id="checkoutDate" class="form-control"
                onchange="validateDates(); updateRoomNumbers()" required>
            </span>
          </div>
        </div>
      </div>
      <div class="footer mt-3">
        <button type="submit" class="btn btn-success w-100" name="guestdetailsubmit">Submit</button>
      </div>
    </form>
  </div>

  <script>
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function () {
      // Set today's date as minimum for check-in
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('checkinDate').min = today;

      // Add click event to all book buttons
      document.querySelectorAll('.bookbtn').forEach(button => {
        button.addEventListener('click', openBookingPanel);
      });

      // Close panel when clicking outside
      document.getElementById('guestdetailpanel').addEventListener('click', function (e) {
        if (e.target === this) {
          closeBookingPanel();
        }
      });
    });

    function openBookingPanel() {
      document.getElementById('guestdetailpanel').style.display = 'flex';
      // Reset form
      document.querySelector('.guestdetailpanelform').reset();
      document.getElementById('roomNumber').innerHTML = '<option value="" selected disabled>Select Room Number</option>';
    }

    function closeBookingPanel() {
      document.getElementById('guestdetailpanel').style.display = 'none';
    }

    function validatePhone() {
      const phoneInput = document.getElementById('phone');
      const phoneError = document.getElementById('phone-error');
      const phoneValue = phoneInput.value;

      if (!/^\d{10}$/.test(phoneValue)) {
        phoneError.textContent = 'Please enter a valid 10-digit phone number';
        phoneInput.style.border = '1px solid red';
        return false;
      } else {
        phoneError.textContent = '';
        phoneInput.style.border = '1px solid #ccc';
        return true;
      }
    }

    function validateDates() {
      const checkin = document.getElementById('checkinDate').value;
      const checkout = document.getElementById('checkoutDate').value;

      if (checkin && checkout) {
        if (new Date(checkout) <= new Date(checkin)) {
          alert('Check-out date must be after check-in date');
          document.getElementById('checkoutDate').value = '';
          return false;
        }
      }
      return true;
    }

    function updateRoomNumbers() {
      const roomType = document.getElementById('roomType').value;
      const checkinDate = document.getElementById('checkinDate').value;
      const checkoutDate = document.getElementById('checkoutDate').value;
      const roomNumberSelect = document.getElementById('roomNumber');

      // Clear existing options
      roomNumberSelect.innerHTML = '<option value="" selected disabled>Select Room Number</option>';

      if (!roomType || !checkinDate || !checkoutDate) {
        roomNumberSelect.innerHTML = '<option value="" selected disabled>Please select dates and room type first</option>';
        return;
      }

      // Show loading state
      const loadingOption = document.createElement('option');
      loadingOption.textContent = 'Loading available rooms...';
      loadingOption.disabled = true;
      roomNumberSelect.appendChild(loadingOption);

      fetch('get_available_rooms.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `roomType=${encodeURIComponent(roomType)}&checkin=${encodeURIComponent(checkinDate)}&checkout=${encodeURIComponent(checkoutDate)}`
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          roomNumberSelect.innerHTML = '<option value="" selected disabled>Select Room Number</option>';
          const bookedRooms = data.bookedRooms || [];

          // Determine room range based on type
          let start, end;
          switch (roomType) {
            case 'Superior Room': start = 401; end = 410; break;
            case 'Deluxe Room': start = 301; end = 310; break;
            case 'Guest House': start = 201; end = 210; break;
            case 'Single Room': start = 101; end = 110; break;
            default: return;
          }

          // Populate room options
          for (let i = start; i <= end; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;

            if (bookedRooms.includes(i.toString())) {
              option.disabled = true;
              option.classList.add('disabled-room');
              option.textContent += ' (Booked)';
            }

            roomNumberSelect.appendChild(option);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          roomNumberSelect.innerHTML = '<option value="" disabled>Error loading rooms. Please try again.</option>';
        });
    }
  </script>
</body>

</html>