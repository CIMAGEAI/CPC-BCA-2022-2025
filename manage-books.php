<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit;
}
?>
<?php
$books = getAllBooks();
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
        integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" 
        crossorigin="anonymous"
        />

        <link rel="stylesheet" href="./assets/css/style.css">

        <title>Manage Books | Modern Library</title>
    </head>
    <body>
        <!--Top navbar start-->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container-fluid">
          <!--offcanvas trigger start-->
          <button 
            class="navbar-toggler me-2" 
            type="button" 
            data-bs-toggle="offcanvas" 
            data-bs-target="#offcanvasExample" 
            aria-controls="offcanvasExample"
          >
          <span class="navbar-toggler-icon"></span>
          </button>
          <!--offcanvas trigger end-->

          <a class="navbar-brand text-uppercase fw-bold text-uppercase me-auto" href="#">Modern Library</a>
          <button 
            class="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <form class="d-flex ms-auto" role="search">
              <div class="input-group my-3 my-lg-0">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search..." 
                  aria-describedby="button-addon2"
               />
            <button 
            class="btn btn-outline-secondary btn-primary text-white" 
            type="button" 
            id="button-addon2"
            >
           <i class="fa-solid fa-magnifying-glass me-2"></i>
        </button>
       </div>

      </form>

       <ul class="navbar-nav mb-2 mb-lg-0">
        
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" 
          href="#"
          role="button" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
          >
          <img src="./assets/images/user.jpg" class="user-icon" />
            Admin
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>

        <!--Top navbar end-->

        <!--offcanvas start-->
        <div 
          class="offcanvas offcanvas-start bg-dark text-white sidebar-nav" 
          tabindex="-1" 
          id="offcanvasExample" 
          aria-labelledby="offcanvasExampleLabel"
        >
          <div class="offcanvas-body">
            <ul class="navbar-nav">
              <li class="nav-item">
              <div class="text-secondary small text-uppercase fw-bold">Core</div>
            </li>

              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#"
                ><i class="fa-solid fa-gauge me-2"></i>Dashboard</a
                >
              </li>
              <li class="nav-item my-0">
                <hr />
            </li>
            <li class="nav-item">
              <div class="text-secondary small text-uppercase fw-bold">Inventory</div>
            </li>

              <li class="nav-item">
                <a 
                  class="nav-link sidebar-link" 
                  data-bs-toggle="collapse"
                  href="#booksMgmt" 
                  role="button" 
                  aria-expanded="false" 
                  aria-controls="booksMgmt"
                >
                  <i class="fa-solid fa-book me-2"></i>Book Management
                  <span class="right-icon float-end">
                    <i class="fa-solid fa-chevron-down"></i></span>
                </a>
                <div class="collapse" id="booksMgmt">
                  <div>
                    <ul class="navbar-nav ps-3">
                      <li>
                        <a href="./add-book.html" class="nav-link">
                          <i class="fa-solid fa-plus me-2"></i>Add New</a>
                      </li>
                      <li>
                        <a href="./manage-books.html" class="nav-link">
                          <i class="fa-solid fa-list me-2"></i>Manage All</a>
                      </li>
                    </ul>  
                  </div>
                </div>   
            </li>

            <li class="nav-item">
                <a 
                  class="nav-link sidebar-link" 
                  data-bs-toggle="collapse"
                  href="#studentMgmt" 
                  role="button" 
                  aria-expanded="false" 
                  aria-controls="studentMgmt"
                >
                  <i class="fa-solid fa-user me-2"></i>student Management
                  <span class="right-icon float-end">
                    <i class="fa-solid fa-chevron-down"></i></span>
                </a>
                <div class="collapse" id="studentMgmt">
                  <div>
                    <ul class="navbar-nav ps-3">
                      <li>
                        <a href="#" class="nav-link">
                          <i class="fa-solid fa-plus me-2"></i>Add New</a>
                      </li>
                      <li>
                        <a href="#" class="nav-link">
                          <i class="fa-solid fa-list me-2"></i>Manage All</a>
                      </li>
                    </ul>  
                  </div>
                </div>   
            </li>
            <li class="nav-item my-0">
                <hr />
            </li>
            <li class="nav-item">
              <div class="text-secondary small text-uppercase fw-bold">
                Business</div>
            </li>

            <li class="nav-item">
                <a 
                  class="nav-link sidebar-link" 
                  data-bs-toggle="collapse"
                  href="#loanMgmt" 
                  role="button" 
                  aria-expanded="false" 
                  aria-controls="loanMgmt"
                >
                 <i class="fa-solid fa-book-open me-2"></i>Book Loan
                  <span class="right-icon float-end">
                    <i class="fa-solid fa-chevron-down"></i></span>
                </a>
                <div class="collapse" id="loanMgmt">
                  <div>
                    <ul class="navbar-nav ps-3">
                      <li>
                        <a href="#" class="nav-link">
                          <i class="fa-solid fa-plus me-2"></i>Add New</a>
                      </li>
                      <li>
                        <a href="#" class="nav-link">
                          <i class="fa-solid fa-list me-2"></i>Manage All</a>
                      </li>
                    </ul>  
                  </div>
                </div>   
            </li>

            <li class="nav-item">
                <a 
                  class="nav-link sidebar-link" 
                  data-bs-toggle="collapse"
                  href="#subsMgmt" 
                  role="button" 
                  aria-expanded="false" 
                  aria-controls="subsMgmt"
                >
                  <i class="fa-solid fa-indian-rupee-sign me-2"></i>Subscription
                  <span class="right-icon float-end">
                    <i class="fa-solid fa-chevron-down"></i></span>
                </a>
                <div class="collapse" id="subsMgmt">
                  <div>
                    <ul class="navbar-nav ps-3">
                      <li>
                        <a href="#" class="nav-link">
                          <i class="fa-solid fa-plus me-2"></i>plans</a>
                      </li>
                      <li>
                        <a href="#" class="nav-link">
                          <i class="fa-solid fa-list me-2"></i>purchase history</a>
                      </li>
                    </ul>  
                  </div>
                </div>   
            </li>
            <li class="nav-item my-0">
                <hr />
            </li>
             <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#"
                ><i class="fa-solid fa-right-from-bracket me-2"></i>Logout</a
                >
              </li>
          </ul>
      </div>
    </div>
    <!--offcanvas end-->

    <!--main content start-->
    <main class="mt-1 pt-3">
      <div class="container-fluid">
        <!--cards-->
        <div class="row dashboard-counts">
          <div class="col-md-12">
            <h4 class="fw-bold text-uppercase">Manage Books</h4>
          
          </div>
            <div class="col-md-12">
              <div class="card">
  <div class="card-header">
    All Books
  </div>
  <div class="card-body">
   <table class="table">
            <thead class="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Book Name</th>
                <th scope="col">publisher Name</th>
                <th scope="col">Auther Name</th>
                <th scope="col">ISBN Nn</th>
                <th scope="col">Action</th>
              </tr>

            </thead>
            <tbody>
             <tr>
                <th scope="row">1</th>
                <td>Java programming</td>
                <td>JD Publishers</td>
                <td>Ram lal</td>
                <td>364278</td>
                <td>
                <a href="#" type="button" class="btn btn-primary btn-sm">
                    Edit
                </a>
                 <a href="#" type="button" class="btn btn-danger btn-sm">
                    Delete
                </a>
                </td>
             </tr>

             <tr>
                <th scope="row">2</th>
                <td>c++ programming</td>
                <td>C Publishers</td>
                <td>Ramu</td>
                <td>36875</td>
                <td>
                <a href="#" type="button" class="btn btn-primary btn-sm">
                    Edit
                </a>
                 <a href="#" type="button" class="btn btn-danger btn-sm">
                    Delete
                </a>
                </td>
             </tr>
            </tbody>
          </table>
  </div>
</div>
            </div>

        </div>
      </div>
    </main>

    <!--main content end-->

    
    <script 
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" 
    integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q" 
    crossorigin="anonymous"
    ></script>
    <script src="https://kit.fontawesome.com/317fe56903.js" crossorigin="anonymous"></script>
  </body>
</html>