// LibraTech API Service
// Comprehensive API communication layer

class APIService {
    constructor() {
        // Use environment-aware base URL
        this.baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000/api'
            : `${window.location.protocol}//${window.location.hostname}:5000/api`;
        this.timeout = 30000; // 30 seconds
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            timeout: this.timeout,
            ...options
        };

        // Add authentication token if available
        const token = this.getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await this.makeRequest(url, config);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                return data;
                
            } catch (error) {
                lastError = error;
                
                // Don't retry on client errors (4xx)
                if (error.message.includes('HTTP 4')) {
                    break;
                }
                
                // Retry on server errors (5xx) or network errors
                if (attempt < this.retryAttempts) {
                    await this.delay(this.retryDelay * attempt);
                    continue;
                }
            }
        }
        
        throw lastError;
    }

    // Make actual HTTP request with timeout
    makeRequest(url, config) {
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);
            
            fetch(url, {
                ...config,
                signal: controller.signal
            })
            .then(response => {
                clearTimeout(timeoutId);
                resolve(response);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                reject(error);
            });
        });
    }

    // Delay utility
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('libraTech_token');
    }

    // Set authentication token
    setAuthToken(token) {
        localStorage.setItem('libraTech_token', token);
    }

    // Remove authentication token
    removeAuthToken() {
        localStorage.removeItem('libraTech_token');
    }

    // GET request
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return this.request(url, {
            method: 'GET'
        });
    }

    // POST request
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // PATCH request
    async patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    // File upload
    async upload(endpoint, file, onProgress = null) {
        const formData = new FormData();
        formData.append('file', file);

        const url = `${this.baseURL}${endpoint}`;
        const token = this.getAuthToken();
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    onProgress(percentComplete);
                }
            });
            
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`));
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });
            
            xhr.open('POST', url);
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            xhr.send(formData);
        });
    }

    // Authentication endpoints
    auth = {
        // Login
        login: async (credentials) => {
            return await this.post('/auth/login', credentials);
        },

        // Register
        register: async (userData) => {
            return await this.post('/auth/register', userData);
        },

        // Logout
        logout: async () => {
            return await this.post('/auth/logout');
        },

        // Refresh token
        refresh: async () => {
            return await this.post('/auth/refresh');
        },

        // Forgot password
        forgotPassword: async (email) => {
            return await this.post('/auth/forgot-password', { email });
        },

        // Reset password
        resetPassword: async (token, password) => {
            return await this.post('/auth/reset-password', { token, password });
        },

        // Verify email
        verifyEmail: async (token) => {
            return await this.post('/auth/verify-email', { token });
        },

        // Change password
        changePassword: async (currentPassword, newPassword) => {
            return await this.post('/auth/change-password', { currentPassword, newPassword });
        }
    };

    // User endpoints
    users = {
        // Get current user profile
        getProfile: async () => {
            return await this.get('/users/profile');
        },

        // Update user profile
        updateProfile: async (profileData) => {
            return await this.put('/users/profile', profileData);
        },

        // Get user by ID (admin only)
        getById: async (userId) => {
            return await this.get(`/users/${userId}`);
        },

        // Get all users (admin only)
        getAll: async (params = {}) => {
            return await this.get('/users', params);
        },

        // Create user (admin only)
        create: async (userData) => {
            return await this.post('/users', userData);
        },

        // Update user (admin only)
        update: async (userId, userData) => {
            return await this.put(`/users/${userId}`, userData);
        },

        // Delete user (admin only)
        delete: async (userId) => {
            return await this.delete(`/users/${userId}`);
        },

        // Toggle user status (admin only)
        toggleStatus: async (userId) => {
            return await this.put(`/users/${userId}/toggle-status`);
        },

        // Get user statistics (admin only)
        getStats: async () => {
            return await this.get('/users/stats');
        }
    };

    // Book endpoints
    books = {
        // Get all books
        getAll: async (params = {}) => {
            return await this.get('/books', params);
        },

        // Get book by ID
        getById: async (bookId) => {
            return await this.get(`/books/${bookId}`);
        },

        // Search books
        search: async (query, params = {}) => {
            return await this.get('/books/search', { q: query, ...params });
        },

        // Get books by category
        getByCategory: async (category, params = {}) => {
            return await this.get(`/books/category/${category}`, params);
        },

        // Get popular books
        getPopular: async (limit = 10) => {
            return await this.get('/books/popular', { limit });
        },

        // Get recently added books
        getRecent: async (limit = 10) => {
            return await this.get('/books/recent', { limit });
        },

        // Create book (admin only)
        create: async (bookData) => {
            return await this.post('/books', bookData);
        },

        // Update book (admin only)
        update: async (bookId, bookData) => {
            return await this.put(`/books/${bookId}`, bookData);
        },

        // Delete book (admin only)
        delete: async (bookId) => {
            return await this.delete(`/books/${bookId}`);
        },

        // Upload book cover (admin only)
        uploadCover: async (bookId, file, onProgress) => {
            return await this.upload(`/books/${bookId}/cover`, file, onProgress);
        },

        // Get book statistics (admin only)
        getStats: async () => {
            return await this.get('/books/stats');
        },

        // Import books (admin only)
        import: async (file, onProgress) => {
            return await this.upload('/books/import', file, onProgress);
        },

        // Export books (admin only)
        export: async (format = 'csv') => {
            return await this.get('/books/export', { format });
        }
    };

    // Transaction endpoints
    transactions = {
        // Get user transactions
        getUserTransactions: async (params = {}) => {
            return await this.get('/transactions/user', params);
        },

        // Get all transactions (admin only)
        getAll: async (params = {}) => {
            return await this.get('/transactions', params);
        },

        // Get transaction by ID
        getById: async (transactionId) => {
            return await this.get(`/transactions/${transactionId}`);
        },

        // Borrow book
        borrow: async (bookId) => {
            return await this.post('/transactions/borrow', { bookId });
        },

        // Return book
        return: async (transactionId) => {
            return await this.post(`/transactions/${transactionId}/return`);
        },

        // Renew book
        renew: async (transactionId) => {
            return await this.post(`/transactions/${transactionId}/renew`);
        },

        // Get overdue transactions
        getOverdue: async () => {
            return await this.get('/transactions/overdue');
        },

        // Pay fine
        payFine: async (transactionId, amount) => {
            return await this.post(`/transactions/${transactionId}/pay-fine`, { amount });
        },

        // Get transaction statistics (admin only)
        getStats: async () => {
            return await this.get('/transactions/stats');
        }
    };

    // Admin endpoints
    admin = {
        // Get dashboard statistics
        getDashboardStats: async () => {
            return await this.get('/admin/stats');
        },

        // Get recent activity
        getRecentActivity: async (limit = 10) => {
            return await this.get('/admin/activity', { limit });
        },

        // Get category statistics
        getCategoryStats: async () => {
            return await this.get('/admin/categories/stats');
        },

        // Get popular books
        getPopularBooks: async (limit = 10) => {
            return await this.get('/admin/books/popular', { limit });
        },

        // Get overdue statistics
        getOverdueStats: async () => {
            return await this.get('/admin/stats/overdue');
        },

        // Get new user statistics
        getNewUserStats: async () => {
            return await this.get('/admin/stats/new-users');
        },

        // Generate reports
        reports: {
            borrowing: async (params = {}) => {
                return await this.get('/admin/reports/borrowing', params);
            },

            userActivity: async (params = {}) => {
                return await this.get('/admin/reports/user-activity', params);
            },

            overdue: async (params = {}) => {
                return await this.get('/admin/reports/overdue', params);
            },

            popularBooks: async (params = {}) => {
                return await this.get('/admin/reports/popular-books', params);
            },

            financial: async (params = {}) => {
                return await this.get('/admin/reports/financial', params);
            },

            inventory: async (params = {}) => {
                return await this.get('/admin/reports/inventory', params);
            }
        }
    };

    // Notification endpoints
    notifications = {
        // Get user notifications
        getUserNotifications: async () => {
            return await this.get('/notifications');
        },

        // Mark notification as read
        markAsRead: async (notificationId) => {
            return await this.put(`/notifications/${notificationId}/read`);
        },

        // Mark all notifications as read
        markAllAsRead: async () => {
            return await this.put('/notifications/read-all');
        },

        // Delete notification
        delete: async (notificationId) => {
            return await this.delete(`/notifications/${notificationId}`);
        },

        // Get notification settings
        getSettings: async () => {
            return await this.get('/notifications/settings');
        },

        // Update notification settings
        updateSettings: async (settings) => {
            return await this.put('/notifications/settings', settings);
        }
    };

    // QR Code endpoints
    qr = {
        // Generate QR code for book
        generateBookQR: async (bookId) => {
            return await this.get(`/qr/book/${bookId}`);
        },

        // Generate QR code for user
        generateUserQR: async () => {
            return await this.get('/qr/user');
        },

        // Scan QR code
        scan: async (qrData) => {
            return await this.post('/qr/scan', { qrData });
        }
    };

    // Error handling
    handleError(error) {
        console.error('API Error:', error);
        
        if (error.message.includes('HTTP 401')) {
            // Unauthorized - redirect to login
            this.removeAuthToken();
            window.location.href = '/login.html';
            return 'Session expired. Please login again.';
        }
        
        if (error.message.includes('HTTP 403')) {
            return 'Access denied. You do not have permission to perform this action.';
        }
        
        if (error.message.includes('HTTP 404')) {
            return 'Resource not found.';
        }
        
        if (error.message.includes('HTTP 422')) {
            return 'Invalid data provided. Please check your input.';
        }
        
        if (error.message.includes('HTTP 500')) {
            return 'Server error. Please try again later.';
        }
        
        if (error.name === 'AbortError') {
            return 'Request timed out. Please check your connection and try again.';
        }
        
        return 'An unexpected error occurred. Please try again.';
    }

    // Health check
    async healthCheck() {
        try {
            const response = await this.get('/health');
            return response.status === 'ok';
        } catch (error) {
            return false;
        }
    }

    // Check if user is online
    async isOnline() {
        try {
            await this.healthCheck();
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Create global API instance
window.LibraTechAPI = new APIService(); 