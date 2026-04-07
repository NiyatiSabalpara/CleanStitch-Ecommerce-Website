const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    images: [String], // Array of URLs for multiple angles
    category: String, // e.g., "Oversized", "Streetwear"
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
    inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', ProductSchema);