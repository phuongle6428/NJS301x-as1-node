const User = require('../models/user')
const Transaction = require('../models/transaction')
const Hotel = require('../models/hotel')
const Room = require('../models/room')
const { ObjectId } = require('mongodb')

exports.postRegister = async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  let user = await User.find({ username: username }).exec()
  if (user.length > 0) {
    return res.status(400).json("Alrealy having user with that username")
  }
  let newUser = new User({
    username, password, isAdmin: true
  })
  let result = await newUser.save()
  res.status(200).json("Success")
}

exports.postLogin = async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  let user = await User.findOne({ username: username, password: password, isAdmin: true }).exec()
  if (user.length < 0) {
    return res.status(400).json("Wrong user name or password")
  }
  res.status(200).json({
    _id: user._id,
    username: user.username
  })
}

exports.getTransaction = async (req, res, next) => {
  const limit = req.query.limit
  const result = await Transaction.find().populate('hotel', 'title').populate('user', 'fullName')
  .sort({ dateEnd: 'desc' }).limit(limit)
  res.status(200).json(result)
}

exports.getHotel = async (req, res, next) => {
  const result = await Hotel.find().exec()
  res.status(200).json(result)
}

exports.getTransactionByHotel = async (req, res, next) => {
  const _id = req.query._id
  const result = await Transaction.find({hotel: new ObjectId(_id)})
  res.status(200).json(result)
}

exports.deleteHotel = async (req, res, next) => {
  const _id = req.body._id
  const result = await Hotel.findByIdAndDelete(new ObjectId(_id))
  res.status(200).json("Success")
}

exports.addHotel = async (req, res, next) => {
  const {name, type, city, address, distance, photos, desc, featured, rooms, title} = req.body
  const hotel = new Hotel({name, type, city, address, distance, photos, desc, featured, rooms, title})
  const result = await hotel.save()
  res.status(200).json(result)
}

exports.getRooms = async (req, res, next) => {
  const result = await Room.find().exec()
  res.status(200).json(result)
}

exports.getTransactionByRoom = async (req, res, next) => {
  const _id = req.query._id
  const result = await Transaction.find({'room.roomID' : new ObjectId(_id)})
  res.status(200).json(result)
}

exports.deleteRoom = async (req, res, next) => {
  const _id = req.body._id
  const result = await Room.findByIdAndDelete(new ObjectId(_id))
  const result2 = await Hotel.updateMany({}, {$pullAll : {rooms: [new ObjectId(_id)]}})
  res.status(200).json("Success")
}

exports.addRoom = async (req, res, next) => {
  const {price, desc, roomNumbers, maxPeople, title, hotelId} = req.body
  const reg = /([1-9]+)\s*/g
  let newRoomNumber = roomNumbers.match(reg)
  const room = new Room({title, price, maxPeople, desc, roomNumbers: newRoomNumber})
  let roomResult = await room.save()
  if(roomResult) {
    const result = await Hotel.updateOne({_id: new ObjectId(hotelId)}, {$push: {rooms : roomResult}} )
    res.status(200).json(result)
  }
  res.status(200).json('')
}