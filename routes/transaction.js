const path = require('path');

const express = require('express');

const transactionController = require('../controllers/transaction');

const router = express.Router();

router.post('/transaction', transactionController.postTransaction)

router.get('/transaction/:userId', transactionController.getTransaction)

module.exports = router;
