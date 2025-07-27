 <html>
<head>
<?php
include "navigationbar3.php";
include "dbconfigure.php";
//session_start();
//$u = $_SESSION['sun'];
?>
 <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
 <link rel=stylesheet type = text/css href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
   <script src="//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>



 <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">
  
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>

  <script type="text/javascript">
  $(document).ready(function () {
$('#myTable123').DataTable();
$('.dataTables_length').addClass('bs-select');
});

  </script>
</head>
<body>

<div>


				<div class="container">
				    <div class=row>
				        <div class="col-sm-12">
  <h1 class = text-center style = "font-family : 'Monotype Corsiva' ; color : purple"><b>All Students</b></h1>



</div>
    
</div>
</div>
<?php
//include "dbconfigure.php" ;


$query = "select * from student_info";
$rs = my_select($query);

echo "<div class = container>";
 
echo "<div class = row>";
echo "<div class = col-sm-12>";
echo "<div class='table-responsive'>";
echo "<table class='table table-hover table-sm' style = 'overflow: scroll' id=myTable123>";
echo "<thead style = 'background-color : #F8E8A0 ; color : #BB3902' >";
echo "<tr>";
echo "<th>First Name</th>";
echo "<th>Last Name</th>";
echo "<th>Class</th>";
echo "<th>Year</th>";
echo "<th>Date of Birth</th>";
echo "<th>Contact No.</th>";
echo "<th>Gender</th>";
echo "<th>Permanent Address</th>";
echo "<th>Present Address</th>";
echo "<th>Delete</th>";
echo "<th>Edit</th>";
echo "</tr>";
echo "</thead>";

echo '<tbody id="myTable">';
while($column=mysqli_fetch_array($rs))
{
echo "<tr class='table-active'>";

echo "<td>$column[1]</td>";
echo "<td>$column[2]</td>";
echo "<td>$column[3]</td>";
echo "<td>$column[4]</td>";
echo "<td>$column[5]</td>";
echo "<td>$column[6]</td>";	
echo "<td>$column[7]</td>";
echo "<td>$column[8]</td>";
echo "<td>$column[9]</td>";																			
echo '<td><a class = "btn btn-xs btn-danger" href="deletestudent.php?id='.$column['Roll'].'">
													Remove
													</a></td>';
																								
echo '<td><a class="btn btn-xs btn-success" href="editstudent.php?id='.$column['Roll'].'">
													Edit
													</a></td>';
																										
													
												
													
												
echo "</tr>";

}
echo "</tbody>";
echo "</table>";
echo "</div>";
echo "</div>";
echo "</div>";
echo "</div>";





include'footer1.php';
?>



<script>
$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
</script>



</div>
<!--<?php  //include "bottom.php "?>-->
</body>
</html>