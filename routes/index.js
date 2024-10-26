const express = require('express');
const adminRouter = require('./admin');
const customerRouter = require('./customer');
const restaurantRouter = require('./restaurant');
const userRouter = require('./user');
const ratingRouter = require('./rating');
const packageRouter = require('./package');
const menuCategoryRouter = require('./menuCategory');
const bookingRouter = require('./booking');
const invoiceRouter = require('./invoice');
const invoiceItemRouter = require('./invoiceItem');
const menuItemRouter = require('./menuItem');

const router = express.Router();

router.use('/admin', adminRouter);
router.use('/customer', customerRouter);
router.use('/restaurant', restaurantRouter);
router.use('/user', userRouter);
router.use('/rating', ratingRouter);
router.use('/package', packageRouter);
router.use('/menu-category', menuCategoryRouter);
router.use('/booking', bookingRouter);
router.use('/invoice', invoiceRouter);
router.use('/invoice-item', invoiceItemRouter);
router.use('/menu-item', menuItemRouter);

module.exports = router;