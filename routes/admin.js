const adminController = require("../controllers/adminController");
const express = require('express');

const router = express.Router();

router.get('/', adminController.getAllAdmins);
router.post('/register', adminController.createAdmin);

module.exports = router;