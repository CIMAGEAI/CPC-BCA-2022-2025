import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';
import { CartContext } from '../contexts/CartContext';

const Cart = () => {
  const { cart, totalCost, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price}</p>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
          </li>
        ))}
      </ul>
      <p>Total Cost: ${totalCost}</p>
      <button onClick={clearCart}>Clear Cart</button>
      <Link to="/checkout">
        <button>Checkout</button>
      </Link>
    </div>
  );
};

export default Cart;