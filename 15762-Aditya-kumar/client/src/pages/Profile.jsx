import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Profile = () => {
    const [form, setForm] = useState({ name: '', email: '', mobile: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const token = localStorage.getItem('borrowbuddy-token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await fetch('http://localhost:5000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch profile');
                const data = await res.json();
                setForm({
                    name: data.name || '',
                    email: data.email || '',
                    mobile: data.mobile || '',
                    address: data.address || ''
                });
            } catch (err) {
                // setError('Could not load profile.'); // This line was removed
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // setMsg(''); // This line was removed
        // setError(''); // This line was removed
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setEditing(true);
        // setMsg(''); // This line was removed
        // setError(''); // This line was removed
        try {
            const res = await fetch('http://localhost:5000/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error('Update failed');
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error('Failed to update profile.');
        } finally {
            setEditing(false);
        }
    };

    if (loading) return <div className="profile-loading"><div className="spinner"></div>Loading profile...</div>;

    return (
        <>
            <Navbar/>
            <div className="profile-container">
                <ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
                <h2>My Profile</h2>
                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="profile-group">
                        <label>Name</label>
                        <input name="name" value={form.name} onChange={handleChange} required disabled={editing} />
                    </div>
                    <div className="profile-group">
                        <label>Email</label>
                        <input name="email" value={form.email} onChange={handleChange} type="email" required disabled={editing} />
                    </div>
                    <div className="profile-group">
                        <label>Mobile</label>
                        <input name="mobile" value={form.mobile} onChange={handleChange} type="tel" required disabled={editing} />
                    </div>
                    <div className="profile-group">
                        <label>Address</label>
                        <textarea name="address" value={form.address} onChange={handleChange} required disabled={editing} />
                    </div>
                    <button type="submit" className="profile-save-btn" disabled={editing}>Update Profile</button>
                </form>
            </div>
            <Footer/>
        </>
    );
};

export default Profile; 