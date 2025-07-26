<?php
require_once 'dompdf/autoload.inc.php';
include 'connect.php';

use Dompdf\Dompdf;
use Dompdf\Options;

if (!isset($_GET['order_id'])) {
    die("❌ Order ID missing.");
}

$order_id = intval($_GET['order_id']);

// ✅ Fetch order details
$stmt = $conn->prepare("SELECT * FROM orders WHERE id = ?");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$order = $stmt->get_result()->fetch_assoc();

if (!$order) {
    die("❌ Order not found.");
}

// ✅ Fetch ordered products
$items = $conn->query("SELECT * FROM order_items WHERE order_id = $order_id");

// ✅ HTML invoice content
$html = '
<style>
  body { font-family: DejaVu Sans, sans-serif; }
  h2 { text-align: center; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th, td { border: 1px solid #444; padding: 8px; text-align: left; }
  th { background: #eee; }
</style>

<h2>🧾 Grocify Invoice</h2>
<p><strong>Order ID:</strong> '.$order['id'].'<br>
<strong>Customer:</strong> '.$order['customer_name'].'<br>
<strong>Email:</strong> '.$order['email'].'<br>
<strong>Phone:</strong> '.$order['phone'].'<br>
<strong>Address:</strong> '.$order['address'].'<br>
<strong>Status:</strong> '.$order['status'].'<br>
<strong>Payment:</strong> '.$order['payment_method'].'<br>
<strong>Date:</strong> '.$order['created_at'].'</p>

<table>
<tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>';

$grandTotal = 0;
while ($item = $items->fetch_assoc()) {
    $lineTotal = $item['quantity'] * $item['price'];
    $grandTotal += $lineTotal;

    $html .= '<tr>
        <td>'.$item['product_name'].'</td>
        <td>'.$item['quantity'].'</td>
        <td>&#8377;'.$item['price'].'</td>
        <td>&#8377;'.$lineTotal.'</td>
    </tr>';
}

$html .= '</table><h3>Total: &#8377;'.$grandTotal.'</h3>';

// ✅ Dompdf options for unicode support
$options = new Options();
$options->set('defaultFont', 'DejaVu Sans');
$dompdf = new Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream("Grocify_Invoice_".$order_id.".pdf", ["Attachment" => false]);
exit;
?>
