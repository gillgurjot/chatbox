import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const SocketContext = createContext();

const socket = io(process.env.REACT_APP_API_KEY);

const SocketProvider = ({ children }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const navigate = useNavigate();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
    if (user) {
      socket.emit('setup', user);
      socket.on('connected', () => setSocketConnected(true));
      socket.on('typing', () => setIsTyping(true));
      socket.on('stop typing', () => setIsTyping(false));
    }
    // eslint-disable-next-line
  }, [navigate]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        typing,
        setTyping,
        isTyping,
        socketConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const SocketState = () => {
  return useContext(SocketContext);
};

export default SocketProvider;
