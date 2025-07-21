
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
     <h1 class="text-center">ADD PATIENT</h1>
	 <br>
	 <form method="post">
	 <label>Patient Name</label>
	 <input type = "text" name = "patientname" class="form-control">
	 <label>Address</label>
	 <textarea name = "patientaddress" class="form-control"></textarea>
	 <label>Gender</label>
	 <input type = "radio" value="male" name = "gender"> Male
	 <input type = "radio" value="female" name = "gender"> Female
	 <br>
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
$patientname = $_POST['patientname'];
$patientaddress = $_POST['patientaddress'];
$gender = $_POST['gender'];
$contact = $_POST['contact'];

$query = "insert into patient(patientname,patientaddress,gender,contact) values('$patientname','$patientaddress','$gender','$contact')";
$n = my_iud($query);
if($n==1)
{
echo '<script>alert("Patient Record Has been Added");
window.location = "viewpatient.php";
</script>';
}
else
{
echo '<script>alert("Something Went Wrong , Try Again...");
</script>';
}
}

?>