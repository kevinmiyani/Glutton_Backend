const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    restaurant: {
        uid: { type: String, require: true },
        name: { type: String, require: true },
    },
    customer: {
        uid: { type: String, require: true },
        name: { type: String, require: true },
        email: { type: String, },
        contact: { type: String, },
    },
    booking: {
        discount: { type: Number, },
        noOfGuest: { type: Number, },
        time: { type: String, },
        date: { type: String, },
    },
    isCancel: {
        type: Boolean,
        required: true,
    },
    isVerify: {
        type: Boolean,
        required: true,
    },
}, { timestamps: true, })

module.exports = mongoose.model('Bookings', bookingSchema)