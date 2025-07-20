<?php
require('inc/essentials.php');
session_start();  // Start the session before destroying it
session_destroy();  // Destroy the session
redirect('index.php');  // Redirect to the login page
?>
