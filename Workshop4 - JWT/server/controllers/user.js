const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Create a user
const  userPost = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const userCreated = await user.save();
    res.header('Location', `/user?id=${userCreated._id}`);
    return res.status(201).json(userCreated);
    
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};