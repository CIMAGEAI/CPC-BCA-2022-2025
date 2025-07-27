import Navbar from '../components/Navbar';
import BannerSlider from '../components/BannerSlider';
import Categories from '../components/Categories';
import Footer from '../components/Footer';
import CutomerReviews from '../components/CutomerReviews';
import KeyFeatures from '../components/KeyFeatures';
import ProductSection from '../components/ProductSection';

const Home = () => {
    return (
        <>
            
            <Navbar />
            <BannerSlider />
            <Categories />
            <ProductSection />
            <CutomerReviews />
            <KeyFeatures />
            <Footer />
        </>
    );
};

export default Home;