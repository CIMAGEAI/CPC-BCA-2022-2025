import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/CartPage.css';

const CartPage = () => {
  const {
    cartItems: cart,
    totalCost,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    error,
  } = useContext(CartContext);

  const navigate = useNavigate();

  if (error) return <p style={{ color: 'red' }}>{error.toString()}</p>;
  if (!cart) return <p>Loading cart...</p>;

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/submit-details', {
        state: {
          products: cart, 
        },
      });
    }
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <button onClick={() => navigate('/')} className="btn-shop">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <Link to={`/product/${item.id}`} className="product-image-link">
                <div className="product-image">
                  <img src={item.image} alt={item.title} />
                </div>
                </Link>
                <div className="product-info">
                  <Link to={`/product/${item.id}`} className="product-title-link">
                    <h3>{item.title}</h3>
                  </Link>
                  <p className="product-price">
                    ₹{item.price} x {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="quantity">
                    <button onClick={() => decreaseQuantity(item.id)} className="quantity-button">
                      <FaMinus size={12} />
                    </button>
                    <span className="quantity-text">{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)} className="quantity-button">
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="remove-button">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <strong>₹{totalCost !== undefined ? totalCost.toFixed(2) : '0.00'}</strong>
            </div>
          </div>

          <div className="cart-actions">
            <button onClick={clearCart} className="clear-button">
              Clear Cart
            </button>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
