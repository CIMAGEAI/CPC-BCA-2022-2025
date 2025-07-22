import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
// import Topbar from './Topbar';
import ProductForm from './components/ProductForm';
import CustomerQueries from './components/CustomerQueries';
import ActiveRentals from './components/ActiveRentals';
import RemoveItems from './components/RemoveItems';
import BookingRequests from './components/BookingRequests';
import './AdminDashboard.css';
// Add other components like ActiveRentals, CustomerQueries, RemoveItems

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('borrowbuddy-token');

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const [productStats, enquiryStats, bookingStats] = await Promise.all([
                fetch('http://localhost:5000/api/products/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json()),
                fetch('http://localhost:5000/api/enquiries/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json()),
                fetch('http://localhost:5000/api/bookings/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json())
            ]);

            setStats({
                products: productStats,
                enquiries: enquiryStats,
                bookings: bookingStats
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('borrowbuddy-token');
        localStorage.removeItem('borrowbuddy-user');
        window.location.href = '/login';
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductForm onProductAdded={fetchDashboardStats} />;
            case 'queries':
                return <CustomerQueries />;
            case 'rentals':
                return <ActiveRentals />;
            case 'requests':
                return <BookingRequests />;
            case 'remove':
                return <RemoveItems onProductRemoved={fetchDashboardStats} />;
            default:
                return <ProductForm onProductAdded={fetchDashboardStats} />;
        }
    };

    const renderStats = () => {
        if (loading) {
            return <div className="stats-loading">Loading statistics...</div>;
        }

        if (error) {
            return <div className="stats-error">{error}</div>;
        }

        return (
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>📦 Products</h3>
                    <div className="stat-numbers">
                        <span className="stat-main">{stats.products?.total || 0}</span>
                        <span className="stat-sub">Total</span>
                    </div>
                    <div className="stat-details">
                        <span className="stat-approved">{stats.products?.approved || 0} Approved</span>
                        <span className="stat-pending">{stats.products?.pending || 0} Pending</span>
                    </div>
                </div>

                <div className="stat-card">
                    <h3>💬 Queries</h3>
                    <div className="stat-numbers">
                        <span className="stat-main">{stats.enquiries?.total || 0}</span>
                        <span className="stat-sub">Total</span>
                    </div>
                    <div className="stat-details">
                        <span className="stat-pending">{stats.enquiries?.pending || 0} Pending</span>
                        <span className="stat-unread">{stats.enquiries?.unread || 0} Unread</span>
                    </div>
                </div>

                <div className="stat-card">
                    <h3>📋 Rentals</h3>
                    <div className="stat-numbers">
                        <span className="stat-main">{stats.bookings?.total || 0}</span>
                        <span className="stat-sub">Total</span>
                    </div>
                    <div className="stat-details">
                        <span className="stat-active">{stats.bookings?.active || 0} Active</span>
                        <span className="stat-revenue">₹{stats.bookings?.totalRevenue || 0}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <h3>💰 Revenue</h3>
                    <div className="stat-numbers">
                        <span className="stat-main">₹{stats.bookings?.totalRevenue || 0}</span>
                        <span className="stat-sub">Total</span>
                    </div>
                    <div className="stat-details">
                        <span className="stat-completed">{stats.bookings?.completed || 0} Completed</span>
                        <span className="stat-pending">{stats.bookings?.pending || 0} Pending</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-dashboard">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
            {/* <Topbar onLogout={handleLogout} /> */}

            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>👑 Admin Dashboard</h1>
                    <p>Manage your BorrowBuddy platform</p>
                </div>

                {activeTab === 'products' && (
                    <div className="dashboard-overview">
                        {renderStats()}
                    </div>
                )}

                <div className="dashboard-main">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
