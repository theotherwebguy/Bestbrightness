const mongoose = require('mongoose');

// Define picked stock schema
const pickedStockSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    loggedUserID: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: { type: String, required: true },
    pickedQuantity: { type: Number, required: true },
    stockEnteredTime: { type: Date, default: Date.now }, 
    pickupTime: { type: Date, default: Date.now },
    deliveredTime: { type: Date, default: null }
}, {
    collection: 'PickedStock'
});

const PickedStock = mongoose.model('PickedStock', pickedStockSchema);

module.exports = PickedStock; 
