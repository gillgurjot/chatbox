const express = require('express');
const { validSignUp, validLogin } = require('../helpers/validations');
const { registerUser, userLogin } = require('../controllers/authControllers');

const router = express.Router();

//ROUTE:1 Create a User using: POST "/api/v1/auth/createuser"
router.post('/createuser', validSignUp, registerUser);

//ROUTE:2 Authenticate a User using: POST "/api/v1/auth/login"
router.post('/login', validLogin, userLogin);

module.exports = router;
