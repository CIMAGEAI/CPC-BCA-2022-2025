import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/NavbarStyle.css';

function Navbar() {
    const [query, setQuery] = useState('');
    const user = JSON.parse(localStorage.getItem('borrowbuddy-user'));
    const navigate = useNavigate();

    const [location, setLocation] = useState('Location');

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            setQuery('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('borrowbuddy-token');
        localStorage.removeItem('borrowbuddy-user');
        navigate('/login');
    };
    const logo = '/assets/buddy.png';
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo"><img src={logo} style={{ height: 25, width: 30, marginRight: 8 }} alt="BorrowBuddy" />BorrowBuddy</Link>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="location-select">
                    <option value="Choose Location">Location</option>
                    <option value="Patna">Patna</option>

                </select>
            </div>

            <form onSubmit={handleSearch} className="navbar-search">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" id="search-button">🔍</button>
            </form>


            <div className="navbar-right">
                {/* Cart removed */}

                {user?.role === 'lender' && <Link to="/lender">Lender Dashboard</Link>}
                {user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}

                {user ? (
                    <div className="user-dropdown">
                        <button className="user-dropdown-toggle">
                            Welcome, {user.name} &#x25BC;
                        </button>
                        <div className="user-dropdown-menu">
                            <Link to="/my-bookings">My Bookings</Link>
                            <Link to="/profile">Profile</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="login-btn">Login / Signup</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
