const express = require('express');
const router = express.Router()
const hotelController = require('../controllers/hotel')


router.get('/areas', hotelController.getAreaHotel)

router.get('/types', hotelController.getTypeHotel)

router.get('/rating', hotelController.getRatingHotel)

router.get('/:hotelId', hotelController.getHotel)

router.post('/search', hotelController.getHotels)

router.get('/rooms/:hotelId', hotelController.getRooms)

router.post('/rooms/vacant', hotelController.postVancantRooms)

module.exports = router