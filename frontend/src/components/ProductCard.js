import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div 
            className="product-card group" 
            onClick={() => navigate(`/product/${product._id}`)}
            style={{ cursor: 'pointer', position: 'relative' }}
        >
            <div className="product-image-container">
                <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : ""} 
                    alt={product.name} 
                    className="product-img" 
                />
            </div>
            <div className="product-info" style={{ textAlign: 'center', marginTop: '1rem' }}>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
            </div>
        </div>
    );
};

export default ProductCard;
