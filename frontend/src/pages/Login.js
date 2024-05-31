import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  HStack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import LoginImg from '../assets/login.jpg';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ChatState } from '../context/ChatProvider';

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { user, setUser } = ChatState();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
    // eslint-disable-next-line
  }, []);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const { email, password } = credentials;

  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: 'Please fill all the feilds',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }
    setLoading(true);

    const response = await fetch(`${process.env.REACT_APP_API_KEY}/api/v1/auth/login`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // body data type must match "Content-Type" header
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data));
      setLoading(false);
      setUser(JSON.stringify(data));
      navigate('/chats');
      toast({
        title: 'Logged in Successfully:',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } else {
      toast({
        title: 'Error:',
        description: !data.error ? data.errors[0].msg : data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bgColor={useColorModeValue('twitter.500')}
    >
      <Box
        rounded={'lg'}
        width={{ base: '88%', lg: '70%', md: '80%', sm: '80%' }}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'dark-lg'}
        p={2}
      >
        <HStack>
          <Stack spacing={8} mx={'auto'} py={10} px={8}>
            <Stack>
              <Heading fontSize={'4xl'}>Sign in to your account</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                to enjoy all of our cool features ✌️
              </Text>
            </Stack>

            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents='none'
                    children={<EmailIcon color='gray.300' />}
                  />
                  <Input
                    name='email'
                    id='email'
                    value={email}
                    type='email'
                    placeholder='Enter email address'
                    onChange={onChange}
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents='none' children={<LockIcon color='gray.300' />} />
                  <Input
                    type='password'
                    name='password'
                    id='password'
                    value={password}
                    placeholder='Enter password'
                    onChange={onChange}
                  />
                </InputGroup>
              </FormControl>
              <Stack spacing={10}>
                <Checkbox>Remember me</Checkbox>
                <Button colorScheme='twitter' onClick={handleLogin} isLoading={loading}>
                  Sign in
                </Button>

                <Stack>
                  <Text align={'center'}>
                    Don't have an account?{' '}
                    <RouterLink to={'/signup'}>
                      <Button variant='link' color={'blue.400'}>
                        Sign Up
                      </Button>
                    </RouterLink>
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack width={{ base: '0', lg: '50%', md: '50%', sm: '0' }}>
            <Image
              boxSize={{ base: '0', lg: '550px', md: '500px', sm: '0' }}
              src={LoginImg}
            ></Image>
          </Stack>
        </HStack>
      </Box>
    </Flex>
  );
};

export default Login;
