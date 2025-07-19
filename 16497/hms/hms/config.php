<?php

$server = "localhost";
$username = "Shabana_Parveen";
$password = "123";
$database = "deserthotel";

$conn = mysqli_connect($server,$username,$password,$database);

if(!$conn){
    die("<script>alert('connection Failed.')</script>");
}
// else{
//     echo "<script>alert('connection successfully.')</script>";
// }
?>