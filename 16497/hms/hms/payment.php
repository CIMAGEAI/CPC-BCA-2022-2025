<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Payment Gateway</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #bfe0faff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .payment-form {
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            width: 350px;
        }

        .payment-form h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #5f4dffff;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 8px;
        }

        .pay-btn {
            width: 100%;
            padding: 12px;
            background-color: #5f4dffff;
            border: none;
            color: white;
            font-size: 16px;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
        }

        .pay-btn:hover {
            background-color: #5f4dffff;
        }

        .success-message {
            color: green;
            text-align: center;
            margin-top: 15px;
        }
    </style>
</head>

<body>

    <form action="https://razorpay.me/@xyberweb?amount=N3FC4r7uD3DNAg9EH0MDNw%3D%3D" class="payment-form" method="POST" action="">
        <h2>Payment Gateway</h2>

        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required pattern="[A-Za-z\s]{2,}"
                title="Only letters and spaces, minimum 2 characters">
        </div>

        <div class="form-group">
            <label for="email">Email Id</label>
            <input type="email" id="email" name="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Enter a valid email address">
        </div>


        <!-- <div class="form-group">
      <label for="number">Card Number</label>
      <input type="text" id="number" name="card_number" maxlength="16" required>
    </div>

    <div class="form-group">
      <label for="expiry">Expiry Date</label>
      <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required>
    </div>

    <div class="form-group">
      <label for="cvv">CVV</label>
      <input type="password" id="cvv" name="cvv" maxlength="3" required>
    </div> -->

        <button class="pay-btn" type="submit" name="pay">Pay Now</button>

        <?php
        if (isset($_POST['pay'])) {
            echo "<p class='success-message'>Payment processed successfully (Simulated)!</p>";
            // In real use: validate card, process with gateway API
        }
        ?>
    </form>

</body>

</html>