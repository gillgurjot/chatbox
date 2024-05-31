const express = require('express');
const { fetchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

//ROUTE:1 Fetching users from the db using: GET method at "/api/v1/user/fetchusers"
//Giving it the middleware "protect" to verify if the user is logged in or not
router.get('/fetchusers',protect, fetchUsers);

module.exports = router;
