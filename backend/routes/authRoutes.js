const express = require('express');
const bcrypt = require('bcrypt'); // Ensure bcrypt is installed for password hashing
const User = require('../models/User'); // Adjust this path as needed
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already registered' });
        }

        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If successful, send a success response (you can also send user info or token)
        return res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});





// Route for sending OTP
router.get('/forgotpassword', async (req, res) => {
    const { email } = req.query;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }

        // Generate a new 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.otp = otp; // Update user's OTP
        await user.save();

        console.log(`Generated OTP for ${email}: ${otp}`); // For debugging purposes
        res.json({ status: 'success', message: 'OTP sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route for verifying OTP
router.post('/verifyotp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp) {
            return res.status(400).json({ status: 'error', message: 'Invalid OTP.' });
        }

        res.json({ status: 'verified', message: 'OTP verified successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route for resetting password
router.post('/resetpassword', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.password = newPassword; // Set new password
        user.otp = null; // Clear OTP
        await user.save();

        res.json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;