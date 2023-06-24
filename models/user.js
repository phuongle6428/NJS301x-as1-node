const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
   username: {
      type: String,
      require: true
   },
   password: {
      type: String,
      require: true
   },
   fullName: {
      type: String
   },
   phoneNumber: {
      type: Number
   },
   email: {
      type: String
   },
   isAdmin: {
      type: Boolean,
      default: false
   }
})
module.exports = mongoose.model('User', userSchema);
