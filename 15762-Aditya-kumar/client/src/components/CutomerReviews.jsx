import React from 'react';
import '../styles/CustomerReviewsStyle.css';
import adityaImg from '../assets/people/adityaPhoto.jpg';
import ppImg from '../assets/people/ppImg.jpg';
import giriImg from '../assets/people/giriImg.jpg';
import sonamImg from '../assets/people/sonam.jpg'

const reviews = [
    {
        name: 'Aditya Kumar',
        photo: adityaImg,
        review: 'BorrowBuddy made my festival planning smooth. The furniture looked premium, and delivery was super quick!',
        rating: 4.9,
        location: 'Patna'
    },
    {
        name: 'Pragya Prakash',
        photo: ppImg,
        review: 'Super impressed with the service. Rented a washing machine for 3 months and it worked like new.',
        rating: 4.8,
        location: 'Bangalore'
    },
    {
        name: 'Abhimanyu Giri',
        photo: giriImg,
        review: 'Affordable prices and reliable support. BorrowBuddy helped me save a lot during my college move.',
        rating: 4.7,
        location: 'Patna'
    },
    {
        name: 'Sonam Kumari',
        photo: sonamImg,
        review: 'I loved the hassle-free renting experience. Will surely rent again for my next home setup!',
        rating: 5.0,
        location: 'Mumbai'
    }
];

const CustomerReviews = () => {
    return (
        <section className="review-section">
            <h2>1000+ Happy Customers ❤️</h2>
            <p className="review-subtitle">Here’s what our customers say about BorrowBuddy</p>
            <div className="review-grid">
                {reviews.map((item, index) => (
                    <div key={index} className="review-card">
                        <img src={item.photo} alt={item.name} className="customer-photo" />
                        <h3>{item.name}</h3>
                        <p className="location">{item.location}</p>
                        <p className="review-text">“{item.review}”</p>
                        <div className="rating">
                            {Array(Math.floor(item.rating)).fill('⭐').map((star, idx) => <span key={idx}>{star}</span>)}
                            <span className="rating-number">{item.rating}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CustomerReviews;
