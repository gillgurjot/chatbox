import { Flex } from '@chakra-ui/react';
import React from 'react';
import {AiFillCloseCircle} from 'react-icons/ai'

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Flex
      w='auto'
      px={2}
      py={1}
      borderRadius='lg'
      m={1}
      mb={2}
      variant='solid'
      fontSize={12}
      bgColor='white'
      color='black'
      cursor='pointer'
      onClick={handleFunction}
    >
        {user.name}
        <AiFillCloseCircle style={{marginLeft: '4px', alignSelf: 'center'}}/>
    </Flex>
  );
};

export default UserBadgeItem;
