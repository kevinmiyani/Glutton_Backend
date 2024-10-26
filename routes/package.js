const packageController = require("../controllers/packageController");
const express = require('express');

const router = express.Router();

router.get('/', packageController.getAllPackages);

router.post('/add', packageController.addPackage);

router.delete('/remove/:id', packageController.removePackage);

module.exports = router;