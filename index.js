const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');

// Initializationes 
const app = express();
require("dotenv").config();

// Configuration
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.wve4k.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('⚡ DB Connected successfully!'))
    .catch((err) => console.log('📛 DB Error : ',err));
app.set('port', process.env.PORT || 5000);

// Cors Policy
let origins = process.env.FRONT_END_URL.split(',');
origins.forEach(origin => {
    app.use(cors({ origin, optionsSuccessStatus: 200 }));
});

// Body parser let data pass to the body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/order'));

// Starting the server
app.listen(app.get('port'), ()=>{
    console.log(`🚀 Server started at ${app.get('port')}`);
});