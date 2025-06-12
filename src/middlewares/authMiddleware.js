const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)

    // Gắn thông tin user vào req để các controller khác dùng
    const user = await User.findById(decoded.userId).select('-password');
    // console.log(user)
    if (!user) return res.status(401).json({ message: 'Token không hợp lệ.' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};

module.exports = authMiddleware;
