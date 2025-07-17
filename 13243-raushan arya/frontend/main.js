// LibraTech Library Management System - Main JavaScript
// Global configuration and utility functions

// Configuration
const CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api',
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_LOGIN_ATTEMPTS: 3,
    PASSWORD_MIN_LENGTH: 8,
    BOOKS_PER_PAGE: 12,
    ANIMATION_DURATION: 300
};

// Global state management
const AppState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loginAttempts: 0,
    lastActivity: Date.now()
};

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    Utils.showNotification('Something went wrong. Please try again.', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    Utils.showNotification('Network error. Please check your connection.', 'error');
});

// Utility functions
const Utils = {
    // Format date
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Generate random ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate password
    validatePassword: (password) => {
        const minLength = password.length >= CONFIG.PASSWORD_MIN_LENGTH;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
            score: [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length,
            details: {
                minLength,
                hasUpperCase,
                hasLowerCase,
                hasNumbers,
                hasSpecialChar
            }
        };
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Enhanced notification with better styling
    showNotification: (message, type = 'info', duration = 5000) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        const icon = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        }[type] || 'ℹ️';
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
            <div class="notification-progress"></div>
        `;
        
        // Add styles for better notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#fef2f2' : type === 'success' ? '#f0fdf4' : type === 'warning' ? '#fffbeb' : '#eff6ff'};
            color: ${type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : type === 'warning' ? '#d97706' : '#2563eb'};
            border: 1px solid ${type === 'error' ? '#fecaca' : type === 'success' ? '#bbf7d0' : type === 'warning' ? '#fed7aa' : '#bfdbfe'};
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        const autoRemove = setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Progress bar animation
        const progress = notification.querySelector('.notification-progress');
        progress.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : type === 'warning' ? '#d97706' : '#2563eb'};
            width: 100%;
            transform-origin: left;
            animation: notification-progress ${duration}ms linear;
        `;
    },

    // Enhanced loading spinner
    showLoading: (container, message = 'Loading...') => {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-container">
                <div class="spinner"></div>
                <p class="loading-message">${message}</p>
            </div>
        `;
        
        spinner.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            text-align: center;
        `;
        
        const spinnerContainer = spinner.querySelector('.spinner-container');
        spinnerContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        `;
        
        const spinnerElement = spinner.querySelector('.spinner');
        spinnerElement.style.cssText = `
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        
        const loadingMessage = spinner.querySelector('.loading-message');
        loadingMessage.style.cssText = `
            color: #6b7280;
            font-size: 14px;
            margin: 0;
        `;
        
        container.appendChild(spinner);
        return spinner;
    },

    // Hide loading spinner
    hideLoading: (spinner) => {
        if (spinner) {
            spinner.remove();
        }
    },

    // Confirm dialog
    confirm: (message, title = 'Confirm') => {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal-bg confirm-modal';
            modal.innerHTML = `
                <div class="modal-card card-anim">
                    <div class="modal-header">
                        <h3>${title}</h3>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" id="cancel-btn">Cancel</button>
                        <button class="btn-primary" id="confirm-btn">Confirm</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            modal.querySelector('#cancel-btn').addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
            
            modal.querySelector('#confirm-btn').addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });
        });
    },

    // Local storage utilities
    storage: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
            }
        },
        
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return defaultValue;
            }
        },
        
        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Error removing from localStorage:', e);
            }
        }
    }
};

// API service
const API = {
    baseURL: CONFIG.API_BASE_URL,
    
    // Make API request
    request: async (endpoint, options = {}) => {
        const url = `${API.baseURL}${endpoint}`;
        const token = Utils.storage.get('token');
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };
        
        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Unauthorized - redirect to login
                    Auth.logout();
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            Utils.showNotification('Network error. Please try again.', 'error');
            throw error;
        }
    },
    
    // GET request
    get: (endpoint) => API.request(endpoint),
    
    // POST request
    post: (endpoint, data) => API.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    // PUT request
    put: (endpoint, data) => API.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    // DELETE request
    delete: (endpoint) => API.request(endpoint, {
        method: 'DELETE'
    })
};

// Authentication service
const Auth = {
    // Login
    login: async (email, password, role) => {
        try {
            const response = await API.post('/auth/login', { email, password, role });
            
            if (response.token) {
                Utils.storage.set('token', response.token);
                Utils.storage.set('user', response.user);
                AppState.token = response.token;
                AppState.user = response.user;
                AppState.isAuthenticated = true;
                AppState.lastActivity = Date.now();
                
                Utils.showNotification('Login successful!', 'success');
                
                // Redirect based on role
                setTimeout(() => {
                    window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
                }, 1000);
                
                return true;
            }
        } catch (error) {
            AppState.loginAttempts++;
            Utils.showNotification('Login failed. Please check your credentials.', 'error');
            return false;
        }
    },
    
    // Register
    register: async (userData) => {
        try {
            const response = await API.post('/auth/register', userData);
            
            if (response.success) {
                Utils.showNotification('Registration successful! Please login.', 'success');
                return true;
            }
        } catch (error) {
            Utils.showNotification('Registration failed. Please try again.', 'error');
            return false;
        }
    },
    
    // Logout
    logout: () => {
        Utils.storage.remove('token');
        Utils.storage.remove('user');
        AppState.token = null;
        AppState.user = null;
        AppState.isAuthenticated = false;
        
        Utils.showNotification('Logged out successfully.', 'info');
        window.location.href = 'index.html';
    },
    
    // Check if user is authenticated
    isAuthenticated: () => {
        const token = Utils.storage.get('token');
        const user = Utils.storage.get('user');
        
        if (token && user) {
            AppState.token = token;
            AppState.user = user;
            AppState.isAuthenticated = true;
            return true;
        }
        
        return false;
    },
    
    // Get current user
    getCurrentUser: () => {
        return Utils.storage.get('user');
    },
    
    // Update user activity
    updateActivity: () => {
        AppState.lastActivity = Date.now();
    },
    
    // Check session timeout
    checkSessionTimeout: () => {
        const timeSinceLastActivity = Date.now() - AppState.lastActivity;
        
        if (timeSinceLastActivity > CONFIG.SESSION_TIMEOUT) {
            Utils.showNotification('Session expired. Please login again.', 'warning');
            Auth.logout();
            return true;
        }
        
        return false;
    }
};

// Session management
const Session = {
    init: () => {
        // Check authentication on page load
        if (Auth.isAuthenticated()) {
            // Update activity on user interaction
            document.addEventListener('click', Auth.updateActivity);
            document.addEventListener('keypress', Auth.updateActivity);
            document.addEventListener('scroll', Auth.updateActivity);
            
            // Check session timeout every minute
            setInterval(() => {
                Auth.checkSessionTimeout();
            }, 60000);
        }
    }
};

// Search functionality
const Search = {
    // Search books
    searchBooks: async (query, filters = {}) => {
        try {
            const params = new URLSearchParams({
                q: query,
                ...filters
            });
            
            return await API.get(`/books/search?${params}`);
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    },
    
    // Advanced search with debouncing
    debouncedSearch: Utils.debounce(async (query, filters, callback) => {
        const results = await Search.searchBooks(query, filters);
        callback(results);
    }, 500)
};

// Book management
const BookManager = {
    // Get all books
    getAllBooks: async (page = 1, limit = CONFIG.BOOKS_PER_PAGE) => {
        try {
            return await API.get(`/books?page=${page}&limit=${limit}`);
        } catch (error) {
            console.error('Failed to fetch books:', error);
            return [];
        }
    },
    
    // Get book by ID
    getBookById: async (id) => {
        try {
            return await API.get(`/books/${id}`);
        } catch (error) {
            console.error('Failed to fetch book:', error);
            return null;
        }
    },
    
    // Borrow book
    borrowBook: async (bookId) => {
        try {
            const response = await API.post(`/books/${bookId}/borrow`);
            Utils.showNotification('Book borrowed successfully!', 'success');
            return response;
        } catch (error) {
            Utils.showNotification('Failed to borrow book.', 'error');
            return null;
        }
    },
    
    // Return book
    returnBook: async (bookId) => {
        try {
            const response = await API.post(`/books/${bookId}/return`);
            Utils.showNotification('Book returned successfully!', 'success');
            return response;
        } catch (error) {
            Utils.showNotification('Failed to return book.', 'error');
            return null;
        }
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize session management
    Session.init();
    
    // Setup login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            const loginMessage = document.getElementById('loginMessage');
            
            // Validate inputs
            if (!email || !password) {
                Utils.showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!Utils.validateEmail(email)) {
                Utils.showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            loginMessage.textContent = 'Logging in...';
            loginMessage.style.color = '#4f8cff';
            
            // Attempt login
            const success = await Auth.login(email, password, role);
            
            if (!success) {
                loginMessage.textContent = 'Login failed. Please try again.';
                loginMessage.style.color = '#e53e3e';
            }
        });
    }
    
    // Setup registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const userData = Object.fromEntries(formData);
            
            // Validate password
            const passwordValidation = Utils.validatePassword(userData.password);
            if (!passwordValidation.isValid) {
                Utils.showNotification('Password does not meet requirements.', 'error');
                return;
            }
            
            // Validate password confirmation
            if (userData.password !== userData.confirmPassword) {
                Utils.showNotification('Passwords do not match.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;
            
            // Attempt registration
            const success = await Auth.register(userData);
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            if (success) {
                registerForm.reset();
            }
        });
    }
    
    // Setup password strength meter
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const validation = Utils.validatePassword(this.value);
            const strengthMeter = document.getElementById('passwordStrength');
            
            if (strengthMeter) {
                const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
                const strengthClass = ['very-weak', 'weak', 'fair', 'good', 'strong'];
                
                strengthMeter.textContent = strengthText[validation.score - 1] || 'Very Weak';
                strengthMeter.className = `strength-meter ${strengthClass[validation.score - 1] || 'very-weak'}`;
            }
        });
    }
    
    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            const filters = {
                category: document.getElementById('categoryFilter')?.value || '',
                availability: document.getElementById('availabilityFilter')?.value || ''
            };
            
            if (query.length >= 2) {
                Search.debouncedSearch(query, filters, (results) => {
                    // Update search results
                    const resultsContainer = document.getElementById('searchResults');
                    if (resultsContainer) {
                        resultsContainer.innerHTML = results.map(book => `
                            <div class="search-result-item">
                                <h4>${book.title}</h4>
                                <p>${book.author}</p>
                                <span class="availability ${book.available ? 'available' : 'unavailable'}">
                                    ${book.available ? 'Available' : 'Not Available'}
                                </span>
                            </div>
                        `).join('');
                    }
                });
            }
        });
    }
    
    // Animate floating books
    function animateBooks() {
        document.querySelectorAll('.book-svg').forEach((svg, i) => {
            const t = Date.now()/900 + i;
            const y = Math.sin(t)*10;
            const r = Math.sin(t/2)*4;
            const s = 1 + Math.sin(t/1.5)*0.03;
            svg.style.transform = `translateY(${y}px) rotate(${r}deg) scale(${s})`;
        });
        requestAnimationFrame(animateBooks);
    }
    
    if (document.querySelector('.book-svg')) {
        animateBooks();
    }
    
    // Fade-in and card-anim on scroll
    function animateOnScroll() {
        const fadeEls = document.querySelectorAll('.fade-in');
        const cardEls = document.querySelectorAll('.card-anim');
        const observer = new window.IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(entry.target.classList.contains('card-anim') ? 'card-visible' : 'visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        fadeEls.forEach(el => observer.observe(el));
        cardEls.forEach(el => observer.observe(el));
    }
    
    animateOnScroll();
    
    // Setup modal functionality
    document.querySelectorAll('.modal-bg').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Setup close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal-bg').style.display = 'none';
        });
    });
    
    // Setup logout buttons
    document.querySelectorAll('[id*="logout"], .logout-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            Utils.confirm('Are you sure you want to logout?', 'Logout').then(confirmed => {
                if (confirmed) {
                    Auth.logout();
                }
            });
        });
    });

    const title = document.querySelector('.site-title');
    if (title) {
        title.style.cursor = 'pointer';
        title.addEventListener('click', function(e) {
            e.preventDefault && e.preventDefault();
            window.location.href = 'index.html';
        });
    }
});

// Export for use in other modules
window.LibraTech = {
    Utils,
    API,
    Auth,
    Search,
    BookManager,
    CONFIG,
    AppState
}; 