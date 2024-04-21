const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    pickupTime: { type: Date, default: null }, 
    deliveredTime: { type: Date, default: null }, 
    enteredTime: { type: Date, default: Date.now } 
}, {
    collection: 'Product'
});

// Create User model from schema
const Product = mongoose.model('Product', userSchema);

module.exports = Product; // Export the model