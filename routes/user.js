const router = require('express').Router();
const { verifyTokenAndAuthorizationOrAdmin, verifyTokenAndAdmin } = require('../lib/verifyToken');
const CryptoJs = require('crypto-js');
const User = require('../models/User');

// Get all users
router.get('/', verifyTokenAndAdmin, async(req, res) => {

    // The possibility to get only last 5 added users 
    const query = req.query.new;
    try {
        res.status(200).json(query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find());
    } catch (error) {
        res.status(500).json(error);
    }

});

// Get User By Id
router.get('/find/:id', verifyTokenAndAuthorizationOrAdmin, async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
 
 });

 // Get User number of users creates every month
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {

    const date = new Date();
    const lastYear = new Date( date.setFullYear(date.getFullYear() - 1 ));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gt: lastYear } }},
            { $project: { month: { $month: "$createdAt" } }},
            { $group: { _id: "$month", total: { $sum: 1 } } }
        ])
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }

});

// Update user
router.put('/:id', verifyTokenAndAuthorizationOrAdmin, async (req,res) => {

    if(req.body.password)
    { 
        req.body.password = CryptoJs.AES.encrypt( 
            req.body.password,
            process.env.CRYPT_PASS_SECRET
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{ new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }

}); 

// Delete user
router.delete('/:id', verifyTokenAndAuthorizationOrAdmin, async (req,res) => {
    
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted');
    } catch (error) {
        res.status(500).json(error);
    }
    
    });
    
    module.exports = router;

