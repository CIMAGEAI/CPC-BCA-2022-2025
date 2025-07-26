
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
     <h1 class="text-center">ADD DOCTOR</h1>
	 <br>
	 <form method="post">
	 <label>Doctor Name</label>
	 <input type = "text" name = "doctorname" class="form-control">
	 <label>Specialization</label>
	 <input type = "text" name = "specialization" class="form-control">
	 <label>Contact</label>
	 <input type = "text" name = "contact" class="form-control">
	 <br>
	 <input type = "submit" value="Submit" name="submit" class="form-control btn btn-primary">
	 </form> 
 </div>

</body>
<html>

<?php

if(isset($_POST['submit']))
{
$doctorname = $_POST['doctorname'];
$specialization = $_POST['specialization'];
$contact = $_POST['contact'];

$query = "insert into doctor(doctorname,specialization,contact) values('$doctorname','$specialization','$contact')";
$n = my_iud($query);
if($n==1)
{
echo '<script>alert("Doctor Record Has been Added");
window.location = "viewdoctor.php";
</script>';
}
else
{
echo '<script>alert("Something Went Wrong , Try Again...");
</script>';
}
}

?>