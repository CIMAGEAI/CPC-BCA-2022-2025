<?php
include 'connect.php';

// Collect basic details
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$address = $_POST['address'];
$order_summary = $_POST['order_summary'];
$total = floatval($_POST['total']);
$payment_method = $_POST['payment_method']; // ✅ NEW FIELD

$cart_json = $_POST['full_cart']; // cart JSON from hidden input
$cart = json_decode($cart_json, true);

// Step 1: Insert into `orders`
$stmt = $conn->prepare("INSERT INTO orders (customer_name, email, phone, address, order_summary, total_price, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $name, $email, $phone, $address, $order_summary, $total, $payment_method);

if ($stmt->execute()) {
    $order_id = $stmt->insert_id;

    // Step 2: Save each product into `order_items`
    if (!empty($cart)) {
        $item_stmt = $conn->prepare("INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?, ?, ?, ?)");
        foreach ($cart as $item) {
            $product_name = $item['name'];
            $quantity = $item['qty'];
            $price = $item['price'];
            $item_stmt->bind_param("isid", $order_id, $product_name, $quantity, $price);
            $item_stmt->execute();
        }
    }

    echo "✅ Order saved to database with payment method!";
} else {
    echo "❌ Error saving order: " . $stmt->error;
}
?>

