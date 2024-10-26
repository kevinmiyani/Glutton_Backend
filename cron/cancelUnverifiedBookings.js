const cron = require('node-cron');
const Booking = require('../models/booking');

const cancelUnverifiedBookings = async () => {
    try {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = now.getHours() * 60 + now.getMinutes();

        await Booking.updateMany(
            {
                $or: [
                    { 'booking.date': { $lt: today } },
                    {
                        'booking.date': today,
                        $expr: {
                            $lt: [
                                {
                                    $add: [
                                        { $multiply: [{ $toInt: { $substr: ['$booking.time', 0, 2] } }, 60] },
                                        { $toInt: { $substr: ['$booking.time', 3, 2] } }
                                    ]
                                },
                                currentTime
                            ]
                        }
                    }
                ],
                isVerify: false,
                isCancel: false
            },
            { $set: { isCancel: true } }
        );

        console.log('Cancelled unverified bookings with past time and dates');
    } catch (error) {
        console.error('Error cancelling bookings:', error);
    }
};

// Schedule the cron job to run every 5 minutes
cron.schedule('*/5 * * * *', cancelUnverifiedBookings);

module.exports = cancelUnverifiedBookings;
