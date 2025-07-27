import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductSectionStyle.css';
import { Link } from 'react-router-dom';
const ProductSection = () => {
    const scrollRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products...');
                const res = await axios.get('http://localhost:5000/api/products/approved');
                console.log('Products received:', res.data);
                console.log('Number of products:', res.data.length);
                setProducts(res.data);
                
            } catch (err) {
                console.error('Failed to fetch products:', err);
                console.error('Error details:', err.response?.data);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (direction === 'left') container.scrollLeft -= 100;
        else container.scrollLeft += 100;
    };

    return (
        <div className="product-section">
            <div className="product-header">
                <h2>You'll love to <br /><span>take these home</span></h2>
                <div className="nav-buttons">
                    <button onClick={() => scroll('left')}>&larr;</button>
                    <button onClick={() => scroll('right')}>&rarr;</button>
                </div>
            </div>
            <div className="product-list" ref={scrollRef}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>
                ) : products.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>No products found.</div>
                ) : (
                    products.map((item, idx) => (
                        <div className="product-section-card" key={item._id || idx}>
                            <Link to={`/product/${item._id}`}>
                            <img src={item.images?.[0] || '/images/placeholder.png'} alt={item.title} />
                            <h3>{item.title}</h3>
                            <p className="price">Rent <br /><span>₹{item.pricePerDay}/mo</span></p>
                                <button className="see-more">See more</button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductSection;
