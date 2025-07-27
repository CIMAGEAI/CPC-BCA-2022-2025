<?php
include 'config.php'; // Database connection

$sql = "SELECT * FROM registration";
$result = $conn->query($sql);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    $id = $_POST['id'];
    if ($_POST['action'] == 'delete') {
        $deleteQuery = "DELETE FROM registration WHERE id = $id";
        $conn->query($deleteQuery);
    } elseif ($_POST['action'] == 'block') {
        $blockQuery = "UPDATE registration SET status='blocked' WHERE id = $id";
        $conn->query($blockQuery);
    }
    header("Location: adminregistration.php");
    exit;
}


if (isset($_GET['updated']) && $_GET['updated'] == 1) {
    echo "<p style='color: green; text-align: center;'>User updated successfully!</p>";
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Registration</title>
    <link rel="stylesheet" href="admin.css">
    <style>
    :root {
        --cyber-blue: #00f5ff;
        --matrix-green: #00ff9d;
        --neon-purple: #9d00ff;
        --dark-space: #0a0a1a;
        --hologram-white: rgba(255, 255, 255, 0.9);
        --electric-pink: #ff00aa;
        --deep-space: #050510;
    }

    /* Futuristic Body Styling */
    body {
        font-family: 'Orbitron', 'Rajdhani', sans-serif;
        background: linear-gradient(135deg, var(--deep-space), #121230);
        padding: 20px;
        color: var(--hologram-white);
        min-height: 100vh;
        overflow-x: hidden;
    }

    /* 3D Holographic Container */
    .container {
        width: 85%;
        margin: 40px auto;
        background: rgba(18, 18, 32, 0.7);
        padding: 30px;
        border-radius: 15px;
        box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.5),
            inset 0 0 15px rgba(0, 245, 255, 0.2);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 245, 255, 0.3);
        transform-style: preserve-3d;
        transform: perspective(1000px) rotateX(5deg);
        transition: all 0.5s ease;
        position: relative;
        overflow: hidden;
    }

    .container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg,
                transparent 48%,
                rgba(0, 245, 255, 0.05) 49%,
                rgba(0, 245, 255, 0.05) 51%,
                transparent 52%);
        background-size: 3em 3em;
        opacity: 0.5;
        pointer-events: none;
        animation: holographic 3s linear infinite;
    }

    @keyframes holographic {
        0% {
            background-position: 0 0;
        }

        100% {
            background-position: 3em 3em;
        }
    }

    /* Cyberpunk Heading */
    h2 {
        text-align: center;
        color: var(--cyber-blue);
        margin-bottom: 30px;
        font-size: 2.2rem;
        text-transform: uppercase;
        letter-spacing: 3px;
        text-shadow: 0 0 15px var(--cyber-blue);
        position: relative;
    }

    h2::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 25%;
        width: 50%;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--cyber-blue), transparent);
    }

    /* 3D Holographic Table */
    table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin-top: 20px;
        background: rgba(30, 30, 60, 0.5);
        border-radius: 10px;
        overflow: hidden;
        box-shadow:
            0 5px 15px rgba(0, 0, 0, 0.3),
            inset 0 0 10px rgba(0, 245, 255, 0.2);
        transform: translateZ(20px);
    }

    th,
    td {
        border: 1px solid rgba(0, 245, 255, 0.2);
        padding: 15px;
        text-align: center;
        position: relative;
    }

    th {
        background: linear-gradient(to right, rgba(0, 245, 255, 0.3), rgba(157, 0, 255, 0.3));
        color: var(--hologram-white);
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        text-shadow: 0 0 5px var(--cyber-blue);
    }

    tr {
        transition: all 0.3s ease;
    }

    tr:nth-child(even) {
        background: rgba(18, 18, 32, 0.4);
    }

    tr:hover {
        background: rgba(0, 245, 255, 0.1);
        transform: translateX(5px);
        box-shadow: 0 0 15px rgba(0, 245, 255, 0.2);
    }

    td:hover::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg,
                transparent,
                rgba(0, 245, 255, 0.1),
                transparent);
        animation: shine 1s;
    }

    @keyframes shine {
        0% {
            transform: translateX(-100%);
        }

        100% {
            transform: translateX(100%);
        }
    }

    /* Cyber Buttons */
    .btn {
        padding: 8px 15px;
        font-size: 14px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        transition: all 0.3s ease;
        font-weight: 600;
        letter-spacing: 1px;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        position: relative;
        overflow: hidden;
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
        transition: all 0.5s ease;
    }

    .btn:hover::before {
        left: 100%;
    }

    .btn-edit {
        background: linear-gradient(135deg, var(--matrix-green), #00cc88);
        color: var(--dark-space);
    }

    .btn-edit:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 255, 157, 0.4);
    }

    .btn-delete {
        background: linear-gradient(135deg, var(--electric-pink), #ff0066);
        color: white;
    }

    .btn-delete:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(255, 0, 170, 0.4);
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
    @media (max-width: 768px) {
        .container {
            width: 95%;
            padding: 15px;
            transform: perspective(1000px) rotateX(0deg);
        }

        table {
            font-size: 14px;
        }

        th,
        td {
            padding: 10px;
        }

        .btn {
            padding: 6px 10px;
            font-size: 12px;
        }
    }

    /* Floating Particles Background */
    .particles {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
        pointer-events: none;
    }

    .particle {
        position: absolute;
        background: var(--cyber-blue);
        border-radius: 50%;
        opacity: 0.5;
        animation: float linear infinite;
    }

    @keyframes float {
        from {
            transform: translateY(0) rotate(0deg);
        }

        to {
            transform: translateY(-100vh) rotate(360deg);
        }
    }
    </style>

</head>

<body>


    <div class="container">
        <h2>Registration</h2>

        <table>
            <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
            </tr>

            <?php
        $sql = "SELECT * FROM registration"; // Change 'users' to your actual table name
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<tr>
                    <td>{$row['id']}</td>
                    <td>{$row['fullname']}</td>
                    <td>{$row['email']}</td>
                    <td>{$row['mobile']}</td>
                    <td>
                        <a href='edit.php?id={$row['id']}' class='btn btn-edit'>Edit</a>
                        <a href='delete.php?id={$row['id']}' class='btn btn-delete' onclick='return confirm(\"Are you sure?\")'>Delete</a>
                    </td>
                </tr>";
            }
        } else {
            echo "<tr><td colspan='5'>No records found</td></tr>";
        }

        $conn->close();
        ?>
        </table>
    </div>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const particles = document.createElement('div');
        particles.className = 'particles';
        document.body.appendChild(particles);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random properties
            const size = Math.random() * 5 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 10;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `-${delay}s`;

            // Random color variation
            const hue = 160 + Math.random() * 40; // Blue-green range
            particle.style.background = `hsla(${hue}, 100%, 50%, 0.7)`;

            particles.appendChild(particle);
        }
    });
    </script>
</body>

</html>