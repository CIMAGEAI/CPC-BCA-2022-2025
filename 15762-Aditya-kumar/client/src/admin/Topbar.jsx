import React from 'react';

const Topbar = ({ onLogout }) => {
    const user = JSON.parse(localStorage.getItem('borrowbuddy-user')) || {};

    return (
        <div style={styles.topbar}>
            <div></div>
            <div style={styles.profile}>
                <span>{user.name || 'Admin'}</span>
                <img src="https://i.pravatar.cc/40" alt="avatar" style={styles.avatar} />
                <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
            </div>
        </div>
    );
};

const styles = {
    topbar: {
        height: '60px',
        backgroundColor: '#f1f2f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        marginLeft: '250px',
        borderBottom: '1px solidrgb(195, 196, 199)',
    },
    profile: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    avatar: {
        borderRadius: '50%',
        width: '40px',
        height: '40px',
    },
    logoutBtn: {
        padding: '0.4rem 1rem',
        background: '#e76f51',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Topbar;
