const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.post('/', auth, bookingController.createBooking);
router.get('/my', auth, bookingController.getUserBookings);
router.post('/razorpay-order', auth, bookingController.createRazorpayOrder);

module.exports = router; 