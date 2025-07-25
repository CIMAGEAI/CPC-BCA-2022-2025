import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem('borrowbuddy-token');
    const user = JSON.parse(localStorage.getItem('borrowbuddy-user'));

    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;
