const CourtGroup = require('../models/CourtGroup');
const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');

const getNearbyCourtGroups = async (req, res) => {
  try {
    const { province, district } = req.query;

    // console.log('[GET nearby] Province:', province, 'District:', district);

    if (!province || !district) {
      return res.status(400).json({ message: 'Thiếu thông tin tỉnh hoặc quận.' });
    }

    // Tìm sân theo tỉnh + quận (không phân biệt hoa thường)
    const courtGroups = await CourtGroup.find({
      province: { $regex: new RegExp(province, 'i') },
      district: { $regex: new RegExp(district, 'i') }
    }).select(
      'name type address district province phoneNumber images openTime closeTime rating description createdBy createdAt'
    );

    return res.status(200).json(courtGroups);
  } catch (error) {
    console.error('Lỗi khi lấy courtGroup theo khu vực:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy sân theo khu vực.' });
  }
};

// Tìm kiếm sân
const searchCourtGroups = async (req, res) => {
  try {
    const { type, city, district } = req.query;
    console.log(req.query);

    const query = {};

    // Lọc theo loại sân (vd: badminton, football, tennis,...)
    if (type) {
      query.type = { $regex: new RegExp(type, 'i') };
    }

    // Lọc theo tỉnh/thành
    if (city) {
      query.province = { $regex: new RegExp(city, 'i') };
    }

    // Lọc theo quận/huyện
    if (district) {
      query.district = { $regex: new RegExp(district, 'i') };
    }

    const courtGroups = await CourtGroup.find(query).select(
      'name type address district province images phoneNumber openTime closeTime rating'
    );

    const results = courtGroups.map(court => ({
      ...court.toObject(),
      distance: 0.0 // Có thể cập nhật trong tương lai nếu có tọa độ GPS
    }));

    return res.status(200).json(results);
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ message: 'Lỗi server khi tìm kiếm sân.' });
  }
};

// Lấy các sân theo thể loại
const getCourtGroupsByFilter = async (req, res) => {
  try {
    const { type, city, district } = req.query;

    // Nếu cần ánh xạ slug → tên môn thể thao chuẩn (tuỳ frontend gửi)
    const typeMap = {
      'bong-da': 'Sân bóng đá',
      'cau-long': 'Sân cầu lông',
      'tennis': 'Sân tennis',
      'bong-ban': 'Sân bóng bàn'
    };

    const query = {};

    // Lọc theo loại sân (đã map sang chuẩn database)
    if (type) {
      const mapped = typeMap[type] || type;
      query.type = { $regex: `^${mapped}$`, $options: 'i' };
    }

    // Lọc theo tỉnh/thành
    if (city) {
      query.province = { $regex: new RegExp(city, 'i') };
    }

    // Lọc theo quận/huyện
    if (district) {
      query.district = { $regex: new RegExp(district, 'i') };
    }

    const courtGroups = await CourtGroup.find(query).select(
      'name type address district province phoneNumber images openTime closeTime rating'
    );

    const results = courtGroups.map(court => ({
      ...court.toObject(),
      distance: 0.0 // Placeholder nếu sau này có GPS
    }));

    return res.status(200).json(results);
  } catch (err) {
    console.error('Lỗi khi lọc sân:', err);
    return res.status(500).json({ message: 'Lỗi server khi lọc sân theo loại và khu vực.' });
  }
};

// Lấy ra giờ trống trong sân nhỏ
const getAvailableTimeSlots = async (req, res) => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;
    console.log(courtId)

    if (!courtId || !date) {
      return res.status(400).json({ message: 'Thiếu courtId hoặc date' });
    }

    // Tất cả các khung giờ
    const allSlots = await TimeSlot.find();

    // Các lịch đã đặt
    const bookings = await Booking.find({
      courtId,
      date,
      status: { $ne: 'cancelled' }
    });
    console.log(bookings)

    const bookedStartTimes = bookings.map(b => b.timeSlot.startTime);

    // Lọc ra slot chưa bị đặt
    const available = allSlots.filter(slot => !bookedStartTimes.includes(slot.startTime));

    console.log(available);

    res.json(available);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy ra sân nhỏ của sân lớn theo id
const getCourtsByGroupId = async (req, res) => {
  try {
    const { groupId } = req.query;

    if (!groupId) {
      return res.status(400).json({ message: 'Thiếu groupId trong query' });
    }

    const courts = await Court.find({ groupId });

    res.status(200).json(courts);
  } catch (err) {
    console.error('Lỗi lấy danh sách sân nhỏ:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getCourtsByGroupId, getAvailableTimeSlots, getNearbyCourtGroups, searchCourtGroups, getCourtGroupsByFilter };
