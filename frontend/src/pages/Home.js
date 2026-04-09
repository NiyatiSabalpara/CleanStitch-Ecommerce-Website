import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Home = ({ searchQuery, selectedCategory, setSelectedCategory, onAdd }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categories = ['All', 'Overshirts', 'Trousers', 'Sweatshirts & Hoodies', 'Shirts', 'T-Shirts', 'Co-ords'];

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    axios.get(`/api/products?category=${encodeURIComponent(selectedCategory)}`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products", err);
        setError("Could not connect to the server. Please make sure the backend is running.");
        setLoading(false);
      });
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <>
      <Hero />
      <main className="container">
        <div className="category-filter">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <div className="loading-spinner" />
              <p style={{ marginTop: '1rem', fontSize: '1rem' }}>Loading products...</p>
            </div>
          ) : error ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: '#c0392b', fontSize: '1rem', marginBottom: '1.2rem' }}>⚠️ {error}</p>
              <button
                className="filter-btn active"
                style={{ padding: '0.6rem 1.6rem', cursor: 'pointer' }}
                onClick={fetchProducts}
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <p>No products match your search.</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
              />
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
