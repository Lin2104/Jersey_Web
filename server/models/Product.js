// models/Product.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0.01
    },
    description: {
        type: String,
        required: true
    },
    // Array of public URLs for slider images/videos
    media: [{
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], required: true }
    }],
    // The available sizes for selection
    availableSizes: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'OVER'],
        required: true
    }],
    qrCodes: {
        type: Map, // Allows storing method names (keys) mapped to URLs (values)
        of: String, // The values (URLs) will be strings
        required: true, // Making this required ensures every product has this data
        default: {} 
    },
    // We only need one product, so we can ensure uniqueness
    slug: { 
        type: String,
        unique: true,
        default: 'jersey'
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;