import React, { useState } from 'react';
import '../styles/auth.css';
import axios from 'axios';

const VerifyOtp = ({ email, onVerified }) => {
    const [otp, setOtp] = useState('');
    const [msg, setMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        if (otp.trim().length !== 6) {
            setMsg('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Verifying OTP:', { email, otp });
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
                email: email.toLowerCase(),
                otp: otp.trim()
            });
            setMsg(res.data.msg);
            onVerified(otp.trim()); // pass otp for next step
        } catch (err) {
            console.error('OTP verification error:', err.response?.data);
            setMsg(err.response?.data?.msg || 'Invalid or expired OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Verify OTP</h2>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify'}
                </button>
                {msg && <p className={msg.includes('successfully') ? 'success' : 'error'}>{msg}</p>}
            </form>
        </div>
    );
};

export default VerifyOtp;
