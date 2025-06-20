const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // VD: "08:00"
  endTime: { type: String, required: true }    // VD: "09:00"
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);