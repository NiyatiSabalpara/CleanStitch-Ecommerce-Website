import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Home = ({ searchQuery, selectedCategory, setSelectedCategory, onAdd }) => {
  const [products, setProducts] = useState([]);
  const categories = ['All', 'Overshirts', 'Trousers', 'Sweatshirts & Hoodies', 'Shirts', 'T-Shirts', 'Co-ords'];

  useEffect(() => {
    axios.get(`/api/products?category=${encodeURIComponent(selectedCategory)}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products", err));
  }, [selectedCategory]);

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
          {products.length === 0 ? (
            <p>Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p>No products match your search.</p>
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
