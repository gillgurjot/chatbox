import React, { useEffect, useRef, useState } from 'react';
import {
  Flex,
  Divider,
  Avatar,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Icon,
} from '@chakra-ui/react';
import { FaSistrix } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { BsFillChatRightFill, BsFillBellFill, BsPersonCircle } from 'react-icons/bs';
import NavItem from './NavItem';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';
import SearchModel from './SearchModel';
import ProfileModal from './ProfileModal';
import Logo from './Logo';
import GroupModal from './GroupModal';
import { getSender } from '../../config/ChatLogics';
import NoticationBadge, { Effect } from 'react-notification-badge';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    searchActive,
    groupActive,
    chatActive,
    notification,
    setChatActive,
    setSelectedChat,
    setNotification,
    notifyActive,
    setNotifyActive,
  } = ChatState();
  const inputRef = useRef(null);

  const navigate = useNavigate();

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    if (isOpen) {
      setNotifyActive(true);
      setChatActive(false);
    } else {
      setNotifyActive(false);
      setChatActive(true);
    }
    // eslint-disable-next-line
  }, [isOpen]);

  return (
    <>
      <Flex
        h={{ base: '60px', md: '95vh' }}
        shadow='dark-lg'
        w={{ base: '90%', md: '75px' }}
        bgColor='twitter.700'
        borderRadius='20px'
        flexDirection={{ base: 'row', md: 'column' }}
        zIndex='1'
        display='flex'
        ml={{ base: 0, md: 5 }}
        my={{ base: 2, md: 5 }}
        mt={{ base: 4, md: 5 }}
        justifyContent='space-between'
      >
        <Logo />
        <Flex
          flexDir={{ base: 'row', md: 'column' }}
          w='100%'
          alignItems='center'
          px={{ base: '2%', md: '6%' }}
        >
          <Divider mt='4' display={{ base: 'none', md: 'flex' }} />
          <SearchModel>
            <NavItem icon={FaSistrix} title='Search' active={searchActive} />
          </SearchModel>

          <GroupModal>
            <NavItem active={groupActive} icon={AiOutlineUsergroupAdd} title='Create Group' />
          </GroupModal>

          <NavItem icon={BsFillChatRightFill} title='Chats' active={chatActive} />

          <Menu
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
          >
            <MenuButton onClick={() => setIsOpen(true)} ref={inputRef} />
            <MenuList px={2} ml={7} mt={{ base: 7, md: 2 }}>
              {!notification.length && 'No New Messages'}
              {notification.map((notify) => (
                <MenuItem
                  key={notify._id}
                  onClick={() => {
                    setSelectedChat(notify.chat);
                    setNotification(notification.filter((n) => n !== notify));
                  }}
                >
                  {notify.chat.isGroupChat
                    ? `New Message in ${notify.chat.chatName}`
                    : `New Message from ${getSender(user, notify.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Box display={{ base: 'inline', md: 'none' }}>
            <NoticationBadge
              style={{ marginRight: '5px', marginTop: '20px' }}
              count={notification.length}
              effect={Effect.SCALE}
            />
            <NavItem
              onClick={handleClick}
              active={notifyActive}
              icon={BsFillBellFill}
              title='Notifications'
            />
          </Box>
          <Box display={{ base: 'none', md: 'flex' }}>
            <NavItem
              onClick={handleClick}
              active={notifyActive}
              icon={BsFillBellFill}
              title='Notifications'
            />
            <NoticationBadge
              style={{ marginRight: '5px', marginTop: '20px' }}
              count={notification.length}
              effect={Effect.SCALE}
            />
          </Box>
          <NavItem
            display={{ base: 'none', md: 'flex' }}
            onClick={handleLogout}
            icon={FiLogOut}
            title='Logout'
          />

          <Divider mt='4' display={{ base: 'none', md: 'flex' }} />
        </Flex>

        <Menu>
          <MenuButton borderRadius='60px' display={{ base: 'flex', md: 'none' }}>
            <Avatar cursor='pointer' mx={2} size='md' bgColor={'white'} src={user.pic} />
          </MenuButton>
          <MenuList px={2} ml={7}>
            <ProfileModal user={user}>
              <MenuItem>
                <Icon as={BsPersonCircle} mr={2} /> Profile
              </MenuItem>
            </ProfileModal>
            <MenuItem onClick={handleLogout}>
              <Icon as={FiLogOut} mr={2} />
              Logout
            </MenuItem>
          </MenuList>
        </Menu>

        <ProfileModal user={user}>
          <Tooltip color='white' display='flex' hasArrow label='Profile' placement='auto-start'>
            <Flex
              m={3}
              mt={30}
              alignItems='center'
              cursor='pointer'
              display={{ base: 'none', md: 'flex' }}
            >
              <Flex my={2} align='center'>
                <Avatar bgColor={'white'} size='md' src={user.pic} />
              </Flex>
            </Flex>
          </Tooltip>
        </ProfileModal>
      </Flex>
    </>
  );
};
export default Sidebar;
