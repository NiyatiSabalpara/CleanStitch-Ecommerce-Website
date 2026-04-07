import React from 'react';

const Hero = () => {
    return (
        <header className="hero">
            <img 
                src="/images/hero_vacation.png" 
                alt="CleanStitch Hero" 
                className="hero-image"
            />
            <div className="hero-overlay">
                <div className="hero-content">
                    <h2 className="hero-title">The Vacation Edit</h2>
                    <button className="btn-primary">Shop Collection</button>
                </div>
            </div>
        </header>
    );
};

export default Hero;
