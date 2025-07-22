import React, { useState } from 'react';
import './ProductForm.css';

const ProductForm = ({ onProductAdded }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        pricePerDay: '',
        availableFrom: '',
        availableTo: '',
        termsAccepted: false,
        approved: false,
    });
    const [image, setImage] = useState([]);
    const [errors, setErrors] = useState({});
    const [previewUrls, setPreviewUrls] = useState([]);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const token = localStorage.getItem('borrowbuddy-token');

    // Available categories for the dropdown
    const categories = [
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

    const validate = () => {
        const errs = {};
        if (!form.title || !form.title.trim()) errs.title = 'Title is required';
        else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
        if (!form.description || form.description.trim().length < 10) errs.description = 'Description must be at least 10 characters';
        if (!form.category || !form.category.trim()) errs.category = 'Category is required';
        if (!form.pricePerDay || isNaN(form.pricePerDay) || Number(form.pricePerDay) <= 0) errs.pricePerDay = 'Price must be a positive number';
        if (!form.availableFrom) errs.availableFrom = 'Available from date is required';
        if (form.availableTo) {
            if (form.availableTo < form.availableFrom) errs.availableTo = 'End date must be after start date';
        }
        if (!form.termsAccepted) errs.termsAccepted = 'You must accept the terms';
        if (!image || image.length === 0) errs.images = 'At least one image is required';
        else if (image.length > 5) errs.images = 'Maximum 5 images allowed';
        else {
            for (let img of image) {
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
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setLoading(true);
        const formData = new FormData();
        for (let key in form) formData.append(key, form[key]);
        image.forEach(file => formData.append('images', file));

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Upload failed');
            }

            // Show success popup
            setShowSuccessPopup(true);

            // Reset form
            setForm({ title: '', description: '', category: '', pricePerDay: '', availableFrom: '', availableTo: '', termsAccepted: false, approved: false });
            setImage([]);
            setPreviewUrls([]);
            setErrors({});

            // Clear file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = null;

            // Callback to refresh stats
            if (onProductAdded) {
                onProductAdded();
            }

            // Auto-hide success popup after 4 seconds
            setTimeout(() => setShowSuccessPopup(false), 4000);

        } catch (err) {
            console.error('Upload failed:', err);
            setErrors({ submit: err.message || 'Upload failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = (idx) => {
        const newImages = [...image];
        newImages.splice(idx, 1);
        setImage(newImages);
        const newUrls = previewUrls.filter((_, i) => i !== idx);
        setPreviewUrls(newUrls);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const uniqueFiles = files.filter(file => !image.some(existing => existing.name === file.name && existing.size === file.size));

        if (image.length + uniqueFiles.length > 5) {
            setErrors({ images: 'Maximum 5 images allowed' });
            return;
        }

        setErrors({ images: '' }); // Clear image error
        setImage(prev => [...prev, ...uniqueFiles]);
        const urls = uniqueFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...urls]);
    };

    const closeSuccessPopup = () => {
        setShowSuccessPopup(false);
    };

    return (
        <>
            {loading && (
                <div className="loader-overlay">
                    <div className="spinner"></div>
                    <p>Uploading product...</p>
                </div>
            )}

            {/* Success Notification Popup */}
            {showSuccessPopup && (
                <div className="success-popup-overlay" onClick={closeSuccessPopup}>
                    <div className="success-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22,4 12,14.01 9,11.01"></polyline>
                            </svg>
                        </div>
                        <h3>Product Added Successfully!</h3>
                        <p>Your product has been listed and is now available for rental.</p>
                        <button className="popup-close-btn" onClick={closeSuccessPopup}>
                            Continue
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="product-form">
                <h2>Add New Product</h2>

                {errors.submit && <div className="error-message">{errors.submit}</div>}

                <div className="form-group">
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Product Title *"
                        required
                    />
                    {errors.title && <div className="error-message">{errors.title}</div>}
                </div>
                <div className="form-group">
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Description *"
                        required
                        rows="4"
                    />
                    {errors.description && <div className="error-message">{errors.description}</div>}
                </div>
                <div className="form-group">
                    <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                        className={errors.category ? 'input-error' : ''}
                    >
                        {categories.map((category, index) => (
                            <option key={index} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                    {errors.category && <div className="error-message">{errors.category}</div>}
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        value={form.pricePerDay}
                        onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                        placeholder="Price Per Day *"
                        required
                        min="1"
                    />
                    {errors.pricePerDay && <div className="error-message">{errors.pricePerDay}</div>}
                </div>
                <div className="form-group">
                    <input
                        type="date"
                        value={form.availableFrom}
                        onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                        required
                    />
                    {errors.availableFrom && <div className="error-message">{errors.availableFrom}</div>}
                </div>
                <div className="form-group">
                    <input
                        type="date"
                        value={form.availableTo}
                        onChange={(e) => setForm({ ...form, availableTo: e.target.value })}
                        placeholder="End Date"
                    />
                    {errors.availableTo && <div className="error-message">{errors.availableTo}</div>}
                </div>
                <div className="form-group">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    {errors.images && <div className="error-message">{errors.images}</div>}
                </div>
                <div className="form-group terms">
                    <input
                        type="checkbox"
                        checked={form.termsAccepted}
                        onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })}
                        required
                    />
                    <label>I accept the terms and conditions</label>
                    {errors.termsAccepted && <div className="error-message">{errors.termsAccepted}</div>}
                </div>
                <label className="toggle-wrapper">
                    Approved
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={form.approved}
                            onChange={e => setForm({ ...form, approved: e.target.checked })}
                        />
                        <span className="slider round"></span>
                    </label>
                </label>

                {previewUrls.length > 0 && (
                    <div className="image-preview-container">
                        {previewUrls.map((src, idx) => (
                            <div className="preview-wrapper" key={idx}>
                                <img src={src} alt={`preview-${idx}`} className="preview-img" />
                                <button type="button" className="remove-btn" onClick={() => handleRemoveImage(idx)}>❌</button>
                            </div>
                        ))}
                    </div>
                )}

                <button type="submit" className="btn-upload" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Product'}
                </button>
            </form>
        </>
    );
};

export default ProductForm;
