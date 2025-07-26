<?php 
$dbserver = "127.0.0.1";
$dbuser = "root";
$dbpwd = "";
$dbname = "hospitalphp";

function my_iud($query)//insert , update and delete
{
global $dbserver,$dbuser,$dbpwd,$dbname;
$cid = mysqli_connect($dbserver,$dbuser,$dbpwd) or die("Connection Failed");
mysqli_select_db($cid,$dbname);
mysqli_query($cid,$query);
$n = mysqli_affected_rows($cid);
mysqli_close($cid);
return $n;
}


function my_select($query)//select
{
global $dbserver,$dbuser,$dbpwd,$dbname;
$cid = mysqli_connect($dbserver,$dbuser,$dbpwd) or die("Connection Failed");
mysqli_select_db($cid,$dbname);
$rs = mysqli_query($cid,$query);
mysqli_close($cid);
return $rs;
}


function my_one($query)
{
global $dbserver,$dbuser,$dbpwd,$dbname;
$cid=mysqli_connect($dbserver,$dbuser,$dbpwd) or die("connection failed");
mysqli_select_db($cid,$dbname);
$rs=mysqli_query($cid,$query);
$row=mysqli_fetch_array($rs);

mysqli_close($cid);
return $row[0];
}



?>