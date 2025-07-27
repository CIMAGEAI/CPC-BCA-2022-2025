// /pages/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BreadcrumbNavbar from '../components/BreadcrumbNavbar';
import Footer from '../components/Footer';
import '../styles/SearchResultsStyle.css';

const SearchResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search).get('q');

    useEffect(() => {
        if (query) {
            fetch(`http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`)
                .then((res) => res.json())
                .then((data) => {
                    setResults(data);
                    setLoading(false);
                });
        }
    }, [query]);

    if (loading) return <p>Loading...</p>;
    if (!results.length) return <p>No products found for "{query}"</p>;

    return (
        <>
            <Navbar />
            <BreadcrumbNavbar />
            <div className="search-results">
                <h2>Results for: "{query}"</h2>
                <div className="product-grid">
                    {results.map((product) => (
                        <div
                            key={product._id}
                            className="product-card"
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            <img src={product.images[0]} alt={product.title} />
                            <h3>{product.title}</h3>
                            <p>₹{product.pricePerDay}/day</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SearchResults;
