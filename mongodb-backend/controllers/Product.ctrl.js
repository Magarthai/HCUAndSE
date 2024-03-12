const Product = require('../models/Product.model');
const asyncHandler = require('express-async-handler');

const createProduct = asyncHandler(async (req, res) => {
    try {
        const redeemCodeLength = 10;
        const redeemCode = generateRedeemCode(redeemCodeLength);
        const productData = { ...req.body, code: redeemCode };
        const newProduct = await Product.create(productData);
        
        res.json(newProduct);
        console.log("Product created successfully");
    } catch (error) {
        throw new Error(error);
    }
});

//get single product
const getSingleProduct = asyncHandler(async (req, res) => {
    const { id } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

// get all products
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find(req.query);
        res.json(products);
    } catch (error) {
        throw new Error(error);
    }
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = { createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct};