const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true
   },
   hotel: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      require: true
   },
   room: [{
      roomID: {
         type: Schema.Types.ObjectId,
         ref: 'Room',
         require: true
      },
      roomNumbers: {
         type: [Number],
         require: true
      },
      _id: false,
   }],
   dateStart: {
      type: Date,
      require: true
   },
   dateEnd: {
      type: Date,
      require: true
   },
   price: {
      type: Number,
      require: true
   },
   payment: {
      type: String,
      enum: ['Credit Card', 'Cash'],
      require: true
   },
   status: {
      type: String,
      enum: ['Booked', 'Checkin', 'CheckOut'],
      default: 'CheckOut'
   }
}, {timestamps: true})


module.exports = mongoose.model('Transaction', transactionSchema);

