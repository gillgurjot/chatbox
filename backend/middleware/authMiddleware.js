const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const protect = async (req, res, next) => {
  //Get user from jwt and send id to req object
  const token = req.header('authToken');
  if (!token) {
    res.status(401).send('Invalid token request');
  } else {
    try {
      //Verifying the token using jwt.verify method
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //Sending user data back without the password
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).send('Invalid token request')
    }
  }
}

module.exports = {protect}
