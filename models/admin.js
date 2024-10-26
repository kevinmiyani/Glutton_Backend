const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true, })

module.exports = mongoose.model('Admins', adminSchema)