const Message = require('../Models/messageModel');
const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json('Invalid Request');
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error);
  }
};

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat');
      res.status(200).json(messages)
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error);
  }
};

module.exports = { sendMessage, allMessages };
