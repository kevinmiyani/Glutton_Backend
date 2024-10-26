const Restaurant = require('../models/restaurant');

exports.createRestaurant = async (req, res) => {
    const {
        uid,
        restaurantName,
        restImage,
        ownerName,
        openTime,
        closeTime,
        contactNo,
        email,
        tables,
        reviews,
        rate,

        address,
        city,
        state,
        pincode,
        coordinates,

        startDate,
        endDate,
        isActive,
    } = req.body;

    try {
        const data = new Restaurant({
            uid,
            restaurantName,
            restImage,
            ownerName,
            openTime,
            closeTime,
            contactNo,
            email,
            tables,
            reviews,
            rate,

            address,
            city,
            state,
            pincode,
            coordinates,

            startDate,
            endDate,
            isActive,
        });
        const savedRestaurant = await data.save();
        res.status(200).json({ data: savedRestaurant, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the restaurant', status: false, message: 'Failed', });
    }
}

exports.updateRestaurntByUID = async (req, res) => {
    const { uid } = req.params;
    const {
        restaurantName,
        restImage,
        ownerName,
        openTime,
        closeTime,
        tables,

        address,
        city,
        state,
        pincode,
        coordinates,
    } = req.body;

    try {
        const data = {
            restaurantName: restaurantName,
            restImage: restImage,
            ownerName: ownerName,
            openTime: openTime,
            closeTime: closeTime,
            tables: tables,

            address: address,
            city: city,
            state: state,
            pincode: pincode,
            coordinates: coordinates,
        }
        const restaurant = await Restaurant.updateOne({ uid: uid }, { $set: data })
            .then(async () => {
                return await Restaurant.findOne({ uid: uid });
            });
        res.status(200).json({ data: restaurant, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the restaurant', status: false, message: 'Failed', });
    }
}

exports.packageActivation = async (req, res) => {
    try {

        const {
            uid
        } = req.params;

        const {
            startDate,
            endDate,
        } = req.body;

        const restaurant = await Restaurant.updateOne({ uid: uid }, {
            startDate: startDate,
            endDate: endDate,
            isActive: true,
        }).then(async () => {
            return await Restaurant.findOne({ uid: uid });
        });
        res.status(200).json({ data: restaurant, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while package activating', status: false, message: 'Failed', });
    }
}

exports.checkMobileNumber = async (req, res) => {
    try {
        const {
            contactNo,
        } = req.body;

        const rest = await Restaurant.findOne({ contactNo: contactNo });

        if (rest) {
            res.status(200).json({ error: "This Mobile Number is already used with Glutton Restaurant.", message: 'Failed', status: false })
        } else {
            res.status(200).json({ data: "New Number", message: 'Success', status: true })
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while checking mobile number', status: false, message: 'Failed', });
    }
}

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().sort({ rate: -1 });
        res.status(200).json({ data: restaurants, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the restaurants', status: false, message: 'Failed', });
    }
}

exports.getAllActiveRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true }).sort({ rate: -1 });
        res.status(200).json({ data: restaurants, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the restaurants', status: false, message: 'Failed', });
    }
}

exports.getAllFavouriteRestaurants = async (req, res) => {
    try {
        const { restList } = req.body;
        const restaurants = await Restaurant.find({ uid: { $in: restList } }).sort({ rate: -1 });
        res.status(200).json({ data: restaurants, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the restaurants', status: false, message: 'Failed', });
    }
}

exports.getRestaurantByUID = async (req, res) => {
    try {
        const { uid } = req.params;
        const restaurant = await Restaurant.findOne({ uid: uid });
        res.status(200).json({ data: restaurant, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the restaurant', status: false, message: 'Failed', });
    }
}

exports.getRestaurantPhoto = async (req, res) => {
    try {
        const { uid } = req.params;

        const restaurant = await Restaurant.findOne(
            { uid: uid },
            { images: 1 }
        );

        restaurant && restaurant.images && restaurant.images.reverse();

        res.status(200).json({ data: restaurant, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the customer', status: false, message: 'Failed', });
    }
}

exports.addRestaurantPhoto = async (req, res) => {
    try {
        const { uid } = req.params;

        const {
            img
        } = req.body;

        const restaurant = await Restaurant.updateOne(
            { uid: uid, },
            {
                $addToSet: {
                    images: img
                },
            }).then(async () => {
                return await Restaurant.findOne(
                    { uid: uid },
                    { images: 1 }
                );
            });

        restaurant && restaurant.images && restaurant.images.reverse();

        res.status(200).json({ data: restaurant, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the customer', status: false, message: 'Failed', });
    }
}

exports.removeRestaurantPhoto = async (req, res) => {
    try {
        const { uid } = req.params;

        const {
            img
        } = req.body;

        const restaurant = await Restaurant.updateOne(
            { uid: uid, },
            {
                $pull: {
                    images: img
                },
            }).then(async () => {
                return await Restaurant.findOne(
                    { uid: uid },
                    { images: 1 }
                );
            });

        restaurant && restaurant.images && restaurant.images.reverse();

        res.status(200).json({ data: restaurant, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the customer', status: false, message: 'Failed', });
    }
}