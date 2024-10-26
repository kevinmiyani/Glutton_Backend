const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    duration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    packageName: {
        type: String,
        required: true,
    },
}, { timestamps: true, })

module.exports = mongoose.model('Packages', packageSchema)