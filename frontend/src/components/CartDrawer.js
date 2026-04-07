import React from 'react';

const CartDrawer = ({ isOpen, onClose, cartItems, onCheckout, onRemove }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <>
            <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2 className="cart-title">Your Cart</h2>
                    <button className="close-cart" onClick={onClose}>✕</button>
                </div>
                
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Cart is empty</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <img src={item.images[0]} alt={item.name} className="cart-item-img" />
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-price">₹{item.price} - Size: {item.selectedSize || 'M'}</div>
                                </div>
                                <button 
                                    onClick={() => onRemove(index)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-color)',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        marginLeft: 'auto',
                                        padding: '0.5rem'
                                    }}
                                    title="Remove item"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Subtotal</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <button className="checkout-btn" onClick={onCheckout}>Checkout</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
