import React from 'react';
import { Link } from 'react-router-dom';
import './stylingSeasonalOffers.css';

const SeasonalOffers = () => {
    return (
        <section className="seasonal-offers">
            <div className="offers-content">
                <div className="offers-text">
                    <h2>Exclusive Seasonal Offers</h2>
                    <p>Discover amazing discounts on our exquisite taste this season.
                        Enjoy special prices on selected foods items and exclusive deals for
                        our members.</p>
                    <Link to="/products" className="shop-now-btn">Shop Now</Link>
                </div>
                <div className="offers-image">
                    <img src="/assets/offerImages.jpg" alt="Seasonal Collection" />
                </div>
            </div>
        </section>
    );
};

export default SeasonalOffers;
