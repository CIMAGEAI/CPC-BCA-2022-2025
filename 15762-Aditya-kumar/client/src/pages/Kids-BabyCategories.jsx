import React from 'react';
import CategoryGrid from '../components/CategoryGrid';
import BreadcrumbNavbar from '../components/BreadcrumbNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Example data (replace with your real data or fetch from API)
const babyKidsCategories = [
    {
        name: 'Baby Careers',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402594/baby-carrier-img_he5rip.svg',
        icon: <span role="img" aria-label="bed">🛏️</span>,
    },
    {
        name: 'Baby Beds',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402594/babyFurniture-img_dts5dw.svg',
        icon: <span role="img" aria-label="appliances">🧊</span>,
    },
    {
        name: 'kids Cycles',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402597/kidsCycle-img_lvxkhw.svg',
        icon: <span role="img" aria-label="wfh">💻</span>,
    },
    {
        name: 'Baby Waker',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751523067/Baby-Waker-2_xiyhsz.jpg',
        icon: <span role="img" aria-label="wfh">💻</span>,
    },

];

const KidsBabyCategories = () => (
    <>
        <Navbar />
        <BreadcrumbNavbar />
        <CategoryGrid
            title="Baby & Kids things on rent"
            subtitle="Checkout our huge collection of Baby & Kids things on rent"
            categories={babyKidsCategories}
        />
        <Footer />
    </>
);

export default KidsBabyCategories;