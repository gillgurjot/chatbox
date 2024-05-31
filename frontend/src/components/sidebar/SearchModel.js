import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserListItem';

const SearchModel = ({ children }) => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();
  const [loadingChat, setLoadingChat] = useState();

  const { setSearchActive, setChatActive, user, setSelectedChat, chats, setChats } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleSearch = async () => {
    const spaceCheck = /^\s/.test(search);
    if (!search || spaceCheck) {
      toast({
        title: 'Please enter something to search',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/v1/user/fetchusers?search=${search}`,
        {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json',
            'authToken': user.authToken,
          },
        },
      );
      const data = await response.json();
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to load data',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      console.log(error);
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/api/v1/chat`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'authToken': user.authToken,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setChatActive(true);
      setSearchActive(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to load chats',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      console.log(error);
      setLoadingChat(false);
      setChatActive(true);
      setSearchActive(false);
      onClose();
    }
  };

  return (
    <>
      <span
        style={{ width: '100%' }}
        onClick={() => {
          onOpen();
          setSearchActive(true);
          setChatActive(false);
        }}
      >
        {children}
      </span>
      <Modal
        size={{ base: 'xs', md: 'md' }}
        onClose={() => {
          onClose();
          setSearchActive(false);
          setChatActive(true);
        }}
        isOpen={isOpen}
        scrollBehavior='inside'
        isCentered
      >
        <ModalOverlay bg='none' backdropFilter='auto' backdropInvert='15%' backdropBlur='1px' />
        <ModalContent shadow='lg' borderRadius='20px' bgColor='twitter.500'>
          <ModalHeader
            fontSize={{ base: '30px', md: '40px' }}
            display='flex'
            justifyContent='center'
            color='white'
          >
            Search friends...
          </ModalHeader>
          <ModalCloseButton />
          <Divider alignSelf='center' w='90%' />
          <ModalBody>
            <VStack justifyContent='center' alignItems='center' display='flex' spacing='2vh' my='2'>
              <Flex
                py={6}
                w='100%'
                justifyContent='center'
                alignItems='center'
                height={{ base: '6vh', md: '8vh' }}
                bgColor='white'
                borderRadius='20px'
                shadow='md'
                position='sticky'
              >
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  width='60%'
                  mx={{ base: '2', md: '5' }}
                  placeholder='Search people...'
                  autoFocus
                />
                <Button
                  onClick={handleSearch}
                  size={{ base: 'sm', md: 'md' }}
                  // width={{ base: '22%', md: '15%' }}
                  variant='solid'
                  colorScheme='twitter'
                >
                  Search
                </Button>
              </Flex>
              <Box
                w={{ base: '100%', md: '95%' }}
                minH={{ base: '30vh', md: '35vh' }}
                height='auto'
                borderRadius='20px'
              >
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}
              </Box>
            </VStack>
          </ModalBody>
          <Divider alignSelf='center' w='90%' />
          <ModalFooter>
            {loadingChat && <Spinner color='white' mr='auto' display='flex' />}
            <Button
              color='black'
              bgColor='white'
              onClick={() => {
                onClose();
                setSearchActive(false);
                setChatActive(true);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchModel;
