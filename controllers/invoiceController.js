const Invoice = require('../models/invoice');
const InvoiceItem = require('../models/invoiceItem');
const Restaurant = require('../models/restaurant');

exports.createInvoice = async (req, res) => {
    const {
        invoiceId,
        restaurant,
        customer,
        booking,
        generatedAt,
        isGenerated,
    } = req.body;

    try {
        const data = new Invoice({
            invoiceId,
            restaurant,
            customer,
            booking,
            generatedAt,
            isGenerated,
        });
        const savedInvoice = await data.save();
        res.status(200).json({ data: savedInvoice, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the invoice', status: false, message: 'Failed' });
    }
}

exports.getAllInvoices = async (req, res) => {
    try {
        const { uid } = req.params;
        const invoices = await Invoice.find({ 'customer.uid': uid, isGenerated: true, }, {
            '_id': 0,
            'invoiceId': 1,
            'booking': 1,
            'restaurant': 1,
        }).sort({ generatedAt: -1, });
        res.status(200).json({ data: invoices, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the invoices', status: false, message: 'Failed', });
    }
}

exports.getInvoiceByInvoiceID = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findOne({ invoiceId: id }, {
            _id: 0,
            restaurant: 1,
            customer: 1,
            booking: 1,
            isGenerated: 1,
            invoiceId: 1,
        });

        const restdata = await Restaurant.findOne({ uid: invoice?.restaurant?.uid });

        const invoiceItems = await InvoiceItem.find({ invoiceId: id }, {
            name: 1,
            price: 1,
            qty: 1,
            total: 1,
        }).sort({ updatedAt: 1, });

        const calculation = await InvoiceItem.aggregate([
            {
                $match: { 'invoiceId': id }
            },
            {
                $group: {
                    '_id': '$invoiceId',
                    'totalPrice': { $sum: '$total' },
                }
            },
            {
                $project: {
                    'total': '$totalPrice',
                }
            }
        ]);

        const total = calculation.length > 0 ? calculation[0].total : 0;

        const restaurant = {
            ...invoice.restaurant,
            email: restdata.email,
            contact: restdata.contactNo,
        };

        res.status(200).json({ data: { ...invoice?._doc, restaurant, total, items: invoiceItems }, message: 'Success', status: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while fetching the invoices', status: false, message: 'Failed', });
    }
}

exports.getTempInvoiceByInvoiceID = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findOne({ invoiceId: id }, {
            _id: 0,
            restaurant: 1,
            customer: 1,
            booking: 1,
            isGenerated: 1,
            invoiceId: 1,
        });
        res.status(200).json({ data: invoice, message: 'Success', status: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while fetching the invoices', status: false, message: 'Failed', });
    }
}

exports.removeInvoiceByID = async (req, res) => {
    try {
        const { id } = req.params;
        const invoices = await Invoice.deleteMany({ invoiceId: id });
        res.status(200).json({ data: invoices, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the invoices', status: false, message: 'Failed', });
    }
}

exports.generateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoices = await Invoice.updateOne({ invoiceId: id }, {
            isGenerated: true,
            generatedAt: new Date(),
        }).then(async () => {
            return await Invoice.findOne({ invoiceId: id });
        })
        res.status(200).json({ data: invoices, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the invoices', status: false, message: 'Failed', });
    }
}

exports.allocateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { tableNo } = req.body;
        const invoices = await Invoice.updateOne({ invoiceId: id }, {
            $set: { 'restaurant.tableNo': tableNo }
        }).then(async () => {
            return await Invoice.findOne({ invoiceId: id });
        })
        res.status(200).json({ data: invoices, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the invoices', status: false, message: 'Failed', });
    }
}