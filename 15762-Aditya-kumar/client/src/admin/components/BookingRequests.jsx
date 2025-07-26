import React, { useEffect, useState, useRef, useCallback } from 'react';
import './ActiveRentals.css';

const BookingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState(null);
    const [actionMsg, setActionMsg] = useState('');
    const [popupType, setPopupType] = useState('success'); // 'success' or 'error'
    const [statusLoading, setStatusLoading] = useState(false); // loader for status change
    const popupTimeoutRef = useRef(null);
    const token = localStorage.getItem('borrowbuddy-token');
    const [imageModal, setImageModal] = useState({ open: false, src: '' });

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:5000/api/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch booking requests');
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            setError('Failed to load booking requests');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleApprove = async (id) => {
        setActionMsg('');
        setStatusLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'confirmed', adminNotes: 'Payment verified. Product lent.' })
            });
            if (!res.ok) throw new Error('Failed to approve booking');
            setPopupType('success');
            setActionMsg('Booking approved and product lent!');
            // Fetch updated booking and update selected
            const updated = await fetch(`http://localhost:5000/api/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => r.json());
            setSelected(updated);
            fetchRequests();
        } catch (err) {
            setPopupType('error');
            setActionMsg('Failed to approve booking');
        } finally {
            setStatusLoading(false);
            clearTimeout(popupTimeoutRef.current);
            popupTimeoutRef.current = setTimeout(() => setActionMsg(''), 2000);
        }
    };

    const handleReject = async (id) => {
        setActionMsg('');
        setStatusLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'cancelled', adminNotes: 'Payment not verified. Booking rejected.' })
            });
            if (!res.ok) throw new Error('Failed to reject booking');
            setPopupType('success');
            setActionMsg('Booking rejected.');
            // Fetch updated booking and update selected
            const updated = await fetch(`http://localhost:5000/api/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => r.json());
            setSelected(updated);
            fetchRequests();
        } catch (err) {
            setPopupType('error');
            setActionMsg('Failed to reject booking');
        } finally {
            setStatusLoading(false);
            clearTimeout(popupTimeoutRef.current);
            popupTimeoutRef.current = setTimeout(() => setActionMsg(''), 2000);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        setActionMsg('');
        setStatusLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('Failed to update status');
            setPopupType('success');
            setActionMsg('Status updated!');
            // Fetch updated booking and update selected
            const updated = await fetch(`http://localhost:5000/api/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => r.json());
            setSelected(updated);
            fetchRequests();
        } catch (err) {
            setPopupType('error');
            setActionMsg('Failed to update status');
        } finally {
            setStatusLoading(false);
            clearTimeout(popupTimeoutRef.current);
            popupTimeoutRef.current = setTimeout(() => setActionMsg(''), 2000);
        }
    };

    if (loading) return <div className="active-rentals"><div className="loading-spinner"><div className="spinner"></div><p>Loading booking requests...</p></div></div>;
    if (error) return <div className="active-rentals"><div className="error-message">{error}</div></div>;

    return (
        <div className="active-rentals">
            <div className="rentals-header">
                <h2>📨 Booking Requests</h2>
                <p>Review and manage all booking requests</p>
            </div>
            {/* Loader overlay for status change */}
            {statusLoading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                    <div style={{ color: '#fff', marginTop: 16, fontWeight: 500 }}>Updating status...</div>
                </div>
            )}
            {/* Popup for success/error */}
            {actionMsg && (
                <div className={`popup-overlay ${popupType}`}>
                    <div className="popup-box">
                        <span className="popup-icon">{popupType === 'success' ? '✅' : '❌'}</span>
                        <div className="popup-message">{actionMsg}</div>
                        <button className="popup-close-btn" onClick={() => setActionMsg('')}>Close</button>
                    </div>
                </div>
            )}
            {/* Fullscreen image modal for payment screenshot */}
            {imageModal.open && (
                <div className="modal-overlay" onClick={() => setImageModal({ open: false, src: '' })}>
                    <div className="modal-content" style={{ maxWidth: '90vw', maxHeight: '90vh', background: 'transparent', boxShadow: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                        <button className="modal-close" style={{ alignSelf: 'flex-end', marginBottom: 8, fontSize: 32, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', padding: '4px 12px' }} onClick={() => setImageModal({ open: false, src: '' })}>×</button>
                        <img src={imageModal.src} alt="Payment Fullscreen" style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }} />
                    </div>
                </div>
            )}
            <div className="rentals-list">
                {requests.length === 0 ? (
                    <div className="no-rentals"><p>No booking requests found</p></div>
                ) : (
                    requests.filter(r => r.status === 'pending' || r.status === 'cancellation_requested').map(r => (
                        <div key={r._id} className={`rental-item ${selected?._id === r._id ? 'selected' : ''}`} onClick={() => setSelected(r)}>
                            <div className="rental-header">
                                <h4>{r.user?.name || 'Unknown User'}</h4>
                                <span className="status-badge" style={{ backgroundColor: r.status === 'pending' ? '#ffc107' : '#e76f51' }}>
                                    {r.status === 'pending' ? '⏳ Pending' : '❗ Cancellation Requested'}
                                </span>
                            </div>
                            <p className="rental-email">{r.user?.email}</p>
                            <p className="rental-product">{r.product?.title}</p>
                            <p className="rental-amount">₹{r.totalAmount}</p>
                        </div>
                    ))
                )}
            </div>
            {selected && (
                <div className="rental-detail">
                    <div className="detail-header">
                        <h3>Booking Request Details</h3>
                        <button className="close-btn" onClick={() => setSelected(null)}>×</button>
                    </div>
                    <div className="detail-content">
                        <div className="detail-section">
                            <h4>Customer Information</h4>
                            <p><strong>Name:</strong> {selected.user?.name}</p>
                            <p><strong>Email:</strong> {selected.user?.email}</p>
                            <p><strong>Phone:</strong> {selected.phone || selected.user?.phone || 'Not provided'}</p>
                            <p><strong>Address:</strong> {selected.address || 'Not provided'}</p>
                        </div>
                        <div className="detail-section">
                            <h4>Product Information</h4>
                            <p><strong>Product:</strong> {selected.product?.title}</p>
                            <p><strong>Category:</strong> {selected.product?.category}</p>
                            <p><strong>Price per Day:</strong> ₹{selected.product?.pricePerDay}</p>
                        </div>
                        <div className="detail-section">
                            <h4>Payment Information</h4>
                            <p><strong>Transaction/Reference Number:</strong> {selected.transactionId || 'Not provided'}</p>
                            {selected.paymentScreenshot && (
                                <div style={{ marginTop: 8 }}>
                                    <strong>Payment Screenshot:</strong><br />
                                    <img
                                        src={selected.paymentScreenshot}
                                        alt="Payment Screenshot"
                                        style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, border: '1px solid #eee', marginTop: 4, cursor: 'zoom-in' }}
                                        onClick={() => setImageModal({ open: true, src: selected.paymentScreenshot })}
                                    />
                                    <div style={{ fontSize: 12, color: '#888' }}>(Click to view full screen)</div>
                                </div>
                            )}
                        </div>
                        {selected.status === 'cancellation_requested' && selected.customerNotes && (
                            <div className="detail-section">
                                <h4>Cancellation Reason</h4>
                                <div className="notes-content">{selected.customerNotes}</div>
                            </div>
                        )}
                        <div className="detail-actions">
                            <div style={{ marginBottom: 16 }}>
                                <label><strong>Status:</strong></label>
                                <select
                                    value={selected.status}
                                    onChange={e => handleStatusChange(selected._id, e.target.value)}
                                    style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 6 }}
                                    disabled={statusLoading}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="cancellation_requested">Cancellation Requested</option>
                                    <option value="confirmed">Confirmed/Lended</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            {selected.status === 'pending' && (
                                <>
                                    <button className="submit-btn" style={{ background: '#28a745', marginRight: 10 }} onClick={() => handleApprove(selected._id)} disabled={statusLoading}>
                                        ✅ Approve & Lend
                                    </button>
                                    <button className="submit-btn" style={{ background: '#dc3545' }} onClick={() => handleReject(selected._id)} disabled={statusLoading}>
                                        ❌ Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingRequests; 