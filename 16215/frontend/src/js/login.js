// Make sure config.js is loaded before this script in HTML
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorDiv = document.getElementById('loginError');
  errorDiv.textContent = '';

  if (!email || !password) {
    errorDiv.textContent = 'Please fill in all fields.';
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      errorDiv.textContent = data.message || 'Login failed.';
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