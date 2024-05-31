const { validationResult } = require('express-validator');
const User = require('../Models/userModel');
const generateToken = require('../config/generateToken');
const bcrypt = require('bcryptjs');

//Route:1
//Creating a User using: POST "/api/v1/auth/createuser"
const registerUser = async (req, res) => {
  let success = false;

  //Destructure data from req.body
  const { name, email, password, pic } = req.body;

  //Returning errors "using express-validator"
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Unique Email Check
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ success, error: 'User already exists' });
    } else {
      //Hashing the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
      // Creating new user in Mongo database using .create method
      user = await User.create({
        name,
        email,
        password: secPass,
        pic,
      });
      //Sending Authentication Token to user
      success = true;
      res.json({
        success,
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        authToken: generateToken(user._id),
      });
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).send('Internal server error');
    process.exit();
  }
};

//Route:2
//Authenticating a User using: POST "/api/v1/auth/login"
const userLogin = async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Destructure data from req.body
  const { email, password } = req.body;

  //Checking user credentials with database
  try {
    let user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success, error: 'Please try again with correct credentials' });
    } else {
      //Comparing password hashes with bcrypt
      const passCheck = await bcrypt.compare(password, user.password);
      if (!passCheck) {
        res.status(400).json({ success, error: 'Please try again with correct credentials' });
      } else {
        //Sending Authentication Token to user
        success = true;
        res.json({
          success,
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          authToken: generateToken(user._id),
        });
      }
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).send('Internal server error');
    process.exit();
  }
};

module.exports = { registerUser, userLogin };
