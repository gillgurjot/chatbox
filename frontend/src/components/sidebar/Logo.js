import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export default function Logo(props) {
  return (
    <Box {...props}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        w='50px'
        h='50px'
        bgColor='white'
        rounded='full'
        mt={{ base: 1, md: 8 }}
        mb={5}
        mx={{ base: 2, md: 3 }}
      >
        <Text color='black' fontSize='2xl' fontWeight='bold'>
          CB
        </Text>
      </Box>
    </Box>
  );
}
