const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Ensure this path is correct according to your project structure
const router = express.Router();

// Route to add a user with detailed logging
router.post('/users', async (req, res) => {
    console.log('Attempting to add a new user with data:', req.body);
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            console.log('User already exists with the given username or email:', { username, email });
            return res.status(400).json({ message: 'User already exists with the given username or email' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        console.log('User added successfully:', newUser);
        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
});

// Route to delete a user by username or email with detailed logging
router.delete('/users', async (req, res) => {
  console.log('Attempting to delete user with query:', req.query);

  try {
    const { username, email } = req.query;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      console.log('User not found for deletion with query:', req.query);
      return res.status(404).json({ message: 'User not found' });
    }

    await User.deleteOne({ $or: [{ email }, { username }] });
    console.log('User deleted successfully:', { username, email });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Route to change a user's password by username or email with detailed logging
router.patch('/users/password', async (req, res) => {
    console.log('Attempting to change password for user with data:', req.body);
    try {
        const { username, email, newPassword } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (!user) {
            console.log('User not found for password change with data:', req.body);
            return res.status(404).json({ message: 'User not found' });
        }
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();
        console.log('Password changed successfully for user:', { username, email });
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
});

// Route to fetch all users with detailed logging
router.get('/users', async (req, res) => {
    console.log('Fetching all users');
    try {
        const users = await User.find({}, '-password'); // Excludes the password field from the results
        console.log(`Found ${users.length} users`);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Route to fetch report data with detailed logging
router.get('/reports', async (req, res) => {
    console.log('Fetching report data');
    try {
        // Example report: Total number of users
        const totalUsers = await User.countDocuments();
        console.log('Report data fetched successfully:', { totalUsers });
        res.json({ totalUsers /*, otherStatistic */ });
    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).send('Failed to generate reports');
    }
});

module.exports = router;
