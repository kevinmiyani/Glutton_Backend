const cron = require('node-cron');
const Restaurant = require('../models/restaurant');

const deactivateExpiredRestaurants = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        await Restaurant.updateMany(
            { endDate: { $lt: today } },
            { $set: { isActive: false } }
        );
        console.log('Deactivated expired restaurants');
    } catch (error) {
        console.error('Error deactivating restaurants:', error);
    }
};

// Schedule the cron job to run every 24 hours at midnight
cron.schedule('0 0 * * *', deactivateExpiredRestaurants);

module.exports = deactivateExpiredRestaurants;