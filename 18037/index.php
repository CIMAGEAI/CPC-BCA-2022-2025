<html>
<head>
<?php include "header.php" ?>
</head>
<body>
<?php include "navigationbar.php" ?>


<div class="container" style = "margin-top : 100px">
	   <div class=row>
	   
	   <div class=col-sm-3>

</div>     
<div class=col-sm-6>
			<form method='post'>
                            
				
							<center><h1 style = "font-family : 'Monotype Corsiva' ; color : purple ;"><b>Admin Login</b></h1></center>
						<div class="form-group" style = " border-radius: 10px;">
							<label>UserName</label>
					
            <input type="text"   class="form-control" placeholder="User Name" name="username">
					
						
							<label>Password</label>
						
           <input type="password" class="form-control" placeholder="Password" name="pwd">
		   							
<label class="form-check-label">
<input type="checkbox" class="form-check-input" name="rem"  value='yes'>Remember Me
</label>
</div>
							
							
							
							
							
					
<div class="form-group">
<input type="submit" class="btn btn-danger" name="login"  value="login" style = "width : 200px">
</div>




			</form>
			</div>
 <div class=col-sm-3>
				   

</div> 


</div>

</div> 
<?php include "footer.php"; ?>


</body>
</html>

<?php
if(isset($_REQUEST['login']))
{
$username=$_REQUEST['username'];
$pwd=$_REQUEST['pwd'];
//syntax to fetch value of checkbox
if(isset($_REQUEST['rem']))
$remember='yes';
else
$remember='no';
//echo "<br/>$username,$pwd,$remember";

//1. check if user is valid or not
$query="select count(*) from admin where adminname='$username' and password='$pwd'";
include "dbconfigure.php";
$ans=my_one($query);
if($ans==1)
{
//2. save username and pwd to session variables
$_SESSION['sun']=$username;
$_SESSION['spwd']=$pwd;

//3. if remember is yes, save them to cookies too
if($remember=='yes')
{
setcookie('cun',$username,time()+60*60*24*7);
setcookie('cpwd',$pwd,time()+60*60*24*7);
}
echo '<script>alert("Login Successfull");
window.location = "admin_home.php";
</script>';


}
else
{
echo '<script>alert("Invalid Login Credentials , Try Again");
</script>';
}

}

?>

