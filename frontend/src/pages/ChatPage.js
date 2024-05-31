import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatDisplay from '../components/ChatDisplay';
import MyChats from '../components/MyChats';
import { ChatState } from '../context/ChatProvider';
import Sidebar from '../components/sidebar/Sidebar';

const ChatPage = () => {
  const { user } = ChatState();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Flex
      w='100%'
      minH={'100vh'}
      flexDirection={{ base: 'column', md: 'row' }}
      bgColor={useColorModeValue('twitter.500')}
      alignItems='center'
      justifyContent='center'
    >
      {user && <Sidebar />}
      <Box
        display='flex'
        justifyContent='space-between'
        width='95%'
        height={{ base: '87vh', md: '95vh' }}
        m={{ base: 2, md: 5 }}
      >
        {user && <MyChats />}
        {user && <ChatDisplay />}
      </Box>
    </Flex>
  );
};

export default ChatPage;
