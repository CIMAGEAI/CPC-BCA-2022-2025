<?php
include 'db.php';

$product_id = $_GET['product_id'] ?? 0;

$query = "SELECT * FROM products WHERE id = $product_id";
$result = mysqli_query($conn, $query);
$product = mysqli_fetch_assoc($result);

if (!$product) {
    echo "Product not found.";
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
  <title>Payment - Cosmetics Store</title>
  <style>
    body { font-family: Arial; background: #fef6f9; padding: 20px; }
    .payment-box { max-width: 400px; margin: auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    input, button { width: 100%; margin: 10px 0; padding: 10px; }
    button { background: #ff4d88; color: #fff; border: none; font-weight: bold; }
  </style>
</head>
<body>

<div class="payment-box">
  <h2>Payment for <?= htmlspecialchars($product['title']) ?></h2>
  <p><strong>Price: ₹<?= $product['price'] ?></strong></p>
  <form action="process_payment.php" method="POST">
    <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
    <input type="text" name="customer_name" placeholder="Your Name" required>
    <input type="email" name="customer_email" placeholder="Your Email" required>
    <input type="number" name="quantity" min="1" value="1" required>
    <button type="submit">Confirm Payment</button>
  </form>
</div>

</body>
</html>
