const customerController = require("../controllers/customerController");
const express = require('express');

const router = express.Router();

router.get('/', customerController.getAllCustomers);
router.get('/:uid', customerController.getCustomerByUID);

router.post('/register', customerController.createCustomer);

router.patch('/update/:uid', customerController.updateCustomerByUID);
router.patch('/manage-favorite/:uid', customerController.manageFavoriteByUID);

module.exports = router;