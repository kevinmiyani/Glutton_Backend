const mongoose = require('mongoose');

const customersSchema = new mongoose.Schema({
    authType: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
    },
    email: {
        type: String,
    },
    uid: {
        type: String,
        required: true,
    },
    userImg: {
        type: String,
    },
    userName: {
        type: String,
    },
    favourites: {
        type: [{ type: String, }],
    },
}, { timestamps: true, })

module.exports = mongoose.model('Customers', customersSchema)