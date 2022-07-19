const router = require('express').Router();
const { verifyTokenAndAdmin, verifyTokenAndAuthorizationOrAdmin } = require('../lib/verifyToken');
const CryptoJs = require('crypto-js');
const Cart = require('../models/Cart');

// Get all
router.get('/', verifyTokenAndAdmin, async(req, res) => {

    try {
        const carts = Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error);
    }

});

// Get User Cart
router.get('/find/:userId', verifyTokenAndAuthorizationOrAdmin, async (req, res) => {

    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
 
 });
 
 // Add Cart
router.post('/', verifyTokenAndAuthorizationOrAdmin, async (req, res) => {

    const newCart = new Cart(req.body);

    try {
        const saveCart = await newCart.save();
        res.status(200).json(saveCart);
    } catch (error) {
        res.status(500).json(error);
    }

});

// Update Cart
router.put('/:id', verifyTokenAndAuthorizationOrAdmin, async (req,res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{ new: true });
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error);
    }

}); 

// Delete Cart
router.delete('/:id', verifyTokenAndAuthorizationOrAdmin, async (req,res) => {
    
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart has been deleted');
    } catch (error) {
        res.status(500).json(error);
    }

});

module.exports = router;