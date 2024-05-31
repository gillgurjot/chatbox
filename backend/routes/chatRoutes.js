const express = require('express');
const { accessChat, fetchChats, createGroup, renameGroup, groupAdd, groupRemove } = require('../controllers/chatControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

//To create a new chat using: POST "/api/v1/chat"
router.post('/', protect, accessChat);

//To fetch chats using: GET "/api/v1/chat"
router.get('/', protect, fetchChats);

//To create a new group using: POST "/api/v1/chat/creategroup"
router.post('/creategroup', protect, createGroup);

//To rename a group using: PUT "/api/v1/chat/renamegroup"
router.put('/renamegroup', protect, renameGroup);

//To add someone to group using: PUT "/api/v1/chat/groupadd"
router.post('/groupadd', protect, groupAdd);

//To remove someone from group using: DELETE "/api/v1/chat/groupremove"
router.delete('/groupremove', protect, groupRemove);



module.exports = router;
