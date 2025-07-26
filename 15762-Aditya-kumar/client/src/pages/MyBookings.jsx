import React, { useEffect, useState } from 'react';
import '../styles/MyBookings.css';
import { FaBoxOpen, FaSyncAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('borrowbuddy-token');
    const [cancellingId, setCancellingId] = useState(null);
    const [cancelMsg, setCancelMsg] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelTargetId, setCancelTargetId] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:5000/api/bookings/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch bookings');
            const data = await res.json();
            setBookings(data);
        } catch (err) {
            setError('Could not load your bookings.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBookings();
        // eslint-disable-next-line
    }, [token]);

    const handleCancelRequest = (booking) => {
        if (booking.status !== 'pending') {
            toast.error('Cancellation is only allowed for pending bookings.');
            return;
        }
        setCancelTargetId(booking._id);
        setCancelReason('');
        setShowCancelModal(true);
    };

    const submitCancelRequest = async () => {
        if (!cancelReason.trim()) {
            toast.error('Please provide a reason for cancellation.');
            return;
        }
        setCancellingId(cancelTargetId);
        setCancelMsg('');
        try {
            const res = await fetch(`http://localhost:5000/api/bookings/${cancelTargetId}/request-cancellation`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ customerNotes: cancelReason })
            });
            if (!res.ok) throw new Error('Failed to request cancellation');
            toast.success('Cancellation request sent! Admin will review and process your refund.');
            setBookings(prev => prev.map(b => b._id === cancelTargetId ? { ...b, status: 'cancellation_requested', customerNotes: cancelReason } : b));
            setShowCancelModal(false);
        } catch (err) {
            toast.error('Failed to send cancellation request.');
        } finally {
            setCancellingId(null);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchBookings();
    };

    if (loading) return <div className="mybookings-loading"><div className="spinner"></div>Loading your bookings...</div>;
    if (error) return <div className="mybookings-error">{error}</div>;

    return (
        <>
            <Navbar/>
            <div className="mybookings-container">
                <ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
                <div className="mybookings-header-row">
                    <h2>My Bookings</h2>
                    <button className="mybookings-refresh-btn" onClick={handleRefresh} disabled={refreshing || loading} title="Refresh">
                        <FaSyncAlt className={refreshing ? 'spin' : ''} />
                    </button>
                </div>
                {cancelMsg && <div className="mybookings-cancel-msg">{cancelMsg}</div>}
                {bookings.length === 0 ? (
                    <div className="mybookings-empty-card">
                        <FaBoxOpen size={48} color="#e76f51" style={{ marginBottom: 12 }} />
                        <div className="mybookings-empty-title">No Bookings Yet</div>
                        <div className="mybookings-empty-desc">You have not booked any product. Start exploring and book your first item!</div>
                    </div>
                ) : (
                    <div className="mybookings-list">
                        {bookings.map(booking => (
                            <div className="mybookings-card pro-ui" key={booking._id}>
                                <div className="mybookings-img-col">
                                    <img src={booking.product?.images?.[0] || '/images/placeholder.png'} alt={booking.product?.title} className="mybookings-img" />
                                </div>
                                <div className="mybookings-info-col">
                                    <div className="mybookings-row">
                                        <h3 className="mybookings-title">{booking.product?.title}</h3>
                                        <span className={`status-badge status-${booking.status}`}>{booking.status.replace('_', ' ')}</span>
                                    </div>
                                    <div className="mybookings-details">
                                        <div><strong>Booking ID:</strong> {booking._id.slice(-8).toUpperCase()}</div>
                                        <div><strong>From:</strong> {new Date(booking.startDate).toLocaleDateString()} <strong>To:</strong> {new Date(booking.endDate).toLocaleDateString()}</div>
                                        <div><strong>Total:</strong> ₹{booking.totalAmount}</div>
                                    </div>
                                    {booking.customerNotes && booking.status === 'cancellation_requested' && (
                                        <div className="mybookings-cancel-reason"><strong>Reason:</strong> {booking.customerNotes}</div>
                                    )}
                                    {booking.status === 'cancelled' && (
                                        <div className="mybookings-refund-info">Refund initiated. Money will be reflected in your bank account in next 7 working days.</div>
                                    )}
                                    <div className="mybookings-actions">
                                        {booking.status === 'pending' && (
                                            <button
                                                className="mybookings-cancel-btn"
                                                onClick={() => handleCancelRequest(booking)}
                                                disabled={cancellingId === booking._id}
                                            >
                                                {cancellingId === booking._id ? 'Requesting...' : 'Request Cancellation'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Cancel Modal */}
                {showCancelModal && (
                    <div className="mybookings-modal-overlay" onClick={() => setShowCancelModal(false)}>
                        <div className="mybookings-modal" onClick={e => e.stopPropagation()}>
                            <h3>Request Cancellation</h3>
                            <textarea
                                className="mybookings-modal-textarea"
                                placeholder="Please provide a reason for cancellation..."
                                value={cancelReason}
                                onChange={e => setCancelReason(e.target.value)}
                                rows={4}
                            />
                            <div className="mybookings-modal-actions">
                                <button className="mybookings-cancel-btn" onClick={submitCancelRequest} disabled={cancellingId === cancelTargetId}>
                                    {cancellingId === cancelTargetId ? 'Requesting...' : 'Submit Request'}
                                </button>
                                <button className="mybookings-modal-close" onClick={() => setShowCancelModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default MyBookings; 