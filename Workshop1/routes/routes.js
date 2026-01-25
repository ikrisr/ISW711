
const express = require('express');
const router = express.Router();
const Model = require('../models/model');

// POST
router.post('/post', (req, res) => {
  res.send('Post API');
});

// GET all
router.get('/getAll', (req, res) => {
  res.send('Get All API');
});

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send(req.params.id)
});

// PATCH by ID
router.patch('/update/:id', (req, res) => {
  res.send(`Update by ID API  id=${req.params.id}`);
});

// DELETE by ID
router.delete('/delete/:id', (req, res) => {
  res.send(`Delete by ID API id=${req.params.id}`);
});

router.post('/post', async (req, res) => {
    const data = new Model({
        name: 'John Doe',
        age: 30
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})


module.exports = router;