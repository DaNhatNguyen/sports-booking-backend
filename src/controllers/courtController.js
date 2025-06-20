const Court = require('../models/Court');

// Lấy ra các sân gần khu vực client
const getNearbyCourts = async (req, res) => {
  try {
    const { province, district } = req.query;

    if (!province || !district) {
      return res.status(400).json({ message: 'Thiếu thông tin tỉnh hoặc quận.' });
    }

    // Regex để tìm trong địa chỉ (vd: "Thanh Xuân.*Hà Nội")
    const addressRegex = new RegExp(`${district}.*${province}`, 'i');

    const courts = await Court.find({ address: addressRegex }).select(
      'name type address phoneNumber images price subCourtCount openTime closeTime rating'
    );

    return res.status(200).json(courts);
  } catch (error) {
    console.error('Lỗi khi lấy sân theo khu vực:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy sân theo khu vực.' });
  }
};

// Tìm kiếm sân
const searchCourts = async (req, res) => {
  try {
    const { type, city, district } = req.query;

    const query = {};

    // Môn thể thao
    if (type) query.type = type;

    // Tìm trong địa chỉ chứa quận/huyện hoặc tỉnh/thành
    if (city && district) {
      query.address = { $regex: `${district}.*${city}`, $options: 'i' };
    } else if (city) {
      query.address = { $regex: city, $options: 'i' };
    } else if (district) {
      query.address = { $regex: district, $options: 'i' };
    }

    const courts = await Court.find(query).select(
      'name type address phoneNumber images price subCourtCount openTime closeTime rating'
    );

    const results = courts.map(court => ({
      ...court.toObject(),
      distance: 0.0 // Tạm thời cố định
    }));

    return res.status(200).json(results);
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ message: 'Lỗi server khi tìm kiếm sân.' });
  }
};

// Lấy các sân theo thể loại
const getCourtsByFilter = async (req, res) => {
  try {
    const { type, city, district } = req.query;

    const typeMap = {
      'bong-da': 'Bóng đá',
      'cau-long': 'Cầu lông',
      'tennis': 'Tennis',
      'bong-ban': 'Bóng bàn'
    };

    const query = {};

    // Lọc theo loại sân
    if (type) {
      const mapped = typeMap[type];
      if (mapped) {
        query.type = { $regex: `^${mapped}$`, $options: 'i' };
      }
    }

    console.log(query.type);

    // Lọc theo địa chỉ chứa tên quận/huyện và/hoặc tỉnh/thành
    if (city && district) {
      query.address = { $regex: `${district}.*${city}`, $options: 'i' };
    } else if (city) {
      query.address = { $regex: city, $options: 'i' };
    } else if (district) {
      query.address = { $regex: district, $options: 'i' };
    }

    const courts = await Court.find(query).select(
      'name type address phoneNumber images price subCourtCount openTime closeTime rating'
    );

    const results = courts.map(court => ({
      ...court.toObject(),
      distance: 0.0
    }));

    return res.status(200).json(results);
  } catch (err) {
    console.error('Lỗi khi lọc sân:', err);
    return res.status(500).json({ message: 'Lỗi server khi lọc sân theo loại và khu vực.' });
  }
};

module.exports = { getNearbyCourts, searchCourts, getCourtsByFilter };
