import {
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal size={{ base: 'xs', md: 'md' }} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay bg='none' backdropFilter='auto' backdropInvert='15%' backdropBlur='1px' />
        <ModalContent color='white' shadow='lg' borderRadius='20px' bgColor='twitter.500'>
          <ModalHeader
            fontSize={{ base: '30px', md: '40px' }}
            display='flex'
            justifyContent='center'
          >
            {user.name}
          </ModalHeader>
          <Divider alignSelf='center' w='90%' />
          <ModalCloseButton />
          <ModalBody
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            flexDirection='column'
          >
            <Image
              borderRadius='full'
              boxSize={{ base: '120px', md: '150px' }}
              src={user.pic}
              alt={user.name}
            />
            <Text mt={3} fontSize={{ base: '22px', md: '30px' }}>
              Email: {user.email}
            </Text>
          </ModalBody>
          <Divider alignSelf='center' w='90%' />
          <ModalFooter>
            <Button color='black' bgColor='white' onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
