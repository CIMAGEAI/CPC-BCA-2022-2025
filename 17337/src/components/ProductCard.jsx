import React, { useContext, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/ProductCard.css';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../authContext';

const ProductCard = ({ product }) => {
    const { cartItems, addToCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const cartItem = cartItems?.find((item) => item.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = useCallback(() => {
        if (currentUser) {
            addToCart({ ...product, quantity: 1 });
        } else {
            alert("Please log in to add items to your cart.");
            navigate('/login', { state: { from: location, productToAdd: product } });
        }
    }, [currentUser, addToCart, product, navigate, location]);

    const handleBuyNow = useCallback(() => {
        if (currentUser) {
            const quantityToSend = quantityInCart > 0 ? quantityInCart : 1;
            
            navigate("/checkout", { 
                state: { products: [{ ...product, quantity: quantityToSend }] } 
            });
        } else {
            alert("Please log in to buy this item.");
            navigate('/login', { state: { from: location, productToAdd: product } });
        }
    }, [currentUser, navigate, product, location, quantityInCart]);

    const handleIncrease = useCallback(() => {
        if (product) increaseQuantity(product.id);
    }, [increaseQuantity, product]);

    const handleDecrease = useCallback(() => {
        if (product) decreaseQuantity(product.id);
    }, [decreaseQuantity, product]);

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-card__link">
                <div className="product-card__image-container">
                    <img className="product-card__image" src={product.image} alt={product.title} />
                </div>
                <div className="product-card__info">
                    <h3 className="product-card__title">{product.title}</h3>
                    <div className="product-card__pricing">
                        <strong className="product-card__price">₹{product.price}</strong>
                        {product.cutoffPrice && (
                            <s className="product-card__cutoff-price">₹{product.cutoffPrice}</s>
                        )}
                    </div>
                </div>
            </Link>
            <div className="product-card__actions">
                {quantityInCart > 0 ? (
                    <div className="product-card__quantity-control">
                        <button className="product-card__quantity-btn" onClick={handleDecrease}>-</button>
                        <span className="product-card__quantity-text">{quantityInCart}</span>
                        <button className="product-card__quantity-btn" onClick={handleIncrease}>+</button>
                    </div>
                ) : (
                    <button
                        className="product-card__btn product-card__btn--primary"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                )}
                <button
                    className="product-card__btn product-card__btn--secondary"
                    onClick={handleBuyNow}
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
