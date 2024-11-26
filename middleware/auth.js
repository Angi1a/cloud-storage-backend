const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path according to your structure
const dotenv = require('dotenv');

dotenv.config();

const auth = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user based on the id in the decoded token and check for the token in their tokens array
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
