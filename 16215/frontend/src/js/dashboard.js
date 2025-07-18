// Make sure config.js is loaded before this script in HTML
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const userProfileDiv = document.getElementById('userProfile');
const issuedBooksDiv = document.getElementById('issuedBooks');
const pendingRequestsDiv = document.getElementById('pendingRequests');
const dashboardError = document.getElementById('dashboardError');

if (!user || !token) {
  window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

async function fetchProfile() {
  try {
    const res = await fetch(`${API_BASE_URL}/users/profile/${user.id}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    if (!res.ok) {
      dashboardError.textContent = data.message || 'Failed to load profile.';
      return;
    }
    userProfileDiv.innerHTML = `
      <div><strong>Name:</strong> ${data.user.name}</div>
      <div><strong>Email:</strong> ${data.user.email}</div>
      <div><strong>Role:</strong> ${data.user.role}</div>
      <div><strong>Joined:</strong> ${new Date(data.user.createdAt).toLocaleDateString()}</div>
    `;
    if (data.issuedBooks && data.issuedBooks.length > 0) {
      issuedBooksDiv.innerHTML = data.issuedBooks.map(issue => `
        <div class="issued-card">
          <div class="book-title">${issue.book.title}</div>
          <div class="book-meta">Author: ${issue.book.author}</div>
          <div class="book-meta">Issued: ${new Date(issue.issuedDate).toLocaleDateString()}</div>
          <div class="book-meta">Due: ${new Date(issue.dueDate).toLocaleDateString()}</div>
          <div class="book-meta">Status: ${issue.status}</div>
          <div class="book-meta">Fine: $${issue.fine || 0}</div>
        </div>
      `).join('');
    } else {
      issuedBooksDiv.innerHTML = '<div>No issued books found.</div>';
    }
    if (data.pendingRequests && data.pendingRequests.length > 0) {
      pendingRequestsDiv.innerHTML = '<h3>Pending Book Requests</h3>' + data.pendingRequests.map(issue => `
        <div class="pending-card">
          <div class="book-title">${issue.book.title}</div>
          <div class="book-meta">Author: ${issue.book.author}</div>
          <div class="book-meta">Requested: ${new Date(issue.issuedDate).toLocaleDateString()}</div>
          <div class="book-meta">Status: ${issue.status}</div>
        </div>
      `).join('');
    } else {
      pendingRequestsDiv.innerHTML = '';
    }
  } catch (err) {
    dashboardError.textContent = 'Network error. Please try again.';
  }
}

fetchProfile(); 