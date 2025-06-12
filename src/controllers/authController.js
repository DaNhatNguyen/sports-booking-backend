const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng.' });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    // Tạo JWT token
    const token = jwt.sign(
      { userId: newUser._id, userType: newUser.userType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Trả về token + thông tin user
    return res.status(201).json({
      message: 'Đăng ký thành công!',
      token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        userType: newUser.userType,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Lỗi server.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Lỗi server.' });
  }
};

module.exports = { registerUser, loginUser };
