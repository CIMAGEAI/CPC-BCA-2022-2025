import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-socials">
          <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <FaXTwitter />
          </a>
          <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
        </div>

        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <span>|</span>
          <a href="/terms-of-service">Terms of Service</a>
        </div>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} NavShayKriti LLP. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
