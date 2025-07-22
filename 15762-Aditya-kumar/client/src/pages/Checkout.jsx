import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ProductDetailsStyle.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MAX_RECEIPT_SIZE_MB = 5;

const Checkout = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        transactionId: '',
        paymentScreenshot: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState('success'); // 'success' or 'error'
    const popupTimeoutRef = useRef(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [unavailableRanges, setUnavailableRanges] = useState([]);
    const [calculatedTotal, setCalculatedTotal] = useState(0);


    useEffect(() => {
        // Fetch product details
        fetch(`http://localhost:5000/api/products/${productId}`)
            .then(res => res.json())
            .then(data => setProduct(data));
        // Fetch user info from backend
        const token = localStorage.getItem('borrowbuddy-token');
        if (token) {
            fetch('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.ok ? res.json() : null)
                .then(user => {
                    if (user) {
                        setForm(f => ({
                            ...f,
                            name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            address: user.address || '',
                        }));
                    } else {
                        // fallback to localStorage if backend fails
                        const localUser = JSON.parse(localStorage.getItem('user'));
                        if (localUser) {
                            setForm(f => ({
                                ...f,
                                name: localUser.name || '',
                                email: localUser.email || '',
                                phone: localUser.phone || '',
                            }));
                        }
                    }
                })
                .catch(() => {
                    const localUser = JSON.parse(localStorage.getItem('user'));
                    if (localUser) {
                        setForm(f => ({
                            ...f,
                            name: localUser.name || '',
                            email: localUser.email || '',
                            phone: localUser.phone || '',
                        }));
                    }
                });
        } else {
            const localUser = JSON.parse(localStorage.getItem('user'));
            if (localUser) {
                setForm(f => ({
                    ...f,
                    name: localUser.name || '',
                    email: localUser.email || '',
                    phone: localUser.phone || '',
                }));
            }
        }
        // Fetch unavailable dates for this product
        if (productId) {
            fetch(`http://localhost:5000/api/bookings/product/${productId}/unavailable`)
                .then(res => res.json())
                .then(data => {
                    setUnavailableRanges(data.unavailable || []);
                });
        }
    }, [productId]);

    useEffect(() => {
        if (product && startDate && endDate) {
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            setCalculatedTotal(days * product.pricePerDay);
        } else {
            setCalculatedTotal(0);
        }
    }, [startDate, endDate, product]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'phone') {
            // Only allow numbers and max 10 digits
            const numeric = value.replace(/[^\d]/g, '').slice(0, 10);
            setForm(f => ({ ...f, phone: numeric }));
            validate('phone', numeric);
            return;
        }
        if (name === 'paymentScreenshot') {
            const file = files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    setErrors(errs => ({ ...errs, paymentScreenshot: 'Only image files are allowed' }));
                    setForm(f => ({ ...f, paymentScreenshot: null }));
                    setReceiptPreview(null);
                    return;
                }
                if (file.size > MAX_RECEIPT_SIZE_MB * 1024 * 1024) {
                    setErrors(errs => ({ ...errs, paymentScreenshot: 'File size must be less than 5MB' }));
                    setForm(f => ({ ...f, paymentScreenshot: null }));
                    setReceiptPreview(null);
                    return;
                }
                setErrors(errs => ({ ...errs, paymentScreenshot: '' }));
                setForm(f => ({ ...f, paymentScreenshot: file }));
                setReceiptPreview(URL.createObjectURL(file));
            } else {
                setForm(f => ({ ...f, paymentScreenshot: null }));
                setReceiptPreview(null);
            }
            return;
        }
        setForm(f => ({
            ...f,
            [name]: files ? files[0] : value,
        }));
        validate(name, value);
    };

    // Enhanced validate function to accept dateRange override
    const validate = (field, valueOverride, dateRangeOverride) => {
        const errs = { ...errors };
        const val = valueOverride !== undefined ? valueOverride : form[field];
        const [validateStart, validateEnd] = dateRangeOverride || dateRange;
        if (!form.name.trim() || field === 'name') {
            if (!form.name.trim()) errs.name = 'Name is required';
            else if (!/^[A-Za-z ]{3,}$/.test(form.name)) errs.name = 'Name must be at least 3 alphabets, no numbers or special characters';
            else delete errs.name;
        }
        if (!form.email.trim() || field === 'email') {
            if (!form.email.trim()) errs.email = 'Email is required';
            else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
            else delete errs.email;
        }
        if (!form.phone.trim() || field === 'phone') {
            if (!val || !val.trim()) errs.phone = 'Phone is required';
            else if (!/^\d{10}$/.test(val)) errs.phone = 'Phone must be 10 digits';
            else delete errs.phone;
        }
        if (!form.address.trim() || field === 'address') {
            if (!form.address.trim()) errs.address = 'Address is required';
            else delete errs.address;
        }
        if (!form.transactionId.trim() || field === 'transactionId') {
            if (!form.transactionId.trim()) errs.transactionId = 'Transaction/Reference Number is required';
            else delete errs.transactionId;
        }
        if (!validateStart || !validateEnd) {
            errs.date = 'Please select a valid rental period.';
        } else {
            delete errs.date;
        }
        if ((!form.paymentScreenshot && !receiptPreview) || field === 'paymentScreenshot') {
            if (!form.paymentScreenshot && !receiptPreview) errs.paymentScreenshot = 'Payment screenshot is required';
            else delete errs.paymentScreenshot;
        }
        setErrors(errs);
        return errs;
    };

    const isDateUnavailable = (date) => {
        return unavailableRanges.some(range => {
            const rangeStart = new Date(range.startDate);
            const rangeEnd = new Date(range.endDate);
            return date >= rangeStart && date <= rangeEnd;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Always validate with latest dateRange
        const errs = validate(undefined, undefined, dateRange);
        setErrors(errs);
        if (Object.keys(errs).some(key => errs[key])) {
            setIsSubmitting(false);
            setPopupType('error');
            setSubmitMessage('Please fix the errors above.');
            setShowPopup(true);
            clearTimeout(popupTimeoutRef.current);
            popupTimeoutRef.current = setTimeout(() => setShowPopup(false), 2500);
            return;
        }
        if (!startDate || !endDate) {
            setErrors(errs => ({ ...errs, date: 'Please select a valid rental period.' }));
            setIsSubmitting(false);
            setPopupType('error');
            setSubmitMessage('Please select a valid rental period.');
            setShowPopup(true);
            clearTimeout(popupTimeoutRef.current);
            popupTimeoutRef.current = setTimeout(() => setShowPopup(false), 2500);
            return;
        }
        setIsSubmitting(true);
        setSubmitMessage('');
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('address', form.address);
            formData.append('phone', form.phone);
            formData.append('transactionId', form.transactionId);
            formData.append('productId', product._id);
            formData.append('startDate', startDate.toISOString());
            formData.append('endDate', endDate.toISOString());
            formData.append('totalDays', Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
            formData.append('totalAmount', calculatedTotal);
            if (form.paymentScreenshot) {
                formData.append('paymentScreenshot', form.paymentScreenshot);
            }
            const res = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('borrowbuddy-token')}`
                },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Booking failed');
            setSubmitMessage('Booking request submitted! Your payment will be verified by admin. You will be notified once approved.');
            setPopupType('success');
            setShowPopup(true);
            setForm({
                name: '', email: '', address: '', phone: '', transactionId: '', paymentScreenshot: null,
            });
            setReceiptPreview(null);
            setDateRange([null, null]); // Reset date picker
            clearTimeout(popupTimeoutRef.current);
            popupTimeoutRef.current = setTimeout(() => {
                setShowPopup(false);
                navigate('/');
            }, 2500);
        } catch (err) {
            setSubmitMessage(err.message || 'Failed to submit booking!');
            setPopupType('error');
            setShowPopup(true);
            clearTimeout(popupTimeoutRef.current);
            popupTimeoutRef.current = setTimeout(() => setShowPopup(false), 2500);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            {isSubmitting && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                    <div style={{ color: '#fff', marginTop: 16, fontWeight: 500 }}>Submitting booking...</div>
                </div>
            )}
            {showPopup && (
                <div className={`popup-overlay ${popupType}`}>
                    <div className="popup-box">
                        <span className="popup-icon">{popupType === 'success' ? '✅' : '❌'}</span>
                        <div className="popup-message">{submitMessage}</div>
                        <button className="popup-close-btn" onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                </div>
            )}
            <div className="product-details-page">
                <div className="product-info" style={{ maxWidth: 500, margin: '0 auto' }}>
                    <h2>Checkout</h2>
                    <div className="checkout-product-box" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                        <img src={product.images?.[0] || '/images/placeholder.png'} alt="product" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                        <div>
                            <h4 style={{ margin: 0 }}>{product.title}</h4>
                            <p style={{ margin: 0 }}>{product.category}</p>
                            <p style={{ margin: 0, fontWeight: 600 }}>₹{product.pricePerDay}/day</p>
                        </div>
                    </div>
                    <form className="enquiry-form" onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Show all errors at the top if any */}
                        {Object.values(errors).length > 0 && (
                            <div className="form-errors" style={{ color: 'red', marginBottom: 12 }}>
                                {Object.entries(errors).map(([key, val]) => val && <div key={key}>{val}</div>)}
                            </div>
                        )}
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name *"
                                value={form.name}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email *"
                                value={form.email}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.email && <div className="error-message">{errors.email}</div>}
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number *"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                inputMode="numeric"
                                pattern="\d{10}"
                                maxLength={10}
                            />
                            {errors.phone && <div className="error-message">{errors.phone}</div>}
                        </div>
                        <div className="form-group">
                            <textarea
                                name="address"
                                rows={3}
                                placeholder="Delivery Address *"
                                value={form.address}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.address && <div className="error-message">{errors.address}</div>}
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 500 }}>Select Rental Period *</label>
                            <DatePicker
                                selectsRange
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    const newRange = Array.isArray(update) ? update : [null, null];
                                    setDateRange(newRange);
                                    // Immediately validate date field
                                    validate('date', undefined, newRange);
                                }}
                                minDate={product?.availableFrom ? new Date(product.availableFrom) : new Date()}
                                maxDate={product?.availableTo ? new Date(product.availableTo) : null}
                                excludeDateIntervals={unavailableRanges.map(range => ({
                                    start: new Date(range.startDate),
                                    end: new Date(range.endDate)
                                }))}
                                inline
                                filterDate={date => !isDateUnavailable(date)}
                                disabled={isSubmitting}
                            />
                            {errors.date && <div className="error-message">{errors.date}</div>}
                        </div>
                        <div className="form-group">
                            <label>Total Price:</label>
                            <div style={{ fontWeight: 600, fontSize: 18 }}>₹{calculatedTotal || 0}</div>
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 500 }}>Scan & Pay</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0' }}>
                                <img src={`https://res.cloudinary.com/du9m9w2rt/image/upload/v1751948904/Screenshot_2025-07-08_at_9.36.16_AM_gsu6rx.png`} alt="QR Code" style={{ width: 120, height: 120, borderRadius: 8, border: '1px solid #eee' }} />
                                <span style={{ fontSize: 14 }}>Scan this QR code to pay the rental amount.<br />After payment, enter the transaction/reference number and upload the payment screenshot below.</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="transactionId"
                                placeholder="Transaction/Reference Number *"
                                value={form.transactionId}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.transactionId && <div className="error-message">{errors.transactionId}</div>}
                        </div>
                        <div className="form-group">
                            <input
                                type="file"
                                name="paymentScreenshot"
                                accept="image/*"
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.paymentScreenshot && <div className="error-message">{errors.paymentScreenshot}</div>}
                            {receiptPreview && (
                                <div style={{ marginTop: 8 }}>
                                    <img src={receiptPreview} alt="Receipt Preview" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8, border: '1px solid #eee' }} />
                                </div>
                            )}
                        </div>
                        {submitMessage && (
                            <div className={`submit-message ${submitMessage.includes('submitted') ? 'success' : 'error'}`}>{submitMessage}</div>
                        )}
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
