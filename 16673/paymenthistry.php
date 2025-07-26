<?php
// Database connection
$conn = new mysqli('localhost', 'root', '', 'hotal_man',3306);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch all payment records
$sql = "SELECT * FROM payments";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>

<head>
    <title>Payment History</title>
</head>
<style>
<style>:root {
    --neon-blue: #00f7ff;
    --neon-pink: #ff00aa;
    --neon-purple: #9d00ff;
    --dark-space: #050510;
    --space-gray: #121230;
    --hologram-white: rgba(255, 255, 255, 0.95);
    --cyber-cyan: #00ffcc;
    --matrix-green: #00ff9d;
}

body {
    font-family: 'Orbitron', 'Rajdhani', sans-serif;
    background:
        radial-gradient(circle at 20% 30%, var(--space-gray) 0%, var(--dark-space) 70%),
        linear-gradient(135deg, #0d0d2a 0%, #1a1a40 100%);
    color: var(--hologram-white);
    padding: 30px;
}

h2 {
    text-align: center;
    color: var(--neon-blue);
    margin-bottom: 30px;
    font-size: 2.5rem;
    text-transform: uppercase;
    letter-spacing: 4px;
    text-shadow:
        0 0 10px var(--neon-blue),
        0 0 20px rgba(0, 247, 255, 0.5);
    position: relative;
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

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 30px auto;
    background: rgba(30, 30, 60, 0.7);
    border-radius: 10px;
    overflow: hidden;
    box-shadow:
        0 0 30px rgba(0, 247, 255, 0.2),
        inset 0 0 20px rgba(0, 247, 255, 0.1);
    border: 1px solid rgba(0, 247, 255, 0.3);
    position: relative;
}

table::before {
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
    opacity: 0.5;
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

th,
td {
    padding: 15px;
    text-align: center;
    position: relative;
    border: 1px solid rgba(0, 247, 255, 0.2);
}

th {
    background: linear-gradient(to right, rgba(0, 245, 255, 0.3), rgba(157, 0, 255, 0.3));
    color: var(--hologram-white);
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-shadow: 0 0 5px var(--neon-blue);
    font-size: 1.1rem;
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

a {
    color: var(--cyber-cyan);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
}

a:hover {
    color: var(--neon-pink);
    text-shadow: 0 0 10px var(--neon-pink);
}

a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--neon-pink);
    transition: width 0.3s ease;
}

a:hover::after {
    width: 100%;
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
@media (max-width: 768px) {
    body {
        padding: 15px;
    }

    h2 {
        font-size: 1.8rem;
    }

    th,
    td {
        padding: 10px;
        font-size: 0.9rem;
    }
}
</style>
</style>

<body>
    <h2>Payment History</h2>
    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Register ID</th>
                <th>Full Name</th>
                <th>Razorpay Payment ID</th>
                <th>Payment Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>".$row['id']."</td>";
                    echo "<td>".$row['register_id']."</td>";
                    echo "<td>".$row['full_name']."</td>";
                    echo "<td>".$row['razorpay_payment_id']."</td>";
                    echo "<td>".$row['payment_date']."</td>";
                    echo "<td>
                            <a href='edit_payment.php?id=".$row['id']."'>Edit</a> | 
                            <a href='delete_payment.php?id=".$row['id']."' onclick='return confirm(\"Are you sure you want to delete this record?\")'>Delete</a>
                          </td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='6'>No payment records found</td></tr>";
            }
            $conn->close();
            ?>
        </tbody>
    </table>
</body>

</html>