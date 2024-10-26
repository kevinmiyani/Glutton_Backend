const Admin = require('../models/admin');

exports.createAdmin = async (req, res) => {
    const {
        uid,
        email,
        name,
    } = req.body;

    try {
        const data = new Admin({
            uid,
            email,
            name,
        });
        const savedAdmin = await data.save();
        res.status(200).json({ data: savedAdmin, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the admin', status: false, message: 'Failed' });
    }
}

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json({ data: admins, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the admins', status: false, message: 'Failed', });
    }
}