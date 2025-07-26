<?php
// Database connection
require 'config.php';

// Query to count total signups
$sql = "SELECT COUNT(*) AS total_users FROM registration";
$result = $conn->query($sql);

// Fetch count and store in a variable
if ($result) {
    $row = $result->fetch_assoc();
    $total_signups = $row['total_users'];
} else {
    $total_signups = 0; // If query fails, default value
}


// Output total signups
$total_signups;







// Query to count total rooms
$sql1 = "SELECT COUNT(*) AS total_rooms FROM rooms";
$result1 = $conn->query($sql1);

// Fetch count and store in a variable
if ($result1) {
    $row = $result1->fetch_assoc();
    $total_rooms = $row['total_rooms'];
} else {
    $total_rooms = 0; // If query fails, default value
}

// Close connection


// Output total rooms
$total_rooms;

$sql2 = "SELECT COUNT(*) AS total_feedback FROM feedback";
$result2 = $conn->query($sql2);

// Fetch count and store in a variable
if ($result2) {
    $row = $result2->fetch_assoc();
    $total_feedback = $row['total_feedback'];
} else {
    $total_feedback = 0; // If query fails, default value
}

// Close connection

// Output total feedback count
$total_feedback;


// Query to count total comments
$sql3 = "SELECT COUNT(*) AS total_comments FROM comments";
$result3 = $conn->query($sql3);

// Fetch count and store in a variable
if ($result3) {
    $row = $result3->fetch_assoc();
    $total_comments = $row['total_comments'];
} else {
    $total_comments = 0; // If query fails, default value
}

// Close connection


// Output total comments count
$total_comments;



// Query to count total contact details
$sql4 = "SELECT COUNT(*) AS total_contacts FROM contact_details";
$result4 = $conn->query($sql4);

// Fetch count and store in a variable
if ($result4) {
    $row = $result4->fetch_assoc();
    $total_contacts = $row['total_contacts'];
} else {
    $total_contacts = 0; // If query fails, default value
}

// Close connection


// Output total contacts count
$total_contacts;






// Query to count total payments
$sql5 = "SELECT COUNT(*) AS total_payments FROM payments";
$result5 = $conn->query($sql5);

// Fetch count and store in a variable
if ($result5) {
    $row = $result5->fetch_assoc();
    $total_payments = $row['total_payments'];
} else {
    $total_payments = 0; // If query fails, default value
}

// Close connection
$conn->close();

// Output total payments count
$total_payments;
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    <link rel="stylesheet" href="admin.css">
    <script defer src="admin.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
    :root {
        --neon-blue: #00f2ff;
        --neon-purple: #9d00ff;
        --dark-space: #0a0a1a;
        --cyber-black: #121220;
        --hologram-white: rgba(255, 255, 255, 0.9);
        --electric-pink: #ff00aa;
    }

    /* Cyberpunk Sidebar */
    .sidebar {
        position: fixed;
        top: 0;
        left: -300px;
        width: 300px;
        height: 100vh;
        background: rgba(10, 10, 26, 0.95);
        backdrop-filter: blur(15px) saturate(200%);
        padding-top: 80px;
        transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
        z-index: 1000;
        border-right: 1px solid var(--neon-blue);
        box-shadow: 0 0 40px rgba(157, 0, 255, 0.3);
    }

    .sidebar.active {
        left: 0;
    }

    .sidebar h2 {
        text-align: center;
        color: var(--neon-blue);
        font-size: 1.8rem;
        margin-bottom: 40px;
        text-transform: uppercase;
        letter-spacing: 3px;
        font-weight: 700;
        text-shadow: 0 0 15px var(--neon-blue);
    }

    .sidebar ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .sidebar ul li {
        padding: 15px 30px;
        margin: 8px 20px;
        border-left: 3px solid transparent;
        transition: all 0.4s ease;
    }

    .sidebar ul li:hover {
        border-left: 3px solid var(--electric-pink);
        background: rgba(0, 242, 255, 0.05);
    }

    .sidebar ul li a {
        text-decoration: none;
        color: var(--hologram-white);
        font-size: 1.1rem;
        display: block;
        transition: all 0.3s ease;
        letter-spacing: 1px;
        font-family: 'Courier New', monospace;
    }

    .sidebar ul li a:hover {
        color: var(--neon-blue);
        transform: translateX(10px);
        text-shadow: 0 0 10px var(--neon-blue);
    }

    /* Cyber Toggle Button */
    #toggle-sidebar {
        position: fixed;
        top: 25px;
        left: 25px;
        background: rgba(18, 18, 32, 0.7);
        border: 2px solid var(--neon-blue);
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        color: var(--neon-blue);
        cursor: pointer;
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
        box-shadow: 0 0 20px rgba(0, 242, 255, 0.4);
    }

    #toggle-sidebar:hover {
        background: var(--neon-blue);
        color: var(--cyber-black);
        transform: rotate(90deg);
        box-shadow: 0 0 30px var(--neon-blue);
    }

    /* Main Cyber Grid */
    .main-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        width: 100vw;
        background: linear-gradient(135deg, #0a0a1a, #121230, #1a1a40);
        padding: 20px;
        position: relative;
        overflow: hidden;
    }

    .main-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:
            radial-gradient(circle at 20% 30%, rgba(0, 242, 255, 0.1) 0%, transparent 25%),
            radial-gradient(circle at 80% 70%, rgba(157, 0, 255, 0.1) 0%, transparent 25%);
        pointer-events: none;
    }

    /* Holographic Grid Container */
    .inner-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 25px;
        width: 90%;
        height: 90%;
        background: rgba(255, 255, 255, 0.03);
        padding: 30px;
        border-radius: 15px;
        box-shadow:
            0 0 0 1px rgba(0, 242, 255, 0.1),
            0 0 30px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(0, 242, 255, 0.2);
        position: relative;
        overflow: hidden;
    }

    .inner-container::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(to bottom right,
                transparent 45%,
                rgba(0, 242, 255, 0.05) 50%,
                transparent 55%);
        transform: rotate(30deg);
        animation: scan 6s linear infinite;
    }

    @keyframes scan {
        0% {
            transform: translateY(-100%) rotate(30deg);
        }

        100% {
            transform: translateY(100%) rotate(30deg);
        }
    }

    /* Cyber Cards */
    .box {
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(18, 18, 32, 0.7);
        color: var(--hologram-white);
        font-size: 1.2rem;
        font-weight: 500;
        border-radius: 10px;
        box-shadow:
            inset 0 0 10px rgba(0, 242, 255, 0.2),
            0 5px 20px rgba(0, 0, 0, 0.4);
        transition: all 0.4s ease;
        padding: 30px;
        text-align: center;
        border: 1px solid rgba(0, 242, 255, 0.3);
        position: relative;
        overflow: hidden;
        font-family: 'Orbitron', sans-serif;
    }

    .box::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg,
                transparent,
                rgba(0, 242, 255, 0.1),
                transparent);
        transition: all 0.6s ease;
    }

    .box:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow:
            inset 0 0 15px rgba(0, 242, 255, 0.3),
            0 10px 30px rgba(157, 0, 255, 0.3);
        border-color: var(--electric-pink);
    }

    .box:hover::before {
        left: 100%;
    }

    /* Cyber Close Button */
    #cross {
        background: var(--electric-pink);
        color: white;
        border: none;
        padding: 8px;
        font-size: 1rem;
        cursor: pointer;
        position: absolute;
        top: 15px;
        right: 15px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease;
        box-shadow: 0 0 15px rgba(255, 0, 170, 0.5);
        z-index: 1001;
    }

    #cross:hover {
        transform: scale(1.2) rotate(90deg);
        background: #ff0077;
    }

    /* Cyber Profile */
    .profile-container {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
        box-shadow:
            0 0 20px var(--neon-blue),
            0 0 40px rgba(157, 0, 255, 0.3);
        overflow: hidden;
        z-index: 1000;
        transition: all 0.4s ease;
        border: 2px solid var(--hologram-white);
    }

    .profile-container:hover {
        transform: scale(1.1) rotate(10deg);
        box-shadow:
            0 0 30px var(--neon-blue),
            0 0 60px rgba(157, 0, 255, 0.5);
    }

    .profile-pic {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Responsive Grid */
    @media (max-width: 1200px) {
        .inner-container {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 900px) {
        .inner-container {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 600px) {
        .inner-container {
            grid-template-columns: 1fr;
        }

        .sidebar {
            width: 250px;
        }

        .profile-container {
            width: 50px;
            height: 50px;
        }
    }

    /* Cyberpunk Scanlines Overlay */
    body::after {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:
            linear-gradient(rgba(18, 18, 32, 0.2) 1px,
                transparent 1px);
        background-size: 100% 3px;
        pointer-events: none;
        animation: scanlines 60s linear infinite;
        z-index: 9999;
    }

    @keyframes scanlines {
        from {
            background-position: 0 0;
        }

        to {
            background-position: 0 100vh;
        }
    }
    </style>
</head>

<body>



    <div class="profile-container">
        <!-- Profile Image (Fixed) -->
        <img src="dp.jpg" class="profile-pic" alt="Profile">
    </div>





    <div class="admin-container">

        <body style="background: #121212; color: white;">

            <!-- Hamburger Icon -->
            <button id="toggle-sidebar">☰</button>

            <!-- Sidebar -->
            <aside class="sidebar">
                <h2>Admin Panel</h2>
                <ul>
                    <li><a href="adminregistration.php">Registration History</a></li>
                    <li><a href="bookinghistry.php">Booking History</a></li>
                    <li><a href="contactushistry.php">Contact Us History</a></li>
                    <li><a href="addroom.php">Add Rooms History</a></li>
                    <li><a href="ratinghistry.php">Rating History</a></li>
                    <li><a href="logout.php">Log Out</a></li>
                </ul>

                <script>
                document.getElementById("cross").addEventListener("click", function() {
                    document.getElementById("sidebar").remove(); // Sidebar ko completely remove kar dega
                });
                </script>
            </aside>
            <main class="content">
                <div class="content-wrapper">
                    <h1>Welcome to the Admin Panel</h1>
                </div>
            </main>


    </div>

    <div class="main-container">
        <div class="inner-container">
            <div class="box">
                <p><a href="adminregistration.php"><?php
                // Output total signups
echo "Registrations: " . $total_signups ?></a>
                </p>
            </div>

            <div class="box"><a href="bookinghistry.php"><?php
            echo "Bookings: " . $total_rooms;?></a>
            </div>
            <div class="box"><a href="bookinghistry.php"><?php
            echo "Total Feedback: " . $total_feedback;?></a>
            </div>
            <div class="box"><a href="contactushistry.php"><?php
            echo "Total Comments: " . $total_comments;
            ?></a></div>
            <div class="box"><?php
            echo "Total Contact: " . $total_contacts;
            ?></div>
            <div class="box"><a href="paymenthistry.php"><?php
            echo "Payments: " . $total_payments;
            ?></a></div>
            <div class="box">Settings</div>
            <div class="box"><a href="logout.php">Logout</a></div>
        </div>
    </div>


    <script>
    document.getElementById("toggle-sidebar").addEventListener("click", function() {
        document.querySelector(".sidebar").classList.toggle("active");
    });
    </script>

</body>

</html>