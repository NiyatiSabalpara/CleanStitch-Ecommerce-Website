const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Products');

const seedProducts = [
    {
        name: "Black Linen Pull-On Pants",
        price: 1699,
        description: "Relaxed fit trousers with an elastic waistband for maximum comfort and an effortless aesthetic. Pre-order.",
        images: ["/images/img1.png"],
        category: "Trousers",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Olive High-Waisted Trousers",
        price: 1899,
        description: "Premium thick cotton blend trousers engineered for the perfect oversized fit with retro aesthetics.",
        images: ["/images/img2.png"],
        category: "Trousers",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Vintage Brown Over-Shirt",
        price: 2199,
        description: "Heavyweight drop-shoulder overshirt with a textured finish.",
        images: ["/images/img3.png"],
        category: "Overshirts",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Ocean Blue Resort Shirt",
        price: 1499,
        description: "Fluid drape shirt perfect for beach days.",
        images: ["/images/img4.png"],
        category: "Shirts",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Everyday Basic White Tee",
        price: 999,
        description: "Premium thick cotton blend t-shirt engineered for the perfect relaxed fit.",
        images: ["/images/img5.png"],
        category: "T-Shirts",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Olive Sweatshirt Hoodie",
        price: 2499,
        description: "Cozy brushed terry hoodie for evening chills.",
        images: ["/images/img6.png"],
        category: "Sweatshirts & Hoodies",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Breezy Co-ord Set",
        price: 3499,
        description: "Matching shirt and shorts set in matching linen fabric.",
        images: ["/images/img7.png"],
        category: "Co-ords",
        sizes: ["S", "M", "L", "XL"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/cleanstitch', {
        });
        console.log("Connected to MongoDB");
        
        await Product.deleteMany({});
        console.log("Cleared existing products");

        await Product.insertMany(seedProducts);
        console.log("Database seeded successfully with dynamic product catalog.");

        process.exit(0);
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDB();
