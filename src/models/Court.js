const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  images: [String],
  price: {
    type: Number,
    required: true,
  },
  subCourtCount: {
    type: Number,
    required: true,
  },
  openTime: {
    type: String,
    required: true,
  },
  closeTime: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

courtSchema.index({ location: '2dsphere' }); // cần thiết cho tìm kiếm khoảng cách

module.exports = mongoose.model('Court', courtSchema);
