const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },
  studentList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  zoomLink: {
    type: String
  },
  teacher:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
