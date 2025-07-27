<?php 
include "dbconfigure.php";
$id = $_GET[id];

$query = "delete from appointment where appointmentid=$id";
my_iud($query);

header("location:viewappointment.php");
?>