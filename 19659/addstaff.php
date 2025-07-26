<?php 
ob_start();
?>

<html>
<head>
<?php
session_start();
$un = $_SESSION['sun'];
include "navigationbar3.php";

?>
 <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
 <link rel=stylesheet type = text/css href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
   <script src="//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
</head>
<body>




				<div class="container">
  <h2 class=text-center style = "color : blue">Register Staff</h2>


<div class="col-xs-3">

</div>

<form method="post" enctype = "multipart/form-data">
<div class="form-group col-xs-6">
<label >First Name</label>
<input type="text" name="First_name" id="First_name" class="form-control" >



<label>Last_name</label>
<input type="text" name = "Last_name" id = "Last_name" class="form-control" >



<label>Position</label>
<input type="text" name="Position" id="Position" class="form-control" > 
 
<label>Date of Birth</label>
<input type="date" name="Birth_day" id="Birth_day" class="form-control" > 

<label>Contact Number</label>
<input type="text" name="Mobile_no" id="Mobile_no" class="form-control" > 

<label>Gender</label>
<select name="Sex" id="Sex" >
<option value = male>Male</option>
<option value = female>Female</option>
</select>
<br>

<label>Permanent Address</label>
<textarea name="Permanent" id="Permanent" class="form-control" > </textarea>

<label>Present Address</label>
<textarea name="Present" id="Present" class="form-control" >  </textarea>


<input type="submit" class="btn btn-primary" name="save"  value="Save"/>
</div>
</form>

<div class="col-xs-3">

</div>

</div>

<?php

include "dbconfigure.php" ;
if(isset($_POST["save"]))
{

$First_name=$_POST['First_name'];
$Last_name=$_POST['Last_name'];
$Position=$_POST['Position'];

$Birth_day=$_POST['Birth_day'];
$Mobile_no=$_POST['Mobile_no'];
$Sex=$_POST['Sex'];

$Permanent=$_POST['Permanent'];
$Present=$_POST['Present'];


$query="insert into employee_info(First_name,Last_name,Position,Birth_day,Mobile_no,Sex,Permanent,Present) values('$First_name','$Last_name','$Position','$Birth_day','$Mobile_no','$Sex','$Permanent','$Present')";
$n = my_iud($query);
if($n==1)
{
echo '<script>alert("Record Saved Successfully");
window.location = "viewstaff.php";
</script>';
}
else
{
echo '<script>alert("Something Went Wrong");</script>';
}
}

?>

<?php  //include "bottom.php "?>
</body>
</html>