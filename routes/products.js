const router = require('express').Router();
const { verifyTokenAndAdmin } = require('../lib/verifyToken');
const CryptoJs = require('crypto-js');
const Product = require('../models/Product');

// Get all products | By 
router.get('/', async(req, res) => {

    // The possibility to get only last 5 added users 
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products ;

        if(qNew) products = await Product.find().sort({ createdAt: -1 }).limit(5);
        else if(qCategory) products = await Product.find({ categories: { $in: [qCategory] }});
        else products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }

});

// Get Product By Id
router.get('/find/:id', async (req, res) => {

    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
 
 });

 // Get User number of users creates every month
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {

    const date = new Date();
    const lastYear = new Date( date.setFullYear(date.getFullYear() - 1 ));

    try {
        const data = await Product.aggregate([
            { $match: { createdAt: { $gt: lastYear } }},
            { $project: { month: { $month: "$createdAt" } }},
            { $group: { _id: "$month", total: { $sum: 1 } } }
        ])
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }

});

// Add Product
router.post('/', verifyTokenAndAdmin, async (req, res) => {

    const newProduct = new Product(req.body);

    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
    } catch (error) {
        res.status(500).json(error);
    }

});

// Update Product
router.put('/:id', verifyTokenAndAdmin, async (req,res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{ new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }

}); 

// Delete Product
router.delete('/:id', verifyTokenAndAdmin, async (req,res) => {
    
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json('Product has been deleted');
    } catch (error) {
        res.status(500).json(error);
    }
    
    });
    
    module.exports = router;
