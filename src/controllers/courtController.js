const Court = require('../models/Court');

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

module.exports = { getNearbyCourts, searchCourts };
