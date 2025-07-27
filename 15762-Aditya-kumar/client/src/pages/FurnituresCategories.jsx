import React from 'react';
import CategoryGrid from '../components/CategoryGrid';
import BreadcrumbNavbar from '../components/BreadcrumbNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bedroomImg from '../assets/bedroom.jpg';
import appliancesImg from '../assets/appliances.webp';
import wfhImg from '../assets/study-room.webp';
import livingroomImg from '../assets/living-room.webp';
import diningImg from '../assets/dining.webp';

// Example data (replace with your real data or fetch from API)
const furnitureCategories = [
    {
        name: 'Bedroom',
        image: bedroomImg,
        icon: <span role="img" aria-label="bed">🛏️</span>,
    },
    {
        name: 'Appliances',
        image: appliancesImg,
        icon: <span role="img" aria-label="appliances">🧊</span>,
    },
    {
        name: 'Work From Home (WFH)',
        image: wfhImg,
        icon: <span role="img" aria-label="wfh">💻</span>,
    },
    {
        name: 'Living Room',
        image: livingroomImg,
        icon: <span role="img" aria-label="living">🛋️</span>,
    },
    {
        name: 'Kitchen & Dining',
        image: diningImg,
        icon: <span role="img" aria-label="kitchen">🍽️</span>,
    },
];

const FurnitureCategories = () => (
    <>
        <Navbar />
        <BreadcrumbNavbar />
        <CategoryGrid
            title="Furnitures on rent"
            subtitle="Checkout our huge collection of Furnitures on rent"
            categories={furnitureCategories}
        />
        <Footer />
    </>
);

export default FurnitureCategories;