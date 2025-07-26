import HeroSlider from '../components/heroslide';
import TopCollections from '../components/TopCollections';
import TopCategories from '../components/TopCategories';
import SeasonalOffers from '../components/SeasonalOffers';
import Reviews from '../components/Reviews';

const Homepage=()=>{
    return(
       <>
       
       <HeroSlider />
       <TopCollections />
       <TopCategories />
       <SeasonalOffers />
       <Reviews />
       </>
    )
}

export default Homepage;