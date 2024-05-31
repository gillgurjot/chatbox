export const getSenderId = (loggedUser, users) => {
  if (loggedUser) {
    return users[0]._id === loggedUser._id ? users[1]._id : users[0]._id;
  }
};

export const getSender = (loggedUser, users) => {
  if (loggedUser) {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  }
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const getGroupPic = (chat) => {
  if (chat.chatPic === null) {
    return 'https://icons.veryicon.com/png/o/miscellaneous/forestry-in-yiliang/group-people.png';
  } else {
    return chat.chatPic;
  }
};

export const getSenderPic = (loggedUser, users) => {
  if (loggedUser) {
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
  }
};

export const isSameSender = (messages, currentMessage, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== currentMessage.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return 'auto';
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const convertTime = (currentDate) => {
  let date = new Date(currentDate);
  let time = date.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' });
  return time;
};

export const convertDate = (currentDate) => {
  let date = new Date(currentDate);
  let time = date.toLocaleString('en-US', { dateStyle: 'medium' });
  return time;
};
