const Court = require('../models/Court');

const getNearbyCourts = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query; // khoảng cách tính bằng mét

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Thiếu tọa độ vị trí người dùng.' });
    }

    const courts = await Court.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: 'distance',
          maxDistance: parseFloat(maxDistance),
          spherical: true,
        },
      },
      {
        $project: {
          name: 1,
          type: 1,
          address: 1,
          phoneNumber: 1,
          images: 1,
          price: 1,
          subCourtCount: 1,
          openTime: 1,
          closeTime: 1,
          rating: 1,
          distance: 1,
        },
      },
    ]);

    res.json(courts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sân.' });
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
