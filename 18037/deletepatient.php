<?php 
include "dbconfigure.php";
$id = $_GET[id];

$query = "delete from patient where patientid=$id";
my_iud($query);

header("location:viewpatient.php");
?>