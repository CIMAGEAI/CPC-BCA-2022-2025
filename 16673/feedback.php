<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $rating = $_POST['rating'];
    $feedback = $_POST['feedback'];
    $payment_id = $_POST['payment_id']; // Razorpay payment ID

    // Database connection
    include 'config.php'; // Ensure this file contains correct DB credentials

    $stmt = $conn->prepare("INSERT INTO feedback (payment_id, rating, feedback) VALUES (?, ?, ?)");
    $stmt->bind_param("sis", $payment_id, $rating, $feedback);
    if ($stmt->execute()) {
        echo "<script>alert('Thank you for your feedback!'); window.location.href='thankyou.php';</script>";
    } else {
        echo "<script>alert('Error submitting feedback!');</script>";
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
    <title>Feedback Form</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
    body {
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 20px;
    }

    .stars {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
    }

    .star {
        font-size: 40px;
        color: gray;
        cursor: pointer;
        transition: color 0.3s;
    }

    .star.selected,
    .star:hover {
        color: gold;
    }

    textarea {
        width: 80%;
        height: 100px;
        margin-top: 10px;
        padding: 10px;
    }

    button {
        background-color: #28a745;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        margin-top: 10px;
    }

    button:hover {
        background-color: #218838;
    }
    </style>
</head>

<body>

    <h2>Rate Your Experience</h2>
    <form action="" method="POST">
        <div class="stars">
            <span class="star" data-value="1">&#9733;</span>
            <span class="star" data-value="2">&#9733;</span>
            <span class="star" data-value="3">&#9733;</span>
            <span class="star" data-value="4">&#9733;</span>
            <span class="star" data-value="5">&#9733;</span>
        </div>
        <input type="hidden" name="rating" id="rating" value="5">
        <textarea name="feedback" placeholder="Write your feedback here..." required></textarea>
        <input type="hidden" name="payment_id" value="<?php echo $_GET['payment_id'] ?? ''; ?>">
        <br>
        <button type="submit">Submit Feedback</button>
    </form>

    <script>
    $(document).ready(function() {
        $(".star").click(function() {
            let rating = $(this).data("value");
            $("#rating").val(rating);
            $(".star").removeClass("selected");
            for (let i = 1; i <= rating; i++) {
                $(".star[data-value='" + i + "']").addClass("selected");
            }
        });
    });
    </script>

</body>

</html>