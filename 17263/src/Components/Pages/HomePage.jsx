import React from "react";
import AIBox from "./AIBox"; // import your existing AI chat component
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const categories = [
  {
    name: "Medicines",
    description: "Prescription & OTC drugs",
    products: "5,000+ products",
    color: "#1e88e5",
    emoji: "💊",
    route: "/products/medicines",
  },
  {
    name: "Skin Care",
    description: "Beauty & dermatology",
    products: "2,000+ products",
    color: "#ec407a",
    emoji: "🧴",
    route: "/products/skincare",
  },
  {
    name: "Baby Care",
    description: "Products for little ones",
    products: "1,500+ products",
    color: "#26c6da",
    emoji: "👶",
    route: "/products/babycare",
  },
  {
    name: "Ayurveda",
    description: "Herbal & natural remedies",
    products: "1,000+ products",
    color: "#66bb6a",
    emoji: "🌿",
    route: "/products/ayurveda",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <AIBox />

      <h2 className="section-title">🛒 Shop by Category</h2>
      <p className="section-subtitle">
        Find the right products for your health and wellness needs
      </p>

      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="category-card"
            style={{ backgroundColor: cat.color }}
            onClick={() => navigate(cat.route)}
          >
            <h3>
              {cat.emoji} {cat.name}
            </h3>
            <p>{cat.description}</p>
            <div className="card-footer">
              <span>{cat.products}</span>
              <button>Shop Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
