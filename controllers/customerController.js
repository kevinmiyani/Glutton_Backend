const Customer = require('../models/customer');

exports.createCustomer = async (req, res) => {
    const {
        authType,
        contactNo,
        email,
        uid,
        userName,
    } = req.body;

    try {
        const data = new Customer({
            authType,
            contactNo,
            email,
            uid,
            userName,
        });
        const savedCustomer = await data.save();
        res.status(200).json({ data: savedCustomer, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the customer', status: false, message: 'Failed', });
    }
}

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.status(200).json({ data: customers, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the customers', status: false, message: 'Failed', });
    }
}

exports.getCustomerByUID = async (req, res) => {
    try {
        const { uid } = req.params;
        const customers = await Customer.findOne(
            { uid: uid },
            {
                uid: 1,
                favourites: 1,
                authType: 1,
                contactNo: 1,
                email: 1,
                userName: 1,
                userImg: 1
            }
        );
        res.status(200).json({ data: customers, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the customer', status: false, message: 'Failed', });
    }
}

exports.updateCustomerByUID = async (req, res) => {
    try {
        const { uid } = req.params;
        const {
            userName,
            userImg,
            contactNo,
            email,
        } = req.body;
        const data = {
            userName,
            userImg,
            contactNo,
            email,
        }
        const customers = await Customer.updateOne({ uid: uid }, { $set: data }).then(async () => {
            return await Customer.findOne(
                { uid: uid },
                {
                    uid: 1,
                    favourites: 1,
                    authType: 1,
                    contactNo: 1,
                    email: 1,
                    userName: 1,
                    userImg: 1
                }
            );
        });
        res.status(200).json({ data: customers, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the customer', status: false, message: 'Failed', });
    }
}

exports.manageFavoriteByUID = async (req, res) => {
    try {
        const { uid } = req.params;

        const {
            restId,
        } = req.body;

        if (!restId) {
            return res.status(400).json({ error: 'Invalid restId provided', status: false, message: 'Failed' });
        }

        const customers = await Customer.updateOne({ uid: uid, }, [{
            $set: {
                favourites: {
                    $cond: {
                        if: { $in: [restId, '$favourites'] },
                        then: { $filter: { input: '$favourites', as: 'fav', cond: { $ne: ['$$fav', restId] } } },
                        else: { $concatArrays: ['$favourites', [restId]] }
                    }
                }
            }
        }]).then(async () => {
            return await Customer.findOne(
                { uid: uid },
                {
                    favourites: 1,
                }
            );
        });
        res.status(200).json({ data: customers, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the customers', status: false, message: 'Failed', });
    }
}
