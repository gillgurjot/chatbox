import {
  Avatar,
  Box,
  Divider,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { BiArrowBack } from 'react-icons/bi';
import { getGroupPic, getSender, getSenderPic, getSenderFull } from '../config/ChatLogics';
import ProfileModal from '../components/sidebar/ProfileModal';
import UpdateGroupModal from './UpdateGroupModal';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = process.env.REACT_APP_API_KEY;
let socket, selectedChatCompare;

const SingleChat = () => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    setFetchAgain,
    fetchAgain,
  } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/v1/message/${selectedChat._id}`,
        {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json',
            'authToken': user.authToken,
          },
        },
      );
      const data = await response.json();
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      console.log(error);
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        setNewMessage('');
        const response = await fetch(`${process.env.REACT_APP_API_KEY}/api/v1/message`, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json',
            'authToken': user.authToken,
          },
          body: JSON.stringify({ content: newMessage, chatId: selectedChat._id }),
        });
        const data = await response.json();
        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Error Occured!',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        console.log(error);
        return;
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) socket.emit('stop typing', selectedChat._id);
      setTyping(false);
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: '28px', lg: '30px' }}
            pb='3'
            px='5'
            w='100%'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
          >
            <IconButton
              colorScheme='twitter'
              display={{ base: 'flex', lg: 'none' }}
              icon={<BiArrowBack />}
              onClick={() => setSelectedChat()}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <Box>
                  <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                    <Avatar
                      cursor='pointer'
                      mr={5}
                      bgColor='white'
                      src={getSenderPic(user, selectedChat.users)}
                    />
                  </ProfileModal>
                  {getSender(user, selectedChat.users)}
                </Box>
              ) : (
                <Box>
                  <UpdateGroupModal fetchMessages={fetchMessages}>
                    <Avatar
                      cursor='pointer'
                      mr={5}
                      bgColor='white'
                      src={getGroupPic(selectedChat)}
                    />
                  </UpdateGroupModal>
                  {selectedChat.chatName}
                </Box>
              ))}
          </Box>
          <Divider borderWidth='2px' bgColor='black' size='2xl' alignSelf='center' w='95%' />
          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={5}
            // bg='#E8E8E8'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'
          >
            {loading ? (
              <Spinner size='xl' w={20} h={20} alignSelf='center' margin='auto' />
            ) : (
              <Flex flexDirection='column' overflowY='scroll' style={{ scrollbarWidth: 'none' }}>
                <ScrollableChat messages={messages} />
              </Flex>
            )}
            <FormControl mt={3} onKeyDown={sendMessage} isRequired>
              {isTyping && (
                <Box w='50%' my={2} ml={8}>
                  Typing...
                </Box>
              )}
              <Input
                onChange={handleTyping}
                placeholder='Enter message here...'
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
          <Text fontSize='3xl' pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
