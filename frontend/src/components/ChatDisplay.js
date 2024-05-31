import React from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatDisplay = () => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', lg: 'flex' }}
      alignItems='center'
      flexDir='column'
      p={3}
      bg='white'
      w={{ base: '100%', lg: '68%' }}
      borderRadius='40px'
      borderWidth='1px'
      shadow='dark-lg'
    >
      <SingleChat />
    </Box>
  );
};

export default ChatDisplay;
