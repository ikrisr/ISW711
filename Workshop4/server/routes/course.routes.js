const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../controllers/auth');
const coursesController = require('../controllers/courses');

router.post('/course', authenticateToken, coursesController.coursePost);
router.get('/course', authenticateToken, coursesController.courseGet);
router.delete('/course', authenticateToken, coursesController.courseDelete);
router.put('/course', authenticateToken, coursesController.courseUpdate);

module.exports = router;
