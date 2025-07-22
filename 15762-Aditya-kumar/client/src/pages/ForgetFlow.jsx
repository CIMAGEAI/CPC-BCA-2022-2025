import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

const ForgotFlow = () => {
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    const navigate = useNavigate();

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        if (!validateEmail(email)) {
            setError('Enter a valid email address');
            return;
        }

        setIsLoading(true);
        setLoadingText('Sending OTP...');
        setError('');
        setMsg('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/send-reset-otp', { email });

            setMsg(res.data.msg);
            setStep(2);
        } catch (err) {
            // console.log('OTP Error:', err);
            setError(err.response?.data?.msg || 'Something went wrong');
        } finally {
            setIsLoading(false);
            setLoadingText('');
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        if (otp.trim().length !== 6) {
            setError('Enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        setLoadingText('Verifying OTP...');
        setError('');
        setMsg('');

        try {
            // console.log('Sending OTP verification:', { email, otp });
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
                email: email.toLowerCase(),
                otp: otp.trim()
            });
            setMsg(res.data.msg);
            setStep(3);
        } catch (err) {
            // console.error('OTP verification error:', err.response?.data);
            setError(err.response?.data?.msg || 'Invalid OTP');
        } finally {
            setIsLoading(false);
            setLoadingText('');
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        if (newPassword.length < 6) {
            setError('Password should be at least 6 characters');
            return;
        }

        setIsLoading(true);
        setLoadingText('Resetting Password...');
        setError('');
        setMsg('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
                email: email.toLowerCase(),
                otp: otp.trim(),
                newPassword,
            });
            setMsg(res.data.msg);
            setStep(4); // final message
        } catch (err) {
            // console.error('Password reset error:', err.response?.data);
            setError(err.response?.data?.msg || 'Reset failed');
        } finally {
            setIsLoading(false);
            setLoadingText('');
        }
    };

    // Reset to previous step
    const handleBack = () => {
        if (isLoading) return;

        if (step > 1) {
            setStep(step - 1);
            setError('');
            setMsg('');
        }
    };

    return (
        <div className="auth-container forgot-flow">
            <form className="auth-form">
                {step === 1 && (
                    <>
                        <h2>Reset Password</h2>
                        <p className="step-description">Enter your registered email to receive a verification code</p>

                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className={error && !validateEmail(email) ? 'error' : ''}
                            />
                        </div>

                        <button
                            onClick={handleSendOTP}
                            disabled={isLoading || !validateEmail(email)}
                            className="primary-btn"
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    {loadingText}
                                </>
                            ) : (
                                'Send OTP'
                            )}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2>Verify OTP</h2>
                        <p className="step-description">We've sent a 6-digit code to {email}</p>

                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                disabled={isLoading}
                                maxLength={6}
                                className={error ? 'error' : ''}
                            />
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={isLoading}
                                className="secondary-btn"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleVerifyOTP}
                                disabled={isLoading || otp.trim().length !== 6}
                                className="primary-btn"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        {loadingText}
                                    </>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>
                        </div>

                        <div className="resend-section">
                            <p>Didn't receive the code?</p>
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={isLoading}
                                className="resend-btn"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2>Set New Password</h2>
                        <p className="step-description">Create a strong password for your account</p>

                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={isLoading}
                                className={error ? 'error' : ''}
                            />
                            <small className="password-hint">
                                Password must be at least 6 characters long
                            </small>
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={isLoading}
                                className="secondary-btn"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleResetPassword}
                                disabled={isLoading || newPassword.length < 6}
                                className="primary-btn"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        {loadingText}
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </div>
                    </>
                )}

                {step === 4 && (
                    <div className="success-container">
                        <div className="success-icon">✓</div>
                        <h2>Password Reset Successful!</h2>
                        <p>Your password has been reset successfully. You can now login with your new password.</p>
                        <button
                            onClick={ navigate('/login')}
                            className="primary-btn"
                        >
                            Go to Login
                        </button>
                    </div>
                )}

                {msg && <p className="success">{msg}</p>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default ForgotFlow;
