<?php
include 'config.php'; // Database connection

// Fetch all records from the contactus table
$sql = "SELECT * FROM contactus ORDER BY created_at DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us History</title>
    <link rel="stylesheet" href="styles.css"> <!-- Link to your CSS file -->
    <style>
    /* General Styles */
    body {
        font-family: 'Exo 2', sans-serif;
        background: linear-gradient(180deg, #1a1a3d 0%, #2b2b5e 100%);
        margin: 0;
        padding: 0;
        color: #e0e0e0;
    }

    /* Centered Container */
    .container {
        width: 90%;
        max-width: 1200px;
        margin: 40px auto;
        background: rgba(30, 30, 70, 0.9);
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 0 25px rgba(0, 255, 255, 0.4);
        border: 1px solid rgba(0, 255, 255, 0.2);
        backdrop-filter: blur(8px);
    }

    /* Heading */
    h2 {
        text-align: center;
        color: #00f7ff;
        margin-bottom: 25px;
        text-transform: uppercase;
        letter-spacing: 3px;
        text-shadow: 0 0 12px rgba(0, 247, 255, 0.7);
        font-size: 28px;
    }

    /* Table Styling */
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 25px;
        background: rgba(20, 20, 50, 0.7);
        border-radius: 10px;
        overflow: hidden;
    }

    th,
    td {
        padding: 15px;
        text-align: center;
        border-bottom: 1px solid rgba(0, 255, 255, 0.2);
        transition: all 0.3s ease;
    }

    th {
        background: linear-gradient(45deg, #00f7ff, #ff00cc);
        color: #1a1a3d;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 1px;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }

    td {
        color: #d0d0e0;
    }

    tr:nth-child(even) {
        background: rgba(40, 40, 80, 0.3);
    }

    tr:hover {
        background: rgba(0, 255, 255, 0.1);
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }

    /* Delete Button */
    .btn-delete {
        background: linear-gradient(45deg, #ff004d, #ff4d94);
        color: #1a1a3d;
        padding: 8px 16px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 0 10px rgba(255, 0, 77, 0.5);
    }

    .btn-delete:hover {
        background: linear-gradient(45deg, #ff4d94, #ff004d);
        box-shadow: 0 0 15px rgba(255, 0, 77, 0.8);
        transform: translateY(-2px);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .container {
            width: 95%;
            padding: 15px;
        }

        th,
        td {
            padding: 10px;
            font-size: 14px;
        }

        .btn-delete {
            padding: 6px 12px;
            font-size: 14px;
        }

        h2 {
            font-size: 22px;
        }
    }
    </style>
</head>

<body>

    <div class="container">
        <h2>Contact Us History</h2>

        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Created At</th>
                <th>Action</th>
            </tr>

            <?php
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<tr>
                    <td>{$row['id']}</td>
                    <td>{$row['name']}</td>
                    <td>{$row['email']}</td>
                    <td>{$row['message']}</td>
                    <td>{$row['created_at']}</td>
                    <td>
                        <a href='delete_contact.php?id={$row['id']}' class='btn btn-delete' onclick='return confirm(\"Are you sure you want to delete this message?\")'>Delete</a>
                    </td>
                </tr>";
            }
        } else {
            echo "<tr><td colspan='6'>No messages found</td></tr>";
        }

        $conn->close();
        ?>
        </table>
    </div>

</body>

</html>