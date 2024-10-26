const ratingController = require("../controllers/ratingController");
const express = require('express');

const router = express.Router();

router.get('/:uid', ratingController.getAllRatingsByRestId);
router.post('/add', ratingController.addRating);

module.exports = router;