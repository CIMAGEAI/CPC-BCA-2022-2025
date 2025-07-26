import React, { useState, useEffect } from 'react';
import '../styles/BannerSliderStyle.css';

const banners = [
    '/assets/Banner1.jpg',
    '/assets/Banner2.jpg',
    '/assets/Banner3.jpg',

];

const BannerSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 4000); // every 4 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="banner-slider">
            <img src={banners[currentSlide]} alt={`banner-${currentSlide}`} />

            <div className="banner-controls">
                <button onClick={prevSlide}>❮</button>
                <button onClick={nextSlide}>❯</button>
            </div>

            <div className="slider-dots">
                {banners.map((_, index) => (
                    <span
                        key={index}
                        className={index === currentSlide ? 'active' : ''}
                        onClick={() => setCurrentSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;
