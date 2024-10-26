const MenuCategory = require('../models/menuCategory');

exports.addMenuCategory = async (req, res) => {
    const {
        name,
        img,
        fontColor,
    } = req.body;

    try {
        const data = new MenuCategory({
            name,
            img,
            fontColor,
        });
        const savedMenuCategory = await data.save();
        res.status(200).json({ data: savedMenuCategory, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the menu category', status: false, message: 'Failed' });
    }
}

exports.getAllMenuCategories = async (req, res) => {
    try {
        const menuCategories = await MenuCategory.find().sort({ name: 1 });
        res.status(200).json({ data: menuCategories, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the menu categories', status: false, message: 'Failed', });
    }
}

exports.updateMenuCategoryByID = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            img,
            fontColor,
        } = req.body;

        const data = {
            img,
            fontColor,
        }

        const category = await MenuCategory.updateOne({ _id: id }, { $set: data }).then(async () => {
            return await MenuCategory.findOne({ _id: id });
        });
        res.status(200).json({ data: category, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the category', status: false, message: 'Failed', });
    }
}