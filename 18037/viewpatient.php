
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
<?php include "navigationbar2.php";

$query = "select * from patient";
$rs = my_select($query);

?>




<div>
<div class = container style = "margin-top: 100px ; font-weight : bold">
     <h1 class="text-center">VIEW PATIENT</h1>
	 <br>
	 <table class="table align-middle mb-0 bg-white" id="example">
	 <thead class="thead">
	 <tr>
	 <td>S.No.</td>
	 <td>Patient ID</td>
	 <td>Patient Name</td>
	 <td>Address</td>
	 <td>Gender</td>
	 <td>Contact</td>
	  <td>Action</td>
	  <!-- <td>Edit</td> -->
	 </tr>
	 </thead>
	 
	 <tbody>
	 <?php 
	 $i = 0;
	 while($row = mysqli_fetch_array($rs))
	 {
	 $i++;
	 ?>
	 <tr>
	 <td><?php echo $i; ?></td>
	 <td><?php echo $row[0]; ?></td>
	 <td><?php echo $row[1]; ?></td>
	 <td><?php echo $row[2]; ?></td>
	 <td><?php echo $row[3]; ?></td>
	 <td><?php echo $row[4]; ?></td>
	  <td><a class="btn btn-xs btn-danger" href="deletepatient.php?id=<?php echo $row[0] ?>">Delete</a></td>
	  <!-- <td><a class="btn btn-xs btn-success" href="editpatient.php?id=<?php echo $row[0] ?>">Edit</a></td> -->
	 </tr>
	<?php 
	 }
	 ?>
	 </tbody>
	 </table>
 </div>

</body>
<html>



