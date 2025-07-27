<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $room_count = $_POST['room_count'];
    $bathroom_count = $_POST['bathroom_count'];
    $balcony_count = $_POST['balcony_count'];
    $sofa_count = $_POST['sofa_count'];
    $facilities = implode(", ", $_POST['facilities'] ?? []);
    $price = $_POST['price']; // Fix: Correct field name

    // Handle Image Upload with validation
    $target_dir = "uploads/";
    $imageFileType = strtolower(pathinfo($_FILES["room_image"]["name"], PATHINFO_EXTENSION));
    $allowed_types = ["jpg", "jpeg", "png", "gif"];

    if (!in_array($imageFileType, $allowed_types)) {
        echo "<script>alert('Invalid image format! Only JPG, JPEG, PNG & GIF allowed.');</script>";
        exit();
    }

    $new_filename = uniqid("room_", true) . "." . $imageFileType;
    $target_file = $target_dir . $new_filename;
    move_uploaded_file($_FILES["room_image"]["tmp_name"], $target_file);

    // Insert into database (Fixed: Added `price` column)
    $sql = "INSERT INTO rooms (room_count, bathroom_count, balcony_count, sofa_count, facilities, price, image) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iiiisis", $room_count, $bathroom_count, $balcony_count, $sofa_count, $facilities, $price, $target_file);

    if ($stmt->execute()) {
        echo "<script>alert('Room Added Successfully!'); window.location.href='addroom.php';</script>";
    } else {
        echo "<script>alert('Error: " . $stmt->error . "');</script>";
    }

    $stmt->close();
    $conn->close();
}
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Room</title>
    <link rel="stylesheet" href="addroom.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
    :root {
        --neon-blue: #00f7ff;
        --neon-pink: #ff00aa;
        --neon-purple: #9d00ff;
        --dark-space: #050510;
        --space-gray: #121230;
        --hologram-white: rgba(255, 255, 255, 0.95);
        --cyber-cyan: #00ffcc;
        --matrix-green: #00ff9d;
    }

    /* Cyberpunk Body Styling */
    body {
        font-family: 'Orbitron', 'Rajdhani', sans-serif;
        background:
            radial-gradient(circle at 20% 30%, var(--space-gray) 0%, var(--dark-space) 70%),
            linear-gradient(135deg, #0d0d2a 0%, #1a1a40 100%);
        color: var(--hologram-white);
        min-height: 100vh;
        padding: 20px;
    }

    /* Holographic Container */
    .container {
        max-width: 800px;
        margin: 40px auto;
        background: rgba(18, 18, 50, 0.7);
        padding: 30px;
        border-radius: 15px;
        box-shadow:
            0 0 30px rgba(0, 247, 255, 0.3),
            inset 0 0 20px rgba(0, 247, 255, 0.2);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(0, 247, 255, 0.3);
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
        color: var(--neon-blue);
        margin-bottom: 30px;
        font-size: 2.2rem;
        text-transform: uppercase;
        letter-spacing: 3px;
        text-shadow:
            0 0 10px var(--neon-blue),
            0 0 20px rgba(0, 247, 255, 0.5);
        position: relative;
    }

    h2::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 30%;
        width: 40%;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--neon-pink), transparent);
    }

    /* Cyber Form Elements */
    .form-label {
        font-weight: 600;
        display: block;
        margin-bottom: 10px;
        color: var(--cyber-cyan);
        text-transform: uppercase;
        font-size: 15px;
        letter-spacing: 1px;
    }

    .form-control {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--neon-blue);
        border-radius: 8px;
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

    /* Cyber Checkboxes */
    .form-check-inline {
        margin-right: 20px;
        position: relative;
    }

    .form-check-inline input[type="checkbox"] {
        appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid var(--neon-blue);
        border-radius: 4px;
        background: rgba(10, 10, 30, 0.7);
        position: relative;
        top: 4px;
        margin-right: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .form-check-inline input[type="checkbox"]:checked {
        background: var(--neon-purple);
        border-color: var(--neon-pink);
        box-shadow: 0 0 10px var(--neon-purple);
    }

    .form-check-inline input[type="checkbox"]:checked::after {
        content: '✓';
        position: absolute;
        color: white;
        font-size: 14px;
        left: 2px;
        top: -2px;
    }

    .form-check-inline label {
        color: var(--hologram-white);
        cursor: pointer;
    }

    /* Cyber Button */
    .btn-primary {
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
        background: linear-gradient(45deg, var(--neon-blue), var(--neon-purple));
        color: var(--dark-space);
        border: none;
        box-shadow:
            0 5px 20px rgba(0, 247, 255, 0.4),
            0 0 10px rgba(157, 0, 255, 0.4);
        position: relative;
        overflow: hidden;
    }

    .btn-primary:hover {
        background: linear-gradient(45deg, var(--neon-purple), var(--neon-blue));
        box-shadow:
            0 8px 30px rgba(0, 247, 255, 0.6),
            0 0 20px rgba(157, 0, 255, 0.6);
        transform: translateY(-3px);
    }

    .btn-primary::before {
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
    }

    .btn-primary:hover::before {
        left: 100%;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .container {
            padding: 20px;
            margin: 20px auto;
        }

        h2 {
            font-size: 1.8rem;
        }

        .form-check-inline {
            display: block;
            margin-bottom: 10px;
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
    </style>
</head>

<body>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Add Room Details</h2>
        <form action="addroom.php" method="POST" enctype="multipart/form-data">
            <div class="mb-3">
                <label class="form-label">Upload Room Image</label>
                <input type="file" name="room_image" class="form-control" required>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Number of Rooms</label>
                    <input type="number" name="room_count" class="form-control" required min="1">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Number of Bathrooms</label>
                    <input type="number" name="bathroom_count" class="form-control" required min="1">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Number of Balconies</label>
                    <input type="number" name="balcony_count" class="form-control" required min="0">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Number of Sofas</label>
                    <input type="number" name="sofa_count" class="form-control" required min="0">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Price</label>
                    <input type="number" name="price" class="form-control" required min="0">
                </div>

            </div>
            <div class="mb-3">
                <label class="form-label">Facilities</label><br>
                <input type="checkbox" name="facilities[]" value="WiFi"> WiFi
                <input type="checkbox" name="facilities[]" value="Television"> Television
                <input type="checkbox" name="facilities[]" value="AC"> AC
                <input type="checkbox" name="facilities[]" value="Room Heater"> Room Heater
                <input type="checkbox" name="facilities[]" value="Room Cooler"> Room Cooler
            </div>
            <button type="submit" class="btn btn-primary w-100">Add Room</button>
        </form>
    </div>
</body>

</html>