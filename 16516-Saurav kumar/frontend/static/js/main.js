/**
 * Crime Report Portal - Main JavaScript
 * Security-focused functionality with modern UX
 */

// Global configuration
const CONFIG = {
    API_BASE_URL: '/api/',
    CSRF_TOKEN: document.querySelector('[name=csrfmiddlewaretoken]')?.value,
    UPLOAD_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/', 'video/', 'audio/', 'application/pdf', 'text/'],
    REFRESH_INTERVAL: 30000, // 30 seconds
};

// Security utilities
const SecurityUtils = {
    /**
     * Sanitize user input to prevent XSS
     */
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },

    /**
     * Validate file upload
     */
    validateFile(file) {
        if (file.size > CONFIG.UPLOAD_MAX_SIZE) {
            throw new Error('File size exceeds 10MB limit');
        }

        const isValidType = CONFIG.ALLOWED_FILE_TYPES.some(type => 
            file.type.startsWith(type)
        );
        
        if (!isValidType) {
            throw new Error('File type not allowed');
        }

        return true;
    },

    /**
     * Generate secure random string
     */
    generateSecureId() {
        return crypto.getRandomValues(new Uint8Array(16))
            .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    },

    /**
     * Hash sensitive data (client-side)
     */
    async hashData(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
};

// API utilities
const API = {
    /**
     * Make authenticated API requests
     */
    async request(endpoint, options = {}) {
        const url = CONFIG.API_BASE_URL + endpoint;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': CONFIG.CSRF_TOKEN,
            },
            credentials: 'include',
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    /**
     * Upload file with progress tracking
     */
    async uploadFile(file, onProgress) {
        const formData = new FormData();
        formData.append('file', file);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    const progress = (event.loaded / event.total) * 100;
                    onProgress(progress);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });

            xhr.open('POST', CONFIG.API_BASE_URL + 'upload/');
            xhr.setRequestHeader('X-CSRFToken', CONFIG.CSRF_TOKEN);
            xhr.send(formData);
        });
    }
};

// Only keep utility and API code above

// हर बार table update के बाद यह function call करें
function initializeDashboardModalsAndTriggers() {
  // सिर्फ event listeners दोबारा bind करें
  document.querySelectorAll('[data-bs-toggle="modal"]').forEach(function(btn) {
    btn.removeEventListener('click', handleModalTrigger); // पहले remove करें
    btn.addEventListener('click', handleModalTrigger);
  });
}

function handleModalTrigger(event) {
  // Bootstrap 5 data attributes से modal खुद open हो जाएगा
  // अगर आपको modal fields set करनी हैं, तो यहाँ करें
  var btn = event.currentTarget;
  var target = btn.getAttribute('data-bs-target');
  if (target) {
    var modalEl = document.querySelector(target);
    // Example: Update Status Modal fields set करें
    if (modalEl && modalEl.id === 'updateStatusModal') {
      document.getElementById('updateStatusCaseId').value = btn.getAttribute('data-case-id');
      document.getElementById('newStatus').value = btn.getAttribute('data-case-status');
    }
  }
}