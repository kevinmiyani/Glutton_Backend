const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        require: true,
    },
    restaurant: {
        uid: { type: String, require: true },
        name: { type: String, require: true },
        tableNo: { type: String, },
    },
    customer: {
        uid: { type: String, require: true },
        name: { type: String, require: true },
        email: { type: String, },
        contact: { type: String, },
    },
    booking: {
        discount: { type: Number, },
        time: { type: String, },
        date: { type: String, },
    },
    generatedAt: {
        type: Date,
    },
    isGenerated: {
        type: Boolean,
    }
}, { timestamps: true, })

module.exports = mongoose.model('Invoices', invoiceSchema)