import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import './index.css';
function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };
  const categories = ['All', 'Overshirts', 'Trousers', 'Sweatshirts & Hoodies', 'Shirts', 'T-Shirts', 'Co-ords'];

  const loadRazorpayScript = () => {    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    // 1. Create order on backend
    let orderData;
    try {
      const { data } = await axios.post('/api/order', { amount: totalAmount });
      orderData = data;
    } catch (error) {
      alert("Error creating order");
      return;
    }

    let razorpayKey;
    try {
      const { data } = await axios.get('/api/config/razorpay');
      razorpayKey = data.key_id;
    } catch(e) {
      console.warn("Could not fetch config");
    }

    // 2. Open Razorpay Checkout Modal
    const options = {
      key: razorpayKey || "YOUR_RAZORPAY_KEY_ID",
      amount: orderData.amount,
      currency: "INR",
      name: "CleanStitch",
      description: "Premium Vacation Wear",
      order_id: orderData.id,
      handler: async function (response) {
        // 3. Verify Payment
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: totalAmount,
            items: cart.map(item => ({ product: item._id, price: item.price, size: item.selectedSize || "M", quantity: 1 }))
          };
          
          await axios.post('/api/order/verify', verifyData);
          alert(`Payment Successful! Order Confirmed.`);
          setCart([]);
          setIsCartOpen(false);
        } catch (error) {
          alert('Payment verification failed.');
        }
      },
      prefill: {
        name: "Valued Customer",
        email: "customer@cleanstitch.com",
        contact: "9999999999"
      },
      theme: {
        color: "#000000"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Router>
      <div className="App">
        <AnnouncementBar />
        <Navbar 
          cartCount={cart.length} 
          onCartClick={() => setIsCartOpen(true)} 
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          categories={categories}
          onSelectCategory={setSelectedCategory}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            } 
          />
          <Route 
            path="/product/:id" 
            element={
              <ProductDetails 
                onAdd={(p) => {
                  setCart([...cart, p]);
                  setIsCartOpen(true);
                }} 
              />
            } 
          />
        </Routes>

        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cartItems={cart}
          onCheckout={handleCheckout}
          onRemove={removeFromCart}
        />
      </div>
    </Router>
  );
}

export default App;