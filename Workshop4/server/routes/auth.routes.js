const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const userController = require('../controllers/user');

router.post('/auth/token', authController.generateToken);
router.post('/user', userController.userPost);

module.exports = router;
