const userController = require("../controllers/userController");
const express = require('express');

const router = express.Router();

router.get('/check/:uid', userController.checkUser);

module.exports = router;