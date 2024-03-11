const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    productInfo: {
        type: String
    },
    productPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0 
    },
    productImage: {
        type: Array,
        required: false 
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    pointsValue: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
