const InvoiceItem = require('../models/invoiceItem');

exports.addInvoiceItem = async (req, res) => {
    const {
        invoiceId,
        name,
        qty,
        price,
    } = req.body;

    try {
        const total = qty * price;

        const invoiceItem = await InvoiceItem.findOne({ invoiceId: invoiceId, name: name });

        let savedInvoiceItem;

        if (invoiceItem) {

            savedInvoiceItem = await InvoiceItem.updateOne({ invoiceId: invoiceId, name: name.trim() }, {
                $set: {
                    qty: invoiceItem.qty + qty,
                    total: invoiceItem.total + total,
                }
            }).then(async () => {
                return await InvoiceItem.findOne({ invoiceId: invoiceId, name: name });
            });
        } else {
            const data = new InvoiceItem({
                invoiceId,
                name: name.trim(),
                qty,
                price,
                total,
            });
            savedInvoiceItem = await data.save();
        }
        res.status(200).json({ data: savedInvoiceItem, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the invoice item', status: false, message: 'Failed' });
    }
}