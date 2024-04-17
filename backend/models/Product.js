const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    pickupTime: { type: Date, default: null }, // Added pickupTime field with default value null
    deliveredTime: { type: Date, default: null }, // Added deliveredTime field with default value null
    enteredTime: { type: Date, default: Date.now } // Added enteredTime field with default value set to current time
}, {
    collection: 'Product'
});

// Create User model from schema
const Product = mongoose.model('Product', userSchema);

module.exports = Product; // Export the model