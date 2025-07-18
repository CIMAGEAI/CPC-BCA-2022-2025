// Make sure config.js is loaded before this script in HTML
const adminUser = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const adminName = document.getElementById('adminName');
const totalUsers = document.getElementById('totalUsers');
const totalBooks = document.getElementById('totalBooks');
const issuedBooks = document.getElementById('issuedBooks');
const overdueBooks = document.getElementById('overdueBooks');
const adminError = document.getElementById('adminError');

// Check if user is admin
if (!adminUser || !token || adminUser.role !== 'admin') {
  window.location.href = '../login.html';
}

// Set admin name
if (adminName) {
  adminName.textContent = adminUser.name || 'Admin';
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../login.html';
});

// Dashboard Stats
async function fetchStats() {
  try {
    // Fetch users
    const usersRes = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const users = await usersRes.json();
    if (totalUsers) totalUsers.textContent = Array.isArray(users) ? users.length : '-';

    // Fetch books
    const booksRes = await fetch(`${API_BASE_URL}/books`);
    const books = await booksRes.json();
    if (totalBooks) totalBooks.textContent = Array.isArray(books) ? books.length : '-';

    // Fetch issued books
    const issuedRes = await fetch(`${API_BASE_URL}/borrow?status=issued`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const issued = await issuedRes.json();
    if (issuedBooks) issuedBooks.textContent = Array.isArray(issued) ? issued.length : '-';

    // Fetch overdue books
    const overdueRes = await fetch(`${API_BASE_URL}/borrow/overdue`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const overdue = await overdueRes.json();
    if (overdueBooks) overdueBooks.textContent = Array.isArray(overdue) ? overdue.length : '-';

    // Load recent activity
    loadRecentActivity();
  } catch (err) {
    if (adminError) adminError.textContent = 'Failed to load stats. Please try again.';
  }
}

// Load Recent Activity
async function loadRecentActivity() {
  try {
    const activityDiv = document.getElementById('recentActivity');
    if (!activityDiv) return;

    const [usersRes, booksRes, borrowsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/admin/users`, { headers: { 'Authorization': 'Bearer ' + token } }),
      fetch(`${API_BASE_URL}/books`),
      fetch(`${API_BASE_URL}/borrow`, { headers: { 'Authorization': 'Bearer ' + token } })
    ]);

    const [usersData, booksData, borrowsData] = await Promise.all([
      usersRes.json(), booksRes.json(), borrowsRes.json()
    ]);

    const recentUsers = usersData.slice(0, 3);
    const recentBorrows = borrowsData.slice(0, 5);

    let activityHTML = '';
    
    if (recentUsers.length > 0) {
      activityHTML += '<div class="activity-group"><h4>Recent Users</h4>';
      recentUsers.forEach(user => {
        activityHTML += `<div class="activity-item">
          <i class="fas fa-user-plus"></i>
          <span>${user.name} joined</span>
          <small>${new Date(user.createdAt).toLocaleDateString()}</small>
        </div>`;
      });
      activityHTML += '</div>';
    }

    if (recentBorrows.length > 0) {
      activityHTML += '<div class="activity-group"><h4>Recent Borrows</h4>';
      recentBorrows.forEach(borrow => {
        const book = booksData.find(b => b._id === borrow.bookId);
        const user = usersData.find(u => u._id === borrow.userId);
        if (book && user) {
          activityHTML += `<div class="activity-item">
            <i class="fas fa-book"></i>
            <span>${user.name} borrowed "${book.title}"</span>
            <small>${new Date(borrow.issueDate).toLocaleDateString()}</small>
          </div>`;
        }
      });
      activityHTML += '</div>';
    }

    activityDiv.innerHTML = activityHTML || '<p>No recent activity</p>';
  } catch (err) {
    const activityDiv = document.getElementById('recentActivity');
    if (activityDiv) activityDiv.innerHTML = '<p>Failed to load recent activity</p>';
  }
}

// Load Users
async function loadUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const users = await response.json();
    
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    if (Array.isArray(users)) {
      tbody.innerHTML = users.map(user => `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td><span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}">${user.role}</span></td>
          <td>${new Date(user.createdAt).toLocaleDateString()}</td>
          <td>
            <button class="btn-small btn-edit" onclick="editUser('${user._id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-small btn-delete" onclick="deleteUser('${user._id}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="5">No users found</td></tr>';
    }
  } catch (err) {
    const tbody = document.getElementById('usersTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5">Failed to load users</td></tr>';
  }
}

// Load Books
async function loadBooks() {
  try {
    const response = await fetch(`${API_BASE_URL}/books`);
    const books = await response.json();
    
    const tbody = document.getElementById('booksTableBody');
    if (!tbody) return;

    if (Array.isArray(books)) {
      tbody.innerHTML = books.map(book => `
        <tr>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.genre}</td>
          <td><span class="badge ${book.available ? 'badge-success' : 'badge-warning'}">${book.available ? 'Available' : 'Borrowed'}</span></td>
          <td>
            <button class="btn-small btn-edit" onclick="editBook('${book._id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-small btn-delete" onclick="deleteBook('${book._id}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="5">No books found</td></tr>';
    }
  } catch (err) {
    const tbody = document.getElementById('booksTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5">Failed to load books</td></tr>';
  }
}

// Load Borrows
async function loadBorrows() {
  try {
    const response = await fetch(`${API_BASE_URL}/borrow`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const borrows = await response.json();
    
    const tbody = document.getElementById('borrowsTableBody');
    if (!tbody) return;

    if (Array.isArray(borrows)) {
      // Get users and books for display
      const [usersRes, booksRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/users`, { headers: { 'Authorization': 'Bearer ' + token } }),
        fetch(`${API_BASE_URL}/books`)
      ]);
      const [users, books] = await Promise.all([usersRes.json(), booksRes.json()]);

      tbody.innerHTML = borrows.map(borrow => {
        const user = users.find(u => u._id === borrow.userId);
        const book = books.find(b => b._id === borrow.bookId);
        const isOverdue = new Date(borrow.dueDate) < new Date() && borrow.status === 'issued';
        
        return `
          <tr>
            <td>${user ? user.name : 'Unknown'}</td>
            <td>${book ? book.title : 'Unknown'}</td>
            <td>${new Date(borrow.issueDate).toLocaleDateString()}</td>
            <td>${new Date(borrow.dueDate).toLocaleDateString()}</td>
            <td><span class="badge ${isOverdue ? 'badge-danger' : borrow.status === 'issued' ? 'badge-warning' : 'badge-success'}">${isOverdue ? 'Overdue' : borrow.status}</span></td>
            <td>
              ${borrow.status === 'issued' ? `<button class="btn-small btn-success" onclick="returnBook('${borrow._id}')">
                <i class="fas fa-undo"></i> Return
              </button>` : ''}
            </td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="6">No borrows found</td></tr>';
    }
  } catch (err) {
    const tbody = document.getElementById('borrowsTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="6">Failed to load borrows</td></tr>';
  }
}

// Load Reports
async function loadReports() {
  try {
    // Overdue Report
    const overdueRes = await fetch(`${API_BASE_URL}/borrow/overdue`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const overdue = await overdueRes.json();
    
    const overdueDiv = document.getElementById('overdueReport');
    if (overdueDiv) {
      if (Array.isArray(overdue) && overdue.length > 0) {
        overdueDiv.innerHTML = overdue.slice(0, 5).map(item => `
          <div class="report-item">
            <strong>${item.bookTitle}</strong><br>
            <small>Borrowed by: ${item.userName}</small><br>
            <small>Due: ${new Date(item.dueDate).toLocaleDateString()}</small>
          </div>
        `).join('');
      } else {
        overdueDiv.innerHTML = '<p>No overdue books</p>';
      }
    }

    // Popular Books Report
    const booksRes = await fetch(`${API_BASE_URL}/books`);
    const books = await booksRes.json();
    
    const popularDiv = document.getElementById('popularBooksReport');
    if (popularDiv) {
      if (Array.isArray(books) && books.length > 0) {
        const popularBooks = books.slice(0, 5);
        popularDiv.innerHTML = popularBooks.map(book => `
          <div class="report-item">
            <strong>${book.title}</strong><br>
            <small>By: ${book.author}</small><br>
            <small>Genre: ${book.genre}</small>
          </div>
        `).join('');
      } else {
        popularDiv.innerHTML = '<p>No books available</p>';
      }
    }

    // User Activity Report
    const usersRes = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const users = await usersRes.json();
    
    const activityDiv = document.getElementById('userActivityReport');
    if (activityDiv) {
      if (Array.isArray(users) && users.length > 0) {
        const recentUsers = users.slice(0, 5);
        activityDiv.innerHTML = recentUsers.map(user => `
          <div class="report-item">
            <strong>${user.name}</strong><br>
            <small>${user.email}</small><br>
            <small>Joined: ${new Date(user.createdAt).toLocaleDateString()}</small>
          </div>
        `).join('');
      } else {
        activityDiv.innerHTML = '<p>No users found</p>';
      }
    }

    // Monthly Stats
    const monthlyDiv = document.getElementById('monthlyStatsReport');
    if (monthlyDiv) {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      monthlyDiv.innerHTML = `
        <div class="report-item">
          <strong>Current Month: ${currentMonth}/${currentYear}</strong><br>
          <small>Total Users: ${Array.isArray(users) ? users.length : 0}</small><br>
          <small>Total Books: ${Array.isArray(books) ? books.length : 0}</small><br>
          <small>Overdue Books: ${Array.isArray(overdue) ? overdue.length : 0}</small>
        </div>
      `;
    }
  } catch (err) {
    console.error('Failed to load reports:', err);
  }
}

// Add User
document.getElementById('addUserForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('userName').value,
    email: document.getElementById('userEmail').value,
    password: document.getElementById('userPassword').value,
    role: document.getElementById('userRole').value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      document.getElementById('addUserModal').style.display = 'none';
      document.getElementById('addUserForm').reset();
      loadUsers();
      fetchStats();
    } else {
      const data = await response.json();
      alert(data.message || 'Failed to add user');
    }
  } catch (err) {
    alert('Failed to add user');
  }
});

// Add Book
document.getElementById('addBookForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = {
    title: document.getElementById('bookTitle').value,
    author: document.getElementById('bookAuthor').value,
    genre: document.getElementById('bookGenre').value,
    description: document.getElementById('bookDescription').value,
    coverUrl: document.getElementById('bookCover').value || 'https://via.placeholder.com/150x200?text=No+Cover'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      document.getElementById('addBookModal').style.display = 'none';
      document.getElementById('addBookForm').reset();
      loadBooks();
      fetchStats();
    } else {
      const data = await response.json();
      alert(data.message || 'Failed to add book');
    }
  } catch (err) {
    alert('Failed to add book');
  }
});

// Delete User
async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.ok) {
      loadUsers();
      fetchStats();
    } else {
      alert('Failed to delete user');
    }
  } catch (err) {
    alert('Failed to delete user');
  }
}

// Delete Book
async function deleteBook(bookId) {
  if (!confirm('Are you sure you want to delete this book?')) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.ok) {
      loadBooks();
      fetchStats();
    } else {
      alert('Failed to delete book');
    }
  } catch (err) {
    alert('Failed to delete book');
  }
}

// Return Book
async function returnBook(borrowId) {
  try {
    const response = await fetch(`${API_BASE_URL}/borrow/return/${borrowId}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.ok) {
      loadBorrows();
      fetchStats();
    } else {
      alert('Failed to return book');
    }
  } catch (err) {
    alert('Failed to return book');
  }
}

// Search and Filter functionality
document.getElementById('userSearch')?.addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#usersTableBody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
});

document.getElementById('bookSearch')?.addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#booksTableBody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  fetchStats();
}); 