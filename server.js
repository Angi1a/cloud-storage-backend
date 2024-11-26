const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import models
const User = require('./models/User');

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middleware
const auth = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/userRegistrationDB';
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Note: adminAuth middleware can be applied within adminRoutes as needed

// Handling 404
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));