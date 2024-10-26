const invoiceItemController = require("../controllers/invoiceItemController");
const express = require('express');

const router = express.Router();

router.post('/add', invoiceItemController.addInvoiceItem);

module.exports = router;