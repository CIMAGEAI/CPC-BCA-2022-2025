import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Categories.css';

const Categories = () => {
  const categories = ['tshirts', 'shoes', 'electronics', 'appliances', 'toys'];

  return (
    <div className="categories-page">
      <h2>Categories</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <Link key={category} to={`/category/${category}`} className="category-tile">
            <div className="category-img-wrapper">
              <img src={`/images/${category}.jpg`} alt={category} />
            </div>
            <h3>{category.toUpperCase()}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
