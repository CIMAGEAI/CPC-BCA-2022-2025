import React, { useState } from 'react';
import '../styles/auth.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    const validate = (field, value) => {
        switch (field) {
            case 'name':
                return /^[a-zA-Z\s\-']{3,}$/.test(value) ? '' : 'Name must be at least 3 characters and contain only letters, spaces, hyphens, apostrophes, and periods.';
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? '' : 'Invalid email address.';
            case 'password':
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)
                    ? ''
                    : 'Password must be 8 characters with uppercase, lowercase, number, and special character.';
            case 'confirmPassword':
                return value === form.password ? '' : 'Passwords do not match.';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'email' ? value.toLowerCase() : value;

        setForm({ ...form, [name]: newValue });
        setErrors({ ...errors, [name]: validate(name, newValue) });
        setApiError(''); // Clear API error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return; // Prevent double submission

        const newErrors = {
            name: validate('name', form.name),
            email: validate('email', form.email),
            password: validate('password', form.password),
            confirmPassword: validate('confirmPassword', form.confirmPassword),
        };

        setErrors(newErrors);
        setApiError('');

        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (!hasErrors) {
            setIsLoading(true);
            console.log('Form Submitted:', form);

            try {
                // Remove confirmPassword before sending to API
                const { confirmPassword, ...signupData } = form;
                await axios.post('http://localhost:5000/api/auth/register', signupData);

                alert('Signup successful! Please login.');
                navigate('/login');
            } catch (err) {
                const message = err.response?.data?.msg || 'Something went wrong. Please try again.';
                setApiError(message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                    <img src="/assets/buddy.png" alt="User" style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 8, boxShadow: '0 2px 8px #eee' }} />
                    <h2>Create Account</h2>
                </div>
                {apiError && <div className="api-error">{apiError}</div>}
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.name && <small>{errors.name}</small>}
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.email && <small>{errors.email}</small>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className={errors.password ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.password && <small>{errors.password}</small>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
                </div>
                <div className="extra-options">
                    <Link to="/login" className="link">Already have an Account ? Login</Link>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default Signup;
