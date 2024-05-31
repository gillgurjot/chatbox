import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      display='flex'
      onClick={handleFunction}
      cursor='pointer'
      bg='twitter.700'
      _hover={{
        background: 'white',
        color: 'black',
      }}
      w='100%'
      alignItems='center'
      color='white'
      px={3}
      py={2}
      my={2}
      borderRadius='20px'
    >
      <Avatar mr={2} size='md' cursor='pointer' name={user.name} src={user.pic} />
      <Box>
        <Text fontSize='lg'>{user.name}</Text>
        <Text fontSize='sm'>
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
