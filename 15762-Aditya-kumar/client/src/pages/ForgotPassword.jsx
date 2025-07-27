import React, { useState } from 'react';
import '../styles/auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Enter a valid email address');
            return;
        }

        setError('');
        console.log('Sending reset link to:', email);
        // 🔐 Call API to send reset link
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>

                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={error ? 'error' : ''}
                    />
                    {error && <small>{error}</small>}
                </div>

                <button type="submit">Send Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
