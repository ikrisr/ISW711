const express = require('express');
const Teacher = require('../models/teacher');

const router = express.Router();

module.exports = router;

const teacherController = require('../controllers/teacher');
router.post('/teacher', teacherController.teacherPost);
router.get('/teacher', teacherController.teacherGet);
router.delete('/teacher', teacherController.teacherDelete);
router.put('/teacher', teacherController.teacherUpdate);

//const authController = require('../controllers/auth');
//router.post('/login', authController.login);



