import React from 'react';
import '../styles/FooterStyle.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-column">
                    <h4>BorrowBuddy</h4>
                    <ul>
                        <li>About Us</li>
                        <li>Culture</li>
                        <li>Careers</li>
                        <li>Contact</li>
                        <li>Our Benefits</li>
                        <li>Sitemap</li>
                        <li>Partner with Us</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Information</h4>
                    <ul>
                        <li>Blog</li>
                        <li>Support</li>
                        <li>Documents Required</li>
                        <li>Returns & Refunds</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Policies</h4>
                    <ul>
                        <li>Shipping</li>
                        <li>Cancellation</li>
                        <li>Privacy</li>
                        <li>Terms & Conditions</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Need Help?</h4>
                    <p>📧 support@borrowbuddy.com</p>
                    <h4>Download App</h4>
                    <div className="app-buttons">
                        <img src="/assets/PlayStore.png" alt="Google Play" />
                        <img src="/assets/appStore.png" alt="App Store" />
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2025 BorrowBuddy Pvt. Ltd.</p>
                <div className="social-icons">
                    <i className="fa-brands fa-facebook-f"></i>
                    <i className="fa-brands fa-twitter"></i>
                    <i className="fa-brands fa-linkedin-in"></i>
                    <i className="fa-brands fa-instagram"></i>
                    <i className="fa-brands fa-youtube"></i>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
