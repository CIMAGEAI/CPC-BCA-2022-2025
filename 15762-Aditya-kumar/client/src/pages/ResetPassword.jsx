import React, { useState } from 'react';
import '../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = ({ email, otp }) => {
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/reset-password', { email, otp, newPassword: password });
            setMsg(res.data.msg);
            setTimeout(() => navigate('/login'), 1800);
        } catch (err) {
            setMsg(err.response.data.msg);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleReset}>
                <h2>Set New Password</h2>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Reset Password</button>
                {msg && <p>{msg}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;
