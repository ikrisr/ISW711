const express = require('express');
const Course = require('../models/course');
const Teacher = require('../models/teacher'); 

const router = express.Router();

module.exports = router;

const coursesController = require('../controllers/courses');
router.post('/course', coursesController.coursePost);
router.get('/course', coursesController.courseGet);
router.delete('/course', coursesController.courseDelete);
router.put('/course', coursesController.courseUpdate);

const teacherController = require('../controllers/teacher');
router.post('/teacher', teacherController.teacherPost);
router.get('/teacher', teacherController.teacherGet);
router.delete('/teacher', teacherController.teacherDelete);
router.put('/teacher', teacherController.teacherUpdate);

//const authController = require('../controllers/auth');
//router.post('/login', authController.login);
