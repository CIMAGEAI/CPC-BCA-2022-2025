
<!--nav start-->
 <div>
  <h1>
     <a class="navbar-brand" href="#" style = "color : orange; margin-left:32%; font-size: 37px;">Hospital Management System</a>
  </h1>
</div>
<nav class="navbar navbar-expand-md" style = "background-color :#00615e; ">

  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="collapsibleNavbar" style=" margin-left: 34%;">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" href="admin_home.php" style = "color : white">Home</a>
      </li>
      
    
	  
	  <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown" style = "color : white;">
        Doctor
      </a>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="adddoctor.php">Add Doctor</a>
        <a class="dropdown-item" href="viewdoctor.php">View Doctor</a>
      </div>
    </li>
	
	
	<li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown" style = "color : white;">
       Patient
      </a>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="addpatient.php">Add Patient</a>
        <a class="dropdown-item" href="viewpatient.php">View Patient</a>
      </div>
    </li>  
	  
	  
	  <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown" style = "color : white">
        Appointment
      </a>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="addappointment.php">Add Appointment</a>
        <a class="dropdown-item" href="viewappointment.php">View Appointment</a>
      </div>
    </li>
	  
	  
<li class="nav-item">
        <a class="nav-link" href="signout.php" style = "color : white">Logout</a>
      </li>   	  
    </ul>
  </div>  
</nav>
