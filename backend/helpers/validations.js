const { body } = require('express-validator');

//Validations using express-validator

//Validations for login
const validLogin = [
  body('email', 'Please enter a valid email').isEmail(),
  body('password', 'Password field cannot be blank').exists(),
];

//Validations for signup
const validSignUp = [
  body('name', 'Name must contain atleast 3 characters').isLength({ min: 3 }),
  body('email', 'Please enter a valid email').isEmail(),
  body('password', 'Password must contain atleast 6 characters').isLength({ min: 6 }),
];

module.exports = { validLogin, validSignUp };
