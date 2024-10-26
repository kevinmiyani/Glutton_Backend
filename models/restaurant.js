const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    uid: {
        type: String,
        require: true,
    },
    restaurantName: {
        type: String,
        require: true,
    },
    restImage: {
        type: String,
        require: true,
    },
    ownerName: {
        type: String,
        require: true,
    },
    openTime: {
        type: String,
        require: true,
    },
    closeTime: {
        type: String,
        require: true,
    },
    contactNo: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    tables: {
        type: Number,
    },
    reviews: {
        type: Number,
    },
    rate: {
        type: Number,
    },
    address: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true,
    },
    state: {
        type: String,
        require: true,
    },
    pincode: {
        type: String,
        require: true,
    },
    coordinates: {
        latitude: { type: Number, require: true },
        longitude: { type: Number, require: true },
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    isActive: {
        type: Boolean,
    },
    images: {
        type: [{ type: String }]
    }
}, { timestamps: true, })

module.exports = mongoose.model('Restaurants', restaurantSchema)