import React from 'react';
import '../styles/KeyFeaturesStyle.css';
import qualityImg from '../assets/Icons/Quality.png';
import relocationImg from '../assets/Icons/return.png';
import maintenanceImg from '../assets/Icons/maintanance.png';
import cancelImg from '../assets/Icons/cancelled.png';
import returnImg from '../assets/Icons/easy-return.png';
import upgradeImg from '../assets/Icons/upgrading.png';

const features = [
    {
        icon: qualityImg,
        title: 'Finest-quality products',
        description: 'Quality matters to you, and us! That’s why we do a strict quality-check for every product.'
    },
    {
        icon: relocationImg,
        title: 'Free relocation',
        description: 'Changing your house or city? We’ll relocate your rented products for free.'
    },
    {
        icon: maintenanceImg,
        title: 'Free maintenance',
        description: 'Keeping your rented products in great condition is on us—sit back and relax.'
    },
    {
        icon: cancelImg,
        title: 'Cancel anytime',
        description: 'Pay only for the time you use the product. Cancel your subscription anytime, hassle-free.'
    },
    {
        icon: returnImg,
        title: 'Easy return on delivery',
        description: 'Didn’t like the product on delivery? Return it immediately—no questions asked.'
    },
    {
        icon: upgradeImg,
        title: 'Keep upgrading',
        description: 'Bored of the same product? Upgrade to a newer design and enjoy the change!'
    }
];

const KeyFeatures = () => {
    return (
        <section className="key-features">
            <div className="title-group">
                <h2>There’s more <br /> <span>to renting</span></h2>
                <div className="underline"></div>
            </div>
            <div className="features-grid">
                {features.map((feature, idx) => (
                    <div className="feature-item" key={idx}>
                        <img src={feature.icon} alt={feature.title} className="feature-icon" />
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
            <a href="/#" className="know-more-link">KNOW MORE</a>
        </section>
    );
};

export default KeyFeatures;
