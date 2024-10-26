const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    restId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    category: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MenuCategory",
            required: true,
        },
        name: {
            type: String,
            require: true,
        }
    },
}, { timestamps: true, })

module.exports = mongoose.model('MenuItems', menuItemSchema)