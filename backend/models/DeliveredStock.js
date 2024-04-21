const mongoose = require('mongoose');

// Define delivered stock schema
const deliveredStockSchema = new mongoose.Schema({
    title: { type: String, required: false,  },
    description: { type: String, required: false },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    loggedUserID: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: { type: String, required: true },
    deliveredQuantity: { type: Number, required: true },
    stockEnteredTime: { type: Date, default: Date.now }, // Time when the stock was entered
    pickedUpTime: { type: Date, default: null }, // Time when the stock was picked up
    deliveredTime: { type: Date, default: Date.now } // Time when the stock was delivered
}, {
    collection: 'DeliveredStock'
});

const DeliveredStock = mongoose.model('DeliveredStock', deliveredStockSchema);

module.exports = DeliveredStock; 
