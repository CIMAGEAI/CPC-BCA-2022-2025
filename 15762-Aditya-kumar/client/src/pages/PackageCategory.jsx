// Pages/PackageCategory.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import BreadcrumbNavbar from '../components/BreadcrumbNavbar';

const mockData = {
    'bedroom': ['Bed Set', 'Wardrobe', 'Side Table'],
    'appliances': ['Fridge', 'Washing Machine', 'Microwave'],
    'wfh': ['Office Table', 'Ergonomic Chair'],
    'living-room': ['Sofa', 'TV Unit', 'Coffee Table'],
    'kitchen-dining': ['Dining Table', 'Chairs', 'Cutlery Set']
};

const PackageCategory = () => {
    const { category } = useParams();

    return (
        <>
            <BreadcrumbNavbar />
            <div className="category-detail">
                <h2>{category.replace(/-/g, ' ').toUpperCase()}</h2>
                <ul>
                    {mockData[category]?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    )) || <p>No items found for this category</p>}
                </ul>
            </div>
        </>
    );
};

export default PackageCategory;
