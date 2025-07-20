<?php
session_start();
session_unset();
session_destroy();
header("Location: sury1.php"); // Redirect to sury1.php after logout
exit;
?>