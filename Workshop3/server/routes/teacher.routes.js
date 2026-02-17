const express = require('express');
const Teacher = require('../models/teacher');

const router = express.Router();

// Create a teacher
router.post('/teacher', async (req, res) => {
  const teacher = new Teacher({
    name: req.body.name,
    lastName: req.body.lastName,
    idNumber: req.body.idNumber,
    age: req.body.age
  });

  try {
    const teacherCreated = await teacher.save();
    res.header('Location', `/teacher?id=${teacherCreated._id}`);
    return res.status(201).json(teacherCreated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Get teachers (all or one by id)
router.get('/teacher', async (req, res) => {
  try {
    if (!req.query.id) {
      const data = await Teacher.find();
      return res.status(200).json(data);
    }

    const data = await Teacher.findById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Delete a teacher
router.delete('/teacher', async (req, res) => {
  try {
    await Teacher.deleteOne({ _id: req.query.id });
    return res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Update a teacher
router.put('/teacher', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.query.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.name = req.body.name;
    teacher.lastName = req.body.lastName;
    teacher.idNumber = req.body.idNumber;
    teacher.age = req.body.age;

    const teacherUpdated = await teacher.save();
    return res.status(200).json(teacherUpdated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

