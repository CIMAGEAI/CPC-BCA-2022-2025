import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

const CartIcon = () => {
  const { cartCount } = useContext(CartContext);

  return (
    <div className="cart-icon">
      <span className="badge">{cartCount}</span>
      <i className="fas fa-shopping-cart" aria-hidden="true"></i>
    </div>
  );
};

export default CartIcon;