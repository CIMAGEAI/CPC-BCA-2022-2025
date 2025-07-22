import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFoundStyle.css';

const NotFound = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <h1>404</h1>
                <h2>Oops! Page not found</h2>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/" className="back-home-btn">Go Back Home</Link>
            </div>
        </div>
    );
};

export default NotFound;
