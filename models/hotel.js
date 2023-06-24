const Transaction = require('./transaction');
const Room = require('./room');

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
   name: {
      type: String,
      require: true
   },
   type: {
      type: String,
      require: true
   },
   city: {
      type: String,
      require: true
   },
   address: {
      type: String,
      require: true
   },
   distance: {
      type: String,
      require: true
   },
   photos: {
      type: [String],
      require: true,
      default: undefined
   },
   desc: {
      type: String,
      require: true
   },
   rating: {
      type: Number
   },
   featured: {
      type: Boolean,
      require: true
   },
   rooms: [{
      type: Schema.Types.ObjectId,
      ref: 'Room',
      require: true
   }],
   cheapestPrice: {
      type: Number,
      require: true
   },
   title: {
      type: String,
      require: true
   }
})

hotelSchema.statics.getHotelByArea = async function (areas) {
   let result = await Promise.all(areas.map(async value => {
      let data = await this.find({ city: value })
      return { area: value, hotels: data, image: value + ".jpg" }
   }))
   return result
}
hotelSchema.statics.getHotelByType = async function (types) {
   let result = await Promise.all(types.map(async value => {
      let data = await this.find({ type: value.toLowerCase() })
      return { type: value, instances: data, image: value + ".jpg" }
   }))
   return result
}

hotelSchema.statics.getHotelByRating = async function (number) {
   let result = await this.find().sort({ rating: 'desc' }).limit(3)
   return result
}

hotelSchema.statics.getVacantRoom = async function (hotelID, start, end) {
   let startDate = new Date(start)
   let endDate = new Date(end)
   const hotel = await this.findById(hotelID).populate('rooms')
   let NotVacant = await Transaction.find({ hotel: hotelID, status: { $in: ['Booked', 'Checkin'] } })
   if(NotVacant?.length < 1) {
      return hotel
   }
   let x = await Transaction.find({ hotel: hotelID, status: { $in: ['Booked', 'Checkin'] }, dateStart: { $gt: endDate } })
   let y = await Transaction.find({ hotel: hotelID, status: { $in: ['Booked', 'Checkin'] }, dateEnd: { $lt: startDate } })
   let accept = x.concat(y)
   let NotAcceptVancant
   if(accept.length > 0) {
      NotAcceptVancant = NotVacant.filter(value => {
         let index = accept.findIndex(value2 => {
            return value._id.toString() === value2._id.toString()
         })
         if (index < 0) {
            return true
         } else return false
      })
   } else {NotAcceptVancant = NotVacant}

   let NAVRooms = NotAcceptVancant.map(trans => {
      return trans.room.map(value => value.roomNumbers)
   }).flat(2)
   let rooms = hotel.rooms.map(room => {
      let roomNumbers = room.roomNumbers.filter(value => {
         let index = NAVRooms.findIndex(value2 => {
            return value2 === value
         })
         if (index < 0) {
            return true
         } else return false
      })
      return { ...room._doc, roomNumbers }
   })
   const returnHotel = {...hotel._doc, rooms: rooms}
   return returnHotel
}

hotelSchema.statics.getHotelByCons = async function (option, date, destination) {
   const hotelByDes = await this.find({ city: destination })
   const vacantHotel = await Promise.all(hotelByDes.map(async value => {
      let data = await this.getVacantRoom(value._id, new Date(date.startDate), new Date(date.endDate))
      return data
   }))
   const x = await Promise.all(vacantHotel.map(async (xValue) => {
      let rooms = xValue.rooms
      let suiableRoom = 0
      let y = rooms.map((yValue) => {
         if(option.maxPrice && yValue.price > option.maxPrice) {
            return null
         }
         if(option.minPrice && yValue.price < option.minPrice) {
            return null
         }
         if(option.maxPerson && yValue.maxPeople < option.maxPerson) {
            return null
         }
         suiableRoom += yValue.roomNumbers.length
         return yValue
      })
      if ( suiableRoom < option.numRooms) {
         return null
      }
      xValue.rooms = y.filter((value) => value)
      return xValue
   }))
   return x.filter(value => value)
}


module.exports = mongoose.model('Hotel', hotelSchema);