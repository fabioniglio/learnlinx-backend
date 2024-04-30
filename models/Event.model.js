const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  eventTitle: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeStart: {
    type: String,
    required: true
  },
  timeEnd: {
    type: String,
    required: true
  },
  dayOfWeek: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  color: {
    type: String,
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
