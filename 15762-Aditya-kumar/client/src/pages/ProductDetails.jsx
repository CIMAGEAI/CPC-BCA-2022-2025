import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProductDetailsStyle.css';
import Navbar from '../components/Navbar';
import BreadcrumbNavbar from '../components/BreadcrumbNavbar';
import Footer from '../components/Footer';

const ProductDetails = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoom, setZoom] = useState(false);
    const [enquiry, setEnquiry] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [enquiryErrors, setEnquiryErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${productId}`)
            .then(res => res.json())
            .then(data => setProduct(data));
    }, [productId]);

    if (!product) return <div>Loading...</div>;

    const images = Array.isArray(product.images) ? product.images : [];
    const handlePrev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    const handleNext = () => setCurrentIndex((currentIndex + 1) % images.length);

    // Remove handleRentNow booking logic, replace with navigation
    const handleRentNow = () => {
        navigate(`/checkout/${productId}`);
    };

    // Real-time validation for enquiry form
    const validateEnquiry = (field, value) => {
        let errors = { ...enquiryErrors };
        if (field === 'name' || field === undefined) {
            if (!enquiry.name.trim()) delete errors.name;
            else if (!/^[A-Za-z ]{3,}$/.test(enquiry.name)) errors.name = 'Name must be at least 3 alphabets, no numbers or special characters';
            else delete errors.name;
        }
        if (field === 'email' || field === undefined) {
            if (!enquiry.email.trim()) delete errors.email;
            else if (!/^\S+@\S+\.\S+$/.test(enquiry.email)) errors.email = 'Invalid email';
            else delete errors.email;
        }
        if (field === 'message' || field === undefined) {
            if (!enquiry.message.trim()) delete errors.message;
            else delete errors.message;
        }
        setEnquiryErrors(errors);
        return errors;
    };

    const handleEnquiryChange = (e) => {
        const { name, value } = e.target;
        setEnquiry(prev => ({ ...prev, [name]: value }));
        validateEnquiry(name, value);
    };

    const handleSubmitEnquiry = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        const errors = validateEnquiry();
        if (Object.keys(errors).length > 0) {
            setIsSubmitting(false);
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/enquiries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...enquiry,
                    productId: product._id,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Enquiry submission failed');
            setSubmitMessage('Enquiry submitted successfully! We will get back to you soon.');
            setEnquiry({ name: '', email: '', message: '' });
            setEnquiryErrors({});
        } catch (err) {
            setSubmitMessage(err.message || 'Failed to submit enquiry!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <BreadcrumbNavbar />
            <div className="product-details-page">
                {/* Image Slider */}
                <div className="product-image-slider">
                    <div
                        className={`main-image-container ${zoom ? 'zoomed' : ''}`}
                        onMouseEnter={() => setZoom(true)}
                        onMouseLeave={() => setZoom(false)}
                    >
                        <img src={images[currentIndex] || '/images/placeholder.png'} alt="product" />
                    </div>
                    {images.length > 1 && (
                        <div className="carousel-controls">
                            <button onClick={handlePrev}>⟨</button>
                            <button onClick={handleNext}>⟩</button>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <h2>{product.title}</h2>
                    <p className="category">{product.category}</p>
                    <p className="price">₹{product.pricePerDay}/day</p>
                    <p className="desc">{product.description}</p>
                    <div className="action-buttons">
                        <button className="rent-btn" onClick={handleRentNow}>Rent Now</button>
                        <button className="wishlist-btn">Add to Wishlist ❤️</button>
                    </div>
                </div>

                {/* Enquiry Form */}
                <div className="enquiry-section">
                    <h3>Enquire About This Product</h3>
                    <p className="enquiry-description">
                        Have questions about this product? Send us an enquiry and we'll get back to you within 24 hours.
                    </p>

                    <form onSubmit={handleSubmitEnquiry} className="enquiry-form">
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name *"
                                value={enquiry.name}
                                onChange={handleEnquiryChange}
                                required
                                disabled={isSubmitting}
                            />
                            {enquiryErrors.name && <div className="error-message">{enquiryErrors.name}</div>}
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email *"
                                value={enquiry.email}
                                onChange={handleEnquiryChange}
                                required
                                disabled={isSubmitting}
                            />
                            {enquiryErrors.email && <div className="error-message">{enquiryErrors.email}</div>}
                        </div>
                        <div className="form-group">
                            <textarea
                                name="message"
                                rows={4}
                                placeholder="Your Message * (Tell us what you'd like to know about this product)"
                                value={enquiry.message}
                                onChange={handleEnquiryChange}
                                required
                                disabled={isSubmitting}
                            />
                            {enquiryErrors.message && <div className="error-message">{enquiryErrors.message}</div>}
                        </div>

                        {submitMessage && (
                            <div className={`submit-message ${submitMessage.includes('successfully') ? 'success' : 'error'}`}>
                                {submitMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                        </button>
                    </form>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h3>User Reviews</h3>
                    {(product.reviews || []).length > 0 ? (
                        product.reviews.map((r, idx) => (
                            <div key={idx} className="review-box">
                                <strong>{r.user}</strong>
                                <p>{r.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>

                {/* Similar Products */}
                <div className="similar-products">
                    <h3>Similar Products</h3>
                    <div className="similar-grid">
                        {/* Simulated items */}
                        {[1, 2, 3].map(i => (
                            <div className="product-card" key={i}>
                                <img src={images[0] || '/images/placeholder.png'} alt={`Product ${i}`} />
                                <h4>{product.title}</h4>
                                <p>₹{product.pricePerDay}/day</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
};

export default ProductDetails;
