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
const roomCategories = [
    {
        name: 'Bedroom',
        count: 15,
        image: bedroomImg,
        icon: <span role="img" aria-label="bed">🛏️</span>,
    },
    {
        name: 'Appliances',
        count: 19,
        image: appliancesImg,   
        icon: <span role="img" aria-label="appliances">🧊</span>,
    },
    {
        name: 'Work From Home (WFH)',
        count: 14,
        image: wfhImg,
        icon: <span role="img" aria-label="wfh">💻</span>,
    },
    {
        name: 'Living Room',
        count: 28,
        image: livingroomImg,
        icon: <span role="img" aria-label="living">🛋️</span>,
    },
    {
        name: 'Kitchen & Dining',
        count: 9,
        image: diningImg,
        icon: <span role="img" aria-label="kitchen">🍽️</span>,
    },
];

const PackagesCategories = () => (
    <>
    <Navbar />
    <BreadcrumbNavbar />
    <CategoryGrid
        title="Packages on rent"
        subtitle="Checkout our huge collection of packages on rent"
        categories={roomCategories}
    />
    <Footer />
    </>
);

export default PackagesCategories;