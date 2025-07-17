import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaCamera, FaSpinner } from 'react-icons/fa';
import "../styles/VisualSearch.css";

const VisualSearch = ({ onClose }) => {
    const [searchResults, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setMessage("");
        setResults([]);

        try {
            const storage = getStorage();
            const filePath = `visual-search/${Date.now()}-${file.name}`;
            const storageRef = ref(storage, filePath);
            const uploadResult = await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(uploadResult.ref);

            const functionUrl = "https://us-central1-ecommerce-71fd2.cloudfunctions.net/searchWithImage";
            
            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { imageUrl: imageUrl } }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'The server returned an error.');
            }

            const result = await response.json();
            const products = result.result.products || []; 
            setResults(products);

            if (products.length === 0) {
                setMessage("No similar products found. Try another image!");
            }

        } catch (err) {
            console.error("Visual search failed:", err);
            setError(`Could not perform search. Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="vs-container">
            <h3>Search with an Image</h3>
            <p>Upload a photo to find visually similar products in our store.</p>
            <label htmlFor="vs-image-upload" className="vs-upload-label">
                <FaCamera />
                <span>{isLoading ? 'Analyzing...' : 'Select Image'}</span>
            </label>
            <input id="vs-image-upload" type="file" accept="image/*" onChange={handleImageUpload} disabled={isLoading} style={{ display: 'none' }} />
            {isLoading && <FaSpinner className="vs-spinner" />}
            {error && <p className="vs-error-message">{error}</p>}
            {message && !isLoading && <p className="vs-info-message">{message}</p>}
            <div className="vs-results-grid">
                {searchResults.map(product => (
                    <Link to={`/product/${product.id}`} key={product.id} className="vs-product-card" onClick={onClose}>
                        <div className="vs-image-container"><img src={product.image} alt={product.title} /></div>
                        <div className="vs-info"><h4>{product.title}</h4><p>₹{product.price}</p></div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default VisualSearch;