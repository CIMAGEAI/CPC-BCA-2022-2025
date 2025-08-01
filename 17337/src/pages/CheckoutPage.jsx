import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const productsToCheckout = location.state?.products;

    const [productQuantities, setProductQuantities] = useState(() => {
        const initialQuantities = {};
        if (productsToCheckout) {
            productsToCheckout.forEach(p => {
                initialQuantities[p.id] = p.quantity || 1;
            });
        }
        return initialQuantities;
    });

    useEffect(() => {
        if (!productsToCheckout || productsToCheckout.length === 0) {
            console.error("Checkout page loaded without any products.");
            setTimeout(() => navigate("/"), 2000);
        }
    }, [productsToCheckout, navigate]);

    
    const handleQuantityChange = (productId, delta) => {
        setProductQuantities(prevQuantities => {
            const currentQuantity = prevQuantities[productId] || 1;
            const newQuantity = currentQuantity + delta;

            if (newQuantity < 1) {
                return prevQuantities;
            }

            return {
                ...prevQuantities,
                [productId]: newQuantity,
            };
        });
    };

    const handleProceedToDetails = () => {
        const finalProducts = productsToCheckout.map(p => ({
            ...p,
            quantity: productQuantities[p.id] || 1,
        }));

        navigate("/submit-details", {
            state: {
                products: finalProducts,
            },
        });
    };

    if (!productsToCheckout || productsToCheckout.length === 0) {
        return (
            <div className="checkout-container centered-error">
                <h2>No products selected for checkout.</h2>
                <p>Redirecting you to the homepage...</p>
                <Link to="/" className="checkout-go-home-btn">
                    Go Home Now
                </Link>
            </div>
        );
    }

    const total = productsToCheckout.reduce((acc, p) => {
        const quantity = productQuantities[p.id] || 1;
        return acc + p.price * quantity;
    }, 0);

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Your Order</h2>
            
            {productsToCheckout.map(product => (
                <div key={product.id} className="checkout-product-row">
                    <img
                        src={product.image || product.imageUrl}
                        alt={product.title}
                        className="checkout-product-img"
                    />
                    <div className="checkout-product-details">
                        <h3 className="checkout-product-title">{product.title}</h3>
                        <div>
                            <span className="checkout-price">₹{product.price}</span>
                            {product.cutoffPrice && (
                                <span className="checkout-cutoff">₹{product.cutoffPrice}</span>
                            )}
                        </div>
                    </div>
                    <div className="checkout-qty-row">
                        <button
                            className="checkout-qty-btn"
                            onClick={() => handleQuantityChange(product.id, -1)}
                            disabled={(productQuantities[product.id] || 1) === 1}
                        >
                            -
                        </button>
                        <span className="checkout-qty-value">{productQuantities[product.id] || 1}</span>
                        <button 
                            className="checkout-qty-btn" 
                            onClick={() => handleQuantityChange(product.id, 1)}
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}

            <div className="checkout-total">
                Total: <span className="checkout-total-value">₹{total.toFixed(2)}</span>
            </div>
            <button className="checkout-confirm-btn" onClick={handleProceedToDetails}>
                Proceed
            </button>
        </div>
    );
};

export default CheckoutPage;
 