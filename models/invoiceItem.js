const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
    },
    price: {
        type: Number,
    },
    total: {
        type: Number,
    },
}, { timestamps: true, })

module.exports = mongoose.model('InvoiceItems', invoiceItemSchema)