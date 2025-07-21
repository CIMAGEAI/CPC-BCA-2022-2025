
<html>
<head>

<?php 
include "dbconfigure.php";
include "header.php"; ?>
  
  <script>
  $(document).ready(function() {
    $('#example').DataTable();
} );
  </script>
  
  <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
<script src="https://cdn.datatables.net/1.10.22/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.22/js/dataTables.bootstrap4.min.js"></script>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.css">
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.22/css/dataTables.bootstrap4.min.css">

</head>
<style>
	.thead{
		background:#dc3592;
		border-color:#dc3592;	
	}
	</style>
<body>






<?php 
ob_start();
$id = $_GET['id'];
?>
<html>
<head>

<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  

</head>
<body>
<?php include "navigationbar2.php";
include "dbconfigure.php";
 ?>

<div>
<?php
/*
on authentic page, only valid users of website can visit
strangers(anonymous) are not allowed
*/
@session_start();
$msg="";
if(verifyuser())
{

	$un=fetchusername();
	$status = "logout";
$msg='Welcome $un , <br /><a href="index.php?a='.$status.'">Signout</a>';

	
}
else
{
header("Location:loginerror.php");
}
?>



<div class = container style = "margin-top : 100px ;">
<h2 class = text-center style = "font-family : 'Monotype Corsiva' ; color : #E6120E">Edit Student</h2>
<?php 
$query = "select * from patient where roll='$id'";
$rs = my_select($query);
echo "<div class='table-responsive'>";
echo "<table class='table table-hover table-borderless'>";
while($column=mysqli_fetch_array($rs))
{
echo '<form method = post>';
echo "<tr><th>Roll Number</th> <td><input type = text  value = $column[0] readonly></td></tr>";
echo "<tr><th>First Name</th> <td><input type = text name = 'First_name' value = $column[1]></td></tr>";
echo "<tr><th>Last Name</th> <td><input type = text name = 'Last_name' value = $column[2]></td></tr>";
echo "<tr><th>Class</th> <td><input type = text name = 'Class' value = '$column[3]'></td></tr>";
echo "<tr><th>Year</th> <td><input type = text name = 'Year' value = '$column[4]'></td></tr>";
echo "<tr><th>Date of Birth</th> <td><input type = date  value = '$column[5]' name ='Birth_date'></td></tr>";
echo "<tr><th>Mobile Number</th> <td><input type = text name = 'Mobile_no' value = $column[6]></td></tr>";
echo "<tr><th>Gender</th>
<td> ";
if($column[7]=='male')
{
echo "
<select name='Sex'>
<option value = male selected>Male</option>
<option value = female>Female</option>
</select>";
}
else
{echo "
<select name='Sex'>
<option value = male>Male</option>
<option value = female selected>Female</option>
</select>";
}
echo "</td></tr>";
 
echo "<tr><th>Permanent Address</th> <td><input type = text name = 'Permanent' value = '$column[8]'></td></tr>";
echo "<tr><th>Present Address</th> <td><input type = text name = 'Present' value = '$column[9]'></td></tr>";
}
echo "</table>";
echo '<input type = submit value = "Submit" class="btn btn-primary" name="edit"></form>
</div>';
?>

</div>
<?php  //include "bottom.php"; ?>
<?php
if(isset($_POST['edit']))
{
$First_name=$_POST['First_name'];
$Last_name=$_POST['Last_name'];
$Class=$_POST['Class'];

$Year=$_POST['Year'];
$Birth_date=$_POST['Birth_date'];
$Mobile_no=$_POST['Mobile_no'];
$Sex=$_POST['Sex'];
$Permanent=$_POST['Permanent'];
$Present=$_POST['Present'];
$query = "update student_info set First_name='$First_name',Last_name='$Last_name',Class='$Class',Year='$Year',Birth_date='$Birth_date',Mobile_no='$Mobile_no',Sex='$Sex',Permanent='$Permanent',Present='$Present' where roll='$id'";
my_iud($query);
header("Location:viewstudent.php");
}
?>



</body>
</html>