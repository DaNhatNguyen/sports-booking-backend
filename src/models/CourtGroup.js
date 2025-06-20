const mongoose = require('mongoose');

const courtGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  address: { type: String, required: true },
  district: String,
  province: String,
  phoneNumber: { type: String }, 
  images: [{ type: String }], 
  openTime: { type: String }, 
  closeTime: { type: String }, 
  rating: { type: Number, min: 1, max: 5, default: 5 }, 
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CourtGroup', courtGroupSchema);
