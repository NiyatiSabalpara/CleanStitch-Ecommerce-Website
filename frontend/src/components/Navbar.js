import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount, onCartClick, searchQuery, onSearch, categories, onSelectCategory }) => {
    const navigate = useNavigate();

    return (
        <nav className="navbar flex-between">
            <div className="nav-links">
                <a href="#shop" onClick={(e) => { e.preventDefault(); onSelectCategory('All', true); navigate('/'); }}>Shop All</a>
                <div className="dropdown">
                    <a href="#collections" className="dropbtn" onClick={e => e.preventDefault()}>Collections ▼</a>
                    <div className="dropdown-content">
                        {categories && categories.filter(c => c !== 'All').map(cat => (
                           <a key={cat} href={`#${cat}`} onClick={(e) => {
                               e.preventDefault();
                               onSelectCategory(cat);
                               navigate('/');
                           }}>{cat}</a>
                        ))}
                    </div>
                </div>
            </div>
            <h1 
                className="brand-logo" 
                style={{ cursor: 'pointer' }} 
                onClick={() => { 
                    onSelectCategory('All'); 
                    navigate('/');
                    window.scrollTo(0, 0); 
                }}
            >
                CleanStitch
            </h1>
            <div className="nav-icons">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    style={{
                        padding: '0.2rem 0.5rem', 
                        border: 'none', 
                        borderBottom: '1px solid #ccc',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.8rem',
                        fontFamily: 'inherit',
                        width: '120px'
                    }}
                />
                <div className="cart-icon-wrapper" onClick={onCartClick}>
                    <span>Cart</span>
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
