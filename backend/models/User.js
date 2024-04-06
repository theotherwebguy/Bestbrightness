const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    collection: 'UserInfo'
});

// Create User model from schema
const User = mongoose.model('UserInfo', userSchema);

module.exports = User; // Export the model