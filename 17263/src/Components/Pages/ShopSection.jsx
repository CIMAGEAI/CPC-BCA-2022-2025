import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";

const ShopSection = ({ category }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((res) => {
        const filtered = res.data.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase()
        );
        setProducts(filtered);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, [category]);

  return (
    <section className="shop" id={category.toLowerCase()}>
      <div className="text">
        <p>{category.toUpperCase()} PRODUCTS</p>
      </div>
      <div className="container">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
};

export default ShopSection;
