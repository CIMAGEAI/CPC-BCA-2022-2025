import React from 'react';
import CategoryGrid from '../components/CategoryGrid';
import BreadcrumbNavbar from '../components/BreadcrumbNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Example data (replace with your real data or fetch from API)
const appliancesCategories = [
    {
        name: 'Refrigerator and Freezer',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751400791/refrigerators-and-freezers-img_kkqrbf.webp',
        icon: <span role="img" aria-label="bed">🛏️</span>,
    },
    {
        name: 'Water Purifier',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751398197/water-purifier-img_k6bdwv.webp',
        icon: <span role="img" aria-label="appliances">🧊</span>,
    },
    {
        name: 'DishWater',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751398197/dishwashers-img_gms8sq.webp',
        icon: <span role="img" aria-label="wfh">💻</span>,
    },
    {
        name: 'Air Purifier',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751400844/air-purifier-img_gehnoz.webp',
        icon: <span role="img" aria-label="living">🛋️</span>,
    },
    {
        name: 'Desert Cooler',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751398196/air-coolers-img_pi7p6c.webp',
        icon: <span role="img" aria-label="kitchen">🍽️</span>,
    },
    {
        name: 'MicroWaves and Induction',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751398196/microwaves-and-induction-img_drlrmu.webp',
        icon: <span role="img" aria-label="kitchen">🍽️</span>,
    },
    {
        name: 'Washing Machine',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751398196/washing-machines-img_pqrpjh.webp',
        icon: <span role="img" aria-label="kitchen">🍽️</span>,
    },
    {
        name: 'Split Air Condition',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751398196/air-conditioners-img_aaj0dr.webp',
        icon: <span role="img" aria-label="kitchen">🍽️</span>,
    },
    {
        name: 'Television',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751398196/televisions-img_is3mxp.webp',
        icon: <span role="img" aria-label="kitchen">🍽️</span>,
    },
];

const AppliancesCategories = () => (
    <>
        <Navbar />
        <BreadcrumbNavbar />
        <CategoryGrid
            title="Electronics Devices on rent"
            subtitle="Checkout our huge collection of electronics devices on rent"
            categories={appliancesCategories}
        />
        <Footer />
    </>
);

export default AppliancesCategories;