<?php
include 'config.php'; // Database connection

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Delete record from contactus table
    $sql = "DELETE FROM contactus WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "<script>alert('Message deleted successfully!'); window.location.href='contactushistry.php';</script>";
    } else {
        echo "<script>alert('Error deleting message');</script>";
    }

    $stmt->close();
    $conn->close();
}
?>