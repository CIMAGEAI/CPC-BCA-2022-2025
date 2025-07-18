import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { CartContext } from '../contexts/CartContext'; 
import { signInWithEmailAndPassword } from "firebase/auth";
import '../styles/Auth.css';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://ecommerce-app-pi86.onrender.com'
  : 'http://localhost:5000';

// ✅ A simple loading component to show during the finalization step
const FinalizingLogin = () => (
    <div className="login-container finalizing-container">
        <div className="spinner"></div>
        <h2>Finalizing Your Login...</h2>
        <p>Please wait, we're getting things ready for you.</p>
    </div>
);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useContext(CartContext);
    
    const productToAdd = location.state?.productToAdd;
    const from = location.state?.from?.pathname || "/";

    const handleLoginSuccess = async (user) => {
        setIsLoading(true); // ✅ Show the loading screen immediately upon success
        try {
            const response = await fetch(`${BACKEND_URL}/api/login-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: user.uid }),
            });
            const data = await response.json();
            if (data.success && data.sessionId) {
                localStorage.setItem('sessionId', data.sessionId);
            }
            if (productToAdd) {
                addToCart({ ...productToAdd, quantity: 1 });
            }
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Post-login process failed:", err);
            setError("Could not finalize your login. Please try again.");
            setIsLoading(false); // On error, show the form again
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true); // ✅ Show the loading screen for email login
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // On success, our success handler will now take over
            await handleLoginSuccess(userCredential.user); 
        } catch (error) {
            setError("Failed to log in. Please check your credentials.");
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            {/* ✅ This conditional rendering provides the improved UX */}
            {isLoading ? (
                <FinalizingLogin />
            ) : (
                <div className="login-container">
                    <h2>Welcome Back!</h2>
                    <form onSubmit={handleEmailSubmit} className="login-form">
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <button type="submit">Login</button>
                        {error && <div className="error-message">{error}</div>}
                    </form>
                    <div className="or-separator"><span>or</span></div>
                    {/* Your existing GoogleSignInButton will work perfectly with this setup */}
                    <GoogleSignInButton onSuccess={handleLoginSuccess} onError={(msg) => setError(msg)} />
                    <div className="login-footer">
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;