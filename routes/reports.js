const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path to your User model location

// Controller for fetching report data, including a list of all users
const getReports = async (req, res) => {
    try {
        // Count the total number of users
        const totalUsers = await User.countDocuments();

        // Fetch all users. Adjust the projection as needed for privacy/security
        const usersList = await User.find({}, 'username email -_id').exec(); // Returns only username and email, excludes _id

        // Here, you can add more data to your report as needed
        // Example: const otherStatistic = await SomeModel.someAggregation();

        // Respond with the report data
        res.json({
            totalUsers, // Total count of users
            usersList,  // List of all users with specified fields
            // otherStatistic, // Any additional report data
        });
    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).send('Failed to generate reports');
    }
};

// Define the route for accessing the report
router.get('/reports', getReports);

module.exports = router;
