import React from 'react';
import CategoryGrid from '../components/CategoryGrid';
import BreadcrumbNavbar from '../components/BreadcrumbNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Example data (replace with your real data or fetch from API)
const electronicsCategories = [
    {
        name: 'Game console',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402594/gamingConsole-img_uzrna4.webp',
        icon: <span role="img" aria-label="bed">🛏️</span>,
    },
    {
        name: 'Laptops ',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402594/laptops-img_umi555.webp',
        icon: <span role="img" aria-label="appliances">🧊</span>,
    },
    {
        name: 'Smart Devices',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402611/smart-devices-img_e9wcih.webp',
        icon: <span role="img" aria-label="wfh">💻</span>,
    },
    {
        name: 'Tablets / Ipads',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402614/tablets-img_beramq.webp',
        icon: <span role="img" aria-label="living">🛋️</span>,
    },
    {
        name: 'Smartphones',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402612/smartphones_new-img_ka0dl5.webp',
        icon: <span role="img" aria-label="kitchen">🍽️</span>,
    },

 
];

const ElectronicsCategories = () => (
    <>
        <Navbar />
        <BreadcrumbNavbar />
        <CategoryGrid
            title="Furnitures on rent"
            subtitle="Checkout our huge collection of Furnitures on rent"
            categories={electronicsCategories}
        />
        <Footer />
    </>
);

export default ElectronicsCategories;