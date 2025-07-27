import React from 'react';
import CategoryGrid from '../components/CategoryGrid';
import BreadcrumbNavbar from '../components/BreadcrumbNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonTheme } from 'react-loading-skeleton';


// Example data (replace with your real data or fetch from API)
const medicalCategories = [
    {
        name: 'Electric Massagers',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402605/massagers-img_gi5s6p.webp',
        icon: <span role="img" aria-label="bed">🛏️</span>,
    },
    {
        name: 'Hospital Beds',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402599/hospital-bed-img_rj1lud.png',
        icon: <span role="img" aria-label="appliances">🧊</span>,
    },
    {
        name: 'Wheel Chairs',
        image: 'https://res.cloudinary.com/du9m9w2rt/image/upload/v1751402620/wheel-chair-img_lwwuwa.png',
        icon: <span role="img" aria-label="wfh">💻</span>,
    },

];



const MedicalCategories = () => {
//     return(
//             <>
//                 <Navbar />
//                 <BreadcrumbNavbar />
//                 <CategoryGrid
//                     title="Medical  on rent"
//                     subtitle="Checkout our huge collection of Medical things on rent"
//                     categories={medicalCategories}
//                 />
//                 <Footer />
//             </>
    
    // )
    return (<>
        <SkeletonTheme baseColor="#eee" highlightColor="#f5f5f5">
        <Navbar/>
        <BreadcrumbNavbar/>
            <CategoryGrid
                                title="Medical  on rent"
                                subtitle="Checkout our huge collection of Medical things on rent"
                                categories={medicalCategories}
                            />
            <Footer />
            </SkeletonTheme>
        </>
    );
}

export default MedicalCategories;