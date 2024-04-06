const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController').default;

router.post('/register', authController.registerUser);

module.exports = router;