<?php
include 'db.php';
$result = mysqli_query($conn, "
  SELECT orders.id, users.full_name, users.email, products.title, orders.quantity, orders.order_date
  FROM orders
  JOIN users ON orders.user_id = users.id
  JOIN products ON orders.product_id = products.id
  ORDER BY orders.order_date DESC
");
?>

<!DOCTYPE html>
<html>
<head>
  <title>Admin - Orders</title>
  <style>
    body { font-family: Arial; background: #f0f0f0; padding: 20px; }
    table { border-collapse: collapse; width: 100%; background: #fff; }
    th, td { padding: 12px; border: 1px solid #ccc; text-align: left; }
    th { background: #ff4d88; color: #fff; }
  </style>
</head>
<body>
  <h2>Order Management - Admin Panel</h2>
  <table>
    <tr>
      <th>Order ID</th>
      <th>Customer</th>
      <th>Email</th>
      <th>Product</th>
      <th>Quantity</th>
      <th>Date</th>
    </tr>
    <?php while ($row = mysqli_fetch_assoc($result)): ?>
      <tr>
        <td><?= $row['id'] ?></td>
        <td><?= htmlspecialchars($row['full_name']) ?></td>
        <td><?= htmlspecialchars($row['email']) ?></td>
        <td><?= htmlspecialchars($row['title']) ?></td>
        <td><?= $row['quantity'] ?></td>
        <td><?= $row['order_date'] ?></td>
      </tr>
    <?php endwhile; ?>
  </table>
</body>
</html>
