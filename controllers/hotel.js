const Hotel = require('../models/hotel')
const Room = require('../models/room')
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

exports.getAreaHotel = async (req, res, next) => {
   let areas = req.query.areas
   let result = await Hotel.getHotelByArea(areas)
   res.status(200).json(result)
}

exports.getTypeHotel = async (req, res, next) => {
   let types = req.query.types
   let result = await Hotel.getHotelByType(types)
   res.status(200).json(result)
}
exports.getRatingHotel = async (req, res, next) => {
   let number = req.query.number
   let result = await Hotel.getHotelByRating(number)
   res.status(200).json(result)
}

exports.getHotel = async (req, res, next) => {
   let _id = req.params.hotelId
   let result = await Hotel.findById(new ObjectId(_id))
   res.status(200).json(result)
}
exports.getHotels = async (req, res, next) => {
   const {options, date, destination} = req.body
   const hotels = await Hotel.getHotelByCons({minPerson: options.adult + options.children, numRooms: options.room}, date, destination)
   // console.log(hotels)
   res.status(200).json(hotels)
}

exports.getRooms = async (req, res, next) => {
   let _id = req.params.hotelId
   let hotel = await Hotel.findById(new ObjectId(_id)).populate('rooms') 
   let rooms = hotel.rooms 
   res.status(200).json(rooms)
}

exports.postVancantRooms = async (req, res, next) => {
   let _id = req.body.hotelId
   let startDate = req.body.dateStart
   let endDate = req.body.dateEnd
   let result = await Hotel.getVacantRoom(new ObjectId(_id), startDate, endDate)
   res.status(200).json(result.rooms)
}