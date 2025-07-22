import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/BreadcrumbNavbarStyle.css';

const categories = [
    { name: 'Packages', path: '/categories/packages' },
    { name: 'Furniture', path: '/categories/furniture' },
    { name: 'Appliances', path: '/categories/appliances' },
    { name: 'Electronics', path: '/categories/electronics' },
    { name: 'Bikes', path: '/categories/bikes' },
    { name: 'Baby & Kids', path: '/categories/baby-kids' },
    { name: 'Medical', path: '/categories/medical' },
    { name: 'Fitness', path: '/categories/fitness' },
];

const BreadcrumbNavbar = () => {
    const location = useLocation();

    // Get current page name from path
    const currentPage = location.pathname.split('/').filter(Boolean).pop() || 'Home';

    return (
        <div className="breadcrumbbar-container">
            <div className="breadcrumb">
                <a href="/" className="breadcrumb-link">Home</a>
                <span className="breadcrumb-separator">&gt;</span>
                {currentPage && (
                    <span className="breadcrumb-link active">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</span>
                )}
            </div>

            <nav className="category-nav">
                {categories.map(cat => (
                    <a
                        key={cat.name}
                        href={cat.path}
                        className={
                            location.pathname === cat.path ||
                                (cat.path.startsWith('/categories/') && location.pathname.startsWith(cat.path))
                                ? 'category-link active'
                                : 'category-link'
                        }
                    >
                        {cat.name}
                    </a>
                ))}
            </nav>
        </div>
    );
};

export default BreadcrumbNavbar;
