const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/register', adminController.postRegister)

router.post('/login', adminController.postLogin)

router.get('/transaction', adminController.getTransaction)

router.get('/transaction/hotel', adminController.getTransactionByHotel)

router.get('/transaction/room', adminController.getTransactionByRoom)

router.get('/hotel', adminController.getHotel)

router.delete('/hotel', adminController.deleteHotel)

router.post('/add/hotel', adminController.addHotel)

router.get('/rooms', adminController.getRooms)

router.delete('/room', adminController.deleteRoom)

router.post('/add/room', adminController.addRoom)

module.exports = router;
