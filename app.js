const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const authRoutes = require('./route/auth-route');
const userRoutes = require('./route/user-route');
const categoryRoutes = require('./route/category-route');
const productRoutes = require('./route/product-route');
const braintreeRoutes = require('./route/brainTree/brainTree')
const orderRoutes = require('./route/order');

mongoose.connect(process.env.MONGO_URL ,  
{useNewUrlParser: true , useUnifiedTopology: true} ).then(()=> console.log('DB connected'));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
  });

//middleware

app.use(morgan('dev'))
app.use(bodyParser.json({limit: '50mb'}))
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//routes middleware
  app.use('/api' ,authRoutes);
  app.use('/api' ,userRoutes);
  app.use('/api' ,categoryRoutes);
  app.use('/api' ,productRoutes);
  app.use('/api' ,braintreeRoutes);
  app.use('/api' , orderRoutes);

const port = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log('server is up and running');
    
});