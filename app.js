const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to Database!');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const auth_routes = require('./routes/auth.routes');
const user_routes = require('./routes/user.routes');
const product_routes = require('./routes/product.routes');

app.use(auth_routes);
app.use(user_routes);
app.use(product_routes);

module.exports = app;
