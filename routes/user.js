const express = require('express');
const router = express.Router()
const UserController = require('../controllers/user')

router.post('/register', UserController.postRegister)

router.post('/login', UserController.postLogin)

router.post('/check-account', UserController.postFindAccount)

module.exports = router

