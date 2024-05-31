import { Stack } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';

const ChatLoading = () => {
  return (
    <Stack color='white' my={3} borderRadius='20px'>
      <Skeleton height='50px' />
      <Skeleton height='50px' />
      <Skeleton height='50px' />
      <Skeleton height='50px' />
      {/* <Skeleton height="52px" /> */}
    </Stack>
  );
};

export default ChatLoading;
