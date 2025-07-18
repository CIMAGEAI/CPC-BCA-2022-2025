// LibraTech Utilities - Advanced functionality
// Comprehensive utility functions for the library management system

// Notification System
const NotificationSystem = {
    types: {
        success: { icon: '✅', color: '#22c55e' },
        error: { icon: '❌', color: '#ef4444' },
        warning: { icon: '⚠️', color: '#f59e0b' },
        info: { icon: 'ℹ️', color: '#3b82f6' }
    },
    
    // Show notification
    show: (message, type = 'info', duration = 5000, options = {}) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const config = NotificationSystem.types[type] || NotificationSystem.types.info;
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${config.icon}</div>
                <div class="notification-body">
                    <span class="notification-message">${message}</span>
                    ${options.subtitle ? `<span class="notification-subtitle">${options.subtitle}</span>` : ''}
                </div>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
            <div class="notification-progress"></div>
        `;
        
        // Add custom styles
        notification.style.setProperty('--notification-color', config.color);
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto remove
        const autoRemove = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Progress bar animation
        const progressBar = notification.querySelector('.notification-progress');
        if (progressBar) {
            progressBar.style.transition = `width ${duration}ms linear`;
            requestAnimationFrame(() => {
                progressBar.style.width = '0%';
            });
        }
        
        return notification;
    },
    
    // Show success notification
    success: (message, subtitle = '', duration = 5000) => {
        return NotificationSystem.show(message, 'success', duration, { subtitle });
    },
    
    // Show error notification
    error: (message, subtitle = '', duration = 7000) => {
        return NotificationSystem.show(message, 'error', duration, { subtitle });
    },
    
    // Show warning notification
    warning: (message, subtitle = '', duration = 6000) => {
        return NotificationSystem.show(message, 'warning', duration, { subtitle });
    },
    
    // Show info notification
    info: (message, subtitle = '', duration = 5000) => {
        return NotificationSystem.show(message, 'info', duration, { subtitle });
    },
    
    // Clear all notifications
    clearAll: () => {
        document.querySelectorAll('.notification').forEach(notification => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
};

// Data Validation System
const ValidationSystem = {
    // Validate email
    email: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: re.test(email),
            message: re.test(email) ? '' : 'Please enter a valid email address'
        };
    },
    
    // Validate password strength
    password: (password) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const score = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
        
        return {
            isValid: score >= 4,
            score,
            details: {
                minLength,
                hasUpperCase,
                hasLowerCase,
                hasNumbers,
                hasSpecialChar
            },
            strength: score < 2 ? 'Very Weak' : score < 3 ? 'Weak' : score < 4 ? 'Fair' : score < 5 ? 'Good' : 'Strong'
        };
    },
    
    // Validate phone number
    phone: (phone) => {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return {
            isValid: re.test(phone.replace(/[\s\-\(\)]/g, '')),
            message: re.test(phone.replace(/[\s\-\(\)]/g, '')) ? '' : 'Please enter a valid phone number'
        };
    },
    
    // Validate ISBN
    isbn: (isbn) => {
        const cleanIsbn = isbn.replace(/[\s\-]/g, '');
        const re = /^(?:[0-9]{10}|[0-9]{13})$/;
        return {
            isValid: re.test(cleanIsbn),
            message: re.test(cleanIsbn) ? '' : 'Please enter a valid ISBN (10 or 13 digits)'
        };
    },
    
    // Validate required field
    required: (value, fieldName = 'This field') => {
        return {
            isValid: value && value.trim().length > 0,
            message: value && value.trim().length > 0 ? '' : `${fieldName} is required`
        };
    },
    
    // Validate minimum length
    minLength: (value, min, fieldName = 'This field') => {
        return {
            isValid: value && value.length >= min,
            message: value && value.length >= min ? '' : `${fieldName} must be at least ${min} characters`
        };
    },
    
    // Validate maximum length
    maxLength: (value, max, fieldName = 'This field') => {
        return {
            isValid: value && value.length <= max,
            message: value && value.length <= max ? '' : `${fieldName} must be no more than ${max} characters`
        };
    },
    
    // Validate date
    date: (date) => {
        const dateObj = new Date(date);
        return {
            isValid: !isNaN(dateObj.getTime()),
            message: !isNaN(dateObj.getTime()) ? '' : 'Please enter a valid date'
        };
    },
    
    // Validate future date
    futureDate: (date) => {
        const dateObj = new Date(date);
        const now = new Date();
        return {
            isValid: !isNaN(dateObj.getTime()) && dateObj > now,
            message: !isNaN(dateObj.getTime()) && dateObj > now ? '' : 'Please enter a future date'
        };
    },
    
    // Validate number range
    numberRange: (value, min, max, fieldName = 'This field') => {
        const num = parseFloat(value);
        return {
            isValid: !isNaN(num) && num >= min && num <= max,
            message: !isNaN(num) && num >= min && num <= max ? '' : `${fieldName} must be between ${min} and ${max}`
        };
    }
};

// File Handling System
const FileSystem = {
    // Download file
    download: (data, filename, type = 'text/plain') => {
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
    
    // Export to CSV
    exportCSV: (data, filename) => {
        if (!Array.isArray(data) || data.length === 0) {
            NotificationSystem.error('No data to export');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');
        
        FileSystem.download(csvContent, `${filename}.csv`, 'text/csv');
        NotificationSystem.success('CSV file exported successfully');
    },
    
    // Export to JSON
    exportJSON: (data, filename) => {
        const jsonContent = JSON.stringify(data, null, 2);
        FileSystem.download(jsonContent, `${filename}.json`, 'application/json');
        NotificationSystem.success('JSON file exported successfully');
    },
    
    // Read file
    readFile: (file, type = 'text') => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            
            switch (type) {
                case 'text':
                    reader.readAsText(file);
                    break;
                case 'dataURL':
                    reader.readAsDataURL(file);
                    break;
                case 'arrayBuffer':
                    reader.readAsArrayBuffer(file);
                    break;
                default:
                    reader.readAsText(file);
            }
        });
    },
    
    // Validate file type
    validateFileType: (file, allowedTypes) => {
        return allowedTypes.includes(file.type);
    },
    
    // Validate file size
    validateFileSize: (file, maxSizeMB) => {
        return file.size <= maxSizeMB * 1024 * 1024;
    }
};

// Chart System (Simple charts using CSS)
const ChartSystem = {
    // Create bar chart
    createBarChart: (container, data, options = {}) => {
        const { width = 400, height = 300, color = '#4f8cff' } = options;
        
        const maxValue = Math.max(...data.map(item => item.value));
        
        const chartHTML = `
            <div class="chart-container" style="width: ${width}px; height: ${height}px;">
                <div class="chart-bars">
                    ${data.map(item => `
                        <div class="chart-bar-container">
                            <div class="chart-bar" 
                                 style="height: ${(item.value / maxValue) * 100}%; background-color: ${color};"
                                 title="${item.label}: ${item.value}">
                            </div>
                            <div class="chart-label">${item.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = chartHTML;
    },
    
    // Create pie chart
    createPieChart: (container, data, options = {}) => {
        const { size = 200, colors = ['#4f8cff', '#7c3aed', '#ff7e5f', '#feb47b', '#a18cd1'] } = options;
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;
        
        const chartHTML = `
            <div class="chart-container" style="width: ${size}px; height: ${size}px;">
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                    ${data.map((item, index) => {
                        const percentage = (item.value / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const startAngle = currentAngle;
                        currentAngle += angle;
                        
                        const x1 = size / 2 + (size / 2 - 20) * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = size / 2 + (size / 2 - 20) * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = size / 2 + (size / 2 - 20) * Math.cos((currentAngle - 90) * Math.PI / 180);
                        const y2 = size / 2 + (size / 2 - 20) * Math.sin((currentAngle - 90) * Math.PI / 180);
                        
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        
                        return `
                            <path d="M ${size/2} ${size/2} L ${x1} ${y1} A ${size/2 - 20} ${size/2 - 20} 0 ${largeArcFlag} 1 ${x2} ${y2} Z"
                                  fill="${colors[index % colors.length]}"
                                  title="${item.label}: ${item.value} (${percentage.toFixed(1)}%)">
                            </path>
                        `;
                    }).join('')}
                </svg>
                <div class="chart-legend">
                    ${data.map((item, index) => `
                        <div class="legend-item">
                            <span class="legend-color" style="background-color: ${colors[index % colors.length]}"></span>
                            <span class="legend-label">${item.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = chartHTML;
    },
    
    // Create line chart
    createLineChart: (container, data, options = {}) => {
        const { width = 400, height = 300, color = '#4f8cff' } = options;
        
        const maxValue = Math.max(...data.map(item => item.value));
        const minValue = Math.min(...data.map(item => item.value));
        const range = maxValue - minValue;
        
        const points = data.map((item, index) => {
            const x = (index / (data.length - 1)) * (width - 40) + 20;
            const y = height - 40 - ((item.value - minValue) / range) * (height - 80);
            return `${x},${y}`;
        }).join(' ');
        
        const chartHTML = `
            <div class="chart-container" style="width: ${width}px; height: ${height}px;">
                <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                    <polyline points="${points}" 
                              fill="none" 
                              stroke="${color}" 
                              stroke-width="2">
                    </polyline>
                    ${data.map((item, index) => {
                        const x = (index / (data.length - 1)) * (width - 40) + 20;
                        const y = height - 40 - ((item.value - minValue) / range) * (height - 80);
                        return `
                            <circle cx="${x}" cy="${y}" r="4" fill="${color}" title="${item.label}: ${item.value}">
                            </circle>
                        `;
                    }).join('')}
                </svg>
            </div>
        `;
        
        container.innerHTML = chartHTML;
    }
};

// Search System
const SearchSystem = {
    // Simple text search
    search: (items, query, fields = []) => {
        if (!query.trim()) return items;
        
        const searchTerm = query.toLowerCase();
        
        return items.filter(item => {
            if (fields.length === 0) {
                // Search all string fields
                return Object.values(item).some(value => 
                    typeof value === 'string' && value.toLowerCase().includes(searchTerm)
                );
            } else {
                // Search specific fields
                return fields.some(field => {
                    const value = item[field];
                    return typeof value === 'string' && value.toLowerCase().includes(searchTerm);
                });
            }
        });
    },
    
    // Advanced search with filters
    advancedSearch: (items, criteria) => {
        return items.filter(item => {
            return Object.entries(criteria).every(([field, condition]) => {
                const value = item[field];
                
                if (condition.type === 'equals') {
                    return value === condition.value;
                } else if (condition.type === 'contains') {
                    return typeof value === 'string' && value.toLowerCase().includes(condition.value.toLowerCase());
                } else if (condition.type === 'range') {
                    return value >= condition.min && value <= condition.max;
                } else if (condition.type === 'in') {
                    return condition.values.includes(value);
                }
                
                return true;
            });
        });
    },
    
    // Fuzzy search
    fuzzySearch: (items, query, fields = []) => {
        if (!query.trim()) return items;
        
        const searchTerm = query.toLowerCase();
        
        return items.filter(item => {
            if (fields.length === 0) {
                return Object.values(item).some(value => 
                    typeof value === 'string' && SearchSystem.calculateSimilarity(value.toLowerCase(), searchTerm) > 0.3
                );
            } else {
                return fields.some(field => {
                    const value = item[field];
                    return typeof value === 'string' && SearchSystem.calculateSimilarity(value.toLowerCase(), searchTerm) > 0.3;
                });
            }
        });
    },
    
    // Calculate string similarity (simple implementation)
    calculateSimilarity: (str1, str2) => {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const distance = SearchSystem.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    },
    
    // Levenshtein distance
    levenshteinDistance: (str1, str2) => {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
};

// Date/Time Utilities
const DateTimeUtils = {
    // Format date
    formatDate: (date, format = 'medium') => {
        const dateObj = new Date(date);
        
        const formats = {
            short: dateObj.toLocaleDateString(),
            medium: dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            long: dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: dateObj.toLocaleTimeString(),
            datetime: dateObj.toLocaleString()
        };
        
        return formats[format] || formats.medium;
    },
    
    // Calculate time difference
    timeDifference: (date1, date2 = new Date()) => {
        const diff = Math.abs(new Date(date1) - new Date(date2));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        return 'Just now';
    },
    
    // Check if date is overdue
    isOverdue: (dueDate) => {
        return new Date(dueDate) < new Date();
    },
    
    // Calculate days until due
    daysUntilDue: (dueDate) => {
        const diff = new Date(dueDate) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },
    
    // Add days to date
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
};

// Export all utilities
window.LibraTechUtils = {
    NotificationSystem,
    ValidationSystem,
    FileSystem,
    ChartSystem,
    SearchSystem,
    DateTimeUtils
};

document.addEventListener('DOMContentLoaded', function() {
  const title = document.querySelector('.site-title');
  if (title) {
    title.style.cursor = 'pointer';
    title.addEventListener('click', function(e) {
      // Prevent default if it's already an anchor
      e.preventDefault && e.preventDefault();
      window.location.href = 'index.html';
    });
  }
}); 