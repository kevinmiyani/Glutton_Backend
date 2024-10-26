const bookingController = require("../controllers/bookingController");
const express = require('express');

const router = express.Router();

router.get('/', bookingController.getAllBookings);
router.get('/:uid', bookingController.getCustomerBookings);

router.post('/add', bookingController.addBooking);
router.post('/timeslot', bookingController.getBookingsTimeSlot);
router.post('/restaurant/:uid', bookingController.getRestaurantBookings);

router.patch('/cancel/:id', bookingController.cancelBookingByID);
router.patch('/verify/:id', bookingController.verifyBookingByID);

module.exports = router;