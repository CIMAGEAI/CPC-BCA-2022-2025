import React, { useEffect, useState } from "react";

import Header from "./components/Header";
import ProductSection from "./components/ProductSection";
import AIBox from "./components/AIBox"; // ✅ Handles both AI features
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("❌ Failed to fetch:", error));
  }, []);

  const categorize = (category) =>
    products.filter((p) => p.category.toLowerCase() === category.toLowerCase());

  return (
    <>
      <Header />

      {/* ✅ Combined AI Assistant Section */}
      <section style={{ padding: "2rem", backgroundColor: "#f9f9f9" }}>
        <h2>🧠 MedicoBot – Ask or Get Recommendations</h2>
        <AIBox />
      </section>

      {/* ✅ Product Sections */}
      <ProductSection
        id="babycare"
        title="BABY CARE PRODUCTS"
        products={categorize("babycare")}
      />
      <ProductSection
        id="medicine"
        title="MEDICINE PRODUCTS"
        products={categorize("medicine")}
      />
      <ProductSection
        id="ayurveda"
        title="AYURVEDA PRODUCTS"
        products={categorize("ayurveda")}
      />
      <ProductSection
        id="skincare"
        title="SKINCARE PRODUCTS"
        products={categorize("skincare")}
      />
    </>
  );
};

export default App;
