<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit;
}
$user = $_SESSION['user'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dashboard - Modern Library</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://kit.fontawesome.com/317fe56903.js" crossorigin="anonymous"></script>
    <style>
        .card {
            border: none;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-radius: 15px;
            transition: transform 0.2s;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .sidebar-nav a:hover {
            background: #2c2c2c;
            border-radius: 5px;
        }
        .user-icon {
            height: 30px;
            width: 30px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .tab-content {
            margin-top: 20px;
        }
        .nav-tabs .nav-link.active {
            background-color: #0d6efd;
            color: white !important;
        }
    </style>
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container-fluid">
        <button class="navbar-toggler me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar">
            <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand fw-bold" href="#">Modern Library</a>

        <div class="collapse navbar-collapse" id="navbarNav">
            <form class="d-flex ms-auto">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search books...">
                    <button class="btn btn-primary text-white" type="button">
                        <i class="fa-solid fa-search"></i>
                    </button>
                </div>
            </form>
            <ul class="navbar-nav ms-3">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" data-bs-toggle="dropdown">
                        <img src="./assets/images/user.jpg" class="user-icon" alt="user">
                        <?= htmlspecialchars($user['name']) ?>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="#">Profile</a></li>
                        <li><a class="dropdown-item" href="#">Settings</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="logout.php">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- Sidebar Offcanvas -->
<div class="offcanvas offcanvas-start bg-dark text-white sidebar-nav" id="offcanvasSidebar">
    <div class="offcanvas-body p-0">
        <nav class="navbar-dark">
            <ul class="navbar-nav">
                <li><div class="text-uppercase text-secondary fw-bold small px-3 mt-3">Core</div></li>
                <li><a class="nav-link px-3 active" href="#"><i class="fa-solid fa-gauge me-2"></i>Dashboard</a></li>

                <li><hr class="dropdown-divider bg-secondary mx-3"></li>
                <li><div class="text-uppercase text-secondary fw-bold small px-3">Inventory</div></li>
                <li><a class="nav-link px-3" data-bs-toggle="collapse" href="#bookMenu"><i class="fa-solid fa-book me-2"></i>Books</a></li>
                <div class="collapse" id="bookMenu">
                    <ul class="navbar-nav ps-4">
                        <li><a class="nav-link" href="add-book.php">➕ Add Book</a></li>
                        <li><a class="nav-link" href="manage-books.php">📚 Manage Books</a></li>
                    </ul>
                </div>

                <li><a class="nav-link px-3" data-bs-toggle="collapse" href="#studentMenu"><i class="fa-solid fa-user me-2"></i>Students</a></li>
                <div class="collapse" id="studentMenu">
                    <ul class="navbar-nav ps-4">
                        <li><a class="nav-link" href="#">➕ Add Student</a></li>
                        <li><a class="nav-link" href="#">👨‍🎓 Manage Students</a></li>
                    </ul>
                </div>

                <li><hr class="dropdown-divider bg-secondary mx-3"></li>
                <li><a class="nav-link px-3 text-danger" href="logout.php"><i class="fa-solid fa-right-from-bracket me-2"></i>Logout</a></li>
            </ul>
        </nav>
    </div>
</div>

<main class="pt-4">
    <div class="container">
        <h3 class="fw-bold mb-4">Welcome, <?= htmlspecialchars($user['name']) ?>!</h3>
        <div class="row g-4 mb-4">
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="fa-solid fa-book fa-2x text-primary mb-2"></i>
                        <h5>Total Books</h5>
                        <h2>150</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="fa-solid fa-users fa-2x text-success mb-2"></i>
                        <h5>Total Students</h5>
                        <h2>100</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="fa-solid fa-sack-dollar fa-2x text-warning mb-2"></i>
                        <h5>Total Revenue</h5>
                        <h2>₹50,000</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="fa-solid fa-hand-holding-book fa-2x text-danger mb-2"></i>
                        <h5>Books Loaned</h5>
                        <h2>15</h2>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <ul class="nav nav-tabs mb-3" id="dashboardTabs" role="tablist">
            <li class="nav-item">
                <button class="nav-link active" id="students-tab" data-bs-toggle="tab" data-bs-target="#students" type="button">New Students</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" id="loans-tab" data-bs-toggle="tab" data-bs-target="#loans" type="button">Recent Loans</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" id="subs-tab" data-bs-toggle="tab" data-bs-target="#subscriptions" type="button">Subscriptions</button>
            </li>
        </ul>

        <div class="tab-content" id="dashboardTabsContent">
            <div class="tab-pane fade show active" id="students">
                <table class="table table-striped table-bordered">
                    <thead class="table-dark">
                        <tr>
                            <th>#</th><th>Name</th><th>Course</th><th>Registered</th><th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td><td>Aditya</td><td>BCA</td><td>05-07-2025, 7:00 PM</td>
                            <td><span class="badge bg-success">Active</span></td>
                        </tr>
                        <tr>
                            <td>2</td><td>Ankit</td><td>B.Com</td><td>05-07-2025, 7:00 PM</td>
                            <td><span class="badge bg-danger">Inactive</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="tab-pane fade" id="loans">Coming soon...</div>
            <div class="tab-pane fade" id="subscriptions">Coming soon...</div>
        </div>
    </div>
</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
