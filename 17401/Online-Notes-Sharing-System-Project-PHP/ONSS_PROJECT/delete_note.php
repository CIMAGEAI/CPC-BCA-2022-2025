<?php
session_start();
include('includes/dbconnection.php');

// 🛡️ Security: Only admin can delete
if (!isset($_SESSION['adminlogin']) || $_SESSION['adminlogin'] !== true) {
    header("Location: signin.php");
    exit();
}

// ✅ Check if ID is passed in URL
if (isset($_GET['id'])) {
    $noteId = intval($_GET['id']);

    // 🔥 Delete note from tblnotes
    $sql = "DELETE FROM tblnotes WHERE ID = :id";
    $query = $dbh->prepare($sql);
    $query->bindParam(':id', $noteId, PDO::PARAM_INT);
    $query->execute();

    // 🌀 Redirect back to admin panel
    header("Location: admin_dashboard.php");
    exit();
} else {
    echo "❌ Invalid request: Note ID not provided.";
}
?>
