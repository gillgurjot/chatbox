import {
  Avatar,
  Button,
  Divider,
  Flex,
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
import React, { useRef, useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import UserListItem from '../UserListItem';
import UserBadgeItem from './UserBadgeItem';

const GroupModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { setChatActive, setGroupActive, user, chats, setChats, setSelectedChat } = ChatState();
  const toast = useToast();
  const inputRef = useRef(null);

  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [chatPic, setChatPic] = useState();
  const [loading, setLoading] = useState(false);

  const postGroupPic = async (groupPic) => {
    // setLoading(true);
    if (groupPic === undefined) {
      toast({
        title: 'Please Select an Image',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      //   setLoading(false);
      return;
    }
    if (groupPic.type === 'image/jpeg' || groupPic.type === 'image/png') {
      const data = new FormData();
      data.append('file', groupPic);
      data.append('upload_preset', 'ChatApp');
      data.append('cloud_name', 'gurjotgill');

      try {
        const response = await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
          method: 'POST',
          body: data,
        });
        const picData = await response.json();
        setChatPic(picData.secure_url);
        // setLoading(false);
      } catch (error) {
        console.log(error);
        // setLoading(false);
      }
    } else {
      toast({
        title: 'Please Select an Image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      //   setLoading(false);
      return;
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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the feilds',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/api/v1/chat/creategroup`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'authToken': user.authToken,
        },
        body: JSON.stringify({
          name: groupChatName,
          chatPic: chatPic,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        }),
      });
      const data = await response.json();
      setChats([data, ...chats]);
      onClose();
      setGroupActive(false);
      setChatActive(true);
      setSearchResults([]);
      setSelectedChat(data);
      setGroupChatName();
      setSelectedUsers([]);
      toast({
        title: 'New Group Created Successfully',
        status: 'success',
        duration: 5000,
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
      setGroupChatName();
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User Already Added',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  return (
    <>
      <span
        style={{ width: '100%' }}
        onClick={() => {
          onOpen();
          setGroupActive(true);
          setChatActive(false);
        }}
      >
        {children}
      </span>
      <Modal
        size={{ base: 'xs', md: 'md' }}
        onClose={() => {
          onClose();
          setGroupActive(false);
          setChatActive(true);
          setSearchResults([]);
        }}
        isOpen={isOpen}
        isCentered
        scrollBehavior='inside'
      >
        <ModalOverlay bg='none' backdropFilter='auto' backdropInvert='15%' backdropBlur='1px' />
        <ModalContent shadow='lg' borderRadius='20px' bgColor='twitter.500'>
          <ModalHeader
            fontSize={{ base: '30px', md: '40px' }}
            display='flex'
            justifyContent='center'
            color='white'
          >
            Create Group
          </ModalHeader>
          <ModalCloseButton />
          <Divider alignSelf='center' w='90%' />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
            <FormControl display='none'>
              <Input
                ref={inputRef}
                bgColor='white'
                type='file'
                p={1.5}
                accept='image/*'
                onChange={(e) => postGroupPic(e.target.files[0])}
              />
            </FormControl>
            <Flex my='2' alignItems='center' justifyContent='center' w='100%'>
              <Avatar
                mr='5'
                alignSelf='center'
                _hover={{ bgImage: 'https://www.pinterest.com/pin/312366924159457557/' }}
                size={{ base: 'lg', md: 'xl' }}
                cursor='pointer'
                onClick={handleClick}
                src={chatPic}
              />
              <FormControl w='70%'>
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
            </Flex>
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
            <Flex flexWrap='wrap'>
              {selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
              ))}
            </Flex>
            {loading ? (
              <Spinner mt='3' />
            ) : (
              searchResults?.map((user) => (
                <UserListItem key={user._d} user={user} handleFunction={() => handleGroup(user)} />
              ))
            )}
          </ModalBody>
          <Divider alignSelf='center' w='90%' />
          <ModalFooter>
            <Button color='black' bgColor='white' onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModal;
