<?php


include "dbconfigure.php";
@session_start();
$u = $_SESSION['sun'];

$id=$_GET['id'];


$query = "delete from student_info where roll='$id'";
$n = my_iud($query);
//echo "$n record removed";  
header("Location:viewstudent.php");
?>