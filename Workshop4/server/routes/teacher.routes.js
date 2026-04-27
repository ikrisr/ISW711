const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../controllers/auth');
const teacherController = require('../controllers/teacher');

router.post('/teacher', authenticateToken, teacherController.teacherPost);
router.get('/teacher', authenticateToken, teacherController.teacherGet);
router.delete('/teacher', authenticateToken, teacherController.teacherDelete);
router.put('/teacher', authenticateToken, teacherController.teacherUpdate);

module.exports = router;
