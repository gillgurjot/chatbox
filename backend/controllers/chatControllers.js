const e = require('express');
const Chat = require('../Models/chatModel');
const User = require('../Models/userModel');

const accessChat = async (req, res) => {
  //User id of a person with which we are trying to create a chat
  const { userId } = req.body; //we are setting this in middleware
  //Check to see if we got the userId from params
  if (!userId) {
    console.log('UserId param not recieved');
    return res.status(400);
  }
  //Check to see if the chat already exists for this user
  let isChat = await Chat.find({
    //to find a non-group chats because we have another endpoint for groups
    isGroupChat: false,
    //and method will match both id's with database to check if they both have a same chat
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    //Without using poppulate it will just return us the ids
    //this will give us users array from chat model without passwords
    .populate('users', '-password')
    //this will show us latest message from user
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email',
  });

  if (isChat.length > 0) {
    //if chat exists we will send the chat to user
    res.send(isChat[0]);
  } else {
    //if the chat does not exists already we will create a new chat
    let chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      //creating a new chat using the data we defined as chatData
      const createdChat = await Chat.create(chatData);
      //sending the created chat to user with the passwords
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password');
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      console.log(error);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name pic email',
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    console.log(error);
  }
};

const createGroup = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please fill all the feilds' });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send({ message: 'Atleast 2 users are required to create a group' });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      chatPic: req.body.chatPic,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
};

const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true },
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
};


const groupAdd = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const userAdded = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true },
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    res.status(200).json(userAdded);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
};

const groupRemove = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const userRemoved = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true },
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(userRemoved);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
};

module.exports = { accessChat, fetchChats, createGroup, renameGroup, groupAdd, groupRemove };
