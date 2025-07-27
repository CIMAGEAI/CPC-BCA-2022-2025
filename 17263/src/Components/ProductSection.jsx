import React from "react";
import "./styles.css";

const ProductSection = ({ id, title, products }) => {
  return (
    <section className="shop" id={id}>
      <div className="text">
        <p>{title}</p>
      </div>
      <div className="container">
        {products.map((product, index) => (
          <div className="box" key={index}>
            <img
              src={`http://127.0.0.1:8000${product.image}`}
              height="200"
              width="200"
              alt={product.name}
            />
            <h4>{product.name}</h4>
            <h5>₹{product.price}</h5>
            <div className="cart">
              <a href="#">
                <i className="bx bx-cart"></i>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
