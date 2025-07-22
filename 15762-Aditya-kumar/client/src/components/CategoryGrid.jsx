import React from 'react';
import '../styles/CategoriesGridStyle.css';

const CategoryGrid = ({ title, subtitle, categories }) => (
    <div className="category-page">
        <div className="category-header">
            <div className="category-title-row">
                <span className="category-icon">{/* You can use an <img> or icon here */}</span>
                <div>
                    <h1 className="category-title">{title}</h1>
                    <p className="category-subtitle">{subtitle}</p>
                </div>
            </div>
            <h2 className="category-section-title">Choose by Your choice</h2>
            <div className="category-section-underline"></div>
        </div>
        <div className="category-grid">
            {categories.map(cat => (
                <div className="category-card" key={cat.name}>
                    <img src={cat.image} alt={cat.name} className="category-img" />
                    <div className="category-card-info">
                        <span className="category-card-icon">{cat.icon}</span>
                        <div>
                            <div className="category-card-title">{cat.name}</div>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default CategoryGrid;