import React, { useState, useEffect } from 'react';
import './CustomerQueries.css';

const CustomerQueries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [responseText, setResponseText] = useState('');
    const [isResponding, setIsResponding] = useState(false);
    const [error, setError] = useState(null);
    // Remove the errors state and validation functions as they don't belong here

    const token = localStorage.getItem('borrowbuddy-token');

    useEffect(() => {
        fetchEnquiries();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/enquiries', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch enquiries');
            }

            const data = await response.json();
            setEnquiries(data);
        } catch (err) {
            console.error('Error fetching enquiries:', err);
            setError('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/enquiries/stats', {
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

    const handleStatusUpdate = async (enquiryId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/enquiries/${enquiryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update local state
            setEnquiries(prev => prev.map(enquiry =>
                enquiry._id === enquiryId
                    ? { ...enquiry, status: newStatus }
                    : enquiry
            ));

            // Refresh stats
            fetchStats();
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update enquiry status');
        }
    };

    const handleRespond = async (enquiryId) => {
        if (!responseText.trim()) return;

        setIsResponding(true);
        try {
            const response = await fetch(`http://localhost:5000/api/enquiries/${enquiryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    adminResponse: responseText,
                    status: 'resolved'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to respond to enquiry');
            }

            setResponseText('');
            setSelectedEnquiry(null);

            // Update local state
            setEnquiries(prev => prev.map(enquiry =>
                enquiry._id === enquiryId
                    ? {
                        ...enquiry,
                        status: 'resolved',
                        adminResponse: responseText,
                        respondedAt: new Date().toISOString()
                    }
                    : enquiry
            ));

            // Refresh stats
            fetchStats();
        } catch (err) {
            console.error('Error responding to enquiry:', err);
            setError('Failed to respond to enquiry');
        } finally {
            setIsResponding(false);
        }
    };

    const handleDelete = async (enquiryId) => {
        if (!window.confirm('Are you sure you want to delete this enquiry?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/enquiries/${enquiryId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to delete enquiry');
            }

            // Remove from local state
            setEnquiries(prev => prev.filter(enquiry => enquiry._id !== enquiryId));
            fetchStats();
        } catch (err) {
            console.error('Error deleting enquiry:', err);
            setError('Failed to delete enquiry');
        }
    };

    const filteredEnquiries = enquiries.filter(enquiry => {
        const matchesFilter = filter === 'all' || enquiry.status === filter;
        const matchesSearch = enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.productName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107';
            case 'in-progress': return '#17a2b8';
            case 'resolved': return '#28a745';
            case 'closed': return '#6c757d';
            default: return '#6c757d';
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
    // Remove the validate and handleSubmit functions

    if (loading) {
        return (
            <div className="customer-queries">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading enquiries...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="customer-queries">
            <div className="queries-header">
                <h2>💬 Customer Queries</h2>
                <p>Manage customer enquiries and responses</p>
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
                    <p>Total</p>
                </div>
                <div className="stat-card pending">
                    <h3>{stats.pending || 0}</h3>
                    <p>Pending</p>
                </div>
                <div className="stat-card in-progress">
                    <h3>{stats.inProgress || 0}</h3>
                    <p>In Progress</p>
                </div>
                <div className="stat-card resolved">
                    <h3>{stats.resolved || 0}</h3>
                    <p>Resolved</p>
                </div>
                <div className="stat-card unread">
                    <h3>{stats.unread || 0}</h3>
                    <p>Unread</p>
                </div>
            </div>

            <div className="filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name, email, or product..."
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
                        className={filter === 'in-progress' ? 'active' : ''}
                        onClick={() => setFilter('in-progress')}
                    >
                        In Progress
                    </button>
                    <button
                        className={filter === 'resolved' ? 'active' : ''}
                        onClick={() => setFilter('resolved')}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            <div className="enquiries-container">
                <div className="enquiries-list">
                    {filteredEnquiries.length === 0 ? (
                        <div className="no-enquiries">
                            <p>No enquiries found</p>
                        </div>
                    ) : (
                        filteredEnquiries.map(enquiry => (
                            <div
                                key={enquiry._id}
                                className={`enquiry-item ${selectedEnquiry?._id === enquiry._id ? 'selected' : ''} ${!enquiry.isRead ? 'unread' : ''}`}
                                onClick={() => setSelectedEnquiry(enquiry)}
                            >
                                <div className="enquiry-header">
                                    <h4>{enquiry.name}</h4>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(enquiry.status) }}
                                    >
                                        {enquiry.status}
                                    </span>
                                </div>
                                <p className="enquiry-email">{enquiry.email}</p>
                                <p className="enquiry-product">{enquiry.productName}</p>
                                <p className="enquiry-message">{enquiry.message.substring(0, 100)}...</p>
                                <p className="enquiry-date">{formatDate(enquiry.createdAt)}</p>
                                {!enquiry.isRead && <div className="unread-indicator"></div>}
                            </div>
                        ))
                    )}
                </div>

                {selectedEnquiry && (
                    <div className="enquiry-detail">
                        <div className="detail-header">
                            <h3>Enquiry Details</h3>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedEnquiry(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="detail-content">
                            <div className="detail-section">
                                <h4>Customer Information</h4>
                                <p><strong>Name:</strong> {selectedEnquiry.name}</p>
                                <p><strong>Email:</strong> {selectedEnquiry.email}</p>
                                <p><strong>Product:</strong> {selectedEnquiry.productName}</p>
                                <p><strong>Status:</strong>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(selectedEnquiry.status) }}
                                    >
                                        {selectedEnquiry.status}
                                    </span>
                                </p>
                                <p><strong>Date:</strong> {formatDate(selectedEnquiry.createdAt)}</p>
                            </div>

                            <div className="detail-section">
                                <h4>Message</h4>
                                <div className="message-content">
                                    {selectedEnquiry.message}
                                </div>
                            </div>

                            {selectedEnquiry.adminResponse && (
                                <div className="detail-section">
                                    <h4>Admin Response</h4>
                                    <div className="response-content">
                                        {selectedEnquiry.adminResponse}
                                    </div>
                                    <p className="response-date">
                                        Responded on: {formatDate(selectedEnquiry.respondedAt)}
                                    </p>
                                </div>
                            )}

                            <div className="detail-actions">
                                <div className="status-actions">
                                    <label>Update Status:</label>
                                    <select
                                        value={selectedEnquiry.status}
                                        onChange={(e) => handleStatusUpdate(selectedEnquiry._id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>

                                {!selectedEnquiry.adminResponse && (
                                    <div className="response-actions">
                                        <label>Admin Response:</label>
                                        <textarea
                                            value={responseText}
                                            onChange={(e) => setResponseText(e.target.value)}
                                            placeholder="Type your response..."
                                            rows="4"
                                        />
                                        <button
                                            className="respond-btn"
                                            onClick={() => handleRespond(selectedEnquiry._id)}
                                            disabled={isResponding || !responseText.trim()}
                                        >
                                            {isResponding ? 'Sending...' : 'Send Response'}
                                        </button>
                                    </div>
                                )}

                                <div className="delete-actions">
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(selectedEnquiry._id)}
                                    >
                                        🗑️ Delete Enquiry
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

export default CustomerQueries;
