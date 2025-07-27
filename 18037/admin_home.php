
<html>
<head>

<?php 
include "dbconfigure.php";
include "header.php"; ?>
  

</head>
<body>
<?php include "navigationbar2.php" ?>
<div>
<div class = container style = "margin-top: 100px ; font-weight : bold">
     <div class = row>
         <div class="col-sm-4 text-center" style="background-color : white ; height : 100px ; font-size : 20pt ; font-family: cursive">
             <img src = "images/docter button1.jpg"> 
             <p style = "color : purple"> <?php echo totaldoctor() ?><p>
         </div>
         <div class="col-sm-4 text-center" style="background-color : white ; height : 100px ; font-size : 20pt ; font-family: cursive">
             <img src = "images/patient button1.jpg"> 
             <p style = "color : purple"> <?php echo totalpatient() ?><p>
         </div>
         <div class="col-sm-4 text-center" style="background-color : white ; height : 100px ; font-size : 20pt ; font-family: cursive">
             <img src = "images/appointment button1.png"> 
             <p style = "color : purple"> <?php echo totalappointment() ?><p>
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



function totaldoctor()
{
$query = "select * from doctor";
$rs = my_select($query);
$n = mysqli_num_rows($rs);
return $n;
}

function totalpatient()
{
$query = "select * from patient";
$rs = my_select($query);
$n = mysqli_num_rows($rs);
return $n;
}


function totalappointment()
{
$query = "select * from appointment";
$rs = my_select($query);
$n = mysqli_num_rows($rs);
return $n;
}


?>