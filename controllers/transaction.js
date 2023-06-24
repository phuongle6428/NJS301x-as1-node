const Transaction = require('../models/transaction')
const User = require('../models/user')
const Hotel = require('../models/hotel')
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

exports.postTransaction = async (req, res, next) => {
  const user = req.body.user
  const hotel = req.body.hotel
  const room = req.body.room.map(({roomID, roomNumbers}) => {
    return {
      roomID: new ObjectId(roomID),
      roomNumbers
    }
  })
  const payment = req.body.payment
  const price = req.body.price
  const dateStart = req.body.dateStart
  const dateEnd = req.body.dateEnd
  let insUser = await User.updateMany(
    { _id: new ObjectId(user._id) },
    { fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber }
  ).exec()
  let transaction = new Transaction({
    user: new ObjectId(user._id),
    hotel: new ObjectId(hotel._id),
    room, dateStart, dateEnd, price, payment, status: 'Booked'
  })
  let result = await transaction.save()
  res.status(200).json(result)
}

exports.getTransaction = async (req, res, next) => {
  const userId = req.params.userId
  const result = await Transaction.find({user: new ObjectId(userId)})
  .populate('hotel', 'title').populate('room.roomID').sort({dateEnd: 'desc'})
  res.status(200).json(result)
}

