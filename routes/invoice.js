const invoiceController = require("../controllers/invoiceController");
const express = require('express');

const router = express.Router();

router.get('/customer/:uid', invoiceController.getAllInvoices);
router.get('/temp/:id', invoiceController.getTempInvoiceByInvoiceID);
router.get('/:id', invoiceController.getInvoiceByInvoiceID);
router.delete('/remove/:id', invoiceController.removeInvoiceByID);

router.post('/create', invoiceController.createInvoice);

router.patch('/generate/:id', invoiceController.generateInvoice);
router.patch('/table-allocate/:id', invoiceController.allocateTable);

module.exports = router;