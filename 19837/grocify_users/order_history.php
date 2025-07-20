<?php
session_start();
include 'connect.php';

$user_email = $_SESSION['user_email']; // Assumes you stored email in session after login

$query = $conn->prepare("SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC");
$query->bind_param("s", $user_email);
$query->execute();
$result = $query->get_result();
?>

<!DOCTYPE html>
<html>
<head>
  <title>Your Order History</title>
  <style>
    body { font-family: Arial; padding: 20px; background: #f0f0f0; }
    h2 { text-align: center; }
    table { width: 100%; border-collapse: collapse; background: white; margin-top: 20px; }
    th, td { padding: 10px; border: 1px solid #ddd; }
    th { background: #eee; }
  </style>
</head>
<body>

<h2>📦 Your Order History</h2>

<table>
  <thead>
    <tr>
      <th>Order ID</th><th>Summary</th><th>Total</th><th>Status</th><th>Date</th>
    </tr>
  </thead>
  <tbody>
    <?php while ($row = $result->fetch_assoc()): ?>
    <tr>
      <td><?= $row['id'] ?></td>
      <td><?= nl2br(htmlspecialchars($row['order_summary'])) ?></td>
      <td>₹<?= $row['total_price'] ?></td>
      <td><?= $row['status'] ?></td>
      <td><?= $row['created_at'] ?></td>
    </tr>
    <?php endwhile; ?>
  </tbody>
</table>

</body>
</html>
