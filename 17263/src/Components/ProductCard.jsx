import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="box">
      <img src={product.image} height="200" width="200" alt={product.name} />
      <h4>{product.name}</h4>
      <h5>₹{product.price}</h5>
      <div className="cart">
        <a href="#">
          <i className="bx bx-cart"></i>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
