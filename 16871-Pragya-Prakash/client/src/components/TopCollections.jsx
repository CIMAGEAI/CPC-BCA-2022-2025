import React from 'react';
import { Link } from 'react-router-dom';
import './styleCollections.css';
import { useCart } from '../contexts/CartContext';



const TopCollections = () => {
    const { addToCart } = useCart();
    
    const collections = [
        {
            id: 1,
            name: 'Pickles Collections',
            price: 575.00,
            image: '/assets/mangoPickle.jpg',
            sale: false
        },
        {
            id: 2,
            name: 'Sweets Collections',
            price: 56.00,
            originalPrice: 75.00,
            image: '/assets/thekua.jpg',
            sale: false
        },
        {
            id: 3,
            name: 'Snacks Collections',
            price: 63.00,
            originalPrice: 85.00,
            image: '/assets/nimki.jpg',
            sale: false
        }
    ];

    return (
        <section className="collections-section">
            <div className="collections-header">
                <div>
                    <h2>Parampara Collections</h2>
                    <p>Discover our exquisite range of traditional foods.</p>
                </div>
                <Link to="/products" className="shop-luxury-btn">Shop Now</Link>
            </div>
            <div className="collections-grid">
                {collections.map((collection) => (
                    <div key={collection.id} className="collection-card">
                        {collection.sale && <span className="sale-badge">Sale!</span>}
                        <img src={collection.image} alt={collection.name} />
                        <h3>{collection.name}</h3>
                        <div className="price">
                            {collection.originalPrice && (
                                <span className="original-price">₹{collection.originalPrice.toFixed(2)}</span>
                            )}
                            <span className="current-price">₹{collection.price.toFixed(2)}</span>
                        </div>
                        <button className="add-to-cart-btn" onClick={() => addToCart({
                            _id: collection.id,
                            name: collection.name,
                            price: collection.price,
                            mainImage: { url: collection.image },
                            stock: 100 // default stock
                        }, 1)}>
                            Add to cart
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TopCollections;
