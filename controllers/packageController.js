const Package = require('../models/package');

exports.addPackage = async (req, res) => {
    const {
        duration,
        price,
        packageName,
    } = req.body;

    try {
        const data = new Package({
            duration,
            price,
            packageName,
        });
        const savedPackage = await data.save();
        res.status(200).json({ data: savedPackage, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the package', status: false, message: 'Failed' });
    }
}

exports.getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find().sort({ createdAt: -1 });
        res.status(200).json({ data: packages, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the packages', status: false, message: 'Failed', });
    }
}

exports.removePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const package = await Package.findByIdAndDelete(id);
        res.status(200).json({ data: package, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while delete package', status: false, message: 'Failed', });
    }
}