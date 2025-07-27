<?php 
include "dbconfigure.php";
$id = $_GET[id];

$query = "delete from doctor where doctorid=$id";
my_iud($query);

header("location:viewdoctor.php");
?>