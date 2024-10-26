const mongoose = require('mongoose');

const menuCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    fontColor: {
        type: String,
        required: true,
    },
}, { timestamps: true, })

module.exports = mongoose.model('MenuCategory', menuCategorySchema)