<?php

session_start();
define("SERVER","localhost");
	define("USER","root");
	define("PASSWORD","");
	define("DATABASE","electronic_shopping");
	function iud($query)
	{
		$cid=mysqli_connect(SERVER,USER,PASSWORD,DATABASE) or die("connection error");
	$result=mysqli_query($cid,$query);
	$n=mysqli_affected_rows($cid);
	mysqli_close($cid);
	return $n;
	}
	
function select($query)
{
	$cid=mysqli_connect(SERVER,USER,PASSWORD,DATABASE) or die("connection error");
	$result=mysqli_query($cid,$query);
	mysqli_close($cid);
	return $result;
}













?>
	