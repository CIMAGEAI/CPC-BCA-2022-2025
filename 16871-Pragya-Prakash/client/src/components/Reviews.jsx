import React from 'react';
import { FaStar } from 'react-icons/fa';
import './stylingReviews.css';
const Reviews = () => {
    const reviews = [
        {
            id: 1,
            name: "Simran Prakash",
            rating: 5,
            comment: "Absolutely love my new Pickles! The delivery was super fast and the packaging was beautiful.",
            date: "March 15, 2024"
        },
        {
            id: 2,
            name: "Ranju Singh",
            rating: 4,
            comment: "Great customer service and authentic products. Will definitely buy again!",
            date: "March 12, 2024"
        },
        {
            id: 3,
            name: "SatyaPrakash Singh",
            rating: 4,
            comment: "Delicious taste and quick delivery. Very satisfied with my purchase.",
            date: "March 10, 2024"
        }
    ];

    return (
        <>
            
            <section className="customer-reviews">
                <h2>What Our Customers Say</h2>
                <div className="reviews-grid">
                    {reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="rating">
                                {[...Array(review.rating)].map((_, i) => (
                                    <FaStar key={i} className="star" />
                                ))}
                            </div>
                            <p className="review-text">{review.comment}</p>
                            <div className="reviewer-info">
                                <h4>{review.name}</h4>
                                <span>{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Reviews;