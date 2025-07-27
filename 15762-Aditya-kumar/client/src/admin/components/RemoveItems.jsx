import React, { useState, useEffect, useCallback, useRef } from 'react';
import './RemoveItems.css';
import ProductForm from './ProductForm';

// Category options (same as ProductForm)
const categoryOptions = [
    { value: '', label: 'Select a category *' },
    { value: 'Appliances', label: 'Appliances' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Fitness', label: 'Fitness Equipment' },
    { value: 'Bikes', label: 'Bikes & Vehicles' },
    { value: 'Medical', label: 'Medical Equipment' },
    { value: 'Kids-Baby', label: 'Kids & Baby Items' },
    { value: 'Packages', label: 'Packages & Bundles' },
    { value: 'Other', label: 'Other' }
];

// ProductFormModal: Add/Edit product modal (in this file for now)
const ProductFormModal = ({ open, onClose, onSubmit, initialData, isSubmitting, error, success }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        pricePerDay: '',
        availableFrom: '',
        availableTo: '',
        images: [],
    });
    const [previewUrls, setPreviewUrls] = useState([]);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || '',
                description: initialData.description || '',
                category: initialData.category || '',
                pricePerDay: initialData.pricePerDay || '',
                availableFrom: initialData.availableFrom ? initialData.availableFrom.slice(0, 10) : '',
                availableTo: initialData.availableTo ? initialData.availableTo.slice(0, 10) : '',
                images: [], // for new uploads only
            });
            setPreviewUrls(initialData.images || []);
        } else {
            setForm({ title: '', description: '', category: '', pricePerDay: '', availableFrom: '', availableTo: '', images: [] });
            setPreviewUrls([]);
        }
        setFormErrors({});
    }, [initialData, open]);

    const handleInput = (e) => {
        const { name, value, files } = e.target;
        if (name === 'images') {
            const fileArr = Array.from(files);
            setForm(f => ({ ...f, images: fileArr }));
            setPreviewUrls(fileArr.map(file => URL.createObjectURL(file)));
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required';
        else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
        if (!form.description.trim()) errs.description = 'Description is required';
        else if (form.description.trim().length < 10) errs.description = 'Description must be at least 10 characters';
        if (!form.category.trim()) errs.category = 'Category is required';
        if (!form.pricePerDay || isNaN(form.pricePerDay) || Number(form.pricePerDay) <= 0) errs.pricePerDay = 'Valid price required';
        if (!form.availableFrom) errs.availableFrom = 'Start date required';
        // For new product, require at least 1 image
        if (!initialData && (!form.images || form.images.length === 0)) {
            errs.images = 'At least one image is required';
        }
        // Validate image type/size (max 5MB per image)
        if (form.images && form.images.length > 0) {
            for (let img of form.images) {
                if (!img.type.startsWith('image/')) {
                    errs.images = 'Only image files are allowed';
                    break;
                }
                if (img.size > 5 * 1024 * 1024) {
                    errs.images = 'Each image must be less than 5MB';
                    break;
                }
            }
        }
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(form, previewUrls);
    };

    if (!open) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content product-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{initialData ? 'Edit Product' : 'Add New Product'}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input name="title" value={form.title} onChange={handleInput} required />
                        {formErrors.title && <div className="error-message">{formErrors.title}</div>}
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={form.description} onChange={handleInput} required rows={3} />
                        {formErrors.description && <div className="error-message">{formErrors.description}</div>}
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={form.category} onChange={handleInput} required>
                            {categoryOptions.map((cat, idx) => (
                                <option key={idx} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                        {formErrors.category && <div className="error-message">{formErrors.category}</div>}
                    </div>
                    <div className="form-group">
                        <label>Price Per Day (INR)</label>
                        <input name="pricePerDay" type="number" value={form.pricePerDay} onChange={handleInput} required min="1" />
                        {formErrors.pricePerDay && <div className="error-message">{formErrors.pricePerDay}</div>}
                    </div>
                    <div className="form-group">
                        <label>Available From</label>
                        <input name="availableFrom" type="date" value={form.availableFrom} onChange={handleInput} required />
                        {formErrors.availableFrom && <div className="error-message">{formErrors.availableFrom}</div>}
                    </div>
                    <div className="form-group">
                        <label>Available To</label>
                        <input name="availableTo" type="date" value={form.availableTo} onChange={handleInput} />
                    </div>
                    <div className="form-group">
                        <label>Images</label>
                        <input name="images" type="file" accept="image/*" multiple onChange={handleInput} />
                        <div className="image-preview-container">
                            {previewUrls.map((src, idx) => (
                                <img key={idx} src={src} alt={`preview-${idx}`} className="preview-img" />
                            ))}
                        </div>
                        {formErrors.images && <div className="error-message">{formErrors.images}</div>}
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <div className="modal-footer">
                        <button type="button" className="modal-btn secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal-btn primary" disabled={isSubmitting}>
                            {isSubmitting ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const RemoveItems = ({ onProductRemoved }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [bulkActions, setBulkActions] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const token = localStorage.getItem('borrowbuddy-token');
    const refreshIntervalRef = useRef(null);

    // Fetch products with enhanced error handling
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/products', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched products:', data); // Debug output
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Fetch statistics
    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                // setStats(data); // This line was removed as per the edit hint
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    }, [token]);

    // Manual refresh function
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([fetchProducts(), fetchStats()]);
            setSuccess('Data refreshed successfully');
        } catch (err) {
            setError('Failed to refresh data');
        } finally {
            setIsRefreshing(false);
        }
    }, [fetchProducts, fetchStats]);

    // Initialize data with polling instead of SSE
    useEffect(() => {
        fetchProducts();
        fetchStats();

        // Remove polling interval for real-time updates
        // refreshIntervalRef.current = setInterval(() => {
        //     fetchProducts();
        //     fetchStats();
        // }, 30000);

        // Cleanup on unmount
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [fetchProducts, fetchStats]);

    // Handle status change
    const handleStatusChange = async (productId, newStatus) => {
        // Remove optimistic local update; only update after backend confirms
        setFormError('');
        setFormSuccess('');
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ approved: newStatus === 'approved' })
            });

            if (!response.ok) {
                throw new Error('Failed to update product status');
            }

            setSuccess(`Product status updated to ${newStatus}`);
            // Always refresh products and stats after status change
            await fetchProducts();
            await fetchStats();
            if (onProductRemoved) onProductRemoved();

        } catch (err) {
            setError('Failed to update product status');
        }
    };

    // Handle product deletion
    const handleDeleteProduct = async () => {
        if (!deletingProduct || !deleteReason.trim()) return;

        try {
            const response = await fetch(`http://localhost:5000/api/products/${deletingProduct._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ reason: deleteReason })
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setProducts(prev => prev.filter(product => product._id !== deletingProduct._id));
            setShowDeleteModal(false);
            setDeleteReason('');
            setDeletingProduct(null);
            setSuccess('Product deleted successfully');

            // Always refresh products and stats after deletion
            await fetchProducts();
            await fetchStats();
            if (onProductRemoved) onProductRemoved();

        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Failed to delete product');
        }
    };

    // Bulk actions
    const handleBulkAction = async (action) => {
        if (bulkActions.length === 0) return;

        try {
            const promises = bulkActions.map(productId => {
                if (action === 'approve') {
                    return fetch(`http://localhost:5000/api/products/${productId}/approve`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ approved: true })
                    });
                } else if (action === 'unapprove') {
                    return fetch(`http://localhost:5000/api/products/${productId}/approve`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ approved: false })
                    });
                }
                return null;
            });

            await Promise.all(promises.filter(Boolean));
            setSuccess(`Bulk ${action} completed successfully`);
            setBulkActions([]);
            setShowBulkActions(false);
            // Always refresh products and stats after bulk action
            await fetchProducts();
            await fetchStats();
            if (onProductRemoved) onProductRemoved();

        } catch (err) {
            setError(`Bulk ${action} failed`);
        }
    };

    // Add product handler (use ProductForm component)
    const handleProductAdded = async () => {
        setShowProductForm(false);
        await fetchProducts();
        await fetchStats();
    };

    // Edit product submit handler (keep modal, match ProductForm validation/UI)
    const handleProductEditSubmit = async (form, previewUrls) => {
        setFormSubmitting(true);
        setFormError('');
        setFormSuccess('');
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('category', form.category);
            formData.append('pricePerDay', form.pricePerDay);
            formData.append('availableFrom', form.availableFrom);
            if (form.availableTo) formData.append('availableTo', form.availableTo);
            if (form.images && form.images.length > 0) {
                form.images.forEach(img => formData.append('images', img));
            }
            if (form.termsAccepted !== undefined) formData.append('termsAccepted', form.termsAccepted);
            if (form.approved !== undefined) formData.append('approved', form.approved);
            const res = await fetch(`http://localhost:5000/api/products/${editProduct._id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed to update product');
            setFormSuccess('Product updated successfully!');
            setShowProductForm(false);
            setEditProduct(null);
            await fetchProducts();
            await fetchStats();
        } catch (err) {
            setFormError(err.message || 'Failed to save product');
        } finally {
            setFormSubmitting(false);
        }
    };

    // Filter and sort products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        // const matchesCategory = !filterCategory || product.category === filterCategory; // Removed as per edit hint
        // const matchesStatus = !filterStatus || // Removed as per edit hint
        //     (filterStatus === 'approved' && product.approved) ||
        //     (filterStatus === 'pending' && !product.approved);
        return matchesSearch; // && matchesCategory && matchesStatus; // Removed as per edit hint
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
            case 'title':
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
                break;
            case 'price':
                aValue = parseFloat(a.pricePerDay);
                bValue = parseFloat(b.pricePerDay);
                break;
            case 'createdAt':
                aValue = new Date(a.createdAt);
                bValue = new Date(b.createdAt);
                break;
            default:
                aValue = a[sortBy];
                bValue = b[sortBy];
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // const categories = [...new Set(products.map(product => product.category))]; // Removed as per edit hint

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="remove-items-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="remove-items-container">
            {/* Header Section */}
            <div className="remove-items-header">
                <div className="header-content">
                    <div className="header-title">
                        <h2>Product Management</h2>
                        <p>Manage product approvals, status, and removals</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="add-btn"
                            onClick={() => { setShowProductForm(true); setEditProduct(null); }}
                        >
                            + Add Product
                        </button>
                        <button
                            className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <span className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`}>↻</span>
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics Dashboard */}
            {/* <div className="stats-dashboard">
                <div className="stat-card total">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <h3>{stats.total}</h3>
                        <p>Total Products</p>
                    </div>
                </div>
                <div className="stat-card approved">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>{stats.approved}</h3>
                        <p>Approved</p>
                    </div>
                </div>
                <div className="stat-card pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <h3>{stats.pending}</h3>
                        <p>Pending</p>
                    </div>
                </div>
                <div className="stat-card categories">
                    <div className="stat-icon">🏷️</div>
                    <div className="stat-content">
                        <h3>{stats.categories}</h3>
                        <p>Categories</p>
                    </div>
                </div>
            </div> */}

            {/* Notifications */}
            {error && (
                <div className="notification error">
                    <span className="notification-icon">⚠️</span>
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="notification-close">×</button>
                </div>
            )}

            {success && (
                <div className="notification success">
                    <span className="notification-icon">✅</span>
                    <span>{success}</span>
                    <button onClick={() => setSuccess(null)} className="notification-close">×</button>
                </div>
            )}

            {/* Filters and Controls */}
            <div className="controls-section">
                <div className="filters-row">
                    <div className="search-container">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search products by title, description, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="search-icon">🔍</span>
                        </div>
                    </div>

                    <div className="filter-controls">
                        {/* Remove category and status filter dropdowns, keep only sort dropdown */}
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="filter-select"
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="title-asc">Title A-Z</option>
                            <option value="title-desc">Title Z-A</option>
                            <option value="price-asc">Price Low-High</option>
                            <option value="price-desc">Price High-Low</option>
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                {showBulkActions && bulkActions.length > 0 && (
                    <div className="bulk-actions">
                        <span className="bulk-count">{bulkActions.length} items selected</span>
                        <div className="bulk-buttons">
                            <button
                                className="bulk-btn approve"
                                onClick={() => handleBulkAction('approve')}
                            >
                                ✅ Approve All
                            </button>
                            <button
                                className="bulk-btn unapprove"
                                onClick={() => handleBulkAction('unapprove')}
                            >
                                ⏸️ Unapprove All
                            </button>
                            <button
                                className="bulk-btn clear"
                                onClick={() => {
                                    setBulkActions([]);
                                    setShowBulkActions(false);
                                }}
                            >
                                ✕ Clear Selection
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Products Grid */}
            <div className="products-section">
                {/* Show warning and reload button if no products */}
                {!loading && products.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No products found</h3>
                        <p>
                            There are no products in the database.<br />
                            <button onClick={handleRefresh} className="refresh-btn">Reload</button>
                        </p>
                    </div>
                )}
                {/* Existing paginated products grid */}
                {paginatedProducts.length > 0 && (
                    <div className="products-grid">
                        {paginatedProducts.map(product => (
                            <div key={product._id} className="product-card">
                                <div className="product-header">
                                    <div className="product-image-container">
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="product-image"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="no-image">
                                                <span>📷</span>
                                            </div>
                                        )}
                                        <div className={`status-badge ${product.approved ? 'approved' : 'pending'}`}>
                                            {product.approved ? 'Approved' : 'Pending'}
                                        </div>
                                    </div>
                                    <div className="product-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={bulkActions.includes(product._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setBulkActions(prev => [...prev, product._id]);
                                                    setShowBulkActions(true);
                                                } else {
                                                    setBulkActions(prev => prev.filter(id => id !== product._id));
                                                    if (bulkActions.length === 1) {
                                                        setShowBulkActions(false);
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="product-content">
                                    <h3 className="product-title">{product.title}</h3>
                                    <p className="product-category">{product.category}</p>
                                    <p className="product-price">{formatPrice(product.pricePerDay)}/day</p>
                                    <p className="product-description">
                                        {product.description.length > 80
                                            ? `${product.description.substring(0, 80)}...`
                                            : product.description
                                        }
                                    </p>
                                    <div className="product-meta">
                                        <span className="meta-item">
                                            <span className="meta-icon">📅</span>
                                            {formatDate(product.createdAt)}
                                        </span>
                                        {product.availableFrom && (
                                            <span className="meta-item">
                                                <span className="meta-icon">📆</span>
                                                From: {formatDate(product.availableFrom)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="product-actions">
                                    <div className="action-group">
                                        <select
                                            value={product.approved ? 'approved' : 'pending'}
                                            onChange={e => handleStatusChange(product._id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="approved">Approved</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                    <div className="action-group">
                                        <button
                                            className="action-btn view"
                                            onClick={() => setSelectedProduct(product)}
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className="action-btn edit"
                                            onClick={() => { setShowProductForm(true); setEditProduct(product); }}
                                            title="Edit Product"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => {
                                                setDeletingProduct(product);
                                                setShowDeleteModal(true);
                                            }}
                                            title="Delete Product"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            ← Previous
                        </button>
                        <div className="pagination-pages">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Product Details Modal */}
            {selectedProduct && (
                <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="modal-content product-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedProduct.title}</h3>
                            <button
                                className="modal-close"
                                onClick={() => setSelectedProduct(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="product-images">
                                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                    <div className="image-gallery">
                                        {selectedProduct.images.map((image, index) => (
                                            <div key={index} className="gallery-item">
                                                <img
                                                    src={image}
                                                    alt={`${selectedProduct.title} ${index + 1}`}
                                                    className="gallery-image"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-images">
                                        <span>📷</span>
                                        <p>No Images Available</p>
                                    </div>
                                )}
                            </div>

                            <div className="product-details">
                                <div className="detail-row">
                                    <span className="detail-label">Category:</span>
                                    <span className="detail-value">{selectedProduct.category}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Price:</span>
                                    <span className="detail-value price">{formatPrice(selectedProduct.pricePerDay)}/day</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Status:</span>
                                    <span className={`detail-value status ${selectedProduct.approved ? 'approved' : 'pending'}`}>
                                        {selectedProduct.approved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Available From:</span>
                                    <span className="detail-value">{formatDate(selectedProduct.availableFrom)}</span>
                                </div>
                                {selectedProduct.availableTo && (
                                    <div className="detail-row">
                                        <span className="detail-label">Available To:</span>
                                        <span className="detail-value">{formatDate(selectedProduct.availableTo)}</span>
                                    </div>
                                )}
                                <div className="detail-row">
                                    <span className="detail-label">Created:</span>
                                    <span className="detail-value">{formatDate(selectedProduct.createdAt)}</span>
                                </div>
                                <div className="detail-section">
                                    <span className="detail-label">Description:</span>
                                    <p className="detail-description">{selectedProduct.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="modal-btn secondary"
                                onClick={() => setSelectedProduct(null)}
                            >
                                Close
                            </button>
                            <button
                                className="modal-btn primary"
                                onClick={() => {
                                    handleStatusChange(selectedProduct._id, selectedProduct.approved ? 'pending' : 'approved');
                                    setSelectedProduct(null);
                                }}
                            >
                                {selectedProduct.approved ? 'Unapprove' : 'Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deletingProduct && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="delete-warning">
                                <span className="warning-icon">⚠️</span>
                                <h4>Are you sure you want to delete this product?</h4>
                                <p className="product-name">"{deletingProduct.title}"</p>
                                <p className="warning-text">This action cannot be undone and will permanently remove the product from the system.</p>
                            </div>

                            <div className="delete-reason">
                                <label htmlFor="delete-reason">Reason for deletion:</label>
                                <textarea
                                    id="delete-reason"
                                    value={deleteReason}
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                    placeholder="Please provide a reason for deletion..."
                                    rows="4"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="modal-btn secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn danger"
                                onClick={handleDeleteProduct}
                                disabled={!deleteReason.trim()}
                            >
                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ProductForm for add/edit */}
            {showProductForm && !editProduct && (
                <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
                    <div className="modal-content product-modal" onClick={e => e.stopPropagation()}>
                        <ProductForm onProductAdded={handleProductAdded} />
                    </div>
                </div>
            )}
            {/* ProductFormModal for edit */}
            {showProductForm && editProduct && (
                <ProductFormModal
                    open={showProductForm}
                    onClose={() => { setShowProductForm(false); setEditProduct(null); setFormError(''); setFormSuccess(''); }}
                    onSubmit={handleProductEditSubmit}
                    initialData={editProduct}
                    isSubmitting={formSubmitting}
                    error={formError}
                    success={formSuccess}
                />
            )}
        </div>
    );
};

export default RemoveItems;
