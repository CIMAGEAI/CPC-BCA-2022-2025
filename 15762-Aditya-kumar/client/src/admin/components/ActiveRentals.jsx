import React, { useState, useEffect } from 'react';
import './ActiveRentals.css';

const ActiveRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedRental, setSelectedRental] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('borrowbuddy-token');

    useEffect(() => {
        fetchActiveRentals();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchActiveRentals = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/bookings/active', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch active rentals');
            }

            const data = await response.json();
            setRentals(data);
        } catch (err) {
            console.error('Error fetching active rentals:', err);
            setError('Failed to load active rentals');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/bookings/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleStatusUpdate = async (rentalId, newStatus) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${rentalId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: newStatus,
                    adminNotes: adminNotes || undefined
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            setAdminNotes('');

            // Update local state
            setRentals(prev => prev.map(rental =>
                rental._id === rentalId
                    ? { ...rental, status: newStatus, adminNotes: adminNotes || rental.adminNotes }
                    : rental
            ));

            // Refresh stats
            fetchStats();
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update rental status');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelRental = async (rentalId) => {
        if (!window.confirm('Are you sure you want to cancel this rental?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${rentalId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel rental');
            }

            // Remove from local state
            setRentals(prev => prev.filter(rental => rental._id !== rentalId));
            fetchStats();
        } catch (err) {
            console.error('Error cancelling rental:', err);
            setError('Failed to cancel rental');
        }
    };

    const filteredRentals = rentals.filter(rental => {
        const matchesFilter = filter === 'all' || rental.status === filter;
        const matchesSearch = rental.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rental.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rental.product?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107';
            case 'confirmed': return '#17a2b8';
            case 'active': return '#28a745';
            case 'completed': return '#6c757d';
            case 'cancelled': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return '⏳ Pending';
            case 'confirmed': return '✅ Confirmed';
            case 'active': return '🟢 Active';
            case 'completed': return '✅ Completed';
            case 'cancelled': return '❌ Cancelled';
            default: return status;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getDaysRemaining = (endDate) => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <div className="active-rentals">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading active rentals...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="active-rentals">
            <div className="rentals-header">
                <h2>📋 Active Rentals</h2>
                <p>Manage ongoing and upcoming rentals</p>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>{stats.total || 0}</h3>
                    <p>Total Bookings</p>
                </div>
                <div className="stat-card pending">
                    <h3>{stats.pending || 0}</h3>
                    <p>Pending</p>
                </div>
                <div className="stat-card confirmed">
                    <h3>{stats.confirmed || 0}</h3>
                    <p>Confirmed</p>
                </div>
                <div className="stat-card active">
                    <h3>{stats.active || 0}</h3>
                    <p>Active</p>
                </div>
                <div className="stat-card completed">
                    <h3>{stats.completed || 0}</h3>
                    <p>Completed</p>
                </div>
                <div className="stat-card revenue">
                    <h3>{formatCurrency(stats.totalRevenue || 0)}</h3>
                    <p>Total Revenue</p>
                </div>
            </div>

            <div className="filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by customer name, email, or product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="search-icon">🔍</span>
                </div>
                <div className="filter-buttons">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={filter === 'pending' ? 'active' : ''}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={filter === 'confirmed' ? 'active' : ''}
                        onClick={() => setFilter('confirmed')}
                    >
                        Confirmed
                    </button>
                    <button
                        className={filter === 'active' ? 'active' : ''}
                        onClick={() => setFilter('active')}
                    >
                        Active
                    </button>
                    <button
                        className={filter === 'completed' ? 'active' : ''}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </button>
                </div>
            </div>

            <div className="rentals-container">
                <div className="rentals-list">
                    {filteredRentals.length === 0 ? (
                        <div className="no-rentals">
                            <p>No rentals found</p>
                        </div>
                    ) : (
                        filteredRentals.map(rental => (
                            <div
                                key={rental._id}
                                className={`rental-item ${selectedRental?._id === rental._id ? 'selected' : ''}`}
                                onClick={() => setSelectedRental(rental)}
                            >
                                <div className="rental-header">
                                    <h4>{rental.user?.name || 'Unknown User'}</h4>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(rental.status) }}
                                    >
                                        {getStatusBadge(rental.status)}
                                    </span>
                                </div>
                                <p className="rental-email">{rental.user?.email}</p>
                                <p className="rental-product">{rental.product?.title}</p>
                                <p className="rental-dates">
                                    {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                </p>
                                <p className="rental-amount">{formatCurrency(rental.totalAmount)}</p>
                                {rental.status === 'active' && (
                                    <p className="days-remaining">
                                        {getDaysRemaining(rental.endDate)} days remaining
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {selectedRental && (
                    <div className="rental-detail">
                        <div className="detail-header">
                            <h3>Rental Details</h3>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedRental(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="detail-content">
                            <div className="detail-section">
                                <h4>Customer Information</h4>
                                <p><strong>Name:</strong> {selectedRental.user?.name}</p>
                                <p><strong>Email:</strong> {selectedRental.user?.email}</p>
                                <p><strong>Phone:</strong> {selectedRental.phone || selectedRental.user?.phone || 'Not provided'}</p>
                                <p><strong>Address:</strong> {selectedRental.address || 'Not provided'}</p>
                            </div>

                            <div className="detail-section">
                                <h4>Product Information</h4>
                                <p><strong>Product:</strong> {selectedRental.product?.title}</p>
                                <p><strong>Category:</strong> {selectedRental.product?.category}</p>
                                <p><strong>Price per Day:</strong> {formatCurrency(selectedRental.product?.pricePerDay)}</p>
                            </div>

                            <div className="detail-section">
                                <h4>Rental Information</h4>
                                <p><strong>Start Date:</strong> {formatDate(selectedRental.startDate)}</p>
                                <p><strong>End Date:</strong> {formatDate(selectedRental.endDate)}</p>
                                <p><strong>Total Days:</strong> {selectedRental.totalDays}</p>
                                <p><strong>Total Amount:</strong> {formatCurrency(selectedRental.totalAmount)}</p>
                                <p><strong>Status:</strong>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(selectedRental.status) }}
                                    >
                                        {getStatusBadge(selectedRental.status)}
                                    </span>
                                </p>
                                <p><strong>Pickup Location:</strong> {selectedRental.pickupLocation}</p>
                                <p><strong>Return Location:</strong> {selectedRental.returnLocation}</p>
                            </div>

                            {selectedRental.customerNotes && (
                                <div className="detail-section">
                                    <h4>Customer Notes</h4>
                                    <div className="notes-content">
                                        {selectedRental.customerNotes}
                                    </div>
                                </div>
                            )}

                            {selectedRental.adminNotes && (
                                <div className="detail-section">
                                    <h4>Admin Notes</h4>
                                    <div className="notes-content">
                                        {selectedRental.adminNotes}
                                    </div>
                                </div>
                            )}

                            <div className="detail-section">
                                <h4>Payment Information</h4>
                                <p><strong>Transaction/Reference Number:</strong> {selectedRental.transactionId || 'Not provided'}</p>
                                {selectedRental.paymentScreenshot && (
                                    <div style={{ marginTop: 8 }}>
                                        <strong>Payment Screenshot:</strong><br />
                                        <a href={selectedRental.paymentScreenshot} target="_blank" rel="noopener noreferrer">
                                            <img src={selectedRental.paymentScreenshot} alt="Payment Screenshot" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, border: '1px solid #eee', marginTop: 4 }} />
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="detail-actions">
                                <div className="status-actions">
                                    <label>Update Status:</label>
                                    <select
                                        value={selectedRental.status}
                                        onChange={(e) => handleStatusUpdate(selectedRental._id, e.target.value)}
                                        disabled={isUpdating}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div className="notes-actions">
                                    <label>Admin Notes:</label>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add admin notes..."
                                        rows="3"
                                    />
                                </div>

                                <div className="cancel-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => handleCancelRental(selectedRental._id)}
                                        disabled={selectedRental.status === 'cancelled'}
                                    >
                                        🚫 Cancel Rental
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveRentals;
