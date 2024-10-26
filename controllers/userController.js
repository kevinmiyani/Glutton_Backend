const Admin = require('../models/admin');
const Customer = require('../models/customer');
const Restaurant = require('../models/restaurant');

exports.checkUser = async (req, res) => {
    try {
        const { uid } = req.params;

        const admin = await Admin.findOne({ uid: uid });
        if (admin) {
            return res.status(200).json({ data: "Admin", message: 'Success', status: true })
        }

        const restaurant = await Restaurant.findOne({ uid: uid });
        if (restaurant) {
            return res.status(200).json({ data: "Restaurant", message: 'Success', status: true })
        }

        const customer = await Customer.findOne({ uid: uid });
        if (customer) {
            return res.status(200).json({ data: "Customer", message: 'Success', status: true })
        }

        res.status(200).json({ data: null, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the admins', status: false, message: 'Failed', });
    }
}