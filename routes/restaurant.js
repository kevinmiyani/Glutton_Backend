const restaurantController = require("../controllers/restaurantController");
const express = require('express');

const router = express.Router();

router.get('/', restaurantController.getAllRestaurants);
router.get('/active', restaurantController.getAllActiveRestaurants);
router.get('/photo/:uid', restaurantController.getRestaurantPhoto);
router.get('/:uid', restaurantController.getRestaurantByUID);

router.post('/register', restaurantController.createRestaurant);
router.post('/check-mobile', restaurantController.checkMobileNumber);
router.post('/favourite', restaurantController.getAllFavouriteRestaurants);

router.patch('/update/:uid', restaurantController.updateRestaurntByUID);
router.patch('/package-activation/:uid', restaurantController.packageActivation);
router.patch('/photo/add/:uid', restaurantController.addRestaurantPhoto);

router.delete('/photo/remove/:uid', restaurantController.removeRestaurantPhoto);

module.exports = router;