<!-- In signupModal -->
<form action="signup.php" method="POST">
  <input type="text" name="full_name" placeholder="Full Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="password" placeholder="Create Password" required />
  <button type="submit">Register</button>
</form>

<!-- In loginModal -->
<form action="login.php" method="POST">
  <input type="text" name="email" placeholder="Email or Username" required />
  <input type="password" name="password" placeholder="Password" required />
  <button type="submit">Login</button>
</form>
