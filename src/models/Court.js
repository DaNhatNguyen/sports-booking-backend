const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String, // vd: "Cầu lông", "Bóng đá"
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  images: [String], // danh sách link ảnh
  price: {
    type: Number,
    required: true,
  },
  subCourtCount: {
    type: Number,
    required: true, // số lượng sân nhỏ
  },
  openTime: {
    type: String, // ví dụ: "06:00"
    required: true,
  },
  closeTime: {
    type: String, // ví dụ: "22:00"
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },
  rating: {
    type: Number,
    default: 0,
  },
});

courtSchema.index({ location: '2dsphere' }); // cần thiết cho tìm kiếm khoảng cách

module.exports = mongoose.model('Court', courtSchema);
