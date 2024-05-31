import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = (props) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [searchActive, setSearchActive] = useState(false);
  const [chatActive, setChatActive] = useState(true);
  const [groupActive, setGroupActive] = useState(false);
  const [notifyActive, setNotifyActive] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    setUser(userInfo);
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        searchActive,
        setSearchActive,
        chatActive,
        setChatActive,
        groupActive,
        setGroupActive,
        notifyActive,
        setNotifyActive,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchAgain,
        setFetchAgain,
        notification,
        setNotification,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
