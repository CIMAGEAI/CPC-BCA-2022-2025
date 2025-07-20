<?php
include 'connect.php';

// ✅ Handle status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_status'])) {
    $order_id = $_POST['order_id'];
    $new_status = $_POST['status'];
    $update = $conn->prepare("UPDATE orders SET status=? WHERE id=?");
    $update->bind_param("si", $new_status, $order_id);
    $update->execute();
}

// ✅ Filter by status (from GET)
$filter_status = isset($_GET['status']) ? $_GET['status'] : '';

if ($filter_status && $filter_status !== "All") {
    $stmt = $conn->prepare("SELECT * FROM orders WHERE status=? ORDER BY created_at DESC");
    $stmt->bind_param("s", $filter_status);
} else {
    $stmt = $conn->prepare("SELECT * FROM orders ORDER BY created_at DESC");
}
$stmt->execute();
$result = $stmt->get_result();
?>

<!DOCTYPE html>
<html>
<head>
  <title>Admin - Orders with Filter</title>
  <style>
    body {
      font-family: Arial;
      background: #f4f4f4;
      padding: 20px;
    }
    h2 {
      text-align: center;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      margin-top: 20px;
    }
    th, td {
      padding: 12px;
      border: 1px solid #ccc;
      text-align: left;
    }
    th {
      background: #eee;
    }
    form select, form button {
      padding: 6px;
    }
    .invoice-link {
      color: green;
      font-weight: bold;
      text-decoration: none;
    }
    .filter-box {
      text-align: right;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>

<h2>📋 Admin Dashboard - Orders</h2>

<div class="filter-box">
  <form method="GET">
    <label>Filter Status:</label>
    <select name="status" onchange="this.form.submit()">
      <option <?= $filter_status == 'All' ? 'selected' : '' ?>>All</option>
      <option <?= $filter_status == 'Pending' ? 'selected' : '' ?>>Pending</option>
      <option <?= $filter_status == 'Confirmed' ? 'selected' : '' ?>>Confirmed</option>
      <option <?= $filter_status == 'Cancelled' ? 'selected' : '' ?>>Cancelled</option>
    </select>
  </form>
</div>

<table>
  <thead>
    <tr>
      <th>Order ID</th>
      <th>Customer</th>
      <th>Email</th>
      <th>Total</th>
      <th>Status</th>
      <th>Change Status</th>
      <th>Invoice</th>
      <th>Date</th>
      <th>Payment</th> <!-- ✅ New column -->
    </tr>
  </thead>
  <tbody>
    <?php if ($result->num_rows == 0): ?>
      <tr><td colspan="9">No orders found.</td></tr>
    <?php else: ?>
      <?php while ($row = $result->fetch_assoc()): ?>
      <tr>
        <td><?= $row['id'] ?></td>
        <td><?= htmlspecialchars($row['customer_name']) ?></td>
        <td><?= $row['email'] ?></td>
        <td>₹<?= $row['total_price'] ?></td>
        <td><?= $row['status'] ?></td>
        <td>
          <form method="POST">
            <input type="hidden" name="order_id" value="<?= $row['id'] ?>">
            <select name="status">
              <option <?= $row['status']=='Pending'?'selected':'' ?>>Pending</option>
              <option <?= $row['status']=='Confirmed'?'selected':'' ?>>Confirmed</option>
              <option <?= $row['status']=='Cancelled'?'selected':'' ?>>Cancelled</option>
            </select>
            <button name="update_status">Update</button>
          </form>
        </td>
        <td>
          <a class="invoice-link" href="generate_invoice.php?order_id=<?= $row['id'] ?>" target="_blank">🧾 Download</a>
        </td>
        <td><?= $row['created_at'] ?></td>
        <td><?= $row['payment_method'] ?></td> <!-- ✅ Show payment method -->
      </tr>
      <?php endwhile; ?>
    <?php endif; ?>
  </tbody>
</table>

</body>
</html>
