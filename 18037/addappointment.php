
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
     <h1 class="text-center">ADD APPOINTMENT</h1>
	 <br>
	 <?php 
	 $query1 = "select * from doctor";
	 $rs1 = my_select($query1);
	 
	 $query2 = "select * from patient";
	 $rs2 = my_select($query2);
	 ?>
	 
	 <form method="post">
	 <label>Doctor Name</label>
	 <select class="form-control" name = "doctor">
	 <?php
		while($row1 = mysqli_fetch_array($rs1))
		{
		?>
			<option value = "<?php echo $row1[1] ?>"><?php echo $row1[1] ?></option>
			<?php
			}
			?>
	 </select>
	 <label>Patient Name</label>
	 <select name = "patient" class="form-control">
	 <?php
		while($row2 = mysqli_fetch_array($rs2))
		{
		?>
			<option value = "<?php echo $row2[1] ?>"><?php echo $row2[1] ?></option>
			<?php
			}
			?>
	 </select>
	 <label>Appointment Date</label>
	 <input type = "date" name = "adate" class="form-control">
	 <label>Appointment Time</label>
	 <input type = "time" name = "atime" class="form-control">
	 <br>
	 <input type = "submit" value="Submit" name="submit" class="form-control btn btn-primary">
	 </form> 
 </div>

</body>
<html>

<?php

if(isset($_POST['submit']))
{
$doctor = $_POST['doctor'];
$patient = $_POST['patient'];
$adate = $_POST['adate'];
$atime = $_POST['atime'];

$query = "insert into appointment(doctorname,patientname,adate,atime) values('$doctor','$patient','$adate','$atime')";
$n = my_iud($query);
if($n==1)
{
echo '<script>alert("Appointment Record Has been Added");
window.location = "viewappointment.php";
</script>';
}
else
{
echo '<script>alert("Something Went Wrong , Try Again...");
</script>';
}
}

?>