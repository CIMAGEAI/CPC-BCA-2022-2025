<?php
session_start();
require_once 'models/user.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = $_POST['email'] ?? '';
  $password = $_POST['password'] ?? '';

  $user = loginUser($email, $password);
  if ($user) {
    $_SESSION['user'] = $user;
    header("Location: dashboard.php");
    exit;
  } else {
    $error = "Invalid email or password.";
  }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>Login | Modern Library</title>

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">

  <!-- Google Font -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

  <!-- Custom Style -->
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #e0f7fa, #f1f8e9);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card {
      border: none;
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .card img {
      height: 100%;
      object-fit: cover;
    }

    .card-body {
      padding: 2rem;
    }

    .card-title {
      font-weight: 600;
      font-size: 2rem;
      color: #2e7d32;
    }

    .btn-primary {
      background-color: #388e3c;
      border: none;
      transition: 0.3s ease;
    }

    .btn-primary:hover {
      background-color: #2e7d32;
      transform: scale(1.02);
    }

    .form-text {
      font-size: 0.85rem;
    }

    .card-link {
      display: inline-block;
      margin-top: 1rem;
      color: #388e3c;
    }

    @media (max-width: 768px) {
      .card {
        flex-direction: column;
      }

      .card img {
        width: 100%;
        height: 250px;
      }
    }
  </style>
</head>

<body>

  <div class="container">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-lg-10">
        <div class="card flex-row">
          <div class="col-md-5 d-none d-md-block">
            <img src="./assets/images/login-bg.jpg" class="img-fluid" alt="Library Image" />
          </div>
          <div class="col-md-7">
            <div class="card-body">
              <h1 class="card-title">Modern Library</h1>
              <p class="card-text">Enter your credentials to continue</p>

              <form method="POST" action="">
                <?php if ($error): ?>
                  <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
                <?php endif; ?>
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input type="email" name="email" class="form-control" id="email" required>
                  <div class="form-text">We'll never share your email.</div>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" name="password" class="form-control" id="password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
              </form>

              <a href="./forgot-password.php" class="card-link text-center d-block">Forgot Password?</a>

              <a href="signup.php" class="ms-3">Don't have an account? Signup</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
</body>

</html>