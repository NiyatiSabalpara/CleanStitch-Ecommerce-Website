import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = ({ onAdd }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState('M');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        if (res.data.sizes && res.data.sizes.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Loading Product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <button className="checkout-btn" onClick={() => navigate('/')} style={{ marginTop: '1rem', width: 'auto' }}>
          Back to Home
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 500);
    onAdd({ ...product, selectedSize });
  };

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-color)', marginBottom: '2rem', fontSize: '1.1rem' }}
      >
        ← Back to Shop
      </button>

      <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <img 
            src={product.images && product.images.length > 0 ? product.images[0] : ""} 
            alt={product.name} 
            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} 
          />
        </div>
        
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{product.name}</h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', margin: 0 }}>₹{product.price}</p>
          
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>Select Size:</h3>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              {product.sizes && product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '50px',
                    border: selectedSize === size ? '2px solid var(--text-color)' : '1px solid var(--border-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-color)',
                    fontWeight: selectedSize === size ? 'bold' : 'normal',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: isAdding ? '#4CAF50' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transform: isAdding ? 'scale(0.98)' : 'scale(1)',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            {isAdding ? 'Added! ✓' : 'Add to Cart +'}
          </button>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Product Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{product.description}</p>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Return Policy</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              7-Day Easy Returns. Item must be unworn and unwashed with original tags attached.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
