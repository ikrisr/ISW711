const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    credits: {
        required: true,
        type: Number
    }, 
    teacherId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }

})

module.exports = mongoose.model('Course', courseSchema)