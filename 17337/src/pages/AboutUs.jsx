import React from 'react';
import '../styles/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h2>About Us</h2>
      <p>
        Welcome to NavShayKriti! We are passionate about providing the best products to our customers.
        Our mission is to deliver quality, affordability, and exceptional service.
      </p>
      <div className="about-us-content">
        <div className="about-us-section">
          <h3>Our Story</h3>
          <p>
            NavShayKriti LLP started with a vision to make shopping easy and accessible for everyone. Over the years, we have grown into a trusted platform for quality products.
          </p>
        </div>
        <div className="about-us-section">
          <h3>Our Values</h3>
          <ul className="values-list">
            <li>Customer Satisfaction</li>
            <li>Quality Assurance</li>
            <li>Innovation</li>
            <li>Integrity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;