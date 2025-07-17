// Make sure config.js is loaded before this script in HTML
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();
  const errorDiv = document.getElementById('registerError');
  errorDiv.textContent = '';

  if (!name || !email || !password || !confirmPassword) {
    errorDiv.textContent = 'Please fill in all fields.';
    return;
  }
  if (password.length < 6) {
    errorDiv.textContent = 'Password must be at least 6 characters.';
    return;
  }
  if (password !== confirmPassword) {
    errorDiv.textContent = 'Passwords do not match.';
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      errorDiv.textContent = data.message || 'Registration failed.';
      return;
    }
    // Save JWT and user info to localStorage
    localStorage.setItem('token', data.token);
    // Use data.user if available, otherwise fallback to data.name, etc.
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role, id: data._id }));
    }
    // Redirect to home page
    window.location.href = 'index.html';
  } catch (err) {
    errorDiv.textContent = 'Network error. Please try again.';
  }
}); 