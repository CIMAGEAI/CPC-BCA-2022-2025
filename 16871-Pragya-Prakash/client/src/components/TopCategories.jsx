import { Link } from 'react-router-dom';
import './stylingCategories.css';
const TopCategories = () => {
    
    const categories = [
        {
            id: 1,
            name: 'Mango Pickels',
            image: '/assets/mangoPicklesImg.jpg',
            link: '/Products'
        },
        {
            id: 2,
            name: 'GreenChilly Pickles',
            image: '/assets/chilipickle.jpg',
            link: '/Products'
        },
        {
            id: 3,
            name: 'Red Chilly Pickles',
            image: '/assets/Red-Chilli-Pickle.jpeg',
            link: '/Products'
        }
    ];

    return (
        <section className="featured-categories">
            <h2>Top Categories</h2>
            <div className="categories-slider">
                {categories.map((category) => (
                    <div key={category.id} className="category-card">
                        <div className="category-image">
                            <img src={category.image} alt={category.name} />
                            <div className="category-overlay">
                                <h3>{category.name}</h3>
                                <Link to={category.link} className="shop-now-link">Shop Now</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TopCategories;