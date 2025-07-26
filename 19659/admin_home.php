<html>
<head>

<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  

</head>
<body>
<?php include "navigationbar3.php" ?>
<div>
<?php
/*
on authentic page, only valid users of website can visit
strangers(anonymous) are not allowed
*/
@session_start();
include_once "dbconfigure.php";
$msg="";
if(verifyuser())
{

	$un=fetchusername();
	$status = "logout";
$msg='Welcome $un , <br /><a href="index.php?a='.$status.'">Signout</a>';
/*echo '<td><a href="familyViewAdmin2.php?id='.$column['clientid'].'&gname='.$column['groupname'].'">*/
		
}
else
{
header("Location:loginerror.php");
}
?>



<div class = container style = "margin-top: 100px ; font-weight : bold">
     <div class = row>
         <div class="col-sm-4 text-center" style="background-color : white ; height : 100px ; font-size : 20pt ; font-family: cursive">
             <img src = "images/Teacher-male-icon.png"> 
             <p style = "color : purple"> <?php echo totalplans() ?><p>
         </div>
         <div class="col-sm-4 text-center" style="background-color : white ; height : 100px ; font-size : 20pt ; font-family: cursive">
             <img src = "images/Student-3-icon.png"> 
             <p style = "color : purple"> <?php echo totalemployees() ?><p>
         </div>
         <div class="col-sm-4 text-center" style="background-color : white ; height : 100px ; font-size : 20pt ; font-family: cursive">
             <img src = "images/Person-Male-Light-icon.png"> 
             <p style = "color : purple"> <?php echo totalcustomers() ?><p>
         </div>
		 
     </div>  
 </div>
<br>
<br>
<br>
<br>
<br>
<br>
<?php include "footer.php"; ?>
</body>
<html>

<?php



function totalplans()
{
$query = "select * from teacher_info";
$rs = my_select($query);
$n = mysqli_num_rows($rs);
return $n;
}

function totalemployees()
{
$query = "select * from student_info";
$rs = my_select($query);
$n = mysqli_num_rows($rs);
return $n;
}


function totalcustomers()
{
$query = "select * from employee_info";
$rs = my_select($query);
$n = mysqli_num_rows($rs);
return $n;
}


?>