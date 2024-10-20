
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Load environment variables from .env file
require('dotenv').config();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api', authRoutes);


// Route for the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});




// Route for serving the forgot password page
app.get('/forgotpassword', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/forgotpassword.html'));
});







// Default route for the base URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/register.html'));
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
