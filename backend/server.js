const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const Product = require('./models/Products');
const Order = require('./models/Order');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/cleanstitch')
    .then(() => console.log("CleanStitch DB Connected"))
    .catch(err => console.log(err));

// Razorpay Setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Routes
app.get('/api/config/razorpay', (req, res) => {
    res.json({ key_id: process.env.RAZORPAY_KEY_ID });
});

app.get('/api/products', async (req, res) => {
    try {
        const category = req.query.category;
        const filter = category && category !== 'All' ? { category } : {};
        const products = await Product.find(filter);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/order', async (req, res) => {
    const options = {
        amount: req.body.amount * 100, // in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) { 
        res.status(500).send(err); 
    }
});

app.post('/api/order/verify', async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            items,
            amount
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Document the order in MongoDB
            const order = new Order({
                items,
                totalAmount: amount, // INR
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: 'Payment Successful'
            });
            await order.save();

            res.json({ message: 'Payment successfully verified', orderId: order._id });
        } else {
            res.status(400).json({ error: 'Invalid Signature' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve frontend build dynamically
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CleanStitch Server running on port ${PORT}`));