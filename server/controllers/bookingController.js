const Booking = require('../models/Booking');
const Razorpay = require('razorpay');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { property, amount, razorpayPaymentId } = req.body;
    const booking = new Booking({
      user: req.user._id,
      property,
      amount,
      razorpayPaymentId,
      status: 'pending',
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// List bookings for user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('property');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 