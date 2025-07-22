import React, { useState } from 'react';
import '../styles/auth.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const validate = (field, value) => {
        switch (field) {
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
                    ? ''
                    : 'Invalid email format.';
            case 'password':
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)
                    ? ''
                    : 'Password must be 8+ chars with upper, lower, number, special char.';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: validate(name, value) });
    };
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailLower = form.email.toLowerCase();

        const newErrors = {
            email: validate('email', form.email),
            password: validate('password', form.password),
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(err => err !== '');
        if (!hasErrors) {
            const loginData = {
                email: emailLower,            // ✅ always lowercase
                password: form.password,
            };
            console.log('Logging in with:', loginData);
            // ✅ API call to login here
            try {
                const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
                localStorage.setItem('borrowbuddy-user', JSON.stringify(response.data.user));
                localStorage.setItem('borrowbuddy-token', response.data.token);
                navigate('/');
            } catch (err) {
                alert(err.response.data.msg || 'Login failed');
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                    <img src="/assets/buddy.png" alt="User" style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 8, boxShadow: '0 2px 8px #eee' }} />
                    <h2>Login</h2>
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
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
                    />
                    {errors.password && <small>{errors.password}</small>}
                </div>
                <div className="extra-options">
                    <Link to="/forgot-password" className="link">Forgot Password?</Link>
                    <Link to="/signup" className="link">Create New Account</Link>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
