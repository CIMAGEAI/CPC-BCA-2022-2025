<?php
require_once"dbconfig.php";

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="description" content="">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
     <title>Dorne - Directory &amp; Listing Template</title>

					
    <link rel="icon" href="img/core-img/favicon.ico">

     <link href="style.css" rel="stylesheet">

    <link href="css/responsive/responsive.css" rel="stylesheet">
<script src="jquery.min.js"></script>
	<script>  
 $(document).ready(function(){  
      $('#country').keyup(function(){  
           var query = $(this).val();
aler(query);		   
           if(query != '')  
           {  
                $.ajax({  
                     url:"searchinput.php",  
                     method:"POST",  
                     data:{query:query},  
                     success:function(data)  
                     {  
                          $('#countryList').fadeIn();  
                          $('#countryList').html(data);  
                          
                     }  
                });  
           }  
      });  
      $(document).on('click', 'li', function(){  
           $('#country').val($(this).text());  
           $('#countryList').fadeOut();  
      }); 

$('.navbar-light .dmenu').hover(function () {
        $(this).find('.sm-menu').first().stop(true, true).slideDown(150);
    }, function () {
        $(this).find('.sm-menu').first().stop(true, true).slideUp(105)
    });	  
 });  
 </script>  
</head>

<body>
    <div id="preloader">
        <div class="dorne-load"></div>
    </div>

   <header class="header_area" id="header">
        <div class="container-fluid h-100">
            <div class="row h-100">
                <div class="col-12 h-100">
                    <nav class="h-100 navbar navbar-expand-lg">
                        <a class="navbar-brand" href="index.php">ONLINE ELECTRONIC SHOP</a>
                       
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#dorneNav" aria-controls="dorneNav" aria-expanded="false" aria-label="Toggle navigation"><span class="fa fa-bars"></span></button>
                        <!-- Nav -->
                        <div class="collapse navbar-collapse" id="dorneNav">
                            <ul class="navbar-nav mr-auto" id="dorneMenu">
                                <li class="nav-item active">
                                    <a class="nav-link" href="index.php"><span class="sr-only">(current)</span></a>
                                </li>
                                <li class="nav-item dropdown">
                                    <
                                </li>
                                
                            </ul>
                             <div class="dorne-signin-btn">
							   <?php
							   if(isset($_SESSION['login']))
							   {
								   ?><a class="nav-link" href="index.php">Home <span class="sr-only">(current)</span></a>
                              
								<a class="nav-link" href="mycart.php">My Cart</a>
								<a class="nav-link" href="category.php">Category</a>
                              
                                	<a class="nav-link" href="logout.php">Logout</a>
								   
								   <?php
							   }
								   else
								   {
									   ?>
									   <a href="ragister.php">Sign in  or Register</a>
								<a class="nav-link" href="index.php">Home <span class="sr-only">(current)</span></a>
								<a class="nav-link" href="category.php">Category</a>
                              
								   <?php
								   }
							   
							   ?>
                                
                            </div>
                           
                            
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </header>
     <section class="dorne-welcome-area bg-img bg-overlay" style="background-image: url(img/bg-img/hero-1.jpg);">
        <div class="container h-100">
            <div class="row h-100 align-items-center justify-content-center">
                <div class="col-12 col-md-6"></br></br>
                    <div class="hero-content"></br></br></br></br></br>
                        
                              <h1 style="color:white;font-weight:bold;  text-shadow: 2px 2px 14px #7546E4;">SEARCH YOUR PRODUCT</h1>
                        
                    </div>
                    
<div class="container-fluid">
<div class="row">
<div class="col-lg-4">
<form class="form-inline" method="post" action="search_view.php">  

  
  <div class="form-group ">
    <input type="text" class="form-control" name= "country" id="country"  placeholder="Type here...">
  </div>
  </div><div class="col-lg-4">

  <div class="form-group ">
<select class="form-control" name="category">
<option>Select</option>
<option value="CamerasPhotography">Cameras & Photography</option>
<option value="CarVehicleElectronics">Car & Vehicle Electronics</option>
<option value="ComputersAccessories">Computers & Accessories</option>
<option value="Headphones">Headphones</option>
<option value="HomeTheaterTVVideo">Home Theater, TV & Video</option>
<option value="MobilesAccessories">Mobiles & Accessories</option>
<option value="Tablets">Tablets</option>




</select>     
	 </div>
  </div>
   
<div class="col-lg-4">
  <button type="submit" name="onsearch" id="search_click" class="btn btn-success ">Search</button></div>
</form>	
		 	
</div>
</div>
<div id="countryList" style="background-color:yellow"></div>	

					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
                </div>
            </div>
        </div>
        <!-- Hero Social Btn -->
        
    </section>
    
    
    <!-- ***** Features Destinations Area Start ***** -->
    <section class="dorne-features-destinations-area">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="section-heading dark text-center">
                        <span></span>
                        <h4>ELECTRONICS Collection</h4>
                        <p>Best Items</p>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="features-slides owl-carousel">
                     
					 <?php
					 $result=select("select * from items where category='CamerasPhotography'");
					 while($r=mysqli_fetch_array($result))
					 {
						 extract($r);
					 ?>
                        <div class="single-features-area">
                            <a href="view_detail.php?id=<?=$elecid?>"><img src="admin/images/<?=$image?>" style="height:200px;width:400px">
                            <!-- Price -->
                            <div class="price-start">
                                </div>
                            <div class="feature-content d-flex align-items-center justify-content-between" style="height:150px">
                                <div class="feature-title">
								 <p><?=$Title?></p>
                               
                                   <h5><?=$price?>/-</h5></br>
								     </div>
                                
								<?php for($i=1;$i<=$elec_rating;$i++) :  ?>

								<i class="fa fa-star" style="color:red" aria-hidden="true"></i>
                               <?php  endfor; ?>
                                    
                            </div></a>
                        </div>
						<?php
					 }
						?>
                        
                        
                    </div>
                </div>
            </div></br></br>
			<div class="row">
                <div class="col-12">
                    <div class="features-slides owl-carousel">
                     
					 <?php
					 $result=select("select * from items where category='CarVehicleElectronics'");
					 while($r=mysqli_fetch_array($result))
					 {
						 extract($r);
					 ?>
                        <a href="view_detail.php?id=<?=$elecid?>"><div class="single-features-area">
                            <img src="admin/images/<?=$image?>" style="height:200px;width:400px">
                            <!-- Price -->
                            <div class="price-start">
                                </div>
                            <div class="feature-content d-flex align-items-center justify-content-between" style="height:150px">
                                <div class="feature-title">
								 <p><?=$Title?></p>
                               
                                   <h5><?=$price?>/-</h5>
                                    </div>
                                
								<?php for($i=1;$i<=$elec_rating;$i++) :  ?>

								<i class="fa fa-star" style="color:red" aria-hidden="true"></i>
                               <?php  endfor; ?>
                                     
                            </div>
                        </div></a>
						<?php
					 }
						?>
                        
                        
                    </div>
                </div>
            </div></br></br>
			<div class="row">
                <div class="col-12">
                    <div class="features-slides owl-carousel">
                     
					 <?php
					 $result=select("select * from items where category='HomeTheaterTVVideo'");
					 while($r=mysqli_fetch_array($result))
					 {
						 extract($r);
					 ?>
                        <a href="view_detail.php?id=<?=$elecid?>"><div class="single-features-area">
                            <img src="admin/images/<?=$image?>" style="height:200px;width:400px">
                            <!-- Price -->
                            <div class="price-start">
                                </div>
                            <div class="feature-content d-flex align-items-center justify-content-between" style="height:150px">
                                <div class="feature-title">
								 <p><?=$Title?></p>
                               
                                   <h5><?=$price?>/-</h5>
                                    </div>
                                
								<?php for($i=1;$i<=$elec_rating;$i++) :  ?>

								<i class="fa fa-star" style="color:red" aria-hidden="true"></i>
                               <?php  endfor; ?>
                                     
                            </div>
                        </div></a>
						<?php
					 }
						?>
                        
                        
                    </div>
                </div>
            </div></br></br>
			<div class="row">
                <div class="col-12">
                    <div class="features-slides owl-carousel">
                     
					 <?php
					 $result=select("select * from items where category='ComputersAccessories'");
					 while($r=mysqli_fetch_array($result))
					 {
						 extract($r);
					 ?>
                        <a href="view_detail.php?id=<?=$elecid?>"><div class="single-features-area">
                            <img src="admin/images/<?=$image?>" style="height:200px;width:400px">
                            <!-- Price -->
                            <div class="price-start">
                                </div>
                            <div class="feature-content d-flex align-items-center justify-content-between" style="height:150px">
                                <div class="feature-title">
								 <p><?=$Title?></p>
                               
                                   <h5><?=$price?>/-</h5>
                                    </div>
                                
								<?php for($i=1;$i<=$elec_rating;$i++) :  ?>

								<i class="fa fa-star" style="color:red" aria-hidden="true"></i>
                               <?php  endfor; ?>
                                     
                            </div>
                        </div></a>
						<?php
					 }
						?>
                        
                        
                    </div>
                </div>
            </div></br></br>
			<div class="row">
                <div class="col-12">
                    <div class="features-slides owl-carousel">
                     
					 <?php
					 $result=select("select * from items where category='Tablets'");
					 while($r=mysqli_fetch_array($result))
					 {
						 extract($r);
					 ?>
                        <a href="view_detail.php?id=<?=$elecid?>"><div class="single-features-area">
                            <img src="admin/images/<?=$image?>" style="height:200px;width:400px">
                            <!-- Price -->
                            <div class="price-start">
                                </div>
                            <div class="feature-content d-flex align-items-center justify-content-between" style="height:150px">
                                <div class="feature-title">
								 <p><?=$Title?></p>
                               
                                   <h5><?=$price?>/-</h5>
                                    </div>
                                
								<?php for($i=1;$i<=$elec_rating;$i++) :  ?>

								<i class="fa fa-star" style="color:red" aria-hidden="true"></i>
                               <?php  endfor; ?>
                                     
                            </div>
                        </div></a>
						<?php
					 }
						?>
                        
                        
                    </div>
                </div>
            </div></br></br>
			<div class="row">
                <div class="col-12">
                    <div class="features-slides owl-carousel">
                     
					 <?php
					 $result=select("select * from items where category='Headphones'");
					 while($r=mysqli_fetch_array($result))
					 {
						 extract($r);
					 ?>
                        <a href="view_detail.php?id=<?=$elecid?>"><div class="single-features-area">
                            <img src="admin/images/<?=$image?>" style="height:200px;width:400px">
                            <!-- Price -->
                            <div class="price-start">
                                </div>
                            <div class="feature-content d-flex align-items-center justify-content-between" style="height:150px">
                                <div class="feature-title">
								 <p><?=$Title?></p>
                               
                                   <h5><?=$price?>/-</h5>
                                    </div>
                                
								<?php for($i=1;$i<=$elec_rating;$i++) :  ?>

								<i class="fa fa-star" style="color:red" aria-hidden="true"></i>
                               <?php  endfor; ?>
                                     
                            </div>
                        </div></a>
						<?php
					 }
						?>
                        
                        
                    </div>
                </div>
            </div></br></br>
			<div class="row">
                <div class="col-12">
                    <div class="features-slides owl-carousel">
                     
					 <?php
					 $result=select("select * from items where category='MobilesAccessories'");
					 while($r=mysqli_fetch_array($result))
					 {
						 extract($r);
					 ?>
                        <a href="view_detail.php?id=<?=$elecid?>"><div class="single-features-area">
                            <img src="admin/images/<?=$image?>" style="height:200px;width:400px">
                            <!-- Price -->
                            <div class="price-start">
                                </div>
                            <div class="feature-content d-flex align-items-center justify-content-between" style="height:150px">
                                <div class="feature-title">
								 <p><?=$Title?></p>
                               
                                   <h5><?=$price?>/-</h5>
                                    </div>
                                
								<?php for($i=1;$i<=$elec_rating;$i++) :  ?>

								<i class="fa fa-star" style="color:red" aria-hidden="true"></i>
                               <?php  endfor; ?>
                                     
                            </div>
                        </div></a>
						<?php
					 }
						?>
                        
                        
                    </div>
                </div>
            </div></br></br>
        </div>
    </section>
    

    <!-- ***** Clients Area Start ***** -->
    

    <!-- ****** Footer Area Start ****** -->
    <footer class="dorne-footer-area">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 d-md-flex align-items-center justify-content-between">
                    <div class="footer-text">
                        <p>
                            <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made  <i class="fa fa-heart-o" aria-hidden="true"></i> by <a href="#" target="_blank">Abhash Kumar</a>
<!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>
    </footer>
    <!-- ****** Footer Area End ****** -->

    <!-- jQuery-2.2.4 js -->
    <script src="js/jquery/jquery-2.2.4.min.js"></script>
    <!-- Popper js -->
    <script src="js/bootstrap/popper.min.js"></script>
    <!-- Bootstrap-4 js -->
    <script src="js/bootstrap/bootstrap.min.js"></script>
    <!-- All Plugins js -->
    <script src="js/others/plugins.js"></script>
    <!-- Active JS -->
    <script src="js/active.js"></script>
</body>

</html>