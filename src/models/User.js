const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    userType: {
      type: String,
      enum: ['guest', 'admin'],
      default: 'guest',
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
