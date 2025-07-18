// LibraTech Admin Dashboard - Enhanced JavaScript
// Comprehensive admin functionality

// Simple utility object to replace missing LibraTech
const LibraTech = {
    Auth: {
        isAuthenticated: function() {
            return localStorage.getItem('libraTech_token') !== null;
        },
        getCurrentUser: function() {
            const userStr = localStorage.getItem('libraTech_user');
            return userStr ? JSON.parse(userStr) : null;
        },
        logout: function() {
            localStorage.removeItem('libraTech_token');
            localStorage.removeItem('libraTech_user');
            window.location.href = 'login.html';
        }
    },
    Utils: {
        showNotification: function(message, type = 'info') {
            alert(message);
        },
        showLoading: function(element) {
            if (element) {
                element.innerHTML = '<div style="text-align: center; padding: 20px;">Loading...</div>';
            }
            return element;
        },
        hideLoading: function(element) {
            // Remove loading state
        },
        formatDate: function(dateString) {
            return new Date(dateString).toLocaleDateString();
        }
    },
    API: {
        get: async function(endpoint) {
            const api = new APIService();
            return await api.get(endpoint);
        },
        post: async function(endpoint, data) {
            const api = new APIService();
            return await api.post(endpoint, data);
        },
        put: async function(endpoint, data) {
            const api = new APIService();
            return await api.put(endpoint, data);
        },
        delete: async function(endpoint) {
            const api = new APIService();
            return await api.delete(endpoint);
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin dashboard
    initAdminDashboard();
    
    // Setup navigation
    setupNavigation();
    
    // Load initial data
    loadAdminDashboard();
    
    // Setup real-time monitoring
    setupRealTimeMonitoring();
});

// Initialize admin dashboard
function initAdminDashboard() {
    // Check authentication and admin role
    if (!LibraTech.Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = LibraTech.Auth.getCurrentUser();
    if (user && user.role !== 'admin') {
        LibraTech.Utils.showNotification('Access denied. Admin privileges required.', 'error');
        window.location.href = 'user-dashboard.html';
        return;
    }
    
    // Update admin info in header
    updateAdminInfo();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup form handlers
    setupFormHandlers();
}

// Setup navigation
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Load section
            const section = this.id.replace('nav-', '');
            loadAdminSection(section);
        });
    });
}

// Load admin dashboard data
async function loadAdminDashboard() {
    try {
        const spinner = LibraTech.Utils.showLoading(document.getElementById('admin-main-content'));
        
        // Load dashboard statistics
        const stats = await loadDashboardStats();
        updateDashboardStats(stats);
        
        // Load recent activity
        const recentActivity = await loadRecentActivity();
        updateRecentActivity(recentActivity);
        
        // Load category statistics
        const categoryStats = await loadCategoryStats();
        updateCategoryStats(categoryStats);
        
        // Load popular books
        const popularBooks = await loadPopularBooks();
        updatePopularBooks(popularBooks);
        
        LibraTech.Utils.hideLoading(spinner);
        
    } catch (error) {
        console.error('Failed to load admin dashboard:', error);
        LibraTech.Utils.showNotification('Failed to load dashboard data.', 'error');
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        return await LibraTech.API.get('/admin/stats');
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        return getDefaultDashboardStats();
    }
}

// Get default dashboard stats (fallback)
function getDefaultDashboardStats() {
    return {
        totalBooks: 1247,
        totalUsers: 342,
        activeLoans: 89,
        overdueBooks: 12,
        totalFines: 245.50,
        monthlyBorrows: 156
    };
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    const elements = {
        totalBooks: document.getElementById('totalBooks'),
        totalUsers: document.getElementById('totalUsers'),
        activeLoans: document.getElementById('activeLoans'),
        overdueBooks: document.getElementById('overdueBooks')
    };
    
    if (elements.totalBooks) {
        elements.totalBooks.textContent = stats.totalBooks.toLocaleString();
    }
    
    if (elements.totalUsers) {
        elements.totalUsers.textContent = stats.totalUsers.toLocaleString();
    }
    
    if (elements.activeLoans) {
        elements.activeLoans.textContent = stats.activeLoans.toLocaleString();
    }
    
    if (elements.overdueBooks) {
        elements.overdueBooks.textContent = stats.overdueBooks.toLocaleString();
    }
}

// Load recent activity
async function loadRecentActivity() {
    try {
        return await LibraTech.API.get('/admin/activity');
    } catch (error) {
        console.error('Failed to load recent activity:', error);
        return getDefaultRecentActivity();
    }
}

// Get default recent activity (fallback)
function getDefaultRecentActivity() {
    return [
        { action: 'Book Added', item: 'The Art of Programming', user: 'Admin', date: '2024-01-10', type: 'add' },
        { action: 'User Registered', item: 'John Smith', user: 'System', date: '2024-01-09', type: 'register' },
        { action: 'Book Returned', item: 'Data Structures', user: 'Jane Doe', date: '2024-01-08', type: 'return' },
        { action: 'Overdue Alert', item: 'Advanced Algorithms', user: 'Mike Johnson', date: '2024-01-07', type: 'overdue' }
    ];
}

// Update recent activity display
function updateRecentActivity(activities) {
    const activityList = document.getElementById('adminActivityList');
    if (!activityList) return;
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${getActivityIcon(activity.type)}</div>
            <div class="activity-info">
                <span class="activity-action">${activity.action}</span>
                <span class="activity-item">${activity.item}</span>
                <span class="activity-user">by ${activity.user}</span>
                <span class="activity-date">${LibraTech.Utils.formatDate(activity.date)}</span>
            </div>
        </div>
    `).join('');
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        add: '📚',
        register: '👤',
        return: '📤',
        overdue: '⚠️',
        borrow: '📖',
        delete: '🗑️',
        edit: '✏️'
    };
    return icons[type] || '📋';
}

// Load category statistics
async function loadCategoryStats() {
    try {
        return await LibraTech.API.get('/admin/categories/stats');
    } catch (error) {
        console.error('Failed to load category stats:', error);
        return getDefaultCategoryStats();
    }
}

// Get default category stats (fallback)
function getDefaultCategoryStats() {
    return [
        { category: 'Fiction', count: 456, percentage: 37 },
        { category: 'Non-Fiction', count: 389, percentage: 31 },
        { category: 'Science', count: 234, percentage: 19 },
        { category: 'Technology', count: 168, percentage: 13 }
    ];
}

// Update category statistics
function updateCategoryStats(categoryStats) {
    const categoryStatsContainer = document.getElementById('categoryStats');
    if (!categoryStatsContainer) return;
    
    categoryStatsContainer.innerHTML = categoryStats.map(cat => `
        <div class="category-stat">
            <span class="category-name">${cat.category}</span>
            <div class="category-bar">
                <div class="category-fill" style="width: ${cat.percentage}%"></div>
            </div>
            <span class="category-count">${cat.count} (${cat.percentage}%)</span>
        </div>
    `).join('');
}

// Load popular books
async function loadPopularBooks() {
    try {
        return await LibraTech.API.get('/admin/books/popular');
    } catch (error) {
        console.error('Failed to load popular books:', error);
        return getDefaultPopularBooks();
    }
}

// Get default popular books (fallback)
function getDefaultPopularBooks() {
    return [
        { title: 'The Great Gatsby', borrows: 45 },
        { title: 'To Kill a Mockingbird', borrows: 38 },
        { title: '1984', borrows: 32 },
        { title: 'Pride and Prejudice', borrows: 29 }
    ];
}

// Update popular books
function updatePopularBooks(popularBooks) {
    const popularBooksContainer = document.getElementById('popularBooks');
    if (!popularBooksContainer) return;
    
    popularBooksContainer.innerHTML = popularBooks.map(book => `
        <div class="popular-book">
            <span class="book-title">${book.title}</span>
            <span class="book-borrows">${book.borrows} borrows</span>
        </div>
    `).join('');
}

// Load admin section
function loadAdminSection(section) {
    const mainContent = document.getElementById('admin-main-content');
    
    switch(section) {
        case 'dashboard':
            loadAdminDashboard();
            break;
        case 'books':
            showBookManagement();
            break;
        case 'users':
            showUserManagement();
            break;
        case 'transactions':
            showTransactions();
            break;
        case 'reports':
            showReports();
            break;
    }
}

// Enhance showBookManagement to ensure full CRUD and feedback
async function showBookManagement() {
    const mainContent = document.getElementById('admin-main-content');
    LibraTech.Utils.showLoading(mainContent);
    // Render search/filter UI
    mainContent.innerHTML = `
        <div class="books-search-bar">
            <input type="text" id="booksSearchInput" placeholder="Search by title, author, or ISBN..." />
            <select id="booksCategoryFilter">
                <option value="">All Categories</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="technology">Technology</option>
                <option value="biography">Biography</option>
                <option value="self-help">Self-Help</option>
            </select>
            <select id="booksStatusFilter">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
            <button id="booksSearchBtn" class="btn-primary" style="margin-left:0.5rem;">Search</button>
            </div>
        <div id="booksTableContainer"></div>
    `;
    // Fetch and render books
    async function fetchAndRenderBooks() {
        const search = document.getElementById('booksSearchInput').value.trim();
        const category = document.getElementById('booksCategoryFilter').value;
        const status = document.getElementById('booksStatusFilter').value;
        let url = '/books/admin/books?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `genre=${encodeURIComponent(category)}&`;
        if (status) url += `status=${encodeURIComponent(status)}&`;
        LibraTech.Utils.showLoading(document.getElementById('booksTableContainer'));
        try {
            const response = await LibraTech.API.get(url);
            if (!response.success) throw new Error(response.message || 'Failed to load books');
            const books = response.data;
            document.getElementById('booksTableContainer').innerHTML = renderBooksTable(books);
            setupBooksTableActions(books);
        } catch (error) {
            document.getElementById('booksTableContainer').innerHTML = `<div class="error">Error loading books: ${error.message}</div>`;
        }
    }
    // Debounce for search input
    let searchDebounce;
    document.getElementById('booksSearchInput').addEventListener('input', function() {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(fetchAndRenderBooks, 400);
    });
    document.getElementById('booksCategoryFilter').addEventListener('change', fetchAndRenderBooks);
    document.getElementById('booksStatusFilter').addEventListener('change', fetchAndRenderBooks);
    document.getElementById('booksSearchBtn').addEventListener('click', fetchAndRenderBooks);
    // Initial fetch
    fetchAndRenderBooks();
}

function renderBooksTable(books) {
    if (!books || books.length === 0) {
        return '<div class="loading">No books found.</div>';
    }
    let html = `<table class="admin-table"><thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Genre</th><th>Copies</th><th>Status</th><th>Actions</th></tr></thead><tbody>`;
    for (const book of books) {
        html += `<tr data-id="${book._id}">
                            <td>${book.title}</td>
                            <td>${book.author}</td>
                            <td>${book.isbn}</td>
            <td>${book.genre}</td>
            <td>${book.availableCopies}/${book.totalCopies}</td>
            <td>${book.status}</td>
            <td>
                <button class="admin-btn edit-btn" data-action="edit">Edit</button>
                <button class="admin-btn delete-btn" data-action="delete">Delete</button>
                            </td>
        </tr>`;
    }
    html += '</tbody></table>';
    return html;
}

function setupBooksTableActions(books) {
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const bookId = row.getAttribute('data-id');
            const book = books.find(b => b._id === bookId);
            if (book) showEditBookModal(book);
        });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const row = this.closest('tr');
            const bookId = row.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this book?')) {
                try {
                    LibraTech.Utils.showLoading(row);
                    const response = await LibraTech.API.delete(`/books/admin/books/${bookId}`);
                    if (response.success) {
                        row.remove();
                        LibraTech.Utils.showNotification('Book deleted successfully!', 'success');
                    } else {
                        throw new Error(response.message);
                    }
    } catch (error) {
                    LibraTech.Utils.showNotification('Error deleting book: ' + error.message, 'error');
    }
            }
        });
    });
}

// Show add book modal
function showAddBook() {
    document.getElementById('addBookModal').style.display = 'flex';
}

// Hide add book modal
function hideAddBookModal() {
    document.getElementById('addBookModal').style.display = 'none';
    document.getElementById('addBookForm').reset();
}

// Show add user modal
function showAddUser() {
    document.getElementById('addUserModal').style.display = 'flex';
}

// Hide add user modal
function hideAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
    document.getElementById('addUserForm').reset();
}

// Enhance showTransactions to load real data and provide feedback
async function showTransactions() {
    const mainContent = document.getElementById('admin-main-content');
    LibraTech.Utils.showLoading(mainContent);
    // Render search/filter UI
    mainContent.innerHTML = `
        <div class="transactions-search-bar">
            <input type="text" id="transactionsSearchInput" placeholder="Search by user or book..." />
            <select id="transactionsTypeFilter">
                <option value="">All Types</option>
                <option value="borrowed">Borrowed</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
            </select>
            <input type="date" id="transactionsDateFilter" />
            <button id="transactionsSearchBtn" class="btn-primary" style="margin-left:0.5rem;">Search</button>
            <button id="transactionsExportBtn" class="btn-secondary" style="margin-left:0.5rem;">Export CSV</button>
        </div>
        <div id="transactionsTableContainer"></div>
    `;
    // Fetch and render transactions
    async function fetchAndRenderTransactions() {
        const search = document.getElementById('transactionsSearchInput').value.trim();
        const type = document.getElementById('transactionsTypeFilter').value;
        const date = document.getElementById('transactionsDateFilter').value;
        let url = '/transactions?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (type) url += `type=${encodeURIComponent(type)}&`;
        if (date) url += `date=${encodeURIComponent(date)}&`;
        LibraTech.Utils.showLoading(document.getElementById('transactionsTableContainer'));
        try {
            const response = await LibraTech.API.get(url);
            if (!response.success) throw new Error(response.message || 'Failed to load transactions');
            const transactions = response.data;
            document.getElementById('transactionsTableContainer').innerHTML = renderTransactionsTable(transactions);
        } catch (error) {
            document.getElementById('transactionsTableContainer').innerHTML = `<div class="error">Error loading transactions: ${error.message}</div>`;
        }
    }
    // Debounce for search input
    let searchDebounce;
    document.getElementById('transactionsSearchInput').addEventListener('input', function() {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(fetchAndRenderTransactions, 400);
    });
    document.getElementById('transactionsTypeFilter').addEventListener('change', fetchAndRenderTransactions);
    document.getElementById('transactionsDateFilter').addEventListener('change', fetchAndRenderTransactions);
    document.getElementById('transactionsSearchBtn').addEventListener('click', fetchAndRenderTransactions);
    // Export CSV
    document.getElementById('transactionsExportBtn').addEventListener('click', async function() {
        const search = document.getElementById('transactionsSearchInput').value.trim();
        const type = document.getElementById('transactionsTypeFilter').value;
        const date = document.getElementById('transactionsDateFilter').value;
        let url = '/transactions?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (type) url += `type=${encodeURIComponent(type)}&`;
        if (date) url += `date=${encodeURIComponent(date)}&`;
        try {
            const response = await LibraTech.API.get(url);
            if (!response.success) throw new Error(response.message || 'Failed to load transactions');
            const transactions = response.data;
            // Convert to CSV
            let csv = 'User,Book,Type,Date,Status\n';
            for (const tx of transactions) {
                csv += `"${tx.user?.name || '-'}","${tx.book?.title || '-'}","${tx.type || '-'}","${LibraTech.Utils.formatDate(tx.date || tx.createdAt)}","${tx.status || '-'}"\n`;
            }
            // Download CSV
            const blob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'transactions.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    } catch (error) {
            LibraTech.Utils.showNotification('Failed to export transactions: ' + error.message, 'error');
        }
    });
    // Initial fetch
    fetchAndRenderTransactions();
}

function renderTransactionsTable(transactions) {
    if (!transactions || transactions.length === 0) {
        return '<div class="loading">No transactions found.</div>';
    }
    let html = `<table class="admin-table"><thead><tr><th>User</th><th>Book</th><th>Type</th><th>Date</th><th>Status</th></tr></thead><tbody>`;
    for (const tx of transactions) {
        html += `<tr>
            <td>${tx.user?.name || '-'}</td>
            <td>${tx.book?.title || '-'}</td>
            <td>${tx.type || '-'}</td>
            <td>${LibraTech.Utils.formatDate(tx.date || tx.createdAt)}</td>
            <td>${tx.status || '-'}</td>
        </tr>`;
    }
    html += '</tbody></table>';
    return html;
}

// Show user management
async function showUserManagement() {
    const mainContent = document.getElementById('admin-main-content');
    LibraTech.Utils.showLoading(mainContent);
    // Render search/filter UI
    mainContent.innerHTML = `
        <div class="users-search-bar">
            <input type="text" id="usersSearchInput" placeholder="Search by name or email..." />
            <select id="usersRoleFilter">
                <option value="">All Roles</option>
                <option value="member">Library Member</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
            </select>
            <select id="usersStatusFilter">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
            </select>
            <button id="usersSearchBtn" class="btn-primary" style="margin-left:0.5rem;">Search</button>
            </div>
        <div id="usersTableContainer"></div>
    `;
    // Fetch and render users
    async function fetchAndRenderUsers() {
        const search = document.getElementById('usersSearchInput').value.trim();
        const role = document.getElementById('usersRoleFilter').value;
        const status = document.getElementById('usersStatusFilter').value;
        let url = '/users?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (role) url += `role=${encodeURIComponent(role)}&`;
        if (status) url += `status=${encodeURIComponent(status)}&`;
        LibraTech.Utils.showLoading(document.getElementById('usersTableContainer'));
        try {
            const response = await LibraTech.API.get(url);
            if (!response.success) throw new Error(response.message || 'Failed to load users');
            const users = response.data;
            document.getElementById('usersTableContainer').innerHTML = renderUsersTable(users);
            setupUsersTableActions(users);
        } catch (error) {
            document.getElementById('usersTableContainer').innerHTML = `<div class="error">Error loading users: ${error.message}</div>`;
        }
    }
    // Debounce for search input
    let searchDebounce;
    document.getElementById('usersSearchInput').addEventListener('input', function() {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(fetchAndRenderUsers, 400);
    });
    document.getElementById('usersRoleFilter').addEventListener('change', fetchAndRenderUsers);
    document.getElementById('usersStatusFilter').addEventListener('change', fetchAndRenderUsers);
    document.getElementById('usersSearchBtn').addEventListener('click', fetchAndRenderUsers);
    // Initial fetch
    fetchAndRenderUsers();
}

function renderUsersTable(users) {
    if (!users || users.length === 0) {
        return '<div class="loading">No users found.</div>';
    }
    let html = `<table class="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>`;
    for (const user of users) {
        html += `<tr data-id="${user._id}">
                            <td>${user.name}</td>
                            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.active ? 'Active' : 'Inactive'}</td>
                            <td>
                <button class="admin-btn edit-user-btn" data-action="edit">Edit</button>
                <button class="admin-btn delete-user-btn" data-action="delete">Delete</button>
                <button class="admin-btn status-user-btn" data-action="toggle-status">${user.active ? 'Deactivate' : 'Activate'}</button>
                            </td>
        </tr>`;
    }
    html += '</tbody></table>';
    return html;
}

function setupUsersTableActions(users) {
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const userId = row.getAttribute('data-id');
            const user = users.find(u => u._id === userId);
            if (user) showEditUserModal(user);
        });
    });
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const row = this.closest('tr');
            const userId = row.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    LibraTech.Utils.showLoading(row);
                    const response = await LibraTech.API.delete(`/users/${userId}`);
                    if (response.success) {
                        row.remove();
                        LibraTech.Utils.showNotification('User deleted successfully!', 'success');
                    } else {
                        throw new Error(response.message);
                    }
    } catch (error) {
                    LibraTech.Utils.showNotification('Error deleting user: ' + error.message, 'error');
                }
            }
        });
    });
    document.querySelectorAll('.status-user-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const row = this.closest('tr');
            const userId = row.getAttribute('data-id');
            const user = users.find(u => u._id === userId);
            if (!user) return;
            const action = user.active ? 'deactivate' : 'activate';
            if (confirm(`Are you sure you want to ${action} this user?`)) {
                try {
                    LibraTech.Utils.showLoading(row);
                    const response = await LibraTech.API.put(`/users/${userId}/toggle-status`);
                    if (response.success) {
                        row.querySelector('td:nth-child(4)').textContent = user.active ? 'Inactive' : 'Active';
                        btn.textContent = user.active ? 'Activate' : 'Deactivate';
                        user.active = !user.active;
                        LibraTech.Utils.showNotification(`User ${action}d successfully!`, 'success');
                    } else {
                        throw new Error(response.message);
                    }
                } catch (error) {
                    LibraTech.Utils.showNotification('Error updating user status: ' + error.message, 'error');
                }
            }
        });
    });
}

// Enhance showReports to load analytics and export features
async function showReports() {
    const mainContent = document.getElementById('admin-main-content');
    LibraTech.Utils.showLoading(mainContent);
    // Render filter controls
    mainContent.innerHTML = `
        <div class="reports-filters-bar">
            <label>Date Range: <input type="date" id="reportsStartDate"> to <input type="date" id="reportsEndDate"></label>
            <button id="reportsFilterBtn" class="btn-primary" style="margin-left:0.5rem;">Apply</button>
            <button id="reportsExportBtn" class="btn-secondary" style="margin-left:0.5rem;">Export All (JSON)</button>
        </div>
        <div id="reportsAnalyticsContainer"></div>
    `;
    async function fetchAndRenderReports() {
        const start = document.getElementById('reportsStartDate').value;
        const end = document.getElementById('reportsEndDate').value;
        let qs = '';
        if (start) qs += `start=${encodeURIComponent(start)}&`;
        if (end) qs += `end=${encodeURIComponent(end)}&`;
        LibraTech.Utils.showLoading(document.getElementById('reportsAnalyticsContainer'));
        try {
            const stats = await LibraTech.API.get(`/books/stats?${qs}`);
            const userStats = await LibraTech.API.get(`/users/stats?${qs}`);
            const txStats = await LibraTech.API.get(`/transactions/stats?${qs}`);
            renderReportsAnalytics(stats.data, userStats.data, txStats.data);
            setupReportsExport(stats.data, userStats.data, txStats.data);
        } catch (error) {
            document.getElementById('reportsAnalyticsContainer').innerHTML = `<div class="error">Error loading reports: ${error.message}</div>`;
        }
    }
    function renderReportsAnalytics(bookStats, userStats, txStats) {
        document.getElementById('reportsAnalyticsContainer').innerHTML = `
        <div class="reports-section">
                <h2>Library Analytics & Reports</h2>
            <div class="reports-grid">
                <div class="report-card">
                        <h3>Book Statistics</h3>
                        <canvas id="booksChart" height="180"></canvas>
                        <div class="report-summary">
                            <div>Total Books: <b>${bookStats.totalBooks || 0}</b></div>
                            <div>Categories: <b>${bookStats.categories?.length || 0}</b></div>
                            <div>Most Popular: <b>${bookStats.mostPopular?.title || '-'}</b></div>
                        </div>
                        <button class="admin-btn" id="exportBookStats">Export Book Stats</button>
                </div>
                <div class="report-card">
                        <h3>User Statistics</h3>
                        <canvas id="usersChart" height="180"></canvas>
                        <div class="report-summary">
                            <div>Total Users: <b>${userStats.totalUsers || 0}</b></div>
                            <div>Active: <b>${userStats.activeUsers || 0}</b></div>
                            <div>Roles: <b>${userStats.roles?.join(', ') || '-'}</b></div>
                        </div>
                        <button class="admin-btn" id="exportUserStats">Export User Stats</button>
                </div>
                <div class="report-card">
                        <h3>Transaction Statistics</h3>
                        <canvas id="txChart" height="180"></canvas>
                        <div class="report-summary">
                            <div>Total Transactions: <b>${txStats.totalTransactions || 0}</b></div>
                            <div>Borrows: <b>${txStats.totalBorrows || 0}</b></div>
                            <div>Returns: <b>${txStats.totalReturns || 0}</b></div>
                            <div>Overdues: <b>${txStats.totalOverdues || 0}</b></div>
                </div>
                        <button class="admin-btn" id="exportTxStats">Export Transaction Stats</button>
                    </div>
                </div>
            </div>
        `;
        // Render charts
        setTimeout(() => {
            if (bookStats.categories && bookStats.categoryCounts) {
                new Chart(document.getElementById('booksChart').getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: bookStats.categories,
                        datasets: [{
                            data: bookStats.categoryCounts,
                            backgroundColor: ['#ffbfae','#ffd1b3','#ffe0c7','#ffcba4','#ffd6b3','#ffe5d0','#f9c6b3'],
                        }]
                    },
                    options: { plugins: { legend: { position: 'bottom' } } }
                });
            }
            if (userStats.roles && userStats.roleCounts) {
                new Chart(document.getElementById('usersChart').getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: userStats.roles,
                        datasets: [{
                            label: 'Users',
                            data: userStats.roleCounts,
                            backgroundColor: '#4f8cff',
                        }]
                    },
                    options: { plugins: { legend: { display: false } } }
                });
            }
            if (txStats.months && txStats.monthlyCounts) {
                new Chart(document.getElementById('txChart').getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: txStats.months,
                        datasets: [{
                            label: 'Transactions',
                            data: txStats.monthlyCounts,
                            borderColor: '#7c3aed',
                            backgroundColor: 'rgba(124,58,237,0.13)',
                            fill: true,
                        }]
                    },
                    options: { plugins: { legend: { display: false } } }
                });
            }
        }, 100);
    }
    function setupReportsExport(bookStats, userStats, txStats) {
        document.getElementById('exportBookStats').onclick = () => downloadJSON(bookStats, 'book-stats.json');
        document.getElementById('exportUserStats').onclick = () => downloadJSON(userStats, 'user-stats.json');
        document.getElementById('exportTxStats').onclick = () => downloadJSON(txStats, 'transaction-stats.json');
        document.getElementById('reportsExportBtn').onclick = () => downloadJSON({bookStats, userStats, txStats}, 'all-reports.json');
    }
    document.getElementById('reportsFilterBtn').addEventListener('click', fetchAndRenderReports);
    // Initial fetch
    fetchAndRenderReports();
}

function renderReportsSection(bookStats, userStats, txStats) {
    return `
        <div class="reports-section">
            <h2>Library Analytics & Reports</h2>
            <div class="reports-grid">
                <div class="report-card">
                    <h3>Book Statistics</h3>
                    <pre>${JSON.stringify(bookStats.data, null, 2)}</pre>
                    <button class="admin-btn" id="exportBookStats">Export Book Stats</button>
                </div>
                <div class="report-card">
                    <h3>User Statistics</h3>
                    <pre>${JSON.stringify(userStats.data, null, 2)}</pre>
                    <button class="admin-btn" id="exportUserStats">Export User Stats</button>
                </div>
                <div class="report-card">
                    <h3>Transaction Statistics</h3>
                    <pre>${JSON.stringify(txStats.data, null, 2)}</pre>
                    <button class="admin-btn" id="exportTxStats">Export Transaction Stats</button>
                </div>
            </div>
        </div>
    `;
}

function setupReportExport(bookStats, userStats, txStats) {
    document.getElementById('exportBookStats').onclick = () => downloadJSON(bookStats.data, 'book-stats.json');
    document.getElementById('exportUserStats').onclick = () => downloadJSON(userStats.data, 'user-stats.json');
    document.getElementById('exportTxStats').onclick = () => downloadJSON(txStats.data, 'transaction-stats.json');
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Generate borrowing report
async function generateBorrowingReport() {
    try {
        const spinner = LibraTech.Utils.showLoading(document.getElementById('admin-main-content'));
        
        const report = await LibraTech.API.get('/admin/reports/borrowing');
        
        LibraTech.Utils.hideLoading(spinner);
        
        // Show report in modal
        showReportModal('Borrowing Statistics Report', report);
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to generate report.', 'error');
    }
}

// Generate user activity report
async function generateUserActivityReport() {
    try {
        const spinner = LibraTech.Utils.showLoading(document.getElementById('admin-main-content'));
        
        const report = await LibraTech.API.get('/admin/reports/user-activity');
        
        LibraTech.Utils.hideLoading(spinner);
        
        showReportModal('User Activity Report', report);
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to generate report.', 'error');
    }
}

// Generate overdue report
async function generateOverdueReport() {
    try {
        const spinner = LibraTech.Utils.showLoading(document.getElementById('admin-main-content'));
        
        const report = await LibraTech.API.get('/admin/reports/overdue');
        
        LibraTech.Utils.hideLoading(spinner);
        
        showReportModal('Overdue Books Report', report);
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to generate report.', 'error');
    }
}

// Generate popular books report
async function generatePopularBooksReport() {
    try {
        const spinner = LibraTech.Utils.showLoading(document.getElementById('admin-main-content'));
        
        const report = await LibraTech.API.get('/admin/reports/popular-books');
        
        LibraTech.Utils.hideLoading(spinner);
        
        showReportModal('Popular Books Report', report);
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to generate report.', 'error');
    }
}

// Generate financial report
async function generateFinancialReport() {
    try {
        const spinner = LibraTech.Utils.showLoading(document.getElementById('admin-main-content'));
        
        const report = await LibraTech.API.get('/admin/reports/financial');
        
        LibraTech.Utils.hideLoading(spinner);
        
        showReportModal('Financial Report', report);
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to generate report.', 'error');
    }
}

// Generate inventory report
async function generateInventoryReport() {
    try {
        const spinner = LibraTech.Utils.showLoading(document.getElementById('admin-main-content'));
        
        const report = await LibraTech.API.get('/admin/reports/inventory');
        
        LibraTech.Utils.hideLoading(spinner);
        
        showReportModal('Inventory Report', report);
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to generate report.', 'error');
    }
}

// Show report modal
function showReportModal(title, report) {
    const modal = document.createElement('div');
    modal.className = 'modal-bg';
    modal.innerHTML = `
        <div class="modal-card card-anim report-modal">
            <button class="close-modal" onclick="this.closest('.modal-bg').remove()">&times;</button>
            <div class="modal-header">
                <h3>${title}</h3>
                <div class="report-actions">
                    <button class="btn-secondary" onclick="downloadReport('${title}')">Download PDF</button>
                    <button class="btn-secondary" onclick="exportReport('${title}')">Export Excel</button>
                </div>
            </div>
            <div class="modal-body">
                <div class="report-content">
                    ${formatReportContent(report)}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Format report content
function formatReportContent(report) {
    if (report.type === 'table') {
        return `
            <table class="data-table">
                <thead>
                    <tr>
                        ${report.headers.map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${report.data.map(row => `
                        <tr>
                            ${row.map(cell => `<td>${cell}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else if (report.type === 'summary') {
        return `
            <div class="report-summary">
                ${report.summary.map(item => `
                    <div class="summary-item">
                        <h4>${item.title}</h4>
                        <p>${item.value}</p>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        return `<p>${report.content}</p>`;
    }
}

// Download report
function downloadReport(title) {
    // Implementation for PDF download
    LibraTech.Utils.showNotification('Report download started.', 'success');
}

// Export report
function exportReport(title) {
    // Implementation for Excel export
    LibraTech.Utils.showNotification('Report export started.', 'success');
}

// Edit book
async function editBook(bookId) {
    try {
        const book = await LibraTech.API.get(`/admin/books/${bookId}`);
        showEditBookModal(book);
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to load book details.', 'error');
    }
}

// Show edit book modal
function showEditBookModal(book) {
    const modal = document.createElement('div');
    modal.className = 'modal-bg';
    modal.innerHTML = `
        <div class="modal-card card-anim">
            <button class="close-modal" onclick="this.closest('.modal-bg').remove()">&times;</button>
            <div class="modal-header">
                <h3>Edit Book</h3>
            </div>
            <form id="editBookForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="editBookTitle">Book Title *</label>
                        <input type="text" id="editBookTitle" value="${book.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="editBookAuthor">Author *</label>
                        <input type="text" id="editBookAuthor" value="${book.author}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editBookISBN">ISBN *</label>
                        <input type="text" id="editBookISBN" value="${book.isbn}" required>
                    </div>
                    <div class="form-group">
                        <label for="editBookCategory">Category *</label>
                        <select id="editBookCategory" required>
                            <option value="fiction" ${book.category === 'fiction' || book.genre === 'fiction' ? 'selected' : ''}>Fiction</option>
                            <option value="non-fiction" ${book.category === 'non-fiction' || book.genre === 'non-fiction' ? 'selected' : ''}>Non-Fiction</option>
                            <option value="science" ${book.category === 'science' || book.genre === 'science' ? 'selected' : ''}>Science</option>
                            <option value="history" ${book.category === 'history' || book.genre === 'history' ? 'selected' : ''}>History</option>
                            <option value="technology" ${book.category === 'technology' || book.genre === 'technology' ? 'selected' : ''}>Technology</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="editBookDescription">Description</label>
                    <textarea id="editBookDescription" rows="3">${book.description || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editBookCopies">Number of Copies *</label>
                        <input type="number" id="editBookCopies" value="${book.totalCopies}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="editBookLocation">Shelf Location</label>
                        <input type="text" id="editBookLocation" value="${book.location || ''}" placeholder="e.g., A1-B2-C3">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal-bg').remove()">Cancel</button>
                    <button type="submit" class="btn-primary">Update Book</button>
                </div>
                <div id="editBookLoading" style="display:none;text-align:center;padding:10px;">Updating...</div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup form submission
    modal.querySelector('#editBookForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const loadingDiv = modal.querySelector('#editBookLoading');
        loadingDiv.style.display = 'block';
        
        const bookData = {
            title: document.getElementById('editBookTitle').value,
            author: document.getElementById('editBookAuthor').value,
            isbn: document.getElementById('editBookISBN').value,
            category: document.getElementById('editBookCategory').value,
            description: document.getElementById('editBookDescription').value,
            totalCopies: parseInt(document.getElementById('editBookCopies').value),
            location: document.getElementById('editBookLocation').value
        };
        
        try {
            const response = await LibraTech.API.put(`/admin/books/${book._id || book.id}`, bookData);
            loadingDiv.style.display = 'none';
            if (response.success) {
                LibraTech.Utils.showNotification('Book updated successfully!', 'success');
                modal.remove();
                loadBooksTable();
            } else if (response.errors && response.errors.length > 0) {
                // Show validation errors
                const errorMsg = response.errors.map(e => e.msg).join('\n');
                LibraTech.Utils.showNotification('Validation error:\n' + errorMsg, 'error');
            } else {
                throw new Error(response.message || 'Failed to update book.');
            }
        } catch (error) {
            loadingDiv.style.display = 'none';
            LibraTech.Utils.showNotification('Failed to update book. ' + (error.message || ''), 'error');
        }
    });
}

// Delete book
async function deleteBook(bookId) {
    const confirmed = await LibraTech.Utils.confirm(
        'Are you sure you want to delete this book? This action cannot be undone.',
        'Delete Book'
    );
    
    if (!confirmed) return;
    
    try {
        const response = await LibraTech.API.delete(`/admin/books/${bookId}`);
        
        if (response.success) {
            LibraTech.Utils.showNotification('Book deleted successfully!', 'success');
            loadBooksTable();
        }
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to delete book.', 'error');
    }
}

// View book details
async function viewBookDetails(bookId) {
    try {
        const book = await LibraTech.API.get(`/admin/books/${bookId}`);
        showBookDetailsModal(book);
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to load book details.', 'error');
    }
}

// Show book details modal
function showBookDetailsModal(book) {
    const modal = document.createElement('div');
    modal.className = 'modal-bg';
    modal.innerHTML = `
        <div class="modal-card card-anim">
            <button class="close-modal" onclick="this.closest('.modal-bg').remove()">&times;</button>
            <div class="modal-header">
                <h3>Book Details</h3>
            </div>
            <div class="book-details-content">
                <div class="book-detail-section">
                    <h4>Basic Information</h4>
                    <p><strong>Title:</strong> ${book.title}</p>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>ISBN:</strong> ${book.isbn}</p>
                    <p><strong>Category:</strong> ${book.category}</p>
                    <p><strong>Description:</strong> ${book.description || 'No description available.'}</p>
                </div>
                <div class="book-detail-section">
                    <h4>Inventory</h4>
                    <p><strong>Total Copies:</strong> ${book.totalCopies}</p>
                    <p><strong>Available Copies:</strong> ${book.availableCopies}</p>
                    <p><strong>Borrowed Copies:</strong> ${book.totalCopies - book.availableCopies}</p>
                    <p><strong>Shelf Location:</strong> ${book.location || 'Not specified'}</p>
                </div>
                <div class="book-detail-section">
                    <h4>Statistics</h4>
                    <p><strong>Total Borrows:</strong> ${book.totalBorrows || 0}</p>
                    <p><strong>Current Borrows:</strong> ${book.currentBorrows || 0}</p>
                    <p><strong>Added Date:</strong> ${LibraTech.Utils.formatDate(book.createdAt)}</p>
                    <p><strong>Last Updated:</strong> ${LibraTech.Utils.formatDate(book.updatedAt)}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Edit user
async function editUser(userId) {
    try {
        const user = await LibraTech.API.get(`/admin/users/${userId}`);
        showEditUserModal(user);
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to load user details.', 'error');
    }
}

// Show edit user modal
function showEditUserModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal-bg';
    modal.innerHTML = `
        <div class="modal-card card-anim">
            <button class="close-modal" onclick="this.closest('.modal-bg').remove()">&times;</button>
            <div class="modal-header">
                <h3>Edit User</h3>
            </div>
            <form id="editUserForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="editUserFirstName">First Name *</label>
                        <input type="text" id="editUserFirstName" value="${user.firstName}" required>
                    </div>
                    <div class="form-group">
                        <label for="editUserLastName">Last Name *</label>
                        <input type="text" id="editUserLastName" value="${user.lastName}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editUserEmail">Email *</label>
                        <input type="email" id="editUserEmail" value="${user.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="editUserPhone">Phone</label>
                        <input type="tel" id="editUserPhone" value="${user.phone || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editUserRole">Role *</label>
                        <select id="editUserRole" required>
                            <option value="member" ${user.role === 'member' ? 'selected' : ''}>Library Member</option>
                            <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                            <option value="faculty" ${user.role === 'faculty' ? 'selected' : ''}>Faculty</option>
                            <option value="staff" ${user.role === 'staff' ? 'selected' : ''}>Staff</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editUserStatus">Status *</label>
                        <select id="editUserStatus" required>
                            <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                            <option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal-bg').remove()">Cancel</button>
                    <button type="submit" class="btn-primary">Update User</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup form submission
    modal.querySelector('#editUserForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const userData = {
            firstName: document.getElementById('editUserFirstName').value,
            lastName: document.getElementById('editUserLastName').value,
            email: document.getElementById('editUserEmail').value,
            phone: document.getElementById('editUserPhone').value,
            role: document.getElementById('editUserRole').value,
            status: document.getElementById('editUserStatus').value
        };
        
        try {
            const response = await LibraTech.API.put(`/admin/users/${user.id}`, userData);
            
            if (response.success) {
                LibraTech.Utils.showNotification('User updated successfully!', 'success');
                modal.remove();
                loadUsersTable();
            }
            
        } catch (error) {
            LibraTech.Utils.showNotification('Failed to update user.', 'error');
        }
    });
}

// Toggle user status
async function toggleUserStatus(userId) {
    const confirmed = await LibraTech.Utils.confirm(
        'Are you sure you want to change this user\'s status?',
        'Change User Status'
    );
    
    if (!confirmed) return;
    
    try {
        const response = await LibraTech.API.put(`/admin/users/${userId}/toggle-status`);
        
        if (response.success) {
            LibraTech.Utils.showNotification('User status updated successfully!', 'success');
            loadUsersTable();
        }
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to update user status.', 'error');
    }
}

// View user details
async function viewUserDetails(userId) {
    try {
        const user = await LibraTech.API.get(`/admin/users/${userId}`);
        showUserDetailsModal(user);
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to load user details.', 'error');
    }
}

// Show user details modal
function showUserDetailsModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal-bg';
    modal.innerHTML = `
        <div class="modal-card card-anim">
            <button class="close-modal" onclick="this.closest('.modal-bg').remove()">&times;</button>
            <div class="modal-header">
                <h3>User Details</h3>
            </div>
            <div class="user-details-content">
                <div class="user-detail-section">
                    <h4>Personal Information</h4>
                    <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                    <p><strong>Status:</strong> ${user.status}</p>
                </div>
                <div class="user-detail-section">
                    <h4>Library Activity</h4>
                    <p><strong>Books Currently Borrowed:</strong> ${user.booksBorrowed || 0}</p>
                    <p><strong>Total Books Borrowed:</strong> ${user.totalBorrows || 0}</p>
                    <p><strong>Outstanding Fines:</strong> ${LibraTech.Utils.formatCurrency(user.outstandingFines || 0)}</p>
                    <p><strong>Join Date:</strong> ${LibraTech.Utils.formatDate(user.joinDate)}</p>
                </div>
                <div class="user-detail-section">
                    <h4>Current Books</h4>
                    ${user.currentBooks && user.currentBooks.length > 0 ? 
                        user.currentBooks.map(book => `
                            <div class="current-book-item">
                                <p><strong>${book.title}</strong> by ${book.author}</p>
                                <p>Due: ${LibraTech.Utils.formatDate(book.dueDate)}</p>
                            </div>
                        `).join('') : 
                        '<p>No books currently borrowed.</p>'
                    }
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Update admin info in header
function updateAdminInfo() {
    const user = LibraTech.Auth.getCurrentUser();
    
    const adminName = document.getElementById('adminName');
    if (adminName && user) {
        adminName.textContent = `${user.firstName || user.name} ${user.lastName || ''}`.trim();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Setup logout
    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.confirm('Are you sure you want to logout?')) {
                    LibraTech.Auth.logout();
                }
        });
    }
}

// Setup form handlers
function setupFormHandlers() {
    // Add book form
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(addBookForm);
            const bookData = Object.fromEntries(formData);
            
            try {
                const response = await LibraTech.API.post('/admin/books', bookData);
                
                if (response.success) {
                    LibraTech.Utils.showNotification('Book added successfully!', 'success');
                    hideAddBookModal();
                    loadBooksTable();
                } else if (response.errors && response.errors.length > 0) {
                    // Show validation errors
                    const errorMsg = response.errors.map(e => e.msg).join('\n');
                    LibraTech.Utils.showNotification('Validation error:\n' + errorMsg, 'error');
                } else {
                    throw new Error(response.message || 'Failed to add book.');
                }
            } catch (error) {
                LibraTech.Utils.showNotification('Failed to add book. ' + (error.message || ''), 'error');
            }
        });
    }
    
    // Add user form
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(addUserForm);
            const userData = Object.fromEntries(formData);
            
            try {
                const response = await LibraTech.API.post('/admin/users', userData);
                
                if (response.success) {
                    LibraTech.Utils.showNotification('User added successfully!', 'success');
                    hideAddUserModal();
                    loadUsersTable();
                }
                
            } catch (error) {
                LibraTech.Utils.showNotification('Failed to add user.', 'error');
            }
        });
    }
}

// Setup real-time monitoring
function setupRealTimeMonitoring() {
    // Check for overdue books every 30 minutes
    setInterval(async () => {
        try {
            const overdueStats = await LibraTech.API.get('/admin/stats/overdue');
            
            if (overdueStats.count > 0) {
                LibraTech.Utils.showNotification(
                    `There are ${overdueStats.count} overdue books requiring attention.`,
                    'warning'
                );
            }
        } catch (error) {
            console.error('Failed to check overdue books:', error);
        }
    }, 1800000); // 30 minutes
    
    // Check for new registrations every hour
    setInterval(async () => {
        try {
            const newUsers = await LibraTech.API.get('/admin/stats/new-users');
            
            if (newUsers.count > 0) {
                LibraTech.Utils.showNotification(
                    `${newUsers.count} new user(s) registered in the last hour.`,
                    'info'
                );
            }
        } catch (error) {
            console.error('Failed to check new users:', error);
        }
    }, 3600000); // 1 hour
}

// Export functions for global access
window.showAddBook = showAddBook;
window.hideAddBookModal = hideAddBookModal;
window.showAddUser = showAddUser;
window.hideAddUserModal = hideAddUserModal;
window.showTransactions = showTransactions;
window.hideTransactionsModal = hideTransactionsModal;
window.loadTransactions = loadTransactions;
window.generateBorrowingReport = generateBorrowingReport;
window.generateUserActivityReport = generateUserActivityReport;
window.generateOverdueReport = generateOverdueReport;
window.generatePopularBooksReport = generatePopularBooksReport;
window.generateFinancialReport = generateFinancialReport;
window.generateInventoryReport = generateInventoryReport;
window.editBook = editBook;
window.deleteBook = deleteBook;
window.viewBookDetails = viewBookDetails;
window.editUser = editUser;
window.toggleUserStatus = toggleUserStatus;
window.viewUserDetails = viewUserDetails; 

// Utility to reload books table in admin
function loadBooksTable() {
    showBookManagement();
} 