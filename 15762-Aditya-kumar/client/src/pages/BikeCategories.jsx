import React from 'react';
import CategoryGrid from '../components/CategoryGrid';
import BreadcrumbNavbar from '../components/BreadcrumbNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Example data (replace with your real data or fetch from API)
const bikesCategories = [
    {
        name: 'electric Scooty',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402594/eScooter-img_a4ng7t.webp',
        icon: <span role="img" aria-label="bed">🛏️</span>,
    },
    {
        name: 'Scooty',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402606/scooter-img_p1obnq.webp',
        icon: <span role="img" aria-label="appliances">🧊</span>,
    },
    {
        name: 'Bikes',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402606/moterbike-img_k4pg7e.webp',
        icon: <span role="img" aria-label="wfh">💻</span>,
    },

];

const BikesCategories = () => (
    <>
        <Navbar />
        <BreadcrumbNavbar />
        <CategoryGrid
            title="Bikes on rent"
            subtitle="Checkout our huge collection of Bikes and Scooty on rent"
            categories={bikesCategories}
        />
        <Footer />
    </>
);

export default BikesCategories;