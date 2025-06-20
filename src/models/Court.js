const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourtGroup', required: true },
  name: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Court', courtSchema);
