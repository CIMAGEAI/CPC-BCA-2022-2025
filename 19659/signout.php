<?php ob_start();?>
<html>
<head>
<?php
include "header.php";
?>
</head>
<body>
<?php include "top.php" ?>
<div>
<?php
@session_start();
$_SESSION['sun']="";
$_SESSION['spwd']="";
session_destroy();
setcookie('cun',"",time()-60*60*24*7);
setcookie('cpwd',"",time()-60*60*24*7);
header("Location:index.php");
?>

</div>
<?php  include "bottom.php "?>
</body>
</html>