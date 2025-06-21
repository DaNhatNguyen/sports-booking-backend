const Booking = require('../models/Booking');
const Court = require('../models/Court');

const createBooking = async (req, res) => {
  try {
    const { userId, courtId, date, timeSlot } = req.body;

    if (!userId || !courtId || !date || !timeSlot?.startTime || !timeSlot?.endTime) {
      return res.status(400).json({ message: 'Thiếu thông tin đặt sân' });
    }

    // Kiểm tra sân có tồn tại và đang hoạt động
    const court = await Court.findById(courtId);
    if (!court || !court.isActive) {
      return res.status(404).json({ message: 'Sân không tồn tại hoặc đã bị khóa' });
    }

    // Kiểm tra trùng giờ
    const conflict = await Booking.findOne({
      courtId,
      date,
      'timeSlot.startTime': timeSlot.startTime,
      status: { $ne: 'cancelled' }
    });

    if (conflict) {
      return res.status(409).json({ message: 'Khung giờ này đã có người đặt' });
    }

    // Tạo booking mới
    const newBooking = await Booking.create({
      userId,
      courtId,
      date,
      timeSlot,
      status: 'confirmed',
      createdAt: new Date()
    });

    return res.status(201).json({ message: 'Đặt sân thành công', booking: newBooking });
  } catch (error) {
    console.error('Lỗi đặt sân:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy lịch sử đặt sân của người dùng
const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 }) // sắp xếp mới -> cũ
      .populate({
        path: 'courtId',
        populate: { path: 'groupId' } // lấy cả thông tin sân lớn
      });

    // Format lại dữ liệu cho FE
    const formatted = bookings.map(b => ({
      _id: b._id,
      date: b.date,
      timeSlot: b.timeSlot,
      status: b.status,
      courtName: b.courtId?.name || '---',
      courtGroupName: b.courtId?.groupId?.name || '---',
      address: `${b.courtId?.groupId?.address || ''}, ${b.courtId?.groupId?.district || ''}, ${b.courtId?.groupId?.province || ''}`
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Lỗi khi lấy lịch của user:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { createBooking, getBookingsByUser };
