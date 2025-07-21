<?php
$dbserver="127.0.0.1";	//localhost
$dbuser="root";
$dbpwd="";
$dbname="schoolmgmtphp";


function my_iud($query)//insert , update , delete
{
global $dbserver,$dbuser,$dbpwd,$dbname;
$cid=mysqli_connect($dbserver,$dbuser,$dbpwd) or die("connection failed");
mysqli_select_db($cid,$dbname);
mysqli_query($cid,$query);
$n=mysqli_affected_rows($cid);
mysqli_close($cid);
return $n;
}


function my_select($query)
{
global $dbserver,$dbuser,$dbpwd,$dbname;
$cid=mysqli_connect($dbserver,$dbuser,$dbpwd) or die("connection failed");
mysqli_select_db($cid,$dbname);
$rs=mysqli_query($cid,$query);
mysqli_close($cid);
return $rs;
}

//to be used when sql query returns a single value
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


function verifyuser()
{
$u="";
$p="";
if(isset($_COOKIE['cun']) && isset($_COOKIE['cpwd']))
{
$u=$_COOKIE['cun'];
$p=$_COOKIE['cpwd'];
}
else
{
if(isset($_SESSION['sun']) && isset($_SESSION['spwd']))
{
$u=$_SESSION['sun'];
$p=$_SESSION['spwd'];
}
}
$query="select count(*) from admin where adminname='$u' and password='$p'";
$n=my_one($query);
if($n==1)
{
return true;
}
else
{
return false;
}
}


function fetchusername()
{
$u="";
$p="";
if(isset($_COOKIE['cun']) && isset($_COOKIE['cpwd']))
{
$u=$_COOKIE['cun'];
$p=$_COOKIE['cpwd'];
}
else
{
if(isset($_SESSION['sun']) && isset($_SESSION['spwd']))
{
$u=$_SESSION['sun'];
$p=$_SESSION['spwd'];
}
}
$query="select count(*) from admin where adminname='$u' and password='$p'";
$n=my_one($query);
if($n==1)
{
return $u;
}
else
{
return false;
}
}



function fetchrole()
{
$u="";
$p="";
if(isset($_COOKIE['cun']) && isset($_COOKIE['cpwd']))
{
$u=$_COOKIE['cun'];
$p=$_COOKIE['cpwd'];
}
else
{
if(isset($_SESSION['sun']) && isset($_SESSION['spwd']))
{
$u=$_SESSION['sun'];
$p=$_SESSION['spwd'];
}
}
$query="select count(*) from siteuser where username='$u' and pwd='$p'";
$n=my_one($query);
if($n==1)
{
$query="select role from siteuser where username='$u' and pwd='$p'";
$role=my_one($query);
return $role;

}
else
{
return false;
}
}
?>