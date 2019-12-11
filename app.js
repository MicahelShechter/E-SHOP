var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB  = require('./config/db');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const  productsRouter = require('./routes/product');
const categoryRoute = require('./routes/category');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');


//Connect DB
connectDB();

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/product',productsRouter);
app.use('/api/category',categoryRoute);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);


module.exports = app;
