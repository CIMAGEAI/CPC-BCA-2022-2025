import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    const user = JSON.parse(localStorage.getItem('borrowbuddy-user')) || {};

    return (
        <div style={styles.sidebar}>
            <div style={styles.topSection}>
                <div style={styles.profileBox}>
                    <img src="https://thumbs.dreamstime.com/b/red-admin-sign-pc-laptop-vector-illustration-administrator-icon-screen-controller-man-system-box-88756468.jpg" alt="avatar" style={styles.avatar} />
                    <div style={styles.profileInfo}>
                        <span style={styles.userName}>{user.name || 'Admin'}</span>
                        <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
                    </div>
                </div>
                <button style={styles.homeBtn} onClick={() => window.location.href = '/'}>🏠 Home</button>
            </div>

            <h2 style={styles.logo}>BorrowBuddy Admin</h2>

            {/* <button
                style={activeTab === 'products' ? styles.active : styles.link}
                onClick={() => handleTabClick('products')}
            >
                📦 Product Management
            </button> */}

            <button
                style={activeTab === 'queries' ? styles.active : styles.link}
                onClick={() => handleTabClick('queries')}
            >
                💬 Customer Queries
            </button>

            <button
                style={activeTab === 'rentals' ? styles.active : styles.link}
                onClick={() => handleTabClick('rentals')}
            >
                📋 Active Rentals
            </button>

            <button
                style={activeTab === 'remove' ? styles.active : styles.link}
                onClick={() => handleTabClick('remove')}
            >
                {/* 🗑️ Remove Items */}
                ⚙️ Product Management
            </button>

            <button
                style={activeTab === 'requests' ? styles.active : styles.link}
                onClick={() => handleTabClick('requests')}
            >
                📨 Booking Requests
            </button>
        </div>
    );
};

const styles = {
    sidebar: {
        width: '250px',
        height: '100vh',
        background: '#2f3542',
        color: '#fff',
        padding: '2rem 1rem',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    topSection: {
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
    },
    profileBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        marginBottom: '0.5rem',
    },
    avatar: {
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        border: '2px solid #e76f51',
    },
    profileInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.25rem',
    },
    userName: {
        fontWeight: 600,
        fontSize: '1rem',
        color: '#fff',
    },
    logoutBtn: {
        padding: '0.3rem 0.8rem',
        background: '#e76f51',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        marginTop: '0.2rem',
    },
    homeBtn: {
        width: '100%',
        padding: '0.5rem 0',
        background: '#57606f',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        marginTop: '0.2rem',
        marginBottom: '0.5rem',
        transition: 'background 0.2s',
    },
    logo: {
        fontSize: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'center',
    },
    link: {
        display: 'block',
        color: '#dfe4ea',
        padding: '0.8rem 1rem',
        textDecoration: 'none',
        borderRadius: '4px',
        marginBottom: '1rem',
        background: 'none',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
    },
    active: {
        background: '#e76f51',
        color: '#fff',
        padding: '0.8rem 1rem',
        borderRadius: '4px',
        textDecoration: 'none',
        marginBottom: '1rem',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
    },
};

export default Sidebar;
