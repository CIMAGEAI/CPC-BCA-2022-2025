import React from 'react';
import CategoryGrid from '../components/CategoryGrid';
import BreadcrumbNavbar from '../components/BreadcrumbNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Example data (replace with your real data or fetch from API)
const fitnessCategories = [
    {
        name: 'Electric Massagers',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402605/massagers-img_gi5s6p.webp',
        icon: <span role="img" aria-label="bed">🛏️</span>,
    },
    {
        name: 'Double-Hand waker',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751523068/waker-2_kqmdte.jpg',
        icon: <span role="img" aria-label="appliances">🧊</span>,
    },
    {
        name: 'Single-Hand waker',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751523069/images-3-2_gil88s.jpg',
        icon: <span role="img" aria-label="wfh">💻</span>,
    },
    {
        name: 'Treadmills',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402618/treadmills-img_ng3yfa.webp',
        icon: <span role="img" aria-label="wfh">💻</span>,
    },
    {
        name: 'Excercise Cycle',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402593/exercise-cycle-img_xjoxxi.webp',
        icon: <span role="img" aria-label="wfh">💻</span>,
    },
    {
        name: ' Cross-Cycle',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402593/cross-trainers-img_bsnopf.webp',
        icon: <span role="img" aria-label="wfh">💻</span>,
    },

];

const FitnessCategories = () => (
    <>
        <Navbar />
        <BreadcrumbNavbar />
        <CategoryGrid
            title="Fitness on rent"
            subtitle="Checkout our huge collection of Fitness on rent"
            categories={fitnessCategories}
        />
        <Footer />
    </>
);

export default FitnessCategories;