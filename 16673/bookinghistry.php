<?php
include 'config.php'; // Database connection

// Fetch booking details along with user details
$sql = "SELECT 
            b.id AS booking_id, 
            r.fullname, 
            r.email, 
            r.mobile, 
            b.check_in, 
            b.check_out, 
            b.guests, 
            b.created_at 
        FROM booking b
        JOIN registration r ON b.id = r.id
        ORDER BY b.created_at DESC";

$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking History</title>
    <link rel="stylesheet" href="styles.css"> <!-- Link to your CSS -->
    <style>
    :root {
        --neon-cyan: #00f7ff;
        --neon-pink: #ff00aa;
        --neon-purple: #9d00ff;
        --deep-space: #050510;
        --space-gray: #121230;
        --hologram-white: rgba(255, 255, 255, 0.95);
    }

    /* Cyberpunk Body Styling */
    body {
        font-family: 'Rajdhani', 'Orbitron', sans-serif;
        background:
            radial-gradient(circle at 20% 30%, var(--space-gray) 0%, var(--deep-space) 70%),
            linear-gradient(135deg, #0d0d2a 0%, #1a1a40 100%);
        padding: 30px;
        color: var(--hologram-white);
        min-height: 100vh;
        overflow-x: hidden;
    }

    /* Holographic Container */
    .container {
        width: 65%;
        margin: 40px auto;
        background: rgba(18, 18, 50, 0.7);
        padding: 40px;
        border-radius: 20px;
        box-shadow:
            0 0 30px rgba(0, 247, 255, 0.3),
            inset 0 0 20px rgba(0, 247, 255, 0.2);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(0, 247, 255, 0.3);
        position: relative;
        overflow: hidden;
        transform-style: preserve-3d;
        transform: perspective(1000px) rotateX(2deg);
        transition: all 0.5s ease;
    }

    .container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:
            linear-gradient(45deg,
                transparent 48%,
                rgba(0, 247, 255, 0.05) 49%,
                rgba(0, 247, 255, 0.05) 51%,
                transparent 52%);
        background-size: 4em 4em;
        opacity: 0.7;
        pointer-events: none;
        animation: holographic 4s linear infinite;
    }

    @keyframes holographic {
        0% {
            background-position: 0 0;
        }

        100% {
            background-position: 4em 4em;
        }
    }

    /* Cyberpunk Heading */
    h2 {
        text-align: center;
        color: var(--neon-cyan);
        margin-bottom: 30px;
        font-size: 2.5rem;
        text-transform: uppercase;
        letter-spacing: 4px;
        text-shadow:
            0 0 10px var(--neon-cyan),
            0 0 20px rgba(0, 247, 255, 0.5);
        position: relative;
        font-weight: 700;
    }

    h2::after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: 30%;
        width: 40%;
        height: 3px;
        background: linear-gradient(90deg, transparent, var(--neon-pink), transparent);
        border-radius: 50%;
        filter: blur(1px);
    }

    /* Cyber Form Elements */
    .form-group {
        margin-bottom: 25px;
        position: relative;
    }

    .form-group label {
        font-weight: 600;
        display: block;
        margin-bottom: 10px;
        color: var(--neon-cyan);
        text-transform: uppercase;
        font-size: 15px;
        letter-spacing: 1px;
    }

    .form-control {
        width: 100%;
        padding: 15px;
        border: 1px solid var(--neon-cyan);
        border-radius: 10px;
        font-size: 16px;
        background: rgba(10, 10, 30, 0.7);
        color: var(--hologram-white);
        transition: all 0.4s ease;
        box-shadow:
            inset 0 0 10px rgba(0, 247, 255, 0.1),
            0 0 10px rgba(0, 247, 255, 0.1);
    }

    .form-control:focus {
        border-color: var(--neon-pink);
        outline: none;
        box-shadow:
            inset 0 0 15px rgba(255, 0, 170, 0.2),
            0 0 20px rgba(255, 0, 170, 0.3);
        background: rgba(10, 10, 30, 0.9);
    }

    /* Cyber Buttons */
    .btn {
        width: 100%;
        padding: 15px;
        font-size: 18px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.4s ease;
        margin-top: 20px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 700;
        position: relative;
        overflow: hidden;
        border: none;
        z-index: 1;
    }

    .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent);
        transition: all 0.6s ease;
        z-index: -1;
    }

    .btn:hover::before {
        left: 100%;
    }

    .btn-primary {
        background: linear-gradient(45deg, var(--neon-cyan), var(--neon-purple));
        color: var(--deep-space);
        box-shadow:
            0 5px 20px rgba(0, 247, 255, 0.4),
            0 0 10px rgba(157, 0, 255, 0.4);
    }

    .btn-primary:hover {
        background: linear-gradient(45deg, var(--neon-purple), var(--neon-cyan));
        box-shadow:
            0 8px 30px rgba(0, 247, 255, 0.6),
            0 0 20px rgba(157, 0, 255, 0.6);
        transform: translateY(-3px);
    }

    .btn-secondary {
        background: linear-gradient(45deg, #546e7a, #263238);
        color: var(--hologram-white);
        box-shadow: 0 5px 20px rgba(38, 50, 56, 0.4);
    }

    .btn-secondary:hover {
        background: linear-gradient(45deg, #263238, #546e7a);
        box-shadow: 0 8px 30px rgba(38, 50, 56, 0.6);
        transform: translateY(-3px);
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
            linear-gradient(rgba(18, 18, 50, 0.2) 1px,
                transparent 1px);
        background-size: 100% 4px;
        pointer-events: none;
        animation: scanlines 80s linear infinite;
        z-index: -1;
    }

    @keyframes scanlines {
        from {
            background-position: 0 0;
        }

        to {
            background-position: 0 100vh;
        }
    }

    /* Responsive Design */
    @media (max-width: 992px) {
        .container {
            width: 80%;
            padding: 30px;
        }
    }

    @media (max-width: 768px) {
        .container {
            width: 95%;
            padding: 25px;
            transform: perspective(1000px) rotateX(0deg);
        }

        h2 {
            font-size: 2rem;
            letter-spacing: 2px;
        }

        .btn {
            padding: 12px;
            font-size: 16px;
        }
    }

    /* Floating Cyber Orbs */
    .cyber-orbs {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
        pointer-events: none;
        overflow: hidden;
    }

    .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(30px);
        opacity: 0.3;
        animation: float linear infinite;
    }

    @keyframes float {
        0% {
            transform: translate(0, 0) rotate(0deg);
        }

        50% {
            transform: translate(50vw, 30vh) rotate(180deg);
        }

        100% {
            transform: translate(0, 0) rotate(360deg);
        }
    }
    </style>

    <!-- Add this before </body> for cyber orbs effect -->
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const orbsContainer = document.createElement('div');
        orbsContainer.className = 'cyber-orbs';
        document.body.appendChild(orbsContainer);

        // Create 3 colored orbs
        const colors = ['#00f7ff', '#ff00aa', '#9d00ff'];

        colors.forEach((color, index) => {
            const orb = document.createElement('div');
            orb.className = 'orb';
            orb.style.background = color;
            orb.style.width = `${200 + (index * 100)}px`;
            orb.style.height = `${200 + (index * 100)}px`;
            orb.style.left = `${20 + (index * 20)}%`;
            orb.style.top = `${10 + (index * 25)}%`;
            orb.style.animationDuration = `${30 + (index * 10)}s`;
            orb.style.animationDelay = `-${index * 5}s`;

            orbsContainer.appendChild(orb);
        });
    });
    </script>
</head>

<body>

    <div class="container">
        <h2>Booking History</h2>

        <table>
            <tr>
                <th>Booking ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Guests</th>
                <th>Created At</th>
                <th>Action</th>
            </tr>

            <?php
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<tr>
                    <td>{$row['booking_id']}</td>
                    <td>{$row['fullname']}</td>
                    <td>{$row['email']}</td>
                    <td>{$row['mobile']}</td>
                    <td>{$row['check_in']}</td>
                    <td>{$row['check_out']}</td>
                    <td>{$row['guests']}</td>
                    <td>{$row['created_at']}</td>
                    <td>
                        <a href='delete_booking.php?id={$row['booking_id']}' class='btn btn-delete' onclick='return confirm(\"Are you sure?\")'>Delete</a>
                    </td>
                </tr>";
            }
        } else {
            echo "<tr><td colspan='9'>No bookings found</td></tr>";
        }

        $conn->close();
        ?>
        </table>
    </div>

</body>

</html>