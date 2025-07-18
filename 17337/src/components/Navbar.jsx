import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link, useLocation } from "react-router-dom";
import {
  FaShoppingCart, FaBars, FaTimes, FaHome, FaInfoCircle, FaPhone,
  FaThLarge, FaUser, FaCog, FaSignOutAlt, FaUserShield, FaCamera, FaBox
} from "react-icons/fa";
import "../styles/Navbar.css";
import { getAuth, signOut } from "firebase/auth";
import VisualSearch from "./VisualSearch";

const Navbar = ({ isLoggedIn, products, userRole }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shouldAnimateMobileMenu, setShouldAnimateMobileMenu] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const { cartCount } = useContext(CartContext);
  const location = useLocation();
  const auth = getAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    let openTimer, closeTimer;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      openTimer = setTimeout(() => setShouldAnimateMobileMenu(true), 10);
    } else {
      setShouldAnimateMobileMenu(false);
      closeTimer = setTimeout(() => {
        if (!mobileMenuOpen) document.body.style.overflow = '';
      }, 300);
    }
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    const q = e.target.value.toLowerCase();
    setSearchQuery(q);
    if (!q) {
      setFilteredProducts([]);
      return;
    }
    setFilteredProducts(
      products.filter((product) =>
        product.title?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q)
      )
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredProducts([]);
  };

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">
            NavShayKriti
          </Link>
        </div>

        <div className="nav-center desktop-only">
          <input
            type="search"
            value={searchQuery}
            placeholder="Search products..."
            className="nav-search"
            onChange={handleSearchChange}
          />
          <button
            className="visual-search-icon-btn"
            title="Search with an image"
            onClick={() => setIsVisualSearchOpen(true)}
          >
            <FaCamera />
          </button>

          {searchQuery && (
            <div className={`search-dropdown ${searchQuery ? 'show' : ''}`}>
              <div className="search-dropdown-header">
                  <span>Search Results</span>
                  <button className="search-close-btn" onClick={clearSearch} title="Close search">
                      <FaTimes />
                  </button>
                </div>
              <ul >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <li key={product.id}>
                      <Link to={`/product/${product.id}`} onClick={clearSearch}>
                        <img src={product.image || product.imageUrl} alt={product.title} />
                        <span>{product.title}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="no-results">No products found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="nav-right desktop-only">
          {(userRole === 'root_admin' || userRole === 'admin') && (
            <Link to="/admin" className={`nav-link admin-link ${isActive("/admin")}`}>
              Admin Panel
            </Link>
          )}
          <Link to="/" className={`nav-link ${isActive("/")}`}>Home</Link>
          <Link to="/about" className={`nav-link ${isActive("/about")}`}>About</Link>
          <Link to="/contact" className={`nav-link ${isActive("/contact")}`}>Contact</Link>
          <Link to="/categories" className={`nav-link ${isActive("/categories")}`}>Categories</Link>
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="icon-link">
                <FaShoppingCart />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
              <div className="dropdown hover-trigger">
                <button className="menu-btn">☰</button>
                <div className="dropdown-content">
                  <Link to="/account">Account</Link>
                  <Link to="/orders">Orders</Link>
                  <Link to="/settings">Settings</Link>
                  <span onClick={handleLogout}>Logout</span>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-button">Login</Link>
          )}
        </div>

        <div className="nav-right mobile-only">
          {isLoggedIn && (
            <Link to="/cart" className="icon-link">
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          )}
          <button className="hamburger-btn" onClick={() => setMobileMenuOpen(true)}>
            <FaBars />
          </button>
        </div>

        {mobileMenuOpen && (
  <>
    <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)} />
    <div className={`mobile-menu visually-enhanced ${shouldAnimateMobileMenu ? "open" : ""}`}>
      <div className="mobile-menu-header">
        <span>Menu</span>
        <FaTimes onClick={() => setMobileMenuOpen(false)} />
      </div>
      
      <div style={{ position: 'relative' }}>
        <input type="search" placeholder="Search products..." className="nav-search mobile-search" value={searchQuery} onChange={handleSearchChange} />
        {searchQuery && (
                  <div className={`search-dropdown show`}>
                    <div className="search-dropdown-header">
                        <span>Search Results</span>
                        <button className="search-close-btn" onClick={clearSearch} title="Close search">
                            <FaTimes />
                        </button>
                      </div>
                    <ul>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <li key={product.id}>
                            <Link to={`/product/${product.id}`} onClick={() => { clearSearch(); setMobileMenuOpen(false); }}>
                              <img src={product.image || product.imageUrl} alt={product.title} />
                              <span>{product.title}</span>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li><span style={{ padding: '10px', display: 'block' }}>No products found</span></li>
                      )}
                    </ul>
                  </div>
                )}
      </div>

      <div className="links-container">
        {!searchQuery && (
          <>
            <div
              className="mobile-link visual-search-mobile"
              onClick={() => {
                setIsVisualSearchOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <FaCamera style={{ marginRight: 8 }} /> Search with Image
            </div>
            {(userRole === 'root_admin' || userRole === 'admin') && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={`mobile-link admin-link-mobile ${isActive("/admin")}`}>
                <FaUserShield style={{ marginRight: 8 }} /> Admin Panel
              </Link>
            )}
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive("/")}`}><FaHome style={{ marginRight: 8 }} /> Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive("/about")}`}><FaInfoCircle style={{ marginRight: 8 }} /> About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive("/contact")}`}><FaPhone style={{ marginRight: 8 }} /> Contact</Link>
            <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive("/categories")}`}><FaThLarge style={{ marginRight: 8 }} /> Categories</Link>
            {isLoggedIn ? (
              <>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive("/account")}`}><FaUser style={{ marginRight: 8 }} /> Account</Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive("/orders")}`}><FaBox style={{ marginRight: 8 }} /> Orders</Link>
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive("/settings")}`}><FaCog style={{ marginRight: 8 }} /> Settings</Link>
                <span onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="mobile-link logout visually-highlighted"><FaSignOutAlt style={{ marginRight: 8 }} /> Logout</span>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-link visually-highlighted"><FaUser style={{ marginRight: 8 }}/> Login</Link>
            )}
          </>
        )}
      </div>
    </div>
  </>
)}
      </nav>

      {isVisualSearchOpen && (
        <div className="visual-search-modal-overlay">
          <div className="visual-search-modal-content">
            <button className="close-modal-btn" onClick={() => setIsVisualSearchOpen(false)}>
              <FaTimes />
            </button>
            <VisualSearch onClose={() => setIsVisualSearchOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;