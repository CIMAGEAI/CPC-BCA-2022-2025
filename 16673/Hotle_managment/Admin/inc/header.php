    <div
        class="container-fluid bg-dark text-light p-3 d-flex align-items-center justify-content-between sticky-top col-lg-15">
        <h3 class="mb-0 h-font">ADMIN PANEL</h3>
        <a href="logout.php" class="btn btn-light btn-sm">LOG OUT</a>
    </div>

    <div class="col-lg-2 bg-dark border-top border-3 border-secondary" id="dashboard-menu">
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container-fluid flex-lg-column align-items-stretch">
                <h4 class="mt-2 text-light">ADMIN PANEL</h4>
                <button class="navbar-toggler shadow-none" type="button" data-bs-toggle="collapse"
                    data-bs-target="#adminDropdown" aria-controls="navbarNav" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse flex-column mt-2 align-items-lg-stretch" id="adminDropdown">
                    <ul class="nav nav-pills flex-column">
                        <li class="nav-item">
                            <a class="nav-link text-white" href="dashboard.php">Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="#">rooms</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="#">users</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="setting.php">settings</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>