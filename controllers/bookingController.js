const Booking = require('../models/booking');
const Invoice = require('./invoiceController');
const moment = require('moment');


exports.addBooking = async (req, res) => {
    const {
        restaurant,
        customer,
        booking,
        isCancel,
        isVerify,
    } = req.body;

    try {

        let bookingData = booking;

        const newBooking = await Booking.find({ "customer.uid": customer.uid }).countDocuments() == 0;

        bookingData['discount'] = newBooking ? 30 : 10;

        const data = new Booking({
            restaurant,
            customer,
            booking: bookingData,
            isCancel,
            isVerify,
        });
        const savedBooking = await data.save();
        res.status(200).json({ data: savedBooking, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the booking', status: false, message: 'Failed' });
    }
}

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ "booking.date": -1, "booking.time": -1, });
        res.status(200).json({ data: bookings, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the bookings', status: false, message: 'Failed', });
    }
}

exports.getBookingsTimeSlot = async (req, res) => {
    try {
        const { restId, date } = req.body;
        const bookings = await Booking.aggregate([
            {
                $match: {
                    "restaurant.uid": restId,
                    isCancel: false,
                    "booking.date": date
                }
            },
            {
                $project: {
                    _id: 0,
                    time: "$booking.time",
                }
            }
        ]).sort({
            time: 1
        });

        const times = bookings.map(booking => booking.time);

        res.status(200).json({ data: times, message: 'Success', status: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching the bookings', status: false, message: 'Failed' });
    }
}

exports.getCustomerBookings = async (req, res) => {
    try {
        const { uid } = req.params;
        const bookings = await Booking.find({ "customer.uid": uid, }).sort({ "booking.date": -1, "booking.time": -1, });
        const today = new Date().toISOString().split('T')[0];

        const groupedBookings = bookings.reduce((acc, booking) => {
            const date = booking.booking.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(booking);
            return acc;
        }, {});

        const groupedBookingsArray = Object.entries(groupedBookings).map(([date, bookings]) => ({
            date,
            today: date == today,
            bookings
        }));

        groupedBookingsArray.sort((a, b) => (a.date === today ? -1 : 1));

        res.status(200).json({ data: groupedBookingsArray, message: 'Success', status: true });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the bookings', status: false, message: 'Failed' });
    }
}

exports.getRestaurantBookings = async (req, res) => {
    try {
        const { uid } = req.params;
        const { date } = req.body;
        const bookings = date ?
            await Booking.find({ "restaurant.uid": uid, "booking.date": date }).sort({ "booking.date": -1, "booking.time": -1, })
            :
            await Booking.find({ "restaurant.uid": uid, }).sort({ "booking.date": -1, "booking.time": -1, });

        const bookingsWithStatus = bookings.map(booking => {
            let status;
            if (booking.isVerify) {
                status = 'Verified';
            } else if (booking.isCancel) {
                status = 'Cancelled';
            } else {
                status = date ? 'Pending' : 'Not Verified';
            }
            return {
                ...booking.toObject(),
                status,
            };
        });

        res.status(200).json({ data: bookingsWithStatus, message: 'Success', status: true });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the bookings', status: false, message: 'Failed' });
    }
}

exports.cancelBookingByID = async (req, res) => {
    try {
        const { id } = req.params;
        const data = {
            isCancel: true,
            isVerify: false,
        }
        const bookings = await Booking.updateOne({ _id: id }, { $set: data }).then(async () => {
            return await Booking.findById(id);
        });
        res.status(200).json({ data: bookings, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the bookings', status: false, message: 'Failed', });
    }
}

exports.verifyBookingByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { restId, datetime } = req.body;

        const booking = await Booking.findOne({ "restaurant.uid": restId, _id: id });

        const time = booking?.booking?.time;
        const timeFormat = moment(time, 'HH:mm').subtract(30, 'minutes');

        if (!booking) {
            return res.status(200).json({ message: 'Booking is not for our restaurant', status: false });
        } else if (booking.isCancel) {
            return res.status(200).json({ message: 'Booking is already cancelled', status: false });
        } else if (booking.isVerify) {
            return res.status(200).json({ message: 'Booking is already verified', status: false });
        } else if (booking && new Date(booking.booking.date) > new Date()) {
            return res.status(200).json({ message: 'This booking is not for today', status: false });
        } else if (moment(timeFormat).format('HH:mm') > moment(datetime, ['HH:mm']).format('HH:mm')) {
            return res.status(200).json({ message: 'You are too early from your booking time.', status: false, time: moment(datetime, ['HH:mm']).format('HH:mm') });
        }

        const data = {
            isCancel: false,
            isVerify: true,
        }

        await Booking.updateOne({ _id: id }, { $set: data }).then(async () => {
            if (booking) {
                const invoice = {
                    body: {
                        invoiceId: id,
                        isGenerated: false,
                        restaurant: booking.restaurant,
                        customer: booking.customer,
                        booking: booking.booking,
                    }
                }
                return await Invoice.createInvoice(invoice, res);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching the bookings', status: false, message: 'Failed', });
    }
}
