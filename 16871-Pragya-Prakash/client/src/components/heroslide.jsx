import { useState, useEffect } from 'react';
import './stylingHero.css';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
    const [currentImage, setCurrentImage] = useState(0);

    const images = [
        '/assets/thekua.jpg',
        '/assets/mangoPickle.jpg',
        '/assets/nimki.jpg'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero-section">
            {images.map((img, index) => (
                <div
            
                    key={index}
                    className={`slide ${index === currentImage ? 'active' : ''}`}
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${img})`
                    }}
                />
            ))}
            <div className="hero-content">
                <h1 className="hero-title">Authentic Traditional Foods</h1>
                <p className="hero-description">
                Discover the rich flavors of India's culinary heritage. Every dish tells a story of tradition and love.
                Experience authentic taste without leaving home.
                </p>
                <Link to="/products ">
                    <button className="shop-now-btn">Shop Now</button>
                </Link>
            </div>
        </section>
    );
};

export default HeroSlider;
