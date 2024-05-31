import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
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
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import UserBadgeItem from './sidebar/UserBadgeItem';
import UserListItem from './UserListItem';

const UpdateGroupModal = ({ children, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user, fetchAgain, setFetchAgain } = ChatState();

  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user.id) {
      toast({
        title: 'Only admins can remove someone',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/api/v1/chat/groupremove`, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'authToken': user.authToken,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          userId: userToRemove._id,
        }),
      });
      const data = await response.json();
      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      console.log(error);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!groupChatName || groupChatName === selectedChat.chatName) {
      onClose();
      return;
    }

    try {
      setRenameLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/api/v1/chat/renamegroup`, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'authToken': user.authToken,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          chatName: groupChatName,
        }),
      });
      const data = await response.json();
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      onClose();
      toast({
        title: 'Updated Successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      toast({
        title: 'Error Occured!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      console.log(error);
      setRenameLoading(false);
      setGroupChatName('');
      onClose();
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    const spaceCheck = /^\s/.test(search);
    if (!search || spaceCheck) {
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
      setSearchResults(data);
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

  const handleAdd = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: 'User is Already in group!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add someone',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/api/v1/chat/groupadd`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'authToken': user.authToken,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          userId: userToAdd._id,
        }),
      });
      const data = await response.json();
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal
        size={{ base: 'xs', md: 'md' }}
        scrollBehavior='inside'
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay bg='none' backdropFilter='auto' backdropInvert='15%' backdropBlur='1px' />
        <ModalContent shadow='lg' borderRadius='20px' bgColor='twitter.500'>
          <ModalHeader
            mb={-2}
            fontSize={{ base: '30px', md: '40px' }}
            display='flex'
            justifyContent='center'
            color='white'
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <Divider mb={2} alignSelf='center' w='90%' />
          <ModalBody>
            <Box w='100%' display='flex' flexWrap='wrap' pb={2}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
              ))}
            </Box>
            <FormControl>
              <FormLabel fontSize='18px' color='white'>
                Group Name
              </FormLabel>
              <Input
                bgColor='white'
                placeholder='Enter Group Name...'
                mb='3'
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize='18px' color='white'>
                Add users
              </FormLabel>
              <Input
                bgColor='white'
                placeholder='eg: Gurjot, Harry, John...'
                mb='2'
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner mt='3' />
            ) : (
              searchResults?.map((user) => (
                <UserListItem key={user._d} user={user} handleFunction={() => handleAdd(user)} />
              ))
            )}
          </ModalBody>
          <Divider alignSelf='center' w='90%' />
          <ModalFooter display='flex' justifyContent='space-between'>
            <Button ml={3} on isLoading={renameLoading} onClick={handleUpdate}>
              Update
            </Button>
            <Button
              colorScheme='red'
              onClick={() => {
                handleRemove(user);
                onClose();
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupModal;
