<?php
// Database connection
$conn = new mysqli('localhost', 'root', '', 'hotal_man',3306);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if(isset($_GET['id'])) {
    $id = $_GET['id'];
    
    // Delete the payment record
    $sql = "DELETE FROM payments WHERE id = $id";
    
    if ($conn->query($sql) === TRUE) {
        header("Location: paymenthistry.php");
    } else {
        echo "Error deleting record: " . $conn->error;
    }
}
$conn->close();
?>