const MenuItem = require('../models/menuItem');

exports.addMenuItem = async (req, res) => {
    const {
        restId,
        name,
        price,
        category,
    } = req.body;

    try {
        const data = new MenuItem({
            restId,
            name,
            price,
            category,
        });
        const savedMenuItem = await data.save();
        res.status(200).json({ data: savedMenuItem, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the menu item', status: false, message: 'Failed' });
    }
}

exports.getMenuItemsByRestId = async (req, res) => {
    try {
        const { id } = req.params;
        const menuItems = await MenuItem.find({ restId: id }).sort({ name: 1 });
        res.status(200).json({ data: menuItems, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the menu items', status: false, message: 'Failed', });
    }
}

exports.getMenuByRestId = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItems = await MenuItem.find({ restId: id }).populate('category.id').sort({ 'category.name': 1, 'name': 1 });

        const groupedByCategory = menuItems.reduce((acc, item) => {
            const categoryName = item.category.id.name;

            if (!acc[categoryName]) {
                acc[categoryName] = {
                    name: categoryName,
                    img: item.category.id.img,
                    fontColor: item.category.id.fontColor,
                    items: []
                };
            }

            acc[categoryName].items.push({
                name: item?.name,
                price: item?.price,
            });
            return acc;
        }, {});

        const result = Object.values(groupedByCategory);

        res.status(200).json({ data: result, message: 'Success', status: true });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the menu items', status: false, message: 'Failed', });
    }
}

exports.getMenuCategoriesByRestId = async (req, res) => {
    try {
        const { id } = req.params;
        const menuItems = await MenuItem.find({ restId: id });
        const categories = [];
        menuItems.map((item) => {
            if (!categories.some(category => category?.toString() == item.category?.name?.toString())) {
                categories.push(item.category.name);
            }
        }, []);

        categories.sort((a, b) => a.localeCompare(b));

        res.status(200).json({ data: categories, message: 'Success', status: true });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the menu items', status: false, message: 'Failed' });
    }
}

exports.removeMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await MenuItem.findByIdAndDelete(id);
        res.status(200).json({ data: item, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the menu items', status: false, message: 'Failed', });
    }
}

exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            price
        } = req.body;

        const item = await MenuItem.updateOne({ _id: id, }, { price: price }).then(async () => {
            return await MenuItem.findOne({ _id: id });
        });

        res.status(200).json({ data: item, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the menu items', status: false, message: 'Failed', });
    }
}