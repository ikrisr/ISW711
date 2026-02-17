const express = require('express');
const Course = require('../models/course');
const Teacher = require('../models/teacher'); 

const router = express.Router();

//Post 
router.post('/course', async (req, res) => {
  const course = new Course({
    name: req.body.name,
    credits: req.body.credits,
    teacherId: req.body.teacherId
  });

  try {
    // Verify that the teacher exists
    const teacher = await Teacher.findById(req.body.teacherId);
    if (!teacher) {
      return res.status(400).json({ message: 'teacherId no existe' });
    }
    const courseCreated = await course.save();

    // add header location to the response
    res.header('Location', `/course?id=${courseCreated._id}`);
    return res.status(201).json(courseCreated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

//Route for get courses
router.get('/course', async (req, res) => {
  try {
    if (!req.query.id) {
      const data = await Course.find();
      return res.status(200).json(data);
    }

    const data = await Course.findById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Route for delete a course
router.delete('/course', async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.query.id });
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Route for update a course
router.put('/course', async (req, res) => {
  try {
    const course = await Course.findById(req.query.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const teacher = await Teacher.findById(req.body.teacherId);
    if (!teacher) {
      return res.status(400).json({ message: 'teacherId no existe' });
    }

    course.name = req.body.name;
    course.credits = req.body.credits;
    course.teacherId = req.body.teacherId;

    const courseUpdated = await course.save();
    return res.status(200).json(courseUpdated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
