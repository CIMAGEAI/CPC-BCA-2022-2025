// LibraTech User Dashboard - Enhanced JavaScript
// Comprehensive user functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize user dashboard
    initUserDashboard();
    
    // Setup navigation
    setupNavigation();
    
    // Load initial data
    loadUserDashboard();
    
    // Setup real-time updates
    setupRealTimeUpdates();
});

// Initialize user dashboard
function initUserDashboard() {
    // Check authentication
    if (!LibraTech.Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user info in header
    updateUserInfo();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup search functionality
    setupSearchFunctionality();
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
            loadSection(section);
        });
    });
}

// Load user dashboard data
async function loadUserDashboard() {
    try {
        const spinner = LibraTech.Utils.showLoading(document.getElementById('user-main-content'));
        
        // Load user data
        const userData = await loadUserData();
        updateDashboard(userData);
        
        // Load current books
        const currentBooks = await loadCurrentBooks();
        updateCurrentBooks(currentBooks);
        
        // Load recent activity
        const recentActivity = await loadRecentActivity();
        updateRecentActivity(recentActivity);
        
        LibraTech.Utils.hideLoading(spinner);
        
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        LibraTech.Utils.showNotification('Failed to load dashboard data.', 'error');
    }
}

// Load user data
async function loadUserData() {
    try {
        const user = await LibraTech.API.get('/users/me');
        const stats = await LibraTech.API.get('/users/me/stats');
        
        return {
            ...user,
            stats
        };
    } catch (error) {
        console.error('Failed to load user data:', error);
        return getDefaultUserData();
    }
}

// Get default user data (fallback)
function getDefaultUserData() {
    return {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'member',
        stats: {
            booksBorrowed: 3,
            daysRemaining: 7,
            finesOwed: 0
        }
    };
}

// Update dashboard with user data
function updateDashboard(data) {
    // Update welcome message
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) {
        welcomeName.textContent = data.name.split(' ')[0];
    }
    
    // Update user info in header
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = data.name;
    }
    
    // Update stats
    updateStats(data.stats);
}

// Update user stats
function updateStats(stats) {
    const elements = {
        booksBorrowed: document.getElementById('booksBorrowed'),
        daysRemaining: document.getElementById('daysRemaining'),
        finesOwed: document.getElementById('finesOwed')
    };
    
    if (elements.booksBorrowed) {
        elements.booksBorrowed.textContent = stats.booksBorrowed || 0;
    }
    
    if (elements.daysRemaining) {
        elements.daysRemaining.textContent = stats.daysRemaining || 0;
    }
    
    if (elements.finesOwed) {
        elements.finesOwed.textContent = LibraTech.Utils.formatCurrency(stats.finesOwed || 0);
    }
}

// Load current books
async function loadCurrentBooks() {
    try {
        return await LibraTech.API.get('/users/me/books/current');
    } catch (error) {
        console.error('Failed to load current books:', error);
        return getDefaultCurrentBooks();
    }
}

// Get default current books (fallback)
function getDefaultCurrentBooks() {
    return [
        {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            dueDate: '2024-01-15',
            cover: '📚',
            isbn: '978-0743273565'
        },
        {
            id: 2,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            dueDate: '2024-01-18',
            cover: '📚',
            isbn: '978-0446310789'
        },
        {
            id: 3,
            title: '1984',
            author: 'George Orwell',
            dueDate: '2024-01-20',
            cover: '📚',
            isbn: '978-0451524935'
        }
    ];
}

// Update current books display
function updateCurrentBooks(books) {
    const booksGrid = document.getElementById('currentBooksGrid');
    if (!booksGrid) return;
    
    if (books.length === 0) {
        booksGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <h3>No Books Borrowed</h3>
                <p>You haven't borrowed any books yet. Start exploring our collection!</p>
                <button class="btn-primary" onclick="showBookSearch()">Browse Books</button>
            </div>
        `;
        return;
    }
    
    booksGrid.innerHTML = books.map(book => `
        <div class="book-card" onclick="showBookDetails(${book.id})">
            <div class="book-cover">${book.cover}</div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <span class="due-date ${isOverdue(book.dueDate) ? 'overdue' : ''}">
                    Due: ${LibraTech.Utils.formatDate(book.dueDate)}
                    ${isOverdue(book.dueDate) ? ' (Overdue)' : ''}
                </span>
            </div>
            <div class="book-actions">
                <button class="btn-small" onclick="event.stopPropagation(); renewBook(${book.id})">
                    Renew
                </button>
                ${book.availableCopies > 0 ? `<button class="btn-small btn-primary" onclick="event.stopPropagation(); borrowBook(${book.id})">Borrow</button>` : `<button class="btn-small btn-primary" disabled>Unavailable</button>`}
            </div>
        </div>
    `).join('');
}

// Check if book is overdue
function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
}

// Load recent activity
async function loadRecentActivity() {
    try {
        return await LibraTech.API.get('/users/me/activity');
    } catch (error) {
        console.error('Failed to load recent activity:', error);
        return getDefaultRecentActivity();
    }
}

// Get default recent activity (fallback)
function getDefaultRecentActivity() {
    return [
        { action: 'Borrowed', book: 'The Great Gatsby', date: '2024-01-01', type: 'borrow' },
        { action: 'Returned', book: 'Pride and Prejudice', date: '2023-12-28', type: 'return' },
        { action: 'Borrowed', book: 'To Kill a Mockingbird', date: '2023-12-25', type: 'borrow' }
    ];
}

// Update recent activity display
function updateRecentActivity(activities) {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    if (activities.length === 0) {
        activityList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No Recent Activity</h3>
                <p>Your library activity will appear here.</p>
            </div>
        `;
        return;
    }
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${getActivityIcon(activity.type)}</div>
            <div class="activity-info">
                <span class="activity-action">${activity.action}</span>
                <span class="activity-book">${activity.book}</span>
                <span class="activity-date">${LibraTech.Utils.formatDate(activity.date)}</span>
            </div>
        </div>
    `).join('');
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        borrow: '📖',
        return: '📤',
        renew: '🔄',
        overdue: '⚠️'
    };
    return icons[type] || '📋';
}

// Load section content
function loadSection(section) {
    const mainContent = document.getElementById('user-main-content');
    
    switch(section) {
        case 'dashboard':
            loadUserDashboard();
            break;
        case 'books':
            showBookSearch();
            break;
        case 'history':
            showHistory();
            break;
        case 'profile':
            showProfile();
            break;
    }
}

// Show book search
function showBookSearch() {
    document.getElementById('searchModal').style.display = 'flex';
    document.getElementById('searchInput').focus();
}

// Hide search modal
function hideSearchModal() {
    document.getElementById('searchModal').style.display = 'none';
    document.getElementById('searchResults').innerHTML = '';
}

// Perform book search
async function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const category = document.getElementById('categoryFilter').value;
    const availability = document.getElementById('availabilityFilter').value;
    
    if (!searchTerm) {
        LibraTech.Utils.showNotification('Please enter a search term.', 'warning');
        return;
    }
    
    const spinner = LibraTech.Utils.showLoading(document.getElementById('searchResults'));
    
    try {
        const results = await LibraTech.Search.searchBooks(searchTerm, {
            category,
            availability
        });
        
        LibraTech.Utils.hideLoading(spinner);
        displaySearchResults(results);
        
    } catch (error) {
        LibraTech.Utils.hideLoading(spinner);
        LibraTech.Utils.showNotification('Search failed. Please try again.', 'error');
    }
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No Books Found</h3>
                <p>Try adjusting your search criteria.</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = results.map(book => `
        <div class="search-result-item" onclick="showBookDetails(${book.id})">
            <div class="book-info">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
                <p class="book-isbn">ISBN: ${book.isbn}</p>
            </div>
            <div class="book-actions">
                <span class="availability ${book.available ? 'available' : 'unavailable'}">
                    ${book.available ? 'Available' : 'Not Available'}
                </span>
                ${book.available ? `
                    <button class="btn-small btn-primary" onclick="event.stopPropagation(); borrowBook(${book.id})">
                        Borrow
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Show book details
async function showBookDetails(bookId) {
    try {
        const book = await LibraTech.BookManager.getBookById(bookId);
        
        if (!book) {
            LibraTech.Utils.showNotification('Book not found.', 'error');
            return;
        }
        
        const modal = document.getElementById('bookModal');
        const detailsContainer = document.getElementById('bookDetails');
        
        detailsContainer.innerHTML = `
            <div class="book-detail-content">
                <div class="book-detail-header">
                    <div class="book-cover-large">${book.cover || '📚'}</div>
                    <div class="book-info-large">
                        <h3>${book.title}</h3>
                        <p class="book-author">by ${book.author}</p>
                        <p class="book-isbn">ISBN: ${book.isbn}</p>
                        <span class="availability ${book.available ? 'available' : 'unavailable'}">
                            ${book.available ? 'Available' : 'Not Available'}
                        </span>
                    </div>
                </div>
                <div class="book-detail-body">
                    <div class="detail-section">
                        <h4>Description</h4>
                        <p>${book.description || 'No description available.'}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Details</h4>
                        <ul>
                            <li><strong>Category:</strong> ${book.category}</li>
                            <li><strong>Published:</strong> ${book.publishedYear || 'Unknown'}</li>
                            <li><strong>Pages:</strong> ${book.pages || 'Unknown'}</li>
                            <li><strong>Language:</strong> ${book.language || 'English'}</li>
                        </ul>
                    </div>
                    ${book.available ? `
                        <div class="book-actions-large">
                            <button class="btn-primary" onclick="borrowBook(${book.id})">
                                Borrow This Book
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to load book details.', 'error');
    }
}

// Hide book modal
function hideBookModal() {
    document.getElementById('bookModal').style.display = 'none';
}

// Borrow book
async function borrowBook(bookId) {
    if (!confirm('Do you want to borrow this book?')) return;
    try {
        const response = await LibraTech.API.post(`/books/${bookId}/borrow`);
        if (response && response.success) {
            LibraTech.Utils.showNotification('Book borrowed successfully!', 'success');
            // Reload books and dashboard
            loadUserDashboard();
        } else {
            throw new Error(response.message || 'Failed to borrow book.');
        }
    } catch (error) {
        LibraTech.Utils.showNotification(error.message || 'Failed to borrow book.', 'error');
    }
}

// Return book
async function returnBook(bookId) {
    const confirmed = await LibraTech.Utils.confirm(
        'Are you sure you want to return this book?',
        'Return Book'
    );
    
    if (!confirmed) return;
    
    try {
        const result = await LibraTech.BookManager.returnBook(bookId);
        
        if (result) {
            // Refresh dashboard data
            loadUserDashboard();
        }
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to return book.', 'error');
    }
}

// Renew book
async function renewBook(bookId) {
    try {
        const response = await LibraTech.API.post(`/books/${bookId}/renew`);
        
        if (response.success) {
            LibraTech.Utils.showNotification('Book renewed successfully!', 'success');
            
            // Refresh dashboard data
            loadUserDashboard();
        } else {
            LibraTech.Utils.showNotification(response.message || 'Failed to renew book.', 'error');
        }
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to renew book.', 'error');
    }
}

// Show my books
function showMyBooks() {
    const mainContent = document.getElementById('user-main-content');
    mainContent.innerHTML = `
        <div class="management-section">
            <h2>My Borrowed Books</h2>
            <div class="books-grid" id="myBooksGrid">
                <!-- Books will be loaded here -->
            </div>
        </div>
    `;
    
    // Load current books
    loadCurrentBooks().then(books => {
        updateCurrentBooks(books);
    });
}

// Show history
async function showHistory() {
    const mainContent = document.getElementById('user-main-content');
    mainContent.innerHTML = `
        <div class="management-section">
            <h2>Borrowing History</h2>
            <div class="history-filters">
                <select id="historyFilter">
                    <option value="all">All Activities</option>
                    <option value="borrow">Borrowed</option>
                    <option value="return">Returned</option>
                    <option value="renew">Renewed</option>
                </select>
                <input type="date" id="historyDate" placeholder="Filter by date">
            </div>
            <div class="activity-list" id="historyList">
                <!-- History will be loaded here -->
            </div>
        </div>
    `;
    
    try {
        const history = await loadBorrowingHistory();
        displayBorrowingHistory(history);
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to load history.', 'error');
    }
}

// Load borrowing history
async function loadBorrowingHistory() {
    try {
        return await LibraTech.API.get('/users/me/history');
    } catch (error) {
        console.error('Failed to load borrowing history:', error);
        return [];
    }
}

// Display borrowing history
function displayBorrowingHistory(history) {
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No History Found</h3>
                <p>Your borrowing history will appear here.</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="activity-item">
            <div class="activity-icon">${getActivityIcon(item.type)}</div>
            <div class="activity-info">
                <span class="activity-action">${item.action}</span>
                <span class="activity-book">${item.bookTitle}</span>
                <span class="activity-date">${LibraTech.Utils.formatDate(item.date)}</span>
                ${item.fine ? `<span class="activity-fine">Fine: ${LibraTech.Utils.formatCurrency(item.fine)}</span>` : ''}
            </div>
        </div>
    `).join('');
}

// Show profile
function showProfile() {
    const user = LibraTech.Auth.getCurrentUser();
    const mainContent = document.getElementById('user-main-content');
    
    mainContent.innerHTML = `
        <div class="management-section">
            <h2>My Profile</h2>
            <div class="profile-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="profileFirstName">First Name</label>
                        <input type="text" id="profileFirstName" value="${user?.firstName || ''}">
                    </div>
                    <div class="form-group">
                        <label for="profileLastName">Last Name</label>
                        <input type="text" id="profileLastName" value="${user?.lastName || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="profileEmail">Email</label>
                    <input type="email" id="profileEmail" value="${user?.email || ''}" readonly>
                </div>
                <div class="form-group">
                    <label for="profilePhone">Phone</label>
                    <input type="tel" id="profilePhone" value="${user?.phone || ''}">
                </div>
                <div class="form-group">
                    <label for="profileAddress">Address</label>
                    <textarea id="profileAddress" rows="3">${user?.address || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button class="btn-primary" onclick="updateProfile()">Update Profile</button>
                    <button class="btn-secondary" onclick="showChangePassword()">Change Password</button>
                </div>
            </div>
        </div>
    `;
}

// Update profile
async function updateProfile() {
    const profileData = {
        firstName: document.getElementById('profileFirstName').value,
        lastName: document.getElementById('profileLastName').value,
        phone: document.getElementById('profilePhone').value,
        address: document.getElementById('profileAddress').value
    };
    
    try {
        const response = await LibraTech.API.put('/users/me/profile', profileData);
        
        if (response.success) {
            LibraTech.Utils.showNotification('Profile updated successfully!', 'success');
            
            // Update user data
            const updatedUser = { ...LibraTech.Auth.getCurrentUser(), ...profileData };
            LibraTech.Utils.storage.set('user', updatedUser);
            
            // Update display
            updateUserInfo();
        }
        
    } catch (error) {
        LibraTech.Utils.showNotification('Failed to update profile.', 'error');
    }
}

// Show change password modal
function showChangePassword() {
    const modal = document.createElement('div');
    modal.className = 'modal-bg';
    modal.innerHTML = `
        <div class="modal-card card-anim">
            <button class="close-modal" onclick="this.closest('.modal-bg').remove()">&times;</button>
            <div class="modal-header">
                <h3>Change Password</h3>
            </div>
            <form id="changePasswordForm">
                <div class="form-group">
                    <label for="currentPassword">Current Password</label>
                    <input type="password" id="currentPassword" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <input type="password" id="newPassword" required>
                    <div id="passwordStrength" class="strength-meter"></div>
                </div>
                <div class="form-group">
                    <label for="confirmNewPassword">Confirm New Password</label>
                    <input type="password" id="confirmNewPassword" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal-bg').remove()">Cancel</button>
                    <button type="submit" class="btn-primary">Change Password</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup form submission
    modal.querySelector('#changePasswordForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;
        
        if (newPassword !== confirmPassword) {
            LibraTech.Utils.showNotification('New passwords do not match.', 'error');
            return;
        }
        
        const validation = LibraTech.Utils.validatePassword(newPassword);
        if (!validation.isValid) {
            LibraTech.Utils.showNotification('Password does not meet requirements.', 'error');
            return;
        }
        
        try {
            const response = await LibraTech.API.put('/users/me/password', {
                currentPassword,
                newPassword
            });
            
            if (response.success) {
                LibraTech.Utils.showNotification('Password changed successfully!', 'success');
                modal.remove();
            }
            
        } catch (error) {
            LibraTech.Utils.showNotification('Failed to change password.', 'error');
        }
    });
    
    // Setup password strength meter
    modal.querySelector('#newPassword').addEventListener('input', function() {
        const validation = LibraTech.Utils.validatePassword(this.value);
        const strengthMeter = modal.querySelector('#passwordStrength');
        
        const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const strengthClass = ['very-weak', 'weak', 'fair', 'good', 'strong'];
        
        strengthMeter.textContent = strengthText[validation.score - 1] || 'Very Weak';
        strengthMeter.className = `strength-meter ${strengthClass[validation.score - 1] || 'very-weak'}`;
    });
}

// Update user info in header
function updateUserInfo() {
    const user = LibraTech.Auth.getCurrentUser();
    
    const userName = document.getElementById('userName');
    if (userName && user) {
        userName.textContent = `${user.firstName || user.name} ${user.lastName || ''}`.trim();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Setup logout
    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.LibraTech && LibraTech.Auth && typeof LibraTech.Auth.logout === 'function') {
                LibraTech.Auth.logout();
            } else {
                // Fallback: clear localStorage and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }
        });
    }
}

// Setup search functionality
function setupSearchFunctionality() {
    // Setup search filters
    const categoryFilter = document.getElementById('categoryFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', performSearch);
    }
    
    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', performSearch);
    }
}

// Setup real-time updates
function setupRealTimeUpdates() {
    // Check for overdue books every hour
    setInterval(async () => {
        try {
            const currentBooks = await loadCurrentBooks();
            const overdueBooks = currentBooks.filter(book => isOverdue(book.dueDate));
            
            if (overdueBooks.length > 0) {
                LibraTech.Utils.showNotification(
                    `You have ${overdueBooks.length} overdue book(s). Please return them soon.`,
                    'warning'
                );
            }
        } catch (error) {
            console.error('Failed to check overdue books:', error);
        }
    }, 3600000); // 1 hour
}

// Export functions for global access
window.showBookSearch = showBookSearch;
window.hideSearchModal = hideSearchModal;
window.performSearch = performSearch;
window.showBookDetails = showBookDetails;
window.hideBookModal = hideBookModal;
window.borrowBook = borrowBook;
window.returnBook = returnBook;
window.renewBook = renewBook;
window.showMyBooks = showMyBooks;
window.showHistory = showHistory;
window.showProfile = showProfile;
window.updateProfile = updateProfile;
window.showChangePassword = showChangePassword; 