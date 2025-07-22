import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CategoriesStyle.css';

const categories = [
    {
        name: 'Packages',
        icon: (
            <svg width="48px" height="48px" fill="none" stroke="#1abc9c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

                <rect x="8" y="12" width="32" height="24" rx="4" stroke="#222" />
                <path d="M8 20h32" />
                <path d="M24 12v24" />
            </svg>
        ),
    },
    {
        name: 'Furniture',
        icon: (
            <svg width="48" height="48" fill="none" stroke="#1abc9c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="10" y="20" width="28" height="12" rx="2" stroke="#222" />
                <rect x="14" y="14" width="20" height="8" rx="2" stroke="#222" />
            </svg>
        ),
    },
    {
        name: 'Appliances',
        icon: (
            <svg width="48" height="48" fill="none" stroke="#1abc9c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="14" y="10" width="20" height="28" rx="2" stroke="#222" />
                <circle cx="24" cy="24" r="3" stroke="#1abc9c" />
            </svg>
        ),
    },
    {
        name: 'Electronics',
        icon: (
            <svg width="48" height="48" fill="none" stroke="#1abc9c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="16" y="12" width="16" height="24" rx="3" stroke="#222" />
                <circle cx="24" cy="34" r="1.5" fill="#1abc9c" />
            </svg>
        ),
    },
    {
        name: 'Bikes',
        icon: (
            <svg width="48" height="48" fill="none" stroke="#1abc9c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="14" cy="34" r="6" stroke="#222" />
                <circle cx="34" cy="34" r="6" stroke="#222" />
                <path d="M14 34L24 18L34 34" />
                <path d="M24 18V34" />
            </svg>
        ),
    },
    {
        name: 'Baby & Kids',
        icon: (
            <svg width="48" height="48" fill="none" stroke="#1abc9c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="14" y="24" width="20" height="10" rx="3" stroke="#222" />
                <circle cx="24" cy="20" r="4" stroke="#1abc9c" />
                <path d="M24 24v-4" />
            </svg>
        ),
    },
    {
        name: 'Medical',
        icon: (
            <svg width="48" height="48" fill="none" stroke="#1abc9c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="24" r="10" stroke="#222" />
                <path d="M24 18v12M18 24h12" />
            </svg>
        ),
    },
    {
        name: 'Fitness',
        icon: (
            <svg width="48" height="48" fill="none" stroke="#1abc9c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="16" y="20" width="24" height="12" rx="2" stroke="#222" />
                <circle cx="24" cy="26" r="2" stroke="#1abc9c" />
                <circle cx="32" cy="26" r="2" stroke="#1abc9c" />
            </svg>
        ),
    },
];

const Categories = () => (
    <div className="categories-section">
        <h2 className="categories-title">Rent Furniture & Appliances</h2>
        <div className="cat-grid">
            {categories.map((cat) => (
                <Link to={`/categories/${cat.name}`} >
                    <div className="category-card-grid" key={cat.name}>
                    <div className="category-icon">{cat.icon}</div>
                    <div className="category-label">{cat.name}</div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
);

export default Categories;
