const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt( req.body.password, process.env.CRYPT_PASS_SECRET ).toString()
    });

    if(req.body.isAdmin)
        newUser.isAdmin = true;

    try {
        res.status(201).json(await newUser.save());
    } catch (error) {
        res.status(500).json(error);
    }

});

// Login
router.post('/login', async(req,res) => {
    
    try {
        
        const user = await User.findOne({ username: { $regex: req.body.username, $options: 'i' } });

        if(!user) res.status(401).json('Wrong credentials!');
        else{
            const hashedPassword = CryptoJs.AES.decrypt( user.password, process.env.CRYPT_PASS_SECRET ).toString(CryptoJs.enc.Utf8);
            if(hashedPassword !== req.body.password) res.status(401).json('Wrong password !!');
            else{
                const { password, ...others } = user._doc;

                console.log({...others});

                const accessToken = jwt.sign({
                    ...others
                }, 
                    process.env.JWT_SECRET_KEY ,
                    { expiresIn: "2d" }
                );

                res.status(200).json({ accessToken });
            }
        }
        
    } catch (error) {

        res.status(500).json(error);
        
    }

});

module.exports = router;