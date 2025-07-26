<!DOCTYPE html>
<html lang="en">
<head>
  <title>School Management System</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
</head>
<style>
  .navbar-brand{
    margin-left:40%;
  }
</style>
<body>
<!--nav start-->
<nav class="navbar navbar-expand-md" style = "background-color :blue">
  <h2 class="navbar-brand" href="#" style = "color : #570061 ; font-weight : bold">School Management System</h2>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="collapsibleNavbar">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" href="admin_home.php" style = "color : white">Home</a>
      </li>
      
    
	  
	  <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown" style = "color : white">
        Teacher
      </a>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="addteacher.php">Add Teacher</a>
        <a class="dropdown-item" href="viewteacher.php">View Teacher</a>
      </div>
    </li>
	
	
	<li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown" style = "color : white">
       Student
      </a>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="addstudent.php">Add Student</a>
        <a class="dropdown-item" href="viewstudent.php">View Student</a>
      </div>
    </li>  
	  
	  
	  <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown" style = "color : white">
        Staff
      </a>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="addstaff.php">Add Staff</a>
        <a class="dropdown-item" href="viewstaff.php">View Staff</a>
      </div>
    </li>
	  
	  
<li class="nav-item">
        <a class="nav-link" href="signout.php" style = "color : white">Logout</a>
      </li>   	  
    </ul>
  </div>  
</nav>
<!-- navigation end-->
</body>
</html>