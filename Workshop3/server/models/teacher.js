
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  lastName: {
    required: true,
    type: String
  },
  idNumber: {
    required: true,
    type: String,
    unique: true 
  },
  age: {
    required: true,
    type: Number
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);
