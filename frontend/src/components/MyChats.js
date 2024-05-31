import { Avatar, Box, Divider, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getGroupPic, getSender, getSenderPic } from '../config/ChatLogics';
import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';

const MyChats = () => {
  const { selectedChat, setSelectedChat, chats, setChats, fetchAgain } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const fetchChats = async () => {
    const vUser = JSON.parse(localStorage.getItem('user'));
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/api/v1/chat`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'authToken': vUser.authToken,
        },
      });
      const data = await response.json();
      setChats(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to load chats',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('user')));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', lg: 'flex' }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', lg: '30%' }}
      borderRadius='40px'
      borderWidth='1px'
      shadow='dark-lg'
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        display='flex'
        w='100%'
        justifyContent='center'
        alignItems='center'
      >
        My Chats
      </Box>
      <Divider borderWidth='2px' bgColor='black' size='2xl' alignSelf='center' w='95%' />
      <Box
        display='flex'
        flexDir='column'
        p={3}
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {loading ? (
          <ChatLoading />
        ) : (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? 'twitter.500' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius='lg'
                _hover={{ bgColor: 'twitter.500', color: 'white' }}
                key={chat._id}
                display='flex'
              >
                <Avatar
                  bgColor='white'
                  size='md'
                  src={chat.isGroupChat ? getGroupPic(chat) : getSenderPic(loggedUser, chat.users)}
                ></Avatar>
                <Text alignSelf='center' ml='5'>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
