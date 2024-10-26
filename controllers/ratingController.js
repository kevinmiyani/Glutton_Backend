const Rating = require('../models/rating');
const Restaurant = require('../models/restaurant');

exports.addRating = async (req, res) => {
    const {
        userId,
        restId,
        rating,
        review,
    } = req.body;

    try {
        const data = new Rating({
            userId,
            restId,
            rating,
            review,
        });

        const savedRating = await data.save().then(async (response) => {
            const avgRating = await Rating.aggregate([
                {
                    $match: { restId: restId }
                },
                {
                    $group: {
                        _id: '$restId',
                        avgRating: { $avg: '$rating' },
                        reviews: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        rate: { $round: ['$avgRating', 0] },
                        reviews: 1,
                    }
                }
            ])
            await Restaurant.updateOne({ uid: restId }, { $set: avgRating[0] });
            return response;
        });
        res.status(200).json({ data: savedRating, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the rating', status: false, message: 'Failed' });
    }
}

exports.getAllRatingsByRestId = async (req, res) => {
    try {
        const { uid } = req.params;
        const ratings = await Rating
            .find({
                restId: uid
            })
            .populate({
                path: 'userId',
                select: 'userName userImg'
            })
            .sort({
                createdAt: -1
            });
        res.status(200).json({ data: ratings, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the ratings', status: false, message: 'Failed', });
    }
}