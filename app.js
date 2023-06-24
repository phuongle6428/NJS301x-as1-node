const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();


// const User = require('./models/user');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');
const transactionRoutes = require('./routes/transaction');
const UserRoutes = require('./routes/user');
const hotelRoutes = require('./routes/hotel');

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
   next();
})

app.use('/admin', adminRoutes);
app.use(UserRoutes);
app.use(transactionRoutes)
app.use('/hotel', hotelRoutes)

// app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://phuong:8u35MwmioNL1zRO1@cluster0.yd1v9tj.mongodb.net/assignment02?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });