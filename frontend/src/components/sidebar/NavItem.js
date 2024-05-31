import React from 'react';
import { Flex, Icon, Menu, Tooltip, Box } from '@chakra-ui/react';

export default function NavItem({ icon, title, active, onClick, display }) {
  return (
    <Flex
      display={display}
      onClick={onClick}
      flexDirection='column'
      my={15}
      w='100%'
      alignItems='center'
    >
      <Menu placement='right'>
        <Tooltip
          size='2xl'
          color='white'
          display={{ base: 'none', md: 'flex' }}
          hasArrow
          label={title}
          placement='start'
        >
          <Box
            backgroundColor={active && 'white'}
            cursor='pointer'
            p={3}
            rounded='full'
            _hover={{ textDecor: 'none', bgColor: 'white', color: 'black' }}
            color={active ? 'black' : 'white'}
          >
            <Flex>
              <Icon as={icon} fontSize='2xl' />
            </Flex>
          </Box>
        </Tooltip>
      </Menu>
    </Flex>
  );
}
